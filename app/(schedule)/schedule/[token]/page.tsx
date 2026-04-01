/**
 * /schedule/[token] — Private Link Schedule Page
 * ================================================
 *
 * WHAT IS THIS?
 * When Alvin sends a personalized scheduling link to someone, the URL
 * looks like: /schedule/eyJhbGciOiJIUzI1NiJ9.eyJ...
 *
 * This page:
 *   1. Verifies the JWT token from the URL
 *   2. Looks up the schedulingToken in Sanity
 *   3. Shows a personalized greeting ("Hi Sarah!")
 *   4. Pre-fills the booking form with the recipient's data
 *
 * SERVER COMPONENT:
 * Token verification and Sanity lookup happen server-side. If the token
 * is invalid/expired/used, we render an error state immediately (no
 * client-side flash of content).
 *
 * SECURITY:
 * The JWT is verified cryptographically — it can't be forged.
 * Even if someone guesses the URL pattern, they can't create a valid JWT.
 */

import { verifyToken, hashToken } from '@/lib/scheduling/tokens'
import { getTokenByHash } from '@/lib/scheduling/sanity-scheduling'
import { getSchedulingConfig } from '@/lib/scheduling/sanity-scheduling'
import ScheduleSidebar from '@/components/schedule/ScheduleSidebar'
import WeekCalendar from '@/components/schedule/WeekCalendar'
import type { PrivateLinkTokenPayload } from '@/types/scheduling'

export default async function PrivateLinkPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  // ── Verify the JWT ─────────────────────────────────────
  const payload = await verifyToken<PrivateLinkTokenPayload>(token)

  if (!payload || payload.type !== 'private_link') {
    return <ErrorState message="This scheduling link is invalid or has expired." />
  }

  // ── Look up the scheduling token in Sanity ─────────────
  const tokenHash = hashToken(token)
  const schedulingToken = await getTokenByHash(tokenHash)

  if (!schedulingToken) {
    return <ErrorState message="This scheduling link was not found." />
  }

  if (schedulingToken.isRevoked) {
    return <ErrorState message="This scheduling link has been revoked." />
  }

  if (schedulingToken.isUsed) {
    return <ErrorState message="This scheduling link has already been used." />
  }

  if (new Date(schedulingToken.expiresAt) < new Date()) {
    return <ErrorState message="This scheduling link has expired." />
  }

  // ── Fetch config ───────────────────────────────────────
  const config = await getSchedulingConfig()

  if (!config.isAcceptingBookings) {
    return <ErrorState message="Not currently accepting booking requests." />
  }

  // ── Render personalized schedule page ──────────────────
  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col lg:flex-row">
      <div className="border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'var(--sched-border)' }}>
        <ScheduleSidebar
          config={config}
          recipientName={schedulingToken.recipientName}
          personalNote={schedulingToken.personalNote}
        />
      </div>
      <WeekCalendar
        advanceBookingDays={config.advanceBookingDays}
        privateLinkData={{
          requesterName: schedulingToken.recipientName,
          requesterEmail: schedulingToken.recipientEmail,
          requesterCompany: schedulingToken.recipientCompany,
          requesterRole: schedulingToken.recipientRole,
          privateLinkToken: token,
          topic: '',
          requestedSlot: '',
          timezone: '',
          recaptchaToken: '',
        }}
      />
    </div>
  )
}

/**
 * Error state component — shown when the token is invalid.
 */
function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[calc(100vh-48px)] items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: 'color-mix(in srgb, var(--sched-error) 15%, transparent)' }}
        >
          <svg className="h-6 w-6" style={{ color: 'var(--sched-error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="mb-2 text-lg font-semibold" style={{ color: 'var(--sched-text-primary)' }}>
          Link Unavailable
        </h1>
        <p className="mb-6 text-sm" style={{ color: 'var(--sched-text-secondary)' }}>
          {message}
        </p>
        <a
          href="mailto:alvinwquach@gmail.com"
          className="text-sm underline"
          style={{ color: 'var(--sched-accent)' }}
        >
          Contact me directly
        </a>
      </div>
    </div>
  )
}
