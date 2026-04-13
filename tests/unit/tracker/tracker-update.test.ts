/**
 * Tracker Update Server Actions — Unit Tests
 * ============================================
 *
 * Tests for the Sanity mutation server actions:
 *   - moveApplication: Changes status + reorders within column
 *   - reorderApplications: Reorders within the same column
 *   - syncInterviewsToCalendar: Creates Google Calendar events
 *
 * We mock the Sanity client and Google Calendar API.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Set required env vars before module resolution
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project'
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production'

// ── Sanity client mock ────────────────────────────────────
const mockCommit = vi.fn().mockResolvedValue({})
const mockPatchSet = vi.fn().mockReturnThis()
const mockPatch = vi.fn(() => ({ set: mockPatchSet, commit: mockCommit }))
const mockTransaction = {
  patch: vi.fn((_id: string, cb: (p: { set: typeof mockPatchSet }) => void) => {
    cb({ set: mockPatchSet })
    return mockTransaction
  }),
  commit: mockCommit,
}
const mockFetch = vi.fn()
const mockSanityPatch = vi.fn(() => ({
  set: vi.fn().mockReturnValue({ commit: mockCommit }),
}))

vi.mock('next-sanity', () => ({
  createClient: vi.fn(() => ({
    transaction: vi.fn(() => mockTransaction),
    fetch: mockFetch,
    patch: mockSanityPatch,
  })),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// ── Google Calendar mock ──────────────────────────────────
const mockEventsInsert = vi.fn().mockResolvedValue({
  data: { id: 'gcal-event-123' },
})

vi.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: class MockOAuth2 {
        setCredentials() {}
      },
    },
    calendar: vi.fn(() => ({
      events: {
        insert: mockEventsInsert,
      },
    })),
  },
}))

// Import after mocks
const { moveApplication, reorderApplications, syncInterviewsToCalendar } =
  await import('@/app/actions/tracker-update')

describe('moveApplication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('patches the status and order for all IDs in a transaction', async () => {
    await moveApplication('app-1', 'technical', ['app-1', 'app-2', 'app-3'])

    // Should patch status on the moved app
    expect(mockTransaction.patch).toHaveBeenCalled()
    // Should commit the transaction
    expect(mockCommit).toHaveBeenCalled()
  })

  it('handles a single-item column', async () => {
    await moveApplication('app-1', 'offer', ['app-1'])
    expect(mockTransaction.patch).toHaveBeenCalled()
    expect(mockCommit).toHaveBeenCalled()
  })
})

describe('reorderApplications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('patches order for all IDs', async () => {
    await reorderApplications(['app-3', 'app-1', 'app-2'])
    expect(mockTransaction.patch).toHaveBeenCalledTimes(3)
    expect(mockCommit).toHaveBeenCalled()
  })

  it('handles empty array without error', async () => {
    await reorderApplications([])
    expect(mockCommit).toHaveBeenCalled()
  })
})

describe('syncInterviewsToCalendar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.GOOGLE_CALENDAR_ID = 'test@gmail.com'
    process.env.GOOGLE_CLIENT_ID = 'test-client-id'
    process.env.GOOGLE_CLIENT_SECRET = 'test-secret'
    process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh'
  })

  it('returns error when GOOGLE_CALENDAR_ID is not set', async () => {
    delete process.env.GOOGLE_CALENDAR_ID
    const result = await syncInterviewsToCalendar('app-1')
    expect(result.error).toBe('GOOGLE_CALENDAR_ID not configured')
  })

  it('returns synced: 0 when application has no interviews', async () => {
    mockFetch.mockResolvedValue({
      company: 'Test Co',
      role: 'Engineer',
      interviewDates: [],
    })
    const result = await syncInterviewsToCalendar('app-1')
    expect(result.synced).toBe(0)
  })

  it('returns synced: 0 when application is null', async () => {
    mockFetch.mockResolvedValue(null)
    const result = await syncInterviewsToCalendar('app-1')
    expect(result.synced).toBe(0)
  })

  it('skips interviews that already have a gcalEventId', async () => {
    mockFetch.mockResolvedValue({
      company: 'Test Co',
      role: 'Engineer',
      interviewDates: [
        {
          _key: 'k1',
          date: '2026-04-05T10:00:00Z',
          type: 'technical',
          gcalEventId: 'already-synced',
        },
      ],
    })
    const result = await syncInterviewsToCalendar('app-1')
    expect(result.synced).toBe(0)
    expect(mockEventsInsert).not.toHaveBeenCalled()
  })

  it('skips interviews without a date', async () => {
    mockFetch.mockResolvedValue({
      company: 'Test Co',
      role: 'Engineer',
      interviewDates: [
        { _key: 'k1', date: '', type: 'technical' },
      ],
    })
    const result = await syncInterviewsToCalendar('app-1')
    expect(result.synced).toBe(0)
  })

  it('creates calendar event with correct summary format', async () => {
    mockFetch.mockResolvedValue({
      company: 'Stripe',
      role: 'Software Engineer',
      interviewDates: [
        {
          _key: 'k1',
          date: '2026-04-05T10:00:00Z',
          type: 'system-design',
          interviewer: 'Jane Smith',
          notes: 'Distributed systems focus',
        },
      ],
    })

    await syncInterviewsToCalendar('app-1')

    expect(mockEventsInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        calendarId: 'test@gmail.com',
        requestBody: expect.objectContaining({
          summary: 'System Design — Stripe',
          description: expect.stringContaining('Interviewer: Jane Smith'),
        }),
      }),
    )
  })

  it('creates 1-hour calendar events by default', async () => {
    mockFetch.mockResolvedValue({
      company: 'Test Co',
      role: 'Engineer',
      interviewDates: [
        { _key: 'k1', date: '2026-04-05T10:00:00Z', type: 'technical' },
      ],
    })

    await syncInterviewsToCalendar('app-1')

    expect(mockEventsInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        requestBody: expect.objectContaining({
          start: expect.objectContaining({
            dateTime: '2026-04-05T10:00:00.000Z',
          }),
          end: expect.objectContaining({
            dateTime: '2026-04-05T11:00:00.000Z',
          }),
        }),
      }),
    )
  })

  it('sets reminders at 30 minutes and 24 hours', async () => {
    mockFetch.mockResolvedValue({
      company: 'Test Co',
      role: 'Engineer',
      interviewDates: [
        { _key: 'k1', date: '2026-04-05T10:00:00Z', type: 'technical' },
      ],
    })

    await syncInterviewsToCalendar('app-1')

    expect(mockEventsInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        requestBody: expect.objectContaining({
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 30 },
              { method: 'popup', minutes: 1440 },
            ],
          },
        }),
      }),
    )
  })
})
