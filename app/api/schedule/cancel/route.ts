/**
 * POST /api/schedule/cancel — Cancel a Confirmed Booking
 * ======================================================
 *
 * WHAT DOES THIS ROUTE DO?
 * ------------------------
 * Cancels a confirmed booking. The user gets a cancel link in their
 * confirmation email. When they click it, the frontend calls this route.
 *
 * SIDE EFFECTS:
 *   - Updates booking status to "cancelled" in Sanity
 *   - Deletes the Google Calendar event (if one exists)
 *   - Sends a cancellation confirmation email to the user
 *
 * REQUEST BODY:
 *   { token: string }  // The raw cancel JWT from the email link
 *
 * EDGE CASES:
 *   - Token not found: 404
 *   - Token expired: 400 EXPIRED_TOKEN
 *   - Already cancelled: 400 ALREADY_CANCELLED
 *   - Not confirmed (can only cancel confirmed bookings): 400 NOT_CONFIRMED
 */

import { NextResponse } from 'next/server'
import { verifyToken, hashToken } from '@/lib/scheduling/tokens'
import {
  getBookingByCancelHash,
  updateBookingStatus,
} from '@/lib/scheduling/sanity-scheduling'
import { deleteCalendarEvent } from '@/lib/scheduling/google'
import { Resend } from 'resend'
import type { ApiResponse, ActionTokenPayload } from '@/types/scheduling'

const getResend = () => new Resend(process.env.RESEND_API_KEY || '')

export async function POST(request: Request) {
  try {
    // ── Parse request body ───────────────────────────────
    const { token } = (await request.json()) as { token: string }

    if (!token) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Token is required', code: 'MISSING_TOKEN' },
        { status: 400 }
      )
    }

    // ── Verify the JWT ───────────────────────────────────
    // This checks the signature (proves we created it) and expiry.
    const payload = await verifyToken<ActionTokenPayload>(token)

    if (!payload || payload.type !== 'cancel') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid or expired cancel link', code: 'EXPIRED_TOKEN' },
        { status: 400 }
      )
    }

    // ── Look up booking by token hash ────────────────────
    const hash = hashToken(token)
    const booking = await getBookingByCancelHash(hash)

    if (!booking) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Booking not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // ── Check booking state ──────────────────────────────
    if (booking.status === 'cancelled') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'This booking is already cancelled', code: 'ALREADY_CANCELLED' },
        { status: 400 }
      )
    }

    if (booking.status !== 'confirmed') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Only confirmed bookings can be cancelled', code: 'NOT_CONFIRMED' },
        { status: 400 }
      )
    }

    // ── Delete Google Calendar event ─────────────────────
    // If a calendar event was created when the booking was confirmed,
    // delete it. This is wrapped in a try-catch internally —
    // deleteCalendarEvent handles errors gracefully.
    if (booking.gcalEventId) {
      await deleteCalendarEvent(booking.gcalEventId)
    }

    // ── Update Sanity status ─────────────────────────────
    await updateBookingStatus(booking._id, 'cancelled', {
      cancelledAt: new Date().toISOString(),
    })

    // ── Send cancellation confirmation email ─────────────
    // Fire and forget — don't block the response on email delivery
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alvinquach.dev'

    void getResend().emails.send({
      from: 'Alvin Quach <schedule@alvinquach.dev>',
      to: booking.requesterEmail,
      subject: `Meeting cancelled — ${new Date(booking.requestedSlot).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #f1f5f9;">Meeting Cancelled</h2>
          <p style="color: #94a3b8; line-height: 1.6;">
            Your meeting scheduled for <strong>${new Date(booking.requestedSlot).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: booking.timezone })}</strong> has been cancelled.
          </p>
          <p style="color: #94a3b8; line-height: 1.6;">
            If you'd like to find another time, you're welcome to
            <a href="${baseUrl}/schedule" style="color: #3b82f6;">submit a new request</a>.
          </p>
        </div>
      `,
    })

    return NextResponse.json<ApiResponse>({ success: true })
  } catch (error) {
    console.error('[api/schedule/cancel] Error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to cancel booking', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
