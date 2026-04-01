/**
 * Token Utilities — Unit Tests
 * ============================
 *
 * WHAT ARE WE TESTING?
 * Every function in lib/scheduling/tokens.ts:
 *   - signToken: Creates valid JWTs
 *   - verifyToken: Validates JWTs and returns payloads
 *   - hashToken: Creates consistent SHA-256 hashes
 *   - generateVerificationJWT: Creates verification tokens
 *   - generateActionJWT: Creates cancel/reschedule tokens
 *
 * TEST STRUCTURE:
 * Each test follows the AAA pattern:
 *   Arrange → Set up the test data
 *   Act     → Call the function being tested
 *   Assert  → Check the result matches expectations
 *
 * WHY SET THE ENV VARIABLE?
 * The token functions read SCHEDULING_TOKEN_SECRET from the environment.
 * In tests, we set it to a known value so tests are deterministic.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import {
  signToken,
  verifyToken,
  hashToken,
  generateVerificationJWT,
  generateActionJWT,
} from '@/lib/scheduling/tokens'

// Set the secret before all tests run
beforeAll(() => {
  process.env.SCHEDULING_TOKEN_SECRET = 'test-secret-at-least-32-characters-long'
})

describe('signToken', () => {
  it('creates a valid JWT string', async () => {
    // Arrange: define a simple payload
    const payload = { type: 'test', userId: '123' }

    // Act: sign the token
    const token = await signToken(payload, '1h')

    // Assert: JWT has 3 parts separated by dots (header.payload.signature)
    expect(token).toBeDefined()
    expect(token.split('.')).toHaveLength(3)
  })

  it('creates a token with the correct expiry', async () => {
    // Arrange: sign with 1-hour expiry
    const token = await signToken({ type: 'test' }, '1h')

    // Act: verify it to read the expiry
    const payload = await verifyToken<{ exp: number }>(token)

    // Assert: expiry should be roughly 1 hour from now (within 5 seconds)
    const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600
    expect(payload?.exp).toBeGreaterThan(oneHourFromNow - 5)
    expect(payload?.exp).toBeLessThanOrEqual(oneHourFromNow + 5)
  })
})

describe('verifyToken', () => {
  it('returns payload for a valid token', async () => {
    // Arrange: create a token with known data
    const token = await signToken({ type: 'test', bookingId: 'abc123' }, '1h')

    // Act: verify it
    const payload = await verifyToken<{ type: string; bookingId: string }>(token)

    // Assert: payload contains our data
    expect(payload).not.toBeNull()
    expect(payload?.type).toBe('test')
    expect(payload?.bookingId).toBe('abc123')
  })

  it('returns null for an expired token', async () => {
    // Arrange: create a token that expires immediately (1 second)
    const token = await signToken({ type: 'test' }, '1s')

    // Wait for it to expire
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Act: try to verify
    const payload = await verifyToken(token)

    // Assert: expired token should return null
    expect(payload).toBeNull()
  })

  it('returns null for a tampered token', async () => {
    // Arrange: create a valid token, then modify it
    const token = await signToken({ type: 'test' }, '1h')
    const tampered = token.slice(0, -5) + 'XXXXX' // Corrupt the signature

    // Act: try to verify the tampered token
    const payload = await verifyToken(tampered)

    // Assert: tampered token should return null
    expect(payload).toBeNull()
  })

  it('returns null for a completely invalid string', async () => {
    const payload = await verifyToken('not-a-jwt-at-all')
    expect(payload).toBeNull()
  })

  it('returns null for an empty string', async () => {
    const payload = await verifyToken('')
    expect(payload).toBeNull()
  })
})

describe('hashToken', () => {
  it('produces a consistent SHA-256 output', () => {
    // The same input should always produce the same hash
    const hash1 = hashToken('test-token-string')
    const hash2 = hashToken('test-token-string')
    expect(hash1).toBe(hash2)
  })

  it('produces a 64-character hex string', () => {
    // SHA-256 always produces 32 bytes = 64 hex characters
    const hash = hashToken('any-string')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[a-f0-9]{64}$/) // Only hex characters
  })

  it('output is not equal to the input (not reversible)', () => {
    const input = 'my-secret-token'
    const hash = hashToken(input)
    expect(hash).not.toBe(input)
  })

  it('different inputs produce different hashes', () => {
    const hash1 = hashToken('token-a')
    const hash2 = hashToken('token-b')
    expect(hash1).not.toBe(hash2)
  })
})

describe('generateVerificationJWT', () => {
  it('returns both a token and a hash', async () => {
    const result = await generateVerificationJWT('booking-123', 'test@example.com')

    expect(result.token).toBeDefined()
    expect(result.hash).toBeDefined()
    // Token is a JWT (3 dot-separated parts)
    expect(result.token.split('.')).toHaveLength(3)
    // Hash is a 64-char hex string
    expect(result.hash).toHaveLength(64)
  })

  it('embeds the correct payload data', async () => {
    const { token } = await generateVerificationJWT('booking-456', 'jane@test.com')
    const payload = await verifyToken<{ type: string; bookingId: string; email: string }>(token)

    expect(payload?.type).toBe('verification')
    expect(payload?.bookingId).toBe('booking-456')
    expect(payload?.email).toBe('jane@test.com')
  })

  it('hash matches the token hash', async () => {
    const { token, hash } = await generateVerificationJWT('booking-789', 'test@test.com')
    const computedHash = hashToken(token)
    expect(hash).toBe(computedHash)
  })
})

describe('generateActionJWT', () => {
  it('cancel type encodes correctly', async () => {
    const { token } = await generateActionJWT('cancel', 'booking-cancel-test')
    const payload = await verifyToken<{ type: string; bookingId: string }>(token)

    expect(payload?.type).toBe('cancel')
    expect(payload?.bookingId).toBe('booking-cancel-test')
  })

  it('reschedule type encodes correctly', async () => {
    const { token } = await generateActionJWT('reschedule', 'booking-resched-test')
    const payload = await verifyToken<{ type: string; bookingId: string }>(token)

    expect(payload?.type).toBe('reschedule')
    expect(payload?.bookingId).toBe('booking-resched-test')
  })

  it('returns both token and hash', async () => {
    const result = await generateActionJWT('cancel', 'booking-123')

    expect(result.token.split('.')).toHaveLength(3)
    expect(result.hash).toHaveLength(64)
    expect(result.hash).toBe(hashToken(result.token))
  })
})
