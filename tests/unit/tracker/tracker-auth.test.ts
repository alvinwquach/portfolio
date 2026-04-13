/**
 * Tracker Auth — Unit Tests
 * =========================
 *
 * Tests for the password authentication gate:
 *   - verifyTrackerPassword: Validates password, sets cookie
 *   - isTrackerAuthenticated: Checks cookie matches password
 *   - trackerLogout: Deletes auth cookie
 *
 * These are server actions that use next/headers cookies().
 * We mock the cookies API to test the logic in isolation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/headers cookies
const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

// Import after mocking
const { verifyTrackerPassword, isTrackerAuthenticated, trackerLogout } =
  await import('@/app/actions/tracker-auth')

describe('verifyTrackerPassword', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.TRACKER_PASSWORD = 'test-password-123'
  })

  it('throws when TRACKER_PASSWORD env var is not set', async () => {
    delete process.env.TRACKER_PASSWORD
    await expect(verifyTrackerPassword('anything')).rejects.toThrow(
      'TRACKER_PASSWORD environment variable is not set',
    )
  })

  it('returns { success: false } for wrong password', async () => {
    const result = await verifyTrackerPassword('wrong-password')
    expect(result).toEqual({ success: false })
    expect(mockCookieStore.set).not.toHaveBeenCalled()
  })

  it('returns { success: true } and sets cookie for correct password', async () => {
    const result = await verifyTrackerPassword('test-password-123')
    expect(result).toEqual({ success: true })
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      'tracker_auth',
      'test-password-123',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        path: '/tracker',
      }),
    )
  })

  it('sets secure flag based on NODE_ENV', async () => {
    const env = process.env as Record<string, string | undefined>
    const originalEnv = env.NODE_ENV

    // In production
    env.NODE_ENV = 'production'
    await verifyTrackerPassword('test-password-123')
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      'tracker_auth',
      'test-password-123',
      expect.objectContaining({ secure: true }),
    )

    vi.resetAllMocks()

    // In development
    env.NODE_ENV = 'development'
    await verifyTrackerPassword('test-password-123')
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      'tracker_auth',
      'test-password-123',
      expect.objectContaining({ secure: false }),
    )

    env.NODE_ENV = originalEnv
  })

  it('sets cookie with 30-day maxAge', async () => {
    await verifyTrackerPassword('test-password-123')
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      'tracker_auth',
      'test-password-123',
      expect.objectContaining({ maxAge: 60 * 60 * 24 * 30 }),
    )
  })
})

describe('isTrackerAuthenticated', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.TRACKER_PASSWORD = 'test-password-123'
  })

  it('returns false when no cookie exists', async () => {
    mockCookieStore.get.mockReturnValue(undefined)
    const result = await isTrackerAuthenticated()
    expect(result).toBe(false)
  })

  it('returns false when cookie value does not match password', async () => {
    mockCookieStore.get.mockReturnValue({ value: 'wrong-value' })
    const result = await isTrackerAuthenticated()
    expect(result).toBe(false)
  })

  it('returns true when cookie value matches password', async () => {
    mockCookieStore.get.mockReturnValue({ value: 'test-password-123' })
    const result = await isTrackerAuthenticated()
    expect(result).toBe(true)
  })
})

describe('trackerLogout', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('deletes the tracker_auth cookie', async () => {
    await trackerLogout()
    expect(mockCookieStore.delete).toHaveBeenCalledWith('tracker_auth')
  })
})
