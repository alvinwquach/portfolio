/**
 * /schedule/error — Error Page for Scheduling Flows
 * ==================================================
 *
 * WHAT IS THIS?
 * A catch-all error page for the scheduling system. When something goes
 * wrong during verification, cancellation, etc., the API routes redirect
 * here with a `code` query parameter.
 *
 * ERROR CODES:
 *   INVALID_TOKEN  → The link is malformed or tampered with
 *   EXPIRED_TOKEN  → The link has expired (verification: 1 hour, actions: 7 days)
 *   NOT_FOUND      → The booking doesn't exist in Sanity
 *   INVALID_STATE  → The booking is in an unexpected state for this action
 *
 * WHY CLIENT COMPONENT?
 * We need to read the URL search params on the client side
 * (useSearchParams hook). This could also be done as a server component
 * with searchParams prop, but the client approach is simpler for a
 * static error page.
 */

'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

/**
 * Map of error codes to user-friendly messages.
 *
 * WHY A MAP?
 * Instead of a switch statement, a map is:
 *   1. Easier to read (all messages visible at a glance)
 *   2. Easier to extend (just add a new key-value pair)
 *   3. Has a natural fallback (|| operator for unknown codes)
 */
const ERROR_MESSAGES: Record<string, string> = {
  INVALID_TOKEN: 'This link is invalid. It may have been corrupted or tampered with.',
  EXPIRED_TOKEN: 'This link has expired. Verification links are valid for 1 hour, and action links for 7 days.',
  NOT_FOUND: "We couldn't find this request. It may have been deleted.",
  INVALID_STATE: 'This request is no longer active. It may have already been processed.',
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code') || 'UNKNOWN'
  const message = ERROR_MESSAGES[code] || 'Something went wrong. Please try again or contact me directly.'

  return (
    <div className="flex min-h-[calc(100vh-48px)] items-center justify-center p-8">
      <div className="max-w-md text-center">
        {/* Error icon */}
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: 'color-mix(in srgb, var(--sched-error) 15%, transparent)' }}
        >
          <svg className="h-6 w-6" style={{ color: 'var(--sched-error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>

        <h1 className="mb-2 text-lg font-semibold" style={{ color: 'var(--sched-text-primary)' }}>
          Something Went Wrong
        </h1>

        <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--sched-text-secondary)' }}>
          {message}
        </p>

        {/* Offer alternatives */}
        <div className="flex flex-col items-center gap-3">
          <a
            href="mailto:alvinwquach@gmail.com"
            className="text-sm underline"
            style={{ color: 'var(--sched-accent)' }}
          >
            Email me directly
          </a>
          <Link
            href="/"
            className="text-xs"
            style={{ color: 'var(--sched-text-muted)' }}
          >
            Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Wrap in Suspense because useSearchParams() requires it in Next.js 14+
 * when the page might be statically rendered.
 */
export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-48px)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" style={{ color: 'var(--sched-accent)' }} />
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
