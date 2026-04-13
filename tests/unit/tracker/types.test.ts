/**
 * Tracker Types & Utilities — Unit Tests
 * =======================================
 *
 * Tests for all helper functions in components/tracker/types.ts:
 *   - formatSalaryCompact: Formats salary ranges for card display
 *   - relativeDate: Converts dates to relative labels
 *   - getLatestInterview: Picks the most relevant interview date
 *
 * Also validates the constant maps (STATUS_LABELS, STATUS_DOT_COLORS, etc.)
 * to ensure every status in STATUS_LIST has a matching entry.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  formatSalaryCompact,
  relativeDate,
  getLatestInterview,
  STATUS_LIST,
  STATUS_LABELS,
  STATUS_BG_COLORS,
  STATUS_DOT_COLORS,
  CLOSED_STATUSES,
  PIPELINE_STATUSES,
  OUTCOME_STATUSES,
  type JobApplication,
} from '@/components/tracker/types'

// ═══════════════════════════════════════════
// formatSalaryCompact
// ═══════════════════════════════════════════

describe('formatSalaryCompact', () => {
  it('returns null when both min and max are undefined', () => {
    expect(formatSalaryCompact(undefined, undefined)).toBeNull()
  })

  it('returns null when both min and max are 0', () => {
    expect(formatSalaryCompact(0, 0)).toBeNull()
  })

  it('formats a min–max range in $K notation', () => {
    expect(formatSalaryCompact(140000, 180000)).toBe('$140K\u2013$180K')
  })

  it('formats min-only as "$XK+"', () => {
    expect(formatSalaryCompact(150000, undefined)).toBe('$150K+')
  })

  it('formats max-only as "up to $XK"', () => {
    expect(formatSalaryCompact(undefined, 200000)).toBe('up to $200K')
  })

  it('rounds values to nearest K', () => {
    expect(formatSalaryCompact(149500, 180200)).toBe('$150K\u2013$180K')
  })

  it('handles small values under 1000', () => {
    expect(formatSalaryCompact(500, 900)).toBe('$500\u2013$900')
  })
})

// ═══════════════════════════════════════════
// relativeDate
// ═══════════════════════════════════════════

describe('relativeDate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-01T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "Today" for the current date', () => {
    expect(relativeDate('2026-04-01T14:00:00Z')).toBe('Today')
  })

  it('returns "Tomorrow" for the next day', () => {
    expect(relativeDate('2026-04-02T10:00:00Z')).toBe('Tomorrow')
  })

  it('returns "Yesterday" for the previous day', () => {
    expect(relativeDate('2026-03-31T10:00:00Z')).toBe('Yesterday')
  })

  it('returns "in Xd" for dates 2–7 days in the future', () => {
    expect(relativeDate('2026-04-04T12:00:00Z')).toBe('in 3d')
  })

  it('returns "Xd ago" for dates 2–7 days in the past', () => {
    expect(relativeDate('2026-03-28T12:00:00Z')).toBe('4d ago')
  })

  it('returns "in Xw" for dates more than 7 days in the future', () => {
    expect(relativeDate('2026-04-15T12:00:00Z')).toBe('in 2w')
  })

  it('returns "Xw ago" for dates more than 7 days in the past', () => {
    expect(relativeDate('2026-03-15T12:00:00Z')).toBe('3w ago')
  })
})

// ═══════════════════════════════════════════
// getLatestInterview
// ═══════════════════════════════════════════

describe('getLatestInterview', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-01T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const baseApp: JobApplication = {
    _id: 'test-1',
    company: 'Test Co',
    role: 'Engineer',
    status: 'technical',
    dateApplied: '2026-03-01',
  }

  it('returns null when interviewDates is undefined', () => {
    expect(getLatestInterview(baseApp)).toBeNull()
  })

  it('returns null when interviewDates is empty', () => {
    expect(getLatestInterview({ ...baseApp, interviewDates: [] })).toBeNull()
  })

  it('returns the next upcoming interview if one exists', () => {
    const app: JobApplication = {
      ...baseApp,
      interviewDates: [
        { _key: 'k1', date: '2026-03-28T10:00:00Z', type: 'phone-screen' },
        { _key: 'k2', date: '2026-04-05T10:00:00Z', type: 'technical' },
        { _key: 'k3', date: '2026-04-10T10:00:00Z', type: 'onsite' },
      ],
    }
    const result = getLatestInterview(app)
    expect(result?.type).toBe('technical')
    expect(result?.date).toBe('2026-04-05T10:00:00Z')
  })

  it('returns the most recent past interview when none are upcoming', () => {
    const app: JobApplication = {
      ...baseApp,
      interviewDates: [
        { _key: 'k1', date: '2026-03-20T10:00:00Z', type: 'phone-screen' },
        { _key: 'k2', date: '2026-03-28T10:00:00Z', type: 'technical' },
      ],
    }
    const result = getLatestInterview(app)
    expect(result?.type).toBe('technical')
    expect(result?.date).toBe('2026-03-28T10:00:00Z')
  })

  it('returns the single interview when there is only one', () => {
    const app: JobApplication = {
      ...baseApp,
      interviewDates: [
        { _key: 'k1', date: '2026-04-02T10:00:00Z', type: 'behavioral' },
      ],
    }
    const result = getLatestInterview(app)
    expect(result?.type).toBe('behavioral')
  })
})

// ═══════════════════════════════════════════
// Status constant consistency
// ═══════════════════════════════════════════

describe('Status constants', () => {
  it('STATUS_LIST contains all pipeline + outcome statuses', () => {
    expect(STATUS_LIST).toEqual([
      ...PIPELINE_STATUSES,
      ...OUTCOME_STATUSES,
    ])
  })

  it('every status in STATUS_LIST has a label', () => {
    for (const status of STATUS_LIST) {
      expect(STATUS_LABELS[status]).toBeDefined()
    }
  })

  it('every status in STATUS_LIST has a bg color', () => {
    for (const status of STATUS_LIST) {
      expect(STATUS_BG_COLORS[status]).toBeDefined()
    }
  })

  it('every status in STATUS_LIST has a dot color', () => {
    for (const status of STATUS_LIST) {
      expect(STATUS_DOT_COLORS[status]).toBeDefined()
    }
  })

  it('CLOSED_STATUSES contains only outcome statuses except offer', () => {
    expect(CLOSED_STATUSES.has('rejected')).toBe(true)
    expect(CLOSED_STATUSES.has('ghosted')).toBe(true)
    expect(CLOSED_STATUSES.has('withdrawn')).toBe(true)
    expect(CLOSED_STATUSES.has('offer')).toBe(false)
    expect(CLOSED_STATUSES.has('applied')).toBe(false)
  })
})
