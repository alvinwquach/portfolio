/**
 * GET /api/schedule/slots — Available Time Slots
 * ===============================================
 *
 * WHAT DOES THIS ROUTE DO?
 * ------------------------
 * Returns the available time slots for a given week. This is the data
 * that powers the WeekCalendar component on the /schedule page.
 *
 * WHEN IS IT CALLED?
 *   - When the schedule page loads (current week)
 *   - When the user clicks prev/next week arrows
 *   - When the reschedule page loads
 *
 * REQUEST:
 *   GET /api/schedule/slots?weekStart=2026-03-30
 *   Query param: weekStart = YYYY-MM-DD (should be a Monday)
 *
 * RESPONSE:
 *   { success: true, data: WeekDay[], warning?: string }
 *   or
 *   { success: false, error: string, code: string }
 *
 * DATA FLOW:
 * ----------
 *   1. Validate weekStart parameter
 *   2. Fetch schedulingConfig from Sanity
 *   3. If bookings disabled: return 503
 *   4. In parallel:
 *      a. Fetch Google Calendar busy periods (getFreeBusy)
 *      b. Fetch Sanity pending/confirmed slots
 *   5. Combine all data in generateWeekSlots()
 *   6. Return the WeekDay array
 *
 * CACHING:
 *   Cache-Control: public, s-maxage=60, stale-while-revalidate=300
 *   This means:
 *     - CDN caches for 60 seconds (fresh)
 *     - After 60s, CDN serves stale while refreshing (up to 5 minutes)
 *     - After 5 minutes, must refetch
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSchedulingConfig } from '@/lib/scheduling/sanity-scheduling'
import { getPendingAndConfirmedSlotsForRange } from '@/lib/scheduling/sanity-scheduling'
import { getFreeBusy } from '@/lib/scheduling/google'
import { generateWeekSlots, getWeekStart } from '@/lib/scheduling/slots'
import type { ApiResponse, WeekDay } from '@/types/scheduling'

export async function GET(request: NextRequest) {
  // PSEUDOCODE:
  //
  // Step 1: Extract and validate the weekStart query parameter
  //   weekStartParam = URL search params → "weekStart"
  //   if missing: return 400 "weekStart parameter is required"
  //   parse as Date
  //   if invalid date: return 400 "Invalid date format"
  //
  // Step 2: Adjust to Monday if not already
  //   weekStart = getWeekStart(parsedDate)
  //
  // Step 3: Fetch scheduling config
  //   config = fetch from Sanity
  //   if not accepting bookings: return 503 "Not currently accepting"
  //
  // Step 4: Validate date range
  //   if weekStart is too far in the future: return 400
  //
  // Step 5: Fetch availability data IN PARALLEL
  //   [busyPeriods, pendingSlots] = await Promise.all([
  //     getFreeBusy(weekStart, weekEnd),
  //     getPendingAndConfirmedSlotsForRange(weekStart, weekEnd)
  //   ])
  //
  // Step 6: Generate the week's slot grid
  //   weekDays = generateWeekSlots(weekStart, config, busyPeriods, pendingSlots)
  //
  // Step 7: Return with cache headers
  //   return weekDays with Cache-Control header

  try {
    // ── Step 1: Validate weekStart parameter ──────────────
    const { searchParams } = new URL(request.url)
    const weekStartParam = searchParams.get('weekStart')

    if (!weekStartParam) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'weekStart parameter is required', code: 'MISSING_PARAM' },
        { status: 400 }
      )
    }

    // Parse the date string into a Date object
    const parsedDate = new Date(weekStartParam + 'T00:00:00Z')
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD.', code: 'INVALID_DATE' },
        { status: 400 }
      )
    }

    // ── Step 2: Adjust to Monday ─────────────────────────
    // Even if the user passes a Wednesday, we snap to that week's Monday.
    const weekStart = getWeekStart(parsedDate)

    // ── Step 3: Fetch config ─────────────────────────────
    const config = await getSchedulingConfig()

    if (!config.isAcceptingBookings) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Not currently accepting booking requests.',
          code: 'BOOKINGS_DISABLED',
        },
        { status: 503 }
      )
    }

    // ── Step 4: Validate date range ──────────────────────
    // Don't let users request slots too far in the future
    const maxFutureDate = new Date()
    maxFutureDate.setUTCDate(maxFutureDate.getUTCDate() + config.advanceBookingDays)

    if (weekStart.getTime() > maxFutureDate.getTime()) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Cannot view slots more than ${config.advanceBookingDays} days ahead.`,
          code: 'TOO_FAR_AHEAD',
        },
        { status: 400 }
      )
    }

    // ── Step 5: Fetch availability data in parallel ──────
    // These two calls are independent — run them simultaneously
    // for better performance. Promise.all waits for BOTH to finish.
    const weekEnd = new Date(weekStart)
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 7)

    let warning: string | undefined
    let busyPeriods: import('@/types/scheduling').BusyPeriod[] = []
    let pendingSlots: string[] = []

    try {
      ;[busyPeriods, pendingSlots] = await Promise.all([
        getFreeBusy(weekStart, weekEnd),
        getPendingAndConfirmedSlotsForRange(weekStart, weekEnd),
      ])
    } catch {
      // If Google Calendar fails, continue with just Sanity data
      // The slots will be less accurate but the page still works
      warning = 'Calendar availability may be incomplete'
      busyPeriods = []
      pendingSlots = await getPendingAndConfirmedSlotsForRange(weekStart, weekEnd)
    }

    // ── Step 6: Generate the slot grid ───────────────────
    const weekDays = generateWeekSlots(weekStart, config, busyPeriods, pendingSlots)

    // ── Step 7: Return with cache headers ────────────────
    const response = NextResponse.json<ApiResponse<WeekDay[]>>({
      success: true,
      data: weekDays,
      warning,
    })

    // Set caching headers:
    // s-maxage=60: CDN considers this fresh for 60 seconds
    // stale-while-revalidate=300: CDN serves stale for 5 more minutes while refreshing
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )

    return response
  } catch (error) {
    console.error('[api/schedule/slots] Unexpected error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
