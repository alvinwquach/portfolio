/**
 * GET /api/schedule/booking — Fetch Booking Details for Reschedule Page
 * =====================================================================
 *
 * WHAT DOES THIS ROUTE DO?
 * ------------------------
 * Returns safe booking details for the reschedule page.
 * When someone visits /reschedule/[token], the frontend needs to show
 * the current booking details (time, topic, status) without exposing
 * internal fields like token hashes.
 *
 * WHY A SEPARATE ROUTE?
 * The reschedule page is a client component that needs booking data
 * fetched via the browser. We can't use server-side Sanity queries
 * directly because the page needs the user's timezone (detected client-side).
 *
 * SECURITY:
 * Only returns data if the reschedule token is valid. This prevents
 * anyone from fetching booking details without the correct link.
 *
 * REQUEST:
 *   GET /api/schedule/booking?token=eyJhbG...
 *
 * RESPONSE:
 *   { success: true, data: { id, status, requestedSlot, topic, ... } }
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, hashToken } from '@/lib/scheduling/tokens'
import { getBookingByRescheduleHash } from '@/lib/scheduling/sanity-scheduling'
import type { ApiResponse, ActionTokenPayload } from '@/types/scheduling'

/**
 * Safe booking data — only the fields the reschedule page needs.
 * We explicitly exclude internal fields (token hashes, IP hash, etc.)
 */
interface SafeBookingData {
  id: string
  status: string
  requestedSlot: string
  topic: string
  timezone: string
  requesterName: string
  durationMinutes: number
}

export async function GET(request: NextRequest) {
  try {
    // ── Extract token from query params ──────────────────
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Token required', code: 'MISSING_TOKEN' },
        { status: 400 }
      )
    }

    // ── Verify the JWT ───────────────────────────────────
    const payload = await verifyToken<ActionTokenPayload>(token)

    if (!payload || payload.type !== 'reschedule') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
        { status: 400 }
      )
    }

    // ── Look up booking ──────────────────────────────────
    const hash = hashToken(token)
    const booking = await getBookingByRescheduleHash(hash)

    if (!booking) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Booking not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // ── Return safe subset of data ───────────────────────
    // Only include fields the reschedule page needs to render.
    // Never expose: tokenHashes, ipHash, gcalEventId, etc.
    const safeData: SafeBookingData = {
      id: booking._id,
      status: booking.status,
      requestedSlot: booking.requestedSlot,
      topic: booking.topic,
      timezone: booking.timezone,
      requesterName: booking.requesterName,
      durationMinutes: booking.durationMinutes,
    }

    return NextResponse.json<ApiResponse<SafeBookingData>>({
      success: true,
      data: safeData,
    })
  } catch (error) {
    console.error('[api/schedule/booking] Error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
