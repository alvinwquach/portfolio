/**
 * Slot Generation — Unit Tests
 * ============================
 *
 * WHAT ARE WE TESTING?
 * The core slot generation logic in lib/scheduling/slots.ts:
 *   - generateWeekSlots: Full week generation
 *   - isSlotAvailable: Overlap detection with buffers
 *   - getWeekStart: Monday calculation
 *   - formatSlotForDisplay: Timezone formatting
 *
 * IMPORTANT: All dates in tests use UTC to match production behavior.
 * We use fixed dates (not "new Date()") so tests are deterministic.
 */

import { describe, it, expect } from 'vitest'
import {
  generateWeekSlots,
  isSlotAvailable,
  getWeekStart,
  formatSlotForDisplay,
  getSlotsForDate,
} from '@/lib/scheduling/slots'
import type { SchedulingConfig, BusyPeriod } from '@/types/scheduling'

/**
 * Default test config — used by most tests.
 * Represents a standard Mon-Fri, 9am-5pm schedule.
 */
const defaultConfig: SchedulingConfig = {
  _id: 'schedulingConfig',
  _type: 'schedulingConfig',
  isAcceptingBookings: true,
  weeklySchedule: [
    { day: 0, enabled: false, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
    { day: 1, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
    { day: 2, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
    { day: 3, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
    { day: 4, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
    { day: 5, enabled: true, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
    { day: 6, enabled: false, startHour: 9, startMinute: 0, endHour: 17, endMinute: 0 },
  ],
  dateOverrides: [],
  bufferMinutes: 15,
  maxPerDay: 3,
  maxPerWeek: 8,
  slotDurationMinutes: 30,
  advanceBookingDays: 14,
  minimumNoticeHours: 24,
  whatWeCanDiscuss: [],
  meetingDescription: '',
}

describe('generateWeekSlots', () => {
  it('returns 7 WeekDay objects', () => {
    // Arrange: a Monday far in the future (so no slots are "past")
    const weekStart = new Date('2030-01-07T00:00:00Z') // A Monday

    // Act
    const result = generateWeekSlots(weekStart, defaultConfig, [], [])

    // Assert: should always return exactly 7 days
    expect(result).toHaveLength(7)
  })

  it('has correct day names (Mon through Sun)', () => {
    const weekStart = new Date('2030-01-07T00:00:00Z')
    const result = generateWeekSlots(weekStart, defaultConfig, [], [])

    expect(result.map((d) => d.dayName)).toEqual([
      'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
    ])
  })

  it('generates no slots for weekend days', () => {
    // Config only has [1,2,3,4,5] (Mon-Fri)
    const weekStart = new Date('2030-01-07T00:00:00Z')
    const result = generateWeekSlots(weekStart, defaultConfig, [], [])

    // Saturday (index 5) and Sunday (index 6) should have empty slots
    expect(result[5].slots).toHaveLength(0) // Saturday
    expect(result[6].slots).toHaveLength(0) // Sunday
  })

  it('generates correct number of slots per working day', () => {
    // 9am to 5pm with 30-min slots:
    // 9:00, 9:30, 10:00, ..., 16:30 = 16 slots
    const weekStart = new Date('2030-01-07T00:00:00Z')
    const result = generateWeekSlots(weekStart, defaultConfig, [], [])

    // Monday should have 16 slots
    expect(result[0].slots).toHaveLength(16)
  })

  it('slots start at earliestHour and end before latestHour (Pacific time)', () => {
    // Config hours are in Pacific time. January = PST (UTC-8).
    // So 9am Pacific = 17:00 UTC, 5pm Pacific = 01:00+1 UTC.
    const weekStart = new Date('2030-01-07T00:00:00Z')
    const result = generateWeekSlots(weekStart, defaultConfig, [], [])

    const mondaySlots = result[0].slots
    const firstSlot = new Date(mondaySlots[0].start)
    const lastSlot = new Date(mondaySlots[mondaySlots.length - 1].end)

    // First slot: 9am Pacific = 17:00 UTC (PST offset = +8)
    expect(firstSlot.getUTCHours()).toBe(17)
    expect(firstSlot.getUTCMinutes()).toBe(0)

    // Last slot end: 5pm Pacific = 01:00 UTC next day
    expect(lastSlot.getUTCHours()).toBe(1)
    expect(lastSlot.getUTCMinutes()).toBe(0)
  })

  it('marks past slots as unavailable', () => {
    // Use a week in the past
    const weekStart = new Date('2020-01-06T00:00:00Z') // A Monday in 2020
    const result = generateWeekSlots(weekStart, defaultConfig, [], [])

    // All slots should be unavailable (they're in the past)
    const allSlots = result.flatMap((d) => d.slots)
    for (const slot of allSlots) {
      expect(slot.available).toBe(false)
    }
  })

  it('marks slots overlapping busy periods as unavailable', () => {
    // Config hours are Pacific. January = PST (UTC-8).
    // 10am Pacific = 18:00 UTC, 11am Pacific = 19:00 UTC
    const weekStart = new Date('2030-01-07T00:00:00Z')

    // Block 10am-11am Pacific (= 18:00-19:00 UTC)
    const busyPeriods: BusyPeriod[] = [
      { start: '2030-01-07T18:00:00Z', end: '2030-01-07T19:00:00Z' },
    ]

    const result = generateWeekSlots(weekStart, defaultConfig, busyPeriods, [])
    const mondaySlots = result[0].slots

    // Find the 10:00am and 10:30am Pacific slots (= 18:00 and 18:30 UTC)
    const slot10 = mondaySlots.find((s) => s.start === '2030-01-07T18:00:00.000Z')
    const slot1030 = mondaySlots.find((s) => s.start === '2030-01-07T18:30:00.000Z')

    expect(slot10?.available).toBe(false)
    expect(slot1030?.available).toBe(false)
  })

  it('applies buffer around busy periods', () => {
    const weekStart = new Date('2030-01-07T00:00:00Z')

    // Block 10am-10:30am Pacific (= 18:00-18:30 UTC) with 15-min buffer
    const busyPeriods: BusyPeriod[] = [
      { start: '2030-01-07T18:00:00Z', end: '2030-01-07T18:30:00Z' },
    ]

    const result = generateWeekSlots(weekStart, defaultConfig, busyPeriods, [])
    const mondaySlots = result[0].slots

    // 9:30am Pacific (= 17:30 UTC) slot should be blocked by 15-min pre-buffer
    // Buffer expands busy to 17:45-18:45 UTC. Slot 17:30-18:00 overlaps 17:45.
    const slot930 = mondaySlots.find((s) => s.start === '2030-01-07T17:30:00.000Z')
    expect(slot930?.available).toBe(false)
  })

  it('marks pending slots as isPending', () => {
    const weekStart = new Date('2030-01-07T00:00:00Z')

    // 11am Pacific = 19:00 UTC
    const pendingSlots = ['2030-01-07T19:00:00.000Z']

    const result = generateWeekSlots(weekStart, defaultConfig, [], pendingSlots)
    const mondaySlots = result[0].slots

    const slot11 = mondaySlots.find((s) => s.start === '2030-01-07T19:00:00.000Z')
    expect(slot11?.isPending).toBe(true)
    expect(slot11?.available).toBe(false)
  })

  it('disabled days return empty slot arrays', () => {
    // Only allow Tuesdays
    const tuesdayOnlyConfig: SchedulingConfig = {
      ...defaultConfig,
      weeklySchedule: defaultConfig.weeklySchedule.map(d =>
        d.day === 2 ? { ...d, enabled: true } : { ...d, enabled: false }
      ),
    }
    const weekStart = new Date('2030-01-07T00:00:00Z')
    const result = generateWeekSlots(weekStart, tuesdayOnlyConfig, [], [])

    expect(result[0].slots).toHaveLength(0) // Monday
    expect(result[1].slots.length).toBeGreaterThan(0) // Tuesday
    expect(result[2].slots).toHaveLength(0) // Wednesday
  })
})

describe('isSlotAvailable', () => {
  it('returns true when no busy periods', () => {
    const slotStart = new Date('2030-01-07T09:00:00Z')
    const slotEnd = new Date('2030-01-07T09:30:00Z')

    expect(isSlotAvailable(slotStart, slotEnd, [], 15)).toBe(true)
  })

  it('returns false for exact overlap', () => {
    const slotStart = new Date('2030-01-07T10:00:00Z')
    const slotEnd = new Date('2030-01-07T10:30:00Z')
    const busy: BusyPeriod[] = [
      { start: '2030-01-07T10:00:00Z', end: '2030-01-07T10:30:00Z' },
    ]

    expect(isSlotAvailable(slotStart, slotEnd, busy, 0)).toBe(false)
  })

  it('returns false for partial overlap', () => {
    const slotStart = new Date('2030-01-07T10:15:00Z')
    const slotEnd = new Date('2030-01-07T10:45:00Z')
    const busy: BusyPeriod[] = [
      { start: '2030-01-07T10:00:00Z', end: '2030-01-07T10:30:00Z' },
    ]

    expect(isSlotAvailable(slotStart, slotEnd, busy, 0)).toBe(false)
  })

  it('returns true when no overlap (slot before busy)', () => {
    const slotStart = new Date('2030-01-07T08:00:00Z')
    const slotEnd = new Date('2030-01-07T08:30:00Z')
    const busy: BusyPeriod[] = [
      { start: '2030-01-07T10:00:00Z', end: '2030-01-07T10:30:00Z' },
    ]

    expect(isSlotAvailable(slotStart, slotEnd, busy, 0)).toBe(true)
  })

  it('applies buffer correctly', () => {
    // Slot ends at 10:00, busy starts at 10:00, buffer is 15 min
    // Buffer expands busy to 9:45-10:30+15=10:45
    // Slot 9:30-10:00 overlaps with 9:45-10:45
    const slotStart = new Date('2030-01-07T09:30:00Z')
    const slotEnd = new Date('2030-01-07T10:00:00Z')
    const busy: BusyPeriod[] = [
      { start: '2030-01-07T10:00:00Z', end: '2030-01-07T10:30:00Z' },
    ]

    // With 15-min buffer: slot should be blocked
    expect(isSlotAvailable(slotStart, slotEnd, busy, 15)).toBe(false)

    // Without buffer: slot should be available (they just touch, don't overlap)
    expect(isSlotAvailable(slotStart, slotEnd, busy, 0)).toBe(true)
  })
})

describe('getWeekStart', () => {
  it('returns Monday for a Monday input', () => {
    const monday = new Date('2026-03-30T12:00:00Z') // Monday
    const result = getWeekStart(monday)
    expect(result.getUTCDay()).toBe(1) // 1 = Monday
    expect(result.toISOString().split('T')[0]).toBe('2026-03-30')
  })

  it('returns previous Monday for a Wednesday', () => {
    const wednesday = new Date('2026-04-01T12:00:00Z') // Wednesday
    const result = getWeekStart(wednesday)
    expect(result.getUTCDay()).toBe(1) // Monday
    expect(result.toISOString().split('T')[0]).toBe('2026-03-30')
  })

  it('returns previous Monday for a Sunday', () => {
    const sunday = new Date('2026-04-05T12:00:00Z') // Sunday
    const result = getWeekStart(sunday)
    expect(result.getUTCDay()).toBe(1) // Monday
    expect(result.toISOString().split('T')[0]).toBe('2026-03-30')
  })

  it('sets time to midnight UTC', () => {
    const result = getWeekStart(new Date('2026-04-01T15:30:00Z'))
    expect(result.getUTCHours()).toBe(0)
    expect(result.getUTCMinutes()).toBe(0)
    expect(result.getUTCSeconds()).toBe(0)
  })
})

describe('formatSlotForDisplay', () => {
  it('formats UTC time in given timezone', () => {
    // UTC 16:00 → ET 12:00 PM (EDT = UTC-4)
    const result = formatSlotForDisplay(
      '2026-04-01T16:00:00.000Z',
      'America/New_York'
    )
    expect(result).toContain('12')
    expect(result).toContain('PM')
  })

  it('formats morning times correctly', () => {
    // UTC 14:00 → PT 7:00 AM (PDT = UTC-7)
    const result = formatSlotForDisplay(
      '2026-04-01T14:00:00.000Z',
      'America/Los_Angeles'
    )
    expect(result).toContain('7')
    expect(result).toContain('AM')
  })
})

describe('getSlotsForDate', () => {
  it('returns slots for an existing date', () => {
    const weekDays = [
      { date: '2030-01-07', slots: [{ start: 'a', end: 'b', available: true }], dayName: 'Mon', dayNumber: 7, isToday: false },
      { date: '2030-01-08', slots: [{ start: 'c', end: 'd', available: true }], dayName: 'Tue', dayNumber: 8, isToday: false },
    ]
    const result = getSlotsForDate(weekDays, '2030-01-08')
    expect(result).toHaveLength(1)
    expect(result[0].start).toBe('c')
  })

  it('returns empty array for non-existent date', () => {
    const weekDays = [
      { date: '2030-01-07', slots: [], dayName: 'Mon', dayNumber: 7, isToday: false },
    ]
    const result = getSlotsForDate(weekDays, '2030-01-10')
    expect(result).toHaveLength(0)
  })
})
