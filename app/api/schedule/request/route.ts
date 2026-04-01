/**
 * POST /api/schedule/request — Submit a Booking Request
 * =====================================================
 *
 * WHAT DOES THIS ROUTE DO?
 * ------------------------
 * Handles the form submission from the booking form on /schedule.
 * This is the most complex API route — it has 8 sequential steps
 * that each must pass before the booking is created.
 *
 * STEPS:
 *   1. Rate limiting (by IP hash)
 *   2. reCAPTCHA verification (bot protection)
 *   3. Private link validation (if applicable)
 *   4. Slot availability re-verification
 *   5. Daily limit check
 *   6. Generate verification token
 *   7. Write booking to Sanity
 *   8. Send verification email
 *
 * WHY SO MANY STEPS?
 * Because this is a public endpoint that anyone on the internet can hit.
 * Each step adds a layer of protection:
 *   - Rate limiting → prevents spam bots
 *   - reCAPTCHA → proves the user is human
 *   - Slot re-verification → prevents double-booking (race condition)
 *   - Daily limit → prevents overloading Alvin's calendar
 *   - Token hashing → prevents link forgery
 *
 * REQUEST BODY:
 *   {
 *     requesterName: string,
 *     requesterEmail: string,
 *     requesterCompany?: string,
 *     requesterRole?: string,
 *     topic: string,
 *     requestedSlot: string,     // UTC ISO
 *     timezone: string,           // IANA timezone
 *     recaptchaToken: string,     // From reCAPTCHA v3
 *     privateLinkToken?: string,  // JWT if booking via private link
 *   }
 *
 * RESPONSE:
 *   200: { success: true, message: "Check your email to verify" }
 *   400: { success: false, error: "...", code: "RECAPTCHA_FAILED" | ... }
 *   409: { success: false, error: "...", code: "SLOT_UNAVAILABLE" | "DAILY_LIMIT_REACHED" }
 *   429: { success: false, error: "...", code: "RATE_LIMITED" }
 *   500: { success: false, error: "...", code: "STORAGE_ERROR" }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { headers } from 'next/headers'
import { generateVerificationJWT, hashToken, verifyToken } from '@/lib/scheduling/tokens'
import { getFreeBusy } from '@/lib/scheduling/google'
import { isSlotAvailable } from '@/lib/scheduling/slots'
import {
  getSchedulingConfig,
  createBookingRequest,
  getConfirmedCountForDay,
  getRecentRequestCountByIp,
  getTokenByHash,
  getPendingAndConfirmedSlotsForRange,
} from '@/lib/scheduling/sanity-scheduling'
import { Resend } from 'resend'
import type {
  ApiResponse,
  BookingFormData,
  PrivateLinkTokenPayload,
  RecaptchaVerifyResponse,
} from '@/types/scheduling'

const getResend = () => new Resend(process.env.RESEND_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    // ── Parse request body ───────────────────────────────
    const body = (await request.json()) as BookingFormData

    // Basic input validation before expensive operations
    if (!body.requesterName || !body.requesterEmail || !body.topic || !body.requestedSlot) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // ══════════════════════════════════════════════════════
    // STEP 1: Rate Limiting
    // ══════════════════════════════════════════════════════
    // Hash the user's IP address and count recent requests.
    // If they've made more than 3 in the last hour, reject.
    //
    // WHY HASH THE IP?
    // We don't want to store raw IPs (privacy concern).
    // SHA-256 lets us count per-IP without knowing the actual IP.
    //
    // HOW DO WE GET THE IP?
    // On Vercel, the real IP is in the x-forwarded-for header.
    // The first IP in the chain is the original client.

    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for') || 'unknown'
    const clientIp = forwarded.split(',')[0].trim()
    const ipHash = createHash('sha256').update(clientIp).digest('hex')

    const recentCount = await getRecentRequestCountByIp(ipHash)
    if (recentCount >= 3) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' },
        { status: 429 }
      )
    }

    // ══════════════════════════════════════════════════════
    // STEP 2: reCAPTCHA Verification
    // ══════════════════════════════════════════════════════
    // reCAPTCHA v3 runs invisibly in the background.
    // The frontend gets a token, sends it to us, we verify with Google.
    // Google returns a score from 0.0 (bot) to 1.0 (human).
    // We reject scores below 0.5.
    //
    // WHY NOT JUST CHECK ON THE FRONTEND?
    // Because attackers can skip the frontend entirely and hit this
    // API directly with curl/postman. Server-side verification is the
    // only reliable check.

    if (!body.recaptchaToken) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'reCAPTCHA token required', code: 'RECAPTCHA_FAILED' },
        { status: 400 }
      )
    }

    const recaptchaResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY || '',
          response: body.recaptchaToken,
        }),
      }
    )

    const recaptchaData = (await recaptchaResponse.json()) as RecaptchaVerifyResponse

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Bot detection failed. Please try again.', code: 'RECAPTCHA_FAILED' },
        { status: 400 }
      )
    }

    // ══════════════════════════════════════════════════════
    // STEP 3: Private Link Validation (optional)
    // ══════════════════════════════════════════════════════
    // If the user is booking via a private link, verify the JWT
    // and check that the token hasn't been used/revoked/expired.

    let privateLinkRef: string | undefined
    let isPrivateLink = false

    if (body.privateLinkToken) {
      // Verify the JWT signature and expiry
      const payload = await verifyToken<PrivateLinkTokenPayload>(body.privateLinkToken)
      if (!payload || payload.type !== 'private_link') {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Invalid private link', code: 'INVALID_PRIVATE_LINK' },
          { status: 400 }
        )
      }

      // Look up the schedulingToken in Sanity
      const tokenHash = hashToken(body.privateLinkToken)
      const schedulingToken = await getTokenByHash(tokenHash)

      if (!schedulingToken) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Private link not found', code: 'INVALID_PRIVATE_LINK' },
          { status: 400 }
        )
      }

      // Check token state
      if (schedulingToken.isRevoked) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'This link has been revoked', code: 'INVALID_PRIVATE_LINK' },
          { status: 400 }
        )
      }

      if (schedulingToken.isUsed) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'This link has already been used', code: 'USED_PRIVATE_LINK' },
          { status: 400 }
        )
      }

      if (new Date(schedulingToken.expiresAt) < new Date()) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'This link has expired', code: 'EXPIRED_PRIVATE_LINK' },
          { status: 400 }
        )
      }

      privateLinkRef = schedulingToken._id
      isPrivateLink = true
    }

    // ══════════════════════════════════════════════════════
    // STEP 4: Slot Availability Re-verification
    // ══════════════════════════════════════════════════════
    // The frontend showed the slot as available, but time has passed
    // since then. Someone else might have booked it. We re-verify.
    //
    // This is the CRITICAL race condition guard. Without this check,
    // two people could book the same slot simultaneously.

    const config = await getSchedulingConfig()

    if (!config.isAcceptingBookings) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Not currently accepting bookings', code: 'BOOKINGS_DISABLED' },
        { status: 503 }
      )
    }

    const slotDate = new Date(body.requestedSlot)
    const slotEnd = new Date(slotDate.getTime() + (config.slotDurationMinutes * 60 * 1000))
    const dayStart = new Date(slotDate)
    dayStart.setUTCHours(0, 0, 0, 0)
    const dayEnd = new Date(slotDate)
    dayEnd.setUTCHours(23, 59, 59, 999)

    // Fetch current busy periods and pending slots
    const [busyPeriods, pendingSlots] = await Promise.all([
      getFreeBusy(dayStart, dayEnd),
      getPendingAndConfirmedSlotsForRange(dayStart, dayEnd),
    ])

    // Check Google Calendar availability
    if (!isSlotAvailable(slotDate, slotEnd, busyPeriods, config.bufferMinutes)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'That slot is no longer available.', code: 'SLOT_UNAVAILABLE' },
        { status: 409 }
      )
    }

    // Check if someone else already has this slot
    if (pendingSlots.includes(body.requestedSlot)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'That slot was just taken. Please select another.', code: 'SLOT_UNAVAILABLE' },
        { status: 409 }
      )
    }

    // ══════════════════════════════════════════════════════
    // STEP 5: Daily Limit Check
    // ══════════════════════════════════════════════════════
    const confirmedToday = await getConfirmedCountForDay(slotDate)
    if (confirmedToday >= config.maxPerDay) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No more slots available that day.', code: 'DAILY_LIMIT_REACHED' },
        { status: 409 }
      )
    }

    // ══════════════════════════════════════════════════════
    // STEP 6: Generate Verification Token
    // ══════════════════════════════════════════════════════
    // We need a temporary ID for the JWT payload. We'll use a
    // placeholder and update it after the Sanity document is created.
    // Actually, we create the document first, then update with the hash.

    // ══════════════════════════════════════════════════════
    // STEP 7: Write to Sanity
    // ══════════════════════════════════════════════════════
    // Create the booking document in Sanity. It starts in
    // pending_verification status (email not yet verified).

    const bookingId = await createBookingRequest({
      status: 'pending_verification',
      requesterName: body.requesterName,
      requesterEmail: body.requesterEmail,
      requesterCompany: body.requesterCompany,
      requesterRole: body.requesterRole,
      topic: body.topic,
      requestedSlot: body.requestedSlot,
      durationMinutes: config.slotDurationMinutes,
      timezone: body.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      isPrivateLink,
      ...(privateLinkRef && {
        privateLinkRef: { _ref: privateLinkRef },
      }),
      createdAt: new Date().toISOString(),
      ipHash,
    })

    // Now generate the verification token with the real booking ID
    const { token: verificationToken, hash: verificationHash } =
      await generateVerificationJWT(bookingId, body.requesterEmail)

    // Update the booking with the verification token hash
    const { updateBookingStatus } = await import('@/lib/scheduling/sanity-scheduling')
    await updateBookingStatus(bookingId, 'pending_verification', {
      verificationTokenHash: verificationHash,
      verificationTokenExpiry: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    })

    // ══════════════════════════════════════════════════════
    // STEP 8: Send Verification Email
    // ══════════════════════════════════════════════════════
    // Fire and forget — don't await. We return 200 immediately
    // so the user sees the success message without waiting for email delivery.
    //
    // WHY FIRE AND FORGET?
    // Email delivery can take seconds. The user doesn't need to wait.
    // If the email fails, they can re-submit (rate limit allows 3/hour).

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alvinquach.dev'
    const verifyUrl = `${baseUrl}/api/schedule/verify?token=${verificationToken}`

    // Using void to explicitly show we're not awaiting this
    void getResend().emails.send({
      from: 'Alvin Quach <schedule@alvinquach.dev>',
      to: body.requesterEmail,
      subject: 'Verify your meeting request — alvinquach.dev',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <div style="background: #3b82f6; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
            <span style="color: white; font-weight: bold; font-size: 18px;">AQ</span>
          </div>
          <h2 style="margin: 0 0 16px; color: #f1f5f9;">Verify your meeting request</h2>
          <p style="color: #94a3b8; line-height: 1.6;">
            Hi ${body.requesterName},<br><br>
            You requested a meeting with Alvin Quach.
            Click below to verify your email and submit your request.<br><br>
            <strong>This link expires in 1 hour.</strong>
          </p>
          <a href="${verifyUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 16px 0;">
            Verify Email Address
          </a>
          <p style="color: #475569; font-size: 12px; margin-top: 24px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: undefined,
      code: undefined,
      error: undefined,
    })
  } catch (error) {
    console.error('[api/schedule/request] Error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to create booking request', code: 'STORAGE_ERROR' },
      { status: 500 }
    )
  }
}
