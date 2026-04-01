/**
 * GET /api/schedule/verify — Email Verification
 * ==============================================
 *
 * WHAT DOES THIS ROUTE DO?
 * ------------------------
 * Handles the verification link that users click in their email.
 * When a user submits a booking request, they get an email with:
 *   https://alvinquach.dev/api/schedule/verify?token=eyJhbG...
 *
 * Clicking that link hits this route, which:
 *   1. Verifies the JWT token
 *   2. Finds the booking in Sanity
 *   3. Updates the booking status from pending_verification → pending_approval
 *   4. Redirects the user to a "success" page
 *
 * WHY A GET ROUTE INSTEAD OF POST?
 * Email links can only be GET requests (clicking a link = GET).
 * This is a common pattern for email verification, password resets, etc.
 *
 * WHY REDIRECT INSTEAD OF RETURNING JSON?
 * This is a user-facing endpoint (they click a link in their email),
 * not an API called by frontend JavaScript. So we redirect to a
 * user-friendly page instead of returning JSON.
 *
 * IDEMPOTENCY:
 * If the user clicks the verification link multiple times, the second
 * click should still work (redirect to pending page). We check if the
 * booking is already verified and handle it gracefully.
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, hashToken } from '@/lib/scheduling/tokens'
import {
  getBookingByVerificationHash,
  updateBookingStatus,
  markTokenUsed,
} from '@/lib/scheduling/sanity-scheduling'
import type { VerificationTokenPayload } from '@/types/scheduling'

export async function GET(request: NextRequest) {
  // PSEUDOCODE:
  //
  // Step 1: Extract token from URL query params
  //   token = searchParams.get("token")
  //   if no token: redirect to error page with INVALID_TOKEN code
  //
  // Step 2: Verify JWT signature and expiry
  //   payload = verifyToken(token)
  //   if null: redirect to error page (invalid or expired)
  //
  // Step 3: Hash the token and look up the booking
  //   hash = SHA-256(token)
  //   booking = getBookingByVerificationHash(hash)
  //   if not found: redirect to error page
  //
  // Step 4: Check current status
  //   if already pending_approval or confirmed:
  //     redirect to pending page (idempotent — already verified)
  //   if not pending_verification:
  //     redirect to error page (invalid state)
  //
  // Step 5: Update status to pending_approval
  //   This triggers the Sanity webhook which notifies Alvin
  //
  // Step 6: If booking used a private link, mark the token as used
  //
  // Step 7: Redirect to /schedule/pending

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alvinquach.dev'

  // Helper to build redirect URLs to the error page
  const errorRedirect = (code: string) =>
    NextResponse.redirect(`${baseUrl}/schedule/error?code=${code}`)

  // Helper to redirect to the pending page
  const pendingRedirect = () =>
    NextResponse.redirect(`${baseUrl}/schedule/pending`)

  try {
    // ── Step 1: Extract token ────────────────────────────
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return errorRedirect('INVALID_TOKEN')
    }

    // ── Step 2: Verify JWT ───────────────────────────────
    const payload = await verifyToken<VerificationTokenPayload>(token)

    if (!payload) {
      // Token is either invalid (tampered) or expired.
      // We can't tell which from here, but both are user errors.
      return errorRedirect('EXPIRED_TOKEN')
    }

    if (payload.type !== 'verification') {
      return errorRedirect('INVALID_TOKEN')
    }

    // ── Step 3: Look up the booking ──────────────────────
    const hash = hashToken(token)
    const booking = await getBookingByVerificationHash(hash)

    if (!booking) {
      return errorRedirect('NOT_FOUND')
    }

    // ── Step 4: Check current status ─────────────────────
    // Handle idempotent case: user clicked the link twice
    if (
      booking.status === 'pending_approval' ||
      booking.status === 'confirmed'
    ) {
      // Already verified — just redirect to pending page.
      // No error, no double-processing.
      return pendingRedirect()
    }

    // Only pending_verification bookings can be verified
    if (booking.status !== 'pending_verification') {
      return errorRedirect('INVALID_STATE')
    }

    // ── Step 5: Update status ────────────────────────────
    // This is the key transition. Changing to "pending_approval"
    // triggers the Sanity webhook, which sends a notification
    // to Alvin's email so he can review and approve/reject.
    await updateBookingStatus(booking._id, 'pending_approval')

    // ── Step 6: Mark private link token as used ──────────
    if (booking.isPrivateLink && booking.privateLinkRef) {
      await markTokenUsed(booking.privateLinkRef._ref, booking._id)
    }

    // ── Step 7: Send "Request Received" email to requester ──
    // Fire-and-forget — don't block the redirect on email delivery.
    // This email confirms to the requester that their request is
    // in the queue and explains next steps.
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const formattedSlot = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: booking.timezone || 'America/Los_Angeles',
      timeZoneName: 'short',
    }).format(new Date(booking.requestedSlot))

    void resend.emails.send({
      from: 'Alvin Quach <schedule@alvinquach.dev>',
      to: booking.requesterEmail,
      subject: 'Request received — alvinquach.dev',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#07090d">
          <div style="background:#3b82f6;width:40px;height:40px;border-radius:8px;text-align:center;line-height:40px;margin-bottom:24px">
            <span style="color:white;font-weight:bold;font-size:18px">AQ</span>
          </div>
          <h2 style="color:#f1f5f9;font-size:20px;margin:0 0 16px">Request received</h2>
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 12px">Hi ${booking.requesterName},</p>
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 20px">Your meeting request has been submitted and is now pending review. I'll get back to you within 24 hours.</p>
          <div style="border-left:3px solid #3b82f6;padding:14px 16px;margin:0 0 20px;background:rgba(59,130,246,0.05);border-radius:0 6px 6px 0">
            <p style="color:#475569;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px">Requested time</p>
            <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0 0 4px">${formattedSlot}</p>
            <p style="color:#94a3b8;font-size:13px;margin:0">${booking.durationMinutes} min · Google Meet</p>
          </div>
          <p style="color:#475569;font-size:13px;line-height:1.6;border-top:1px solid rgba(255,255,255,0.05);padding-top:16px">No action needed — just sit tight. If you have questions, reply to this email or reach me at alvinwquach@gmail.com.</p>
        </div>
      `,
    })

    // ── Step 8: Redirect to success page ─────────────────
    return pendingRedirect()
  } catch (error) {
    console.error('[api/schedule/verify] Error:', error)
    return errorRedirect('INVALID_TOKEN')
  }
}
