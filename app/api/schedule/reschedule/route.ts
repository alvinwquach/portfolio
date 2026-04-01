/**
 * POST /api/schedule/reschedule — Reschedule a Confirmed Booking
 * ==============================================================
 *
 * WHAT DOES THIS ROUTE DO?
 * ------------------------
 * Handles a reschedule request. When someone wants to change their
 * meeting time, they:
 *   1. Click "Reschedule" link in their confirmation email
 *   2. Select a new time on the reschedule page (/reschedule/[token])
 *   3. The frontend POSTs here with the new slot
 *
 * KEY DIFFERENCE FROM NEW BOOKINGS:
 *   - No reCAPTCHA required (user is already verified)
 *   - Still validates slot availability (Google Calendar + Sanity)
 *   - Sets status back to pending_approval (Alvin must re-approve)
 *   - Generates NEW cancel/reschedule tokens (old ones invalidated)
 *   - Deletes the old Google Calendar event
 *
 * REQUEST BODY (RescheduleFormData):
 *   {
 *     rescheduleToken: string,  // Raw JWT from confirmation email
 *     newSlot: string,          // UTC ISO string of the new time
 *     timezone: string,         // User's current IANA timezone
 *   }
 */

import { NextResponse } from 'next/server'
import { verifyToken, hashToken, generateActionJWT } from '@/lib/scheduling/tokens'
import {
  getBookingByRescheduleHash,
  updateBookingStatus,
  getSchedulingConfig,
  getConfirmedCountForDay,
  getPendingAndConfirmedSlotsForRange,
} from '@/lib/scheduling/sanity-scheduling'
import { deleteCalendarEvent, getFreeBusy } from '@/lib/scheduling/google'
import { isSlotAvailable } from '@/lib/scheduling/slots'
import { Resend } from 'resend'
import type { ApiResponse, ActionTokenPayload, RescheduleFormData } from '@/types/scheduling'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RescheduleFormData

    // ── Validate required fields ─────────────────────────
    if (!body.rescheduleToken || !body.newSlot || !body.timezone) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // ── Verify the reschedule JWT ────────────────────────
    const payload = await verifyToken<ActionTokenPayload>(body.rescheduleToken)

    if (!payload || payload.type !== 'reschedule') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid or expired reschedule link', code: 'EXPIRED_TOKEN' },
        { status: 400 }
      )
    }

    // ── Look up booking by token hash ────────────────────
    const hash = hashToken(body.rescheduleToken)
    const booking = await getBookingByRescheduleHash(hash)

    if (!booking) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Booking not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // ── Validate booking state ───────────────────────────
    // Can only reschedule confirmed bookings
    if (booking.status === 'cancelled') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'This booking has been cancelled', code: 'ALREADY_CANCELLED' },
        { status: 400 }
      )
    }

    if (booking.status !== 'confirmed') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Only confirmed bookings can be rescheduled', code: 'NOT_CONFIRMED' },
        { status: 400 }
      )
    }

    // ── Validate new slot ────────────────────────────────
    const newSlotDate = new Date(body.newSlot)

    // Can't reschedule to the same time
    if (body.newSlot === booking.requestedSlot) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "That's the same time as your current meeting", code: 'SAME_SLOT' },
        { status: 400 }
      )
    }

    // Can't reschedule to the past
    if (newSlotDate.getTime() <= Date.now()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Cannot reschedule to a past time', code: 'PAST_SLOT' },
        { status: 400 }
      )
    }

    // ── Full availability check ──────────────────────────
    // Same checks as the request route (minus reCAPTCHA)
    const config = await getSchedulingConfig()
    const slotEnd = new Date(newSlotDate.getTime() + config.slotDurationMinutes * 60 * 1000)
    const dayStart = new Date(newSlotDate)
    dayStart.setUTCHours(0, 0, 0, 0)
    const dayEnd = new Date(newSlotDate)
    dayEnd.setUTCHours(23, 59, 59, 999)

    const [busyPeriods, pendingSlots] = await Promise.all([
      getFreeBusy(dayStart, dayEnd),
      getPendingAndConfirmedSlotsForRange(dayStart, dayEnd),
    ])

    // Filter out the current booking's slot from pending slots
    // (the user's own current slot shouldn't block their reschedule)
    const filteredPending = pendingSlots.filter(
      (slot) => slot !== booking.requestedSlot
    )

    if (!isSlotAvailable(newSlotDate, slotEnd, busyPeriods, config.bufferMinutes)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'That slot is no longer available', code: 'SLOT_UNAVAILABLE' },
        { status: 409 }
      )
    }

    if (filteredPending.includes(body.newSlot)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'That slot was just taken', code: 'SLOT_UNAVAILABLE' },
        { status: 409 }
      )
    }

    // Daily limit check
    const confirmedToday = await getConfirmedCountForDay(newSlotDate)
    if (confirmedToday >= config.maxPerDay) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No more slots available that day', code: 'DAILY_LIMIT_REACHED' },
        { status: 409 }
      )
    }

    // Minimum notice check
    const noticeDeadline = new Date(Date.now() + config.minimumNoticeHours * 60 * 60 * 1000)
    if (newSlotDate.getTime() < noticeDeadline.getTime()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Must book at least ${config.minimumNoticeHours} hours in advance`, code: 'TOO_SOON' },
        { status: 400 }
      )
    }

    // ── Delete old Google Calendar event ─────────────────
    // A new event will be created when Alvin re-approves
    if (booking.gcalEventId) {
      await deleteCalendarEvent(booking.gcalEventId)
    }

    // ── Generate new action tokens ───────────────────────
    // Old cancel/reschedule tokens are invalidated because we're
    // overwriting the hashes in Sanity.
    const [newCancelToken, newRescheduleToken] = await Promise.all([
      generateActionJWT('cancel', booking._id),
      generateActionJWT('reschedule', booking._id),
    ])

    // ── Update the booking in Sanity ─────────────────────
    await updateBookingStatus(booking._id, 'pending_approval', {
      previousSlot: booking.requestedSlot,
      requestedSlot: body.newSlot,
      rescheduledAt: new Date().toISOString(),
      cancelToken: newCancelToken.hash,
      rescheduleToken: newRescheduleToken.hash,
      gcalEventId: undefined, // Clear old event ID
    })

    // ── Send notification to Alvin ───────────────────────
    void resend.emails.send({
      from: 'Schedule System <schedule@alvinquach.dev>',
      to: 'alvinwquach@gmail.com',
      subject: `${booking.requesterName} requested to reschedule`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #f1f5f9;">Reschedule Request</h2>
          <p style="color: #94a3b8;"><strong>${booking.requesterName}</strong> wants to reschedule.</p>
          <table style="color: #94a3b8; line-height: 1.8;">
            <tr><td style="padding-right: 16px;">Old slot:</td><td>${new Date(booking.requestedSlot).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Los_Angeles' })}</td></tr>
            <tr><td style="padding-right: 16px;">New slot:</td><td>${new Date(body.newSlot).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Los_Angeles' })}</td></tr>
            <tr><td style="padding-right: 16px;">Topic:</td><td>${booking.topic}</td></tr>
          </table>
          <a href="https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio/desk/scheduling;${booking._id}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
            Review in Sanity Studio
          </a>
        </div>
      `,
    })

    return NextResponse.json<ApiResponse>({
      success: true,
    })
  } catch (error) {
    console.error('[api/schedule/reschedule] Error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to reschedule', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
