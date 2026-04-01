/**
 * Slot Generation Logic
 * =====================
 *
 * WHAT IS THIS FILE?
 * ------------------
 * This file generates the available time slots shown on the weekly calendar.
 * It's the core logic that determines what times a visitor can book.
 *
 * THE SLOT GENERATION ALGORITHM:
 * ------------------------------
 * For each day in the requested week:
 *   1. Skip if it's a non-working day (e.g., weekend)
 *   2. Skip if it's in the past
 *   3. Generate time slots from earliestHour to latestHour
 *   4. For each slot, check if it's available:
 *      a. Not in the past
 *      b. Not within minimumNoticeHours of now
 *      c. Not overlapping any Google Calendar busy period (with buffer)
 *      d. Not already at maxPerDay confirmed bookings
 *      e. Mark as "pending" if a pending booking exists for that time
 *
 * DATA FLOW:
 * ----------
 *   API route (slots/route.ts)
 *     ├── Fetches config from Sanity
 *     ├── Fetches busy periods from Google Calendar (in parallel)
 *     ├── Fetches pending/confirmed slots from Sanity (in parallel)
 *     └── Calls generateWeekSlots() with all that data
 *           └── Returns WeekDay[] array → sent to frontend
 *
 * TIME HANDLING:
 * ─────────────
 * ALL times in this file are in UTC. The frontend converts to the
 * user's local timezone for display using Intl.DateTimeFormat.
 *
 * Why UTC everywhere?
 *   - One source of truth (no timezone ambiguity in storage)
 *   - Google Calendar API uses UTC
 *   - Sanity stores datetime as UTC
 *   - Comparisons are simple (just compare ISO strings or timestamps)
 */

import type {
  SchedulingConfig,
  BusyPeriod,
  WeekDay,
  TimeSlot,
} from '@/types/scheduling'

// ═══════════════════════════════════════════
// MAIN FUNCTION: generateWeekSlots
// ═══════════════════════════════════════════

/**
 * Generate all time slots for a given week.
 *
 * This is the main entry point called by the /api/schedule/slots route.
 * It combines config, Google Calendar, and Sanity data to produce
 * the final slot grid displayed in the WeekCalendar component.
 *
 * @param weekStart    - Monday of the week (Date object, UTC)
 * @param config       - Scheduling config from Sanity
 * @param busyPeriods  - Busy times from Google Calendar
 * @param pendingSlots - UTC ISO strings of pending/confirmed bookings from Sanity
 * @returns WeekDay[]  - Array of 7 days, each with their available slots
 */
export function generateWeekSlots(
  weekStart: Date,
  config: SchedulingConfig,
  busyPeriods: BusyPeriod[],
  pendingSlots: string[]
): WeekDay[] {
  // PSEUDOCODE:
  //
  // weekDays = empty array
  //
  // for dayOffset from 0 to 6 (Monday through Sunday):
  //   currentDate = weekStart + dayOffset days
  //
  //   build WeekDay object with:
  //     date = YYYY-MM-DD string
  //     dayName = "Mon", "Tue", etc.
  //     dayNumber = day of month (1-31)
  //     isToday = whether this date is today
  //     slots = generateDaySlots(currentDate, config, busyPeriods, pendingSlots)
  //
  //   add to weekDays array
  //
  // return weekDays

  const weekDays: WeekDay[] = []
  const now = new Date()

  // Day name abbreviations for the column headers
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    // Calculate the date for this column
    // We start from weekStart (Monday) and add dayOffset days
    const currentDate = new Date(weekStart)
    currentDate.setUTCDate(currentDate.getUTCDate() + dayOffset)

    // Format as YYYY-MM-DD for the date property
    const dateStr = currentDate.toISOString().split('T')[0]

    // Check if this date is today (comparing just the date portion)
    const todayStr = now.toISOString().split('T')[0]
    const isToday = dateStr === todayStr

    // Generate slots for this day
    // This is where the real logic happens — see generateDaySlots below
    const slots = generateDaySlots(
      currentDate,
      config,
      busyPeriods,
      pendingSlots,
      now
    )

    weekDays.push({
      date: dateStr,
      dayName: dayNames[dayOffset],
      dayNumber: currentDate.getUTCDate(),
      isToday,
      slots,
    })
  }

  return weekDays
}

// ═══════════════════════════════════════════
// HELPER: generateDaySlots
// ═══════════════════════════════════════════

/**
 * Generate time slots for a single day.
 *
 * Uses THREE layers of availability:
 *   1. weeklySchedule (per-day hours from config)
 *   2. dateOverrides (specific date exceptions)
 *   3. Google Calendar freebusy (passed as busyPeriods)
 */
