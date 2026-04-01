/**
 * /reschedule/[token] — Reschedule Page
 * =======================================
 *
 * WHAT IS THIS?
 * When someone wants to change their confirmed meeting time, they click
 * the "Reschedule" link in their confirmation email. That link contains
 * a JWT token that brings them here.
 *
 * CLIENT COMPONENT:
 * Unlike the schedule page, this is a client component because:
 *   - Needs timezone detection (browser API)
 *   - Needs to fetch booking details via API (not server-side)
 *   - Has interactive confirmation step
 *
 * LAYOUT:
 *   Same two-column layout as the schedule page, but:
 *   - Left panel shows current booking details + warning
 *   - Right panel shows same calendar with "Select a new time" header
 *   - On slot selection: shows confirmation step (old → new time)
 *
 * STATES:
 *   loading       → Fetching booking details
 *   error         → Token invalid/expired, booking not found
 *   valid         → Showing calendar for new time selection
 *   confirming    → User selected a slot, showing old→new confirmation
 *   submitting    → Sending reschedule request to API
 *   success       → Reschedule submitted successfully
 */

'use client'

import { useState, useEffect, use } from 'react'
import WeekCalendar from '@/components/schedule/WeekCalendar'
import type { ApiResponse, TimeSlot } from '@/types/scheduling'
import { formatSlotForDisplay } from '@/lib/scheduling/slots'

// The booking data shape returned by GET /api/schedule/booking
interface BookingData {
  id: string
  status: string
  requestedSlot: string
  topic: string
  timezone: string
  requesterName: string
  durationMinutes: number
}

type PageState = 'loading' | 'error' | 'valid' | 'success'

export default function ReschedulePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params)

  const [pageState, setPageState] = useState<PageState>('loading')
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [userTimezone, setUserTimezone] = useState('UTC')

  // ── On mount: detect timezone + fetch booking ──────────
  useEffect(() => {
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)

    async function fetchBooking() {
      try {
        // PSEUDOCODE:
        // fetch booking details using the reschedule token
        // if success: show the reschedule UI
        // if error: show appropriate error message

        const response = await fetch(
          `/api/schedule/booking?token=${encodeURIComponent(token)}`
        )
        const data: ApiResponse<BookingData> = await response.json()

        if (data.success && data.data) {
          const b = data.data

          // Check booking state
          if (b.status === 'cancelled') {
            setErrorMessage('This meeting has been cancelled.')
            setPageState('error')
            return
          }

          if (b.status !== 'confirmed') {
            setErrorMessage("This meeting hasn't been confirmed yet.")
            setPageState('error')
            return
          }

          setBooking(b)
          setPageState('valid')
        } else {
          setErrorMessage(
            data.code === 'INVALID_TOKEN'
              ? 'This reschedule link is invalid or expired.'
              : data.error || 'Something went wrong.'
          )
          setPageState('error')
        }
      } catch {
        setErrorMessage('Failed to load booking details.')
        setPageState('error')
      }
    }

    fetchBooking()
  }, [token])

  // ── Loading state ──────────────────────────────────────
  if (pageState === 'loading') {
    return (
      <div className="flex min-h-[calc(100vh-48px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" style={{ color: 'var(--sched-accent)' }} />
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────
  if (pageState === 'error') {
    return (
      <div className="flex min-h-[calc(100vh-48px)] items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-lg font-semibold" style={{ color: 'var(--sched-text-primary)' }}>
            Unable to Reschedule
          </h1>
          <p className="mb-6 text-sm" style={{ color: 'var(--sched-text-secondary)' }}>
            {errorMessage}
          </p>
          <a href="mailto:alvinwquach@gmail.com" className="text-sm underline" style={{ color: 'var(--sched-accent)' }}>
            Request a new link by emailing me
          </a>
        </div>
      </div>
    )
  }

  // ── Success state ──────────────────────────────────────
  if (pageState === 'success') {
    return (
      <div className="flex min-h-[calc(100vh-48px)] items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: 'color-mix(in srgb, var(--sched-success) 15%, transparent)' }}
          >
            <svg className="h-6 w-6" style={{ color: 'var(--sched-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="mb-2 text-lg font-semibold" style={{ color: 'var(--sched-text-primary)' }}>
            Reschedule requested!
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--sched-text-secondary)' }}>
            I&apos;ll review and confirm the new time within 24 hours.
            Your current meeting remains until I respond.
          </p>
        </div>
      </div>
    )
  }

  // ── Valid state: show reschedule UI ────────────────────
  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col lg:flex-row">
      {/* ═══ Left Panel: Current Booking Details ═══════════ */}
      <div
        className="flex w-full flex-col gap-6 border-b p-6 lg:w-[280px] lg:min-w-[280px] lg:border-b-0 lg:border-r"
        style={{ borderColor: 'var(--sched-border)' }}
      >
        <h1 className="text-xl font-bold" style={{ color: 'var(--sched-text-primary)' }}>
          Reschedule Meeting
        </h1>

        {/* Current booking card */}
        {booking && (
          <div
            className="rounded-md p-4"
            style={{
              borderLeft: '3px solid var(--sched-accent)',
              backgroundColor: 'var(--sched-bg-tertiary)',
            }}
          >
            <p className="mb-2 font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--sched-text-muted)' }}>
              Current meeting
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--sched-text-primary)' }}>
              {new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZone: userTimezone,
              }).format(new Date(booking.requestedSlot))}
            </p>
            <p
              className="mt-1 line-clamp-2 text-xs"
              style={{ color: 'var(--sched-text-secondary)' }}
            >
              {booking.topic}
            </p>
            {/* Status badge */}
            <span
              className="mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--sched-success) 15%, transparent)',
                color: 'var(--sched-success)',
              }}
            >
              Confirmed
            </span>
          </div>
        )}

        {/* Warning notice */}
        <div
          className="rounded-md p-3 text-xs leading-relaxed"
          style={{
            borderLeft: '3px solid var(--sched-warning)',
            backgroundColor: 'color-mix(in srgb, var(--sched-warning) 5%, transparent)',
            color: 'var(--sched-text-secondary)',
          }}
        >
          Selecting a new time requires my re-approval.
          Your current slot will be held until I respond.
        </div>
      </div>

      {/* ═══ Right Panel: Calendar with Reschedule Handling ═ */}
      <RescheduleCalendar
        token={token}
        currentSlot={booking?.requestedSlot || ''}
        timezone={userTimezone}
        onSuccess={() => setPageState('success')}
      />
    </div>
  )
}

