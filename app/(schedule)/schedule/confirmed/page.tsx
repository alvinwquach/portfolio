/**
 * /schedule/confirmed — Post-Confirmation Landing
 * ================================================
 *
 * WHAT IS THIS?
 * A simple landing page that users might reach if they click through
 * from a confirmation context. The actual confirmation details
 * (Meet link, calendar invite, etc.) are sent via email — not shown here.
 */

import Link from 'next/link'

export default function ConfirmedPage() {
  return (
    <div className="flex min-h-[calc(100vh-48px)] items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: 'color-mix(in srgb, var(--sched-accent) 15%, transparent)' }}
        >
          <svg className="h-6 w-6" style={{ color: 'var(--sched-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        </div>

        <h1 className="mb-2 text-xl font-semibold" style={{ color: 'var(--sched-text-primary)' }}>
          Meeting Requested
        </h1>

        <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--sched-text-secondary)' }}>
          You&apos;ll hear back within 24 hours. Check your email for confirmation details including the Google Meet link.
        </p>

        <Link
          href="/"
          className="text-sm underline"
          style={{ color: 'var(--sched-accent)' }}
        >
          Back to portfolio
        </Link>
      </div>
    </div>
  )
}