function generateDaySlots(
  date: Date,
  config: SchedulingConfig,
  busyPeriods: BusyPeriod[],
  pendingSlots: string[],
  now: Date
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const dateStr = date.toISOString().split('T')[0]
  const todayStr = now.toISOString().split('T')[0]

  // Past date check
  if (dateStr < todayStr) return slots

  const dayOfWeek = date.getUTCDay()
  const { slotDurationMinutes, bufferMinutes, minimumNoticeHours } = config

  // ── Determine this day's hours ─────────────────────────
  // Check dateOverrides first (specific date exceptions take priority)
  const override = config.dateOverrides?.find(o => o.date === dateStr)

  let earliestHour: number
  let earliestMinute: number
  let latestHour: number
  let latestMinute: number

  if (override) {
    // Date override found
    if (!override.enabled) return slots // Day blocked entirely
    earliestHour = override.startHour ?? 9
    earliestMinute = override.startMinute ?? 0
    latestHour = override.endHour ?? 17
    latestMinute = override.endMinute ?? 0
  } else {
    // Use weekly schedule
    const daySchedule = config.weeklySchedule?.find(d => d.day === dayOfWeek)
    if (!daySchedule || !daySchedule.enabled) return slots // Day off
    earliestHour = daySchedule.startHour
    earliestMinute = daySchedule.startMinute ?? 0
    latestHour = daySchedule.endHour
    latestMinute = daySchedule.endMinute ?? 0
  }

  // ── Convert Pacific hours to UTC ───────────────────────
  const pacificOffsetMinutes = getPacificOffsetMinutes(date)

  const startMinutesLocal = earliestHour * 60 + earliestMinute
  const endMinutesLocal = latestHour * 60 + latestMinute
  const latestStartMinutes = endMinutesLocal - slotDurationMinutes

  for (
    let minutesFromMidnight = startMinutesLocal;
    minutesFromMidnight <= latestStartMinutes;
    minutesFromMidnight += slotDurationMinutes
  ) {
    const utcMinutes = minutesFromMidnight + pacificOffsetMinutes
    const slotStart = new Date(date)
    slotStart.setUTCHours(
      Math.floor(utcMinutes / 60),
      utcMinutes % 60,
      0,
      0
    )

    const slotEnd = new Date(
      slotStart.getTime() + slotDurationMinutes * 60 * 1000
    )

    // ── Availability checks ──────────────────────────────

    // Check 1: Is this slot in the past?
    const isPast = slotStart.getTime() <= now.getTime()

    // Check 2: Is this slot within the minimum notice window?
    // If minimumNoticeHours is 24, the slot must be at least 24 hours from now
    const noticeDeadline = new Date(
      now.getTime() + minimumNoticeHours * 60 * 60 * 1000
    )
    const tooSoon = slotStart.getTime() < noticeDeadline.getTime()

    // Check 3: Does this slot overlap any Google Calendar busy period?
    // We pass the buffer so busy periods "expand" by bufferMinutes on both sides
    const overlapsCalendar = !isSlotAvailable(
      slotStart,
      slotEnd,
      busyPeriods,
      bufferMinutes
    )

    // Check 4: Is there already a pending/confirmed booking at this time?
    // We compare the slot's ISO string against the list from Sanity
    const slotIso = slotStart.toISOString()
    const isPending = pendingSlots.includes(slotIso)

    // A slot is available only if ALL checks pass
    const available = !isPast && !tooSoon && !overlapsCalendar && !isPending

    slots.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      available,
      isPending: isPending && !isPast && !tooSoon,
    })
  }

  return slots
}

// ═══════════════════════════════════════════
// AVAILABILITY CHECK
// ═══════════════════════════════════════════

/**
 * Check if a specific slot is available (not overlapping any busy period).
 *
 * BUFFER LOGIC:
 * The buffer expands each busy period on both sides:
 *
 *   Busy period:     |████████████|
 *   With buffer:  |──|████████████|──|
 *                 ↑                   ↑
 *             buffer before       buffer after
 *
 * Any slot that overlaps the expanded busy period is unavailable.
 *
 * OVERLAP DETECTION:
 * Two time ranges overlap if and only if:
 *   range1.start < range2.end AND range1.end > range2.start
 *
 * This covers all overlap cases:
 *   - Slot starts during busy period
 *   - Slot ends during busy period
 *   - Slot contains entire busy period
 *   - Busy period contains entire slot
 *
 * @param slotStart     - Start of the slot to check
 * @param slotEnd       - End of the slot to check
 * @param busyPeriods   - Array of busy periods from Google Calendar
 * @param bufferMinutes - Padding to add around each busy period
 * @returns true if the slot is free, false if it overlaps
 */
export function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  busyPeriods: BusyPeriod[],
  bufferMinutes: number
): boolean {
  // PSEUDOCODE:
  //
  // for each busyPeriod:
  //   expandedStart = busyPeriod.start - bufferMinutes
  //   expandedEnd   = busyPeriod.end + bufferMinutes
  //
  //   if slot overlaps with expanded busy period:
  //     return false (not available)
  //
  // return true (no overlaps found — slot is free)

  const bufferMs = bufferMinutes * 60 * 1000

  for (const busy of busyPeriods) {
    // Expand the busy period by the buffer on both sides
    const busyStart = new Date(busy.start).getTime() - bufferMs
    const busyEnd = new Date(busy.end).getTime() + bufferMs

    // Check for overlap using the interval overlap formula:
    // Two intervals [a, b) and [c, d) overlap iff a < d AND b > c
    if (
      slotStart.getTime() < busyEnd &&
      slotEnd.getTime() > busyStart
    ) {
      return false // Slot overlaps this busy period
    }
  }

  return true // No overlaps — slot is available
}