/**
 * RescheduleCalendar — Wraps WeekCalendar with reschedule confirmation logic.
 *
 * This component adds the confirmation step that shows:
 *   "You're changing from: [old time] → To: [new time]"
 *   with "Confirm Reschedule" and "Keep current meeting" buttons.
 */
function RescheduleCalendar({
  token,
  currentSlot,
  timezone,
  onSuccess,
}: {
  token: string
  currentSlot: string
  timezone: string
  onSuccess: () => void
}) {
  const [selectedNewSlot, setSelectedNewSlot] = useState<TimeSlot | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleConfirmReschedule = async () => {
    if (!selectedNewSlot) return
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/schedule/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rescheduleToken: token,
          newSlot: selectedNewSlot.start,
          timezone,
        }),
      })

      const data: ApiResponse = await response.json()

      if (data.success) {
        onSuccess()
      } else {
        const errorMessages: Record<string, string> = {
          SLOT_UNAVAILABLE: 'That slot was just taken. Choose another.',
          EXPIRED_TOKEN: 'This link has expired.',
          SAME_SLOT: "That's the same time as your current meeting.",
        }
        setError(errorMessages[data.code || ''] || data.error || 'Something went wrong.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <WeekCalendar headerTitle="Select a new time" />

      {/* Confirmation step — appears when a new slot is selected */}
      {selectedNewSlot && (
        <div
          className="border-t p-4"
          style={{ borderColor: 'var(--sched-border)', backgroundColor: 'var(--sched-bg-secondary)' }}
        >
          {error && (
            <p className="mb-3 text-sm" style={{ color: 'var(--sched-error)' }}>
              {error}
            </p>
          )}

          <div className="mb-4 flex flex-col gap-2 text-sm">
            <div>
              <span style={{ color: 'var(--sched-text-muted)' }}>From: </span>
              <span style={{ color: 'var(--sched-text-primary)' }}>
                {formatSlotForDisplay(currentSlot, timezone)}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--sched-text-muted)' }}>To: </span>
              <span style={{ color: 'var(--sched-accent)' }}>
                {formatSlotForDisplay(selectedNewSlot.start, timezone)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleConfirmReschedule}
              disabled={isSubmitting}
              className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: 'var(--sched-accent)' }}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Reschedule'}
            </button>
            <button
              onClick={() => setSelectedNewSlot(null)}
              className="text-sm"
              style={{ color: 'var(--sched-text-muted)' }}
            >
              &larr; Keep current meeting
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
