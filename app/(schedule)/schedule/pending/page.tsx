/**
 * /schedule/pending — Post-Verification Landing Page
 * ===================================================
 *
 * WHAT IS THIS?
 * After clicking the email verification link, users are redirected here.
 * This is a simple confirmation page that tells them their request was
 * received and is waiting for Alvin's review.
 *
 * WHY A SEPARATE PAGE?
 * The verification happens via GET redirect (email link → API route → redirect).
 * We can't show a success message inside the original schedule page because
 * the user is being redirected from a different URL.
 */

import Link from 'next/link'

export default function PendingPage() {
  return (
    <div className="flex min-h-[calc(100vh-48px)] items-center justify-center p-8">
      <div className="max-w-md text-center">
        {/* Checkmark icon */}
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: 'color-mix(in srgb, var(--sched-success) 15%, transparent)' }}
        >
          <svg className="h-6 w-6" style={{ color: 'var(--sched-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="mb-2 text-xl font-semibold" style={{ color: 'var(--sched-text-primary)' }}>
          Request Submitted
        </h1>

        <p className="mb-2 text-sm leading-relaxed" style={{ color: 'var(--sched-text-secondary)' }}>
          Your email has been verified and your meeting request is now pending review.
        </p>

        <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--sched-text-secondary)' }}>
          I&apos;ll review and respond within 24 hours. You&apos;ll receive a confirmation email if approved.
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