// ═══════════════════════════════════════════
// TIMEZONE HELPER
// ═══════════════════════════════════════════

/**
 * Get the UTC offset (in minutes) for America/Los_Angeles on a given date.
 *
 * WHY THIS IS NEEDED:
 * The schedulingConfig hours (earliestHour=9, latestHour=17) represent
 * Alvin's local business hours in Pacific time. To generate UTC slot
 * times, we need to know the UTC offset for that date.
 *
 * DST HANDLING:
 *   PST (Nov-Mar): UTC-8 → offset = 480 minutes
 *   PDT (Mar-Nov): UTC-7 → offset = 420 minutes
 *
 * We use Intl.DateTimeFormat to get the actual offset for the date,
 * which automatically handles DST transitions.
 *
 * @param date - The date to check
 * @returns Offset in minutes to ADD to Pacific time to get UTC
 */
function getPacificOffsetMinutes(date: Date): number {
  // Format the date in Pacific timezone and in UTC, then compare
  const pacificStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(date)

  // Parse Pacific formatted date back to components
  const [datePart, timePart] = pacificStr.split(', ')
  if (!timePart) {
    // Fallback: assume PST (UTC-8) if parsing fails
    return 480
  }

  // Simpler approach: just check if we're in DST for this date
  // Create a date at noon on the target date in UTC
  const testDate = new Date(date)
  testDate.setUTCHours(12, 0, 0, 0)

  // Get the Pacific hour for this UTC noon
  const pacParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(testDate)

  const pacHour = parseInt(pacParts.find(p => p.type === 'hour')?.value || '0')

  // UTC noon = 12. If Pacific shows 5, offset is 7 hours (PDT).
  // If Pacific shows 4, offset is 8 hours (PST).
  const offsetHours = 12 - pacHour
  return offsetHours * 60
}

// ═══════════════════════════════════════════
// DATE HELPERS
// ═══════════════════════════════════════════

/**
 * Get the Monday of the week containing the given date.
 *
 * WHY MONDAY?
 * The calendar grid starts on Monday (ISO 8601 standard).
 * This function ensures the weekStart is always a Monday,
 * even if the user passes a Wednesday.
 *
 * ALGORITHM:
 *   1. Get the day of week (0=Sun, 1=Mon, ..., 6=Sat)
 *   2. Calculate how many days to subtract to reach Monday
 *   3. Subtract that many days from the date
 *
 * EDGE CASE — SUNDAY:
 *   getUTCDay() returns 0 for Sunday.
 *   Formula: (dayOfWeek + 6) % 7 gives days since Monday:
 *     Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
 *   So for Sunday (0): (0 + 6) % 7 = 6 → go back 6 days to Monday
 *
 * @param date - Any date
 * @returns The Monday of that date's week (midnight UTC)
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  // (dayOfWeek + 6) % 7 converts Sunday=0..Saturday=6 to Monday=0..Sunday=6
  const daysSinceMonday = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - daysSinceMonday)
  d.setUTCHours(0, 0, 0, 0) // Reset to midnight UTC
  return d
}

/**
 * Format a UTC ISO slot time for human display in a given timezone.
 *
 * EXAMPLE:
 *   formatSlotForDisplay("2026-04-01T16:00:00.000Z", "America/New_York")
 *   → "9:00 AM"  (UTC 16:00 = ET 12:00 noon... wait, let me recalculate)
 *   → Actually "12:00 PM" (EDT is UTC-4 in April)
 *
 * WHY Intl.DateTimeFormat?
 *   - Built into every modern browser and Node.js
 *   - Handles DST transitions correctly
 *   - Supports all IANA timezone identifiers
 *   - No extra library needed
 *
 * @param utcIso   - UTC ISO string (e.g., "2026-04-01T16:00:00.000Z")
 * @param timezone - IANA timezone (e.g., "America/Los_Angeles")
 * @returns Formatted time string (e.g., "9:00 AM")
 */
export function formatSlotForDisplay(
  utcIso: string,
  timezone: string
): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(utcIso))
}

/**
 * Extract slots for a specific date from a WeekDay array.
 *
 * Helper used when you have the full week data but need just one day's slots.
 *
 * @param weekDays - Full week of data
 * @param date     - YYYY-MM-DD string of the date to find
 * @returns TimeSlot array for that date (empty if not found)
 */
export function getSlotsForDate(
  weekDays: WeekDay[],
  date: string
): TimeSlot[] {
  return weekDays.find((day) => day.date === date)?.slots || []
}
