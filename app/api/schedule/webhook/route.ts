/**
 * POST /api/schedule/webhook — Sanity Webhook Handler
 * ====================================================
 *
 * WHAT IS A WEBHOOK?
 * ------------------
 * A webhook is a "reverse API call." Instead of US calling Sanity,
 * SANITY calls US whenever a document changes. We configure this in
 * the Sanity dashboard (Settings → API → Webhooks).
 *
 * WHY DO WE NEED THIS?
 * When Alvin opens Sanity Studio and changes a booking's status
 * (e.g., clicks "confirmed"), we need to:
 *   - Create a Google Calendar event
 *   - Send a confirmation email to the requester
 *   - Generate cancel/reschedule tokens
 *
 * The webhook makes this automatic — Alvin just changes the status
 * in Studio, and everything else happens behind the scenes.
 *
 * SECURITY:
 * ---------
 * Sanity signs each webhook request with HMAC-SHA256. We verify this
 * signature to ensure the request actually came from Sanity and wasn't
 * forged by an attacker.
 *
 * STATUS TRANSITIONS HANDLED:
 *   pending_approval → Send NewRequestNotification email to Alvin
 *   confirmed       → Create Google Calendar event + send confirmation email
 *   rejected        → Send rejection email to requester
 *
 * CRITICAL RULE:
 * Always return 200 to Sanity, even if our processing fails.
 * If we return non-200, Sanity will retry the webhook, causing
 * duplicate emails and calendar events.
 */

