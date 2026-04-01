/**
 * GROQ Queries — Unit Tests
 * =========================
 *
 * WHAT ARE WE TESTING?
 * Each GROQ query string is:
 *   1. A non-empty string
 *   2. Contains expected GROQ syntax markers
 *   3. Does NOT contain hardcoded document IDs (uses $params instead)
 *
 * WHY TEST QUERY STRINGS?
 * GROQ queries are just strings — they can't be type-checked by TypeScript.
 * These tests serve as a basic sanity check to catch:
 *   - Accidentally deleted or empty queries
 *   - Missing filter clauses
 *   - Hardcoded IDs that should be parameters
 */

import { describe, it, expect } from 'vitest'
import {
  SCHEDULING_CONFIG_QUERY,
  PENDING_SLOTS_FOR_DATE_QUERY,
  BOOKING_BY_TOKEN_HASH_QUERY,
  BOOKING_BY_CANCEL_TOKEN_QUERY,
  BOOKING_BY_RESCHEDULE_TOKEN_QUERY,
  BOOKING_BY_ID_QUERY,
  TOKEN_BY_HASH_QUERY,
  PENDING_APPROVAL_COUNT_TODAY_QUERY,
  CONFIRMED_COUNT_FOR_DAY_QUERY,
  CONFIRMED_COUNT_THIS_WEEK_QUERY,
  ACTIVE_BOOKINGS_FOR_WEEK_QUERY,
  RECENT_REQUESTS_BY_IP_QUERY,
} from '@/lib/scheduling/groq-queries'

// All query exports to iterate over
const allQueries: Record<string, string> = {
  SCHEDULING_CONFIG_QUERY,
  PENDING_SLOTS_FOR_DATE_QUERY,
  BOOKING_BY_TOKEN_HASH_QUERY,
  BOOKING_BY_CANCEL_TOKEN_QUERY,
  BOOKING_BY_RESCHEDULE_TOKEN_QUERY,
  BOOKING_BY_ID_QUERY,
  TOKEN_BY_HASH_QUERY,
  PENDING_APPROVAL_COUNT_TODAY_QUERY,
  CONFIRMED_COUNT_FOR_DAY_QUERY,
  CONFIRMED_COUNT_THIS_WEEK_QUERY,
  ACTIVE_BOOKINGS_FOR_WEEK_QUERY,
  RECENT_REQUESTS_BY_IP_QUERY,
}

describe('GROQ Queries', () => {
  // Test each query is a non-empty string
  for (const [name, query] of Object.entries(allQueries)) {
    it(`${name} is a non-empty string`, () => {
      expect(typeof query).toBe('string')
      expect(query.trim().length).toBeGreaterThan(0)
    })
  }

  // Test each query contains basic GROQ syntax
  for (const [name, query] of Object.entries(allQueries)) {
    it(`${name} contains GROQ syntax (filter or count)`, () => {
      // Every GROQ query should have either *[ (filter) or count( (aggregation)
      const hasFilter = query.includes('*[')
      const hasCount = query.includes('count(')
      expect(hasFilter || hasCount).toBe(true)
    })
  }

  // Test no queries contain hardcoded document IDs
  for (const [name, query] of Object.entries(allQueries)) {
    it(`${name} does not contain hardcoded document IDs`, () => {
      // Sanity document IDs look like: "abc123-def456-ghi789"
      // Or: "drafts.abc123-def456-ghi789"
      // A proper query uses $params instead of hardcoded IDs
      const hardcodedIdPattern = /["'][a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}/
      expect(query).not.toMatch(hardcodedIdPattern)
    })
  }

  // Specific query validations
  it('SCHEDULING_CONFIG_QUERY filters by schedulingConfig type', () => {
    expect(SCHEDULING_CONFIG_QUERY).toContain('schedulingConfig')
    expect(SCHEDULING_CONFIG_QUERY).toContain('[0]') // Singleton pattern
  })

  it('PENDING_SLOTS_FOR_DATE_QUERY uses date params', () => {
    expect(PENDING_SLOTS_FOR_DATE_QUERY).toContain('$startDate')
    expect(PENDING_SLOTS_FOR_DATE_QUERY).toContain('$endDate')
  })

  it('BOOKING_BY_TOKEN_HASH_QUERY uses $hash param', () => {
    expect(BOOKING_BY_TOKEN_HASH_QUERY).toContain('$hash')
    expect(BOOKING_BY_TOKEN_HASH_QUERY).toContain('verificationTokenHash')
  })

  it('RECENT_REQUESTS_BY_IP_QUERY uses $ipHash param', () => {
    expect(RECENT_REQUESTS_BY_IP_QUERY).toContain('$ipHash')
    expect(RECENT_REQUESTS_BY_IP_QUERY).toContain('count(')
  })
})