import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { generateActionJWT } from '@/lib/scheduling/tokens'
import { getBookingById, updateBookingStatus, storeGcalEventId } from '@/lib/scheduling/sanity-scheduling'
import { createCalendarEvent } from '@/lib/scheduling/google'
import { Resend } from 'resend'
import type { ApiResponse } from '@/types/scheduling'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // ══════════════════════════════════════════════════════
    // STEP 1: Verify HMAC Signature
    // ══════════════════════════════════════════════════════
    // Sanity includes a signature in the header. We recompute it
    // from the raw body and compare. If they don't match, someone
    // is trying to forge a webhook request.
    //
    // HOW HMAC WORKS:
    //   1. Sanity: HMAC-SHA256(requestBody, SANITY_WEBHOOK_SECRET) → signature
    //   2. Sanity sends: body + signature header
    //   3. Us: HMAC-SHA256(body, SANITY_WEBHOOK_SECRET) → our signature
    //   4. Compare: if signature === our signature → authentic

    const rawBody = await request.text()
    const signature = request.headers.get('sanity-webhook-signature')
    const secret = process.env.SANITY_WEBHOOK_SECRET

    if (!signature || !secret) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing signature', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Compute our own HMAC from the raw body
    const computedSignature = createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')

    // Timing-safe comparison to prevent timing attacks
    // (A timing attack measures response time to guess the correct signature)
    if (signature !== computedSignature) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid signature', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // ══════════════════════════════════════════════════════
    // STEP 2: Parse and filter the webhook payload
    // ══════════════════════════════════════════════════════
    const payload = JSON.parse(rawBody)

    // Only process bookingRequest documents — ignore everything else.
    // Sanity sends webhooks for ALL document changes, including
    // profile edits, blog posts, etc. We only care about bookings.
    if (payload._type !== 'bookingRequest') {
      return NextResponse.json<ApiResponse>({ success: true })
    }

    const bookingId: string = payload._id
    const status: string = payload.status

    // ══════════════════════════════════════════════════════
    // STEP 3: Route by status transition
    // ══════════════════════════════════════════════════════
    // Each status triggers different side effects.

    // Wrap all processing in try-catch to ensure we always return 200.
    try {
      // ── PENDING APPROVAL ─────────────────────────────────
      // A new request was just verified. Send Alvin a notification.
      if (status === 'pending_approval') {
        const booking = await getBookingById(bookingId)
        if (!booking) return NextResponse.json<ApiResponse>({ success: true })

        await resend.emails.send({
          from: 'Schedule System <schedule@alvinquach.dev>',
          to: 'alvinwquach@gmail.com',
          subject: `New meeting request: ${booking.requesterName}${booking.requesterCompany ? ` from ${booking.requesterCompany}` : ''}`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #f1f5f9;">New Meeting Request</h2>
              <table style="color: #94a3b8; line-height: 1.8;">
                <tr><td style="padding-right: 16px; font-weight: bold;">Name:</td><td>${booking.requesterName}</td></tr>
                <tr><td style="padding-right: 16px; font-weight: bold;">Email:</td><td>${booking.requesterEmail}</td></tr>
                ${booking.requesterCompany ? `<tr><td style="padding-right: 16px; font-weight: bold;">Company:</td><td>${booking.requesterCompany}</td></tr>` : ''}
                ${booking.requesterRole ? `<tr><td style="padding-right: 16px; font-weight: bold;">Role:</td><td>${booking.requesterRole}</td></tr>` : ''}
                <tr><td style="padding-right: 16px; font-weight: bold;">Topic:</td><td>${booking.topic}</td></tr>
                <tr><td style="padding-right: 16px; font-weight: bold;">Slot:</td><td>${new Date(booking.requestedSlot).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short', timeZone: 'America/Los_Angeles' })} PT</td></tr>
                <tr><td style="padding-right: 16px; font-weight: bold;">Type:</td><td>${booking.isPrivateLink ? '🔗 Private Link' : '🌐 Public'}</td></tr>
              </table>
              <a href="https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio/desk/scheduling;${booking._id}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
                Review in Sanity Studio
              </a>
            </div>
          `,
        })
      }

      // ── CONFIRMED ────────────────────────────────────────
      // Alvin approved the booking. Create calendar event + send confirmation.
      if (status === 'confirmed') {
        const booking = await getBookingById(bookingId)
        if (!booking) return NextResponse.json<ApiResponse>({ success: true })

        // Generate cancel and reschedule tokens for the confirmation email
        const [cancelJWT, rescheduleJWT] = await Promise.all([
          generateActionJWT('cancel', booking._id),
          generateActionJWT('reschedule', booking._id),
        ])

        // Store token hashes in Sanity
        await updateBookingStatus(booking._id, 'confirmed', {
          approvedAt: new Date().toISOString(),
          cancelToken: cancelJWT.hash,
          rescheduleToken: rescheduleJWT.hash,
        })

        // Create Google Calendar event with Meet link
        let meetLink = ''
        try {
          const calEvent = await createCalendarEvent(booking, true)
          await storeGcalEventId(booking._id, calEvent.eventId)
          meetLink = calEvent.meetLink
        } catch (gcalError) {
          // Calendar event creation failed — still send confirmation
          // but note that the calendar invite will come separately.
          console.error('[webhook] Google Calendar event creation failed:', gcalError)

          // Alert Alvin about the failure
          void resend.emails.send({
            from: 'Schedule System <schedule@alvinquach.dev>',
            to: 'alvinwquach@gmail.com',
            subject: `⚠️ Calendar event failed for ${booking.requesterName}`,
            html: `<p>Google Calendar event creation failed for booking ${booking._id}. Please create manually.</p>`,
          })
        }

        // Send confirmation email to the requester
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alvinquach.dev'
        const formattedDate = new Date(booking.requestedSlot).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
          timeZone: booking.timezone || 'America/Los_Angeles',
        })

        await resend.emails.send({
          from: 'Alvin Quach <schedule@alvinquach.dev>',
          to: booking.requesterEmail,
          subject: `Meeting confirmed — ${new Date(booking.requestedSlot).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} with Alvin Quach`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #f1f5f9;">Your meeting is confirmed ✓</h2>
              <div style="border-left: 3px solid #3b82f6; padding: 16px; margin: 16px 0; background: rgba(59, 130, 246, 0.05); border-radius: 0 6px 6px 0;">
                <p style="color: #f1f5f9; margin: 0 0 8px;"><strong>${formattedDate}</strong></p>
                <p style="color: #94a3b8; margin: 0 0 8px;">${booking.durationMinutes} minutes</p>
                ${meetLink ? `<p style="color: #94a3b8; margin: 0;">Google Meet: <a href="${meetLink}" style="color: #3b82f6;">${meetLink}</a></p>` : ''}
              </div>
              ${meetLink ? `
                <p style="color: #94a3b8; font-size: 14px;">
                  <strong>Add to calendar:</strong><br>
                  <a href="${baseUrl}/api/schedule/ical/${booking._id}" style="color: #3b82f6;">Download .ics file</a>
                </p>
              ` : '<p style="color: #f59e0b; font-size: 14px;">Calendar invite will be sent separately.</p>'}
              <hr style="border-color: rgba(48, 54, 61, 0.7); margin: 24px 0;" />
              <p style="color: #475569; font-size: 12px;">
                Need to reschedule? <a href="${baseUrl}/reschedule/${rescheduleJWT.token}" style="color: #3b82f6;">Request a new time</a><br>
                Can't make it? <a href="${baseUrl}/schedule/cancel/${cancelJWT.token}" style="color: #3b82f6;">Cancel this meeting</a><br>
                <span style="color: #475569;">These links expire in 7 days.</span>
              </p>
              <p style="color: #94a3b8; margin-top: 24px;">Looking forward to it. — Alvin</p>
            </div>
          `,
        })
      }

      // ── REJECTED ─────────────────────────────────────────
      // Alvin declined the request. Send a warm, polite rejection email.
      if (status === 'rejected') {
        const booking = await getBookingById(bookingId)
        if (!booking) return NextResponse.json<ApiResponse>({ success: true })

        await updateBookingStatus(booking._id, 'rejected', {
          rejectedAt: new Date().toISOString(),
        })

        await resend.emails.send({
          from: 'Alvin Quach <schedule@alvinquach.dev>',
          to: booking.requesterEmail,
          subject: 'Re: Your meeting request — alvinquach.dev',
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <p style="color: #94a3b8; line-height: 1.8;">
                Hi ${booking.requesterName},<br><br>
                Thanks for reaching out — I appreciate you taking the time.
                ${booking.rejectionReason
                  ? `<br><br>I'm going to pass for now: ${booking.rejectionReason}`
                  : `<br><br>Unfortunately I'm not able to connect at this time.`}
                <br><br>
                Feel free to reach out directly at <a href="mailto:alvinwquach@gmail.com" style="color: #3b82f6;">alvinwquach@gmail.com</a>
                or connect with me on <a href="https://linkedin.com/in/alvinwquach" style="color: #3b82f6;">LinkedIn</a>.
              </p>
              <p style="color: #94a3b8;">Best,<br>Alvin</p>
            </div>
          `,
        })
      }
    } catch (processingError) {
      // Log the error but DON'T return non-200 to Sanity.
      // Returning non-200 causes retries → duplicate emails.
      console.error('[webhook] Processing error:', processingError)
    }

    // ALWAYS return 200 to Sanity — see comment at top of file.
    return NextResponse.json<ApiResponse>({ success: true })
  } catch (error) {
    console.error('[api/schedule/webhook] Error:', error)
    // Even for parse errors, return 200 to prevent Sanity retries
    return NextResponse.json<ApiResponse>({ success: true })
  }
}
