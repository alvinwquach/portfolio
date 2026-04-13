'use client'

import { useEffect, useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { syncInterviewsToCalendar } from '@/app/actions/tracker-update'
import type { JobApplication } from './types'
import { STATUS_LABELS, STATUS_BG_COLORS, STATUS_DOT_COLORS } from './types'

function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-widest text-text-muted">
        {label}
      </p>
      {children}
    </div>
  )
}

export function ApplicationDetail({
  app,
  onClose,
}: {
  app: JobApplication
  onClose: () => void
}) {
  const studioUrl = `/studio/structure/jobApplication;${app._id}`
  const [isPending, startTransition] = useTransition()
  const [syncResult, setSyncResult] = useState<string | null>(null)

  const hasUnsyncedInterviews = app.interviewDates?.some((d) => !d.gcalEventId) ?? false

  function handleSync() {
    startTransition(async () => {
      setSyncResult(null)
      const result = await syncInterviewsToCalendar(app._id)
      if (result.error) {
        setSyncResult(result.error)
      } else if (result.synced === 0) {
        setSyncResult('All interviews already synced')
      } else {
        setSyncResult(`Synced ${result.synced} interview${result.synced > 1 ? 's' : ''}`)
      }
    })
  }

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line p-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'h-3 w-3 shrink-0 rounded-full',
                  STATUS_DOT_COLORS[app.status],
                )}
              />
              <h2 className="truncate text-lg font-medium text-text">
                {app.company}
              </h2>
            </div>
            <p className="mt-0.5 pl-5.5 text-sm text-text-muted">{app.role}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 shrink-0 rounded-md p-1 text-text-muted transition-colors hover:text-text"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-5">
            {/* Status + Date + Referral badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  STATUS_BG_COLORS[app.status],
                )}
              >
                {STATUS_LABELS[app.status]}
              </span>
              <span className="text-xs text-text-muted">
                Applied {new Date(app.dateApplied).toLocaleDateString()}
              </span>
              {app.referral && (
                <span className="rounded-full bg-accent-warm/20 px-2 py-0.5 text-xs text-accent-warm">
                  Referral
                </span>
              )}
            </div>

            {/* Job URL */}
            {app.jobUrl && (
              <a
                href={app.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-accent hover:underline"
              >
                View Job Posting &rarr;
              </a>
            )}

            {/* Salary */}
            {app.salaryRange && (app.salaryRange.min || app.salaryRange.max) && (
              <Section label="Salary Range">
                <p className="text-sm text-text">
                  {app.salaryRange.min
                    ? formatCurrency(app.salaryRange.min, app.salaryRange.currency)
                    : '?'}{' '}
                  &ndash;{' '}
                  {app.salaryRange.max
                    ? formatCurrency(app.salaryRange.max, app.salaryRange.currency)
                    : '?'}
                </p>
              </Section>
            )}

            {/* Source */}
            {app.source && (
              <Section label="Source">
                <p className="text-sm capitalize text-text">
                  {app.source.replace('-', ' ')}
                </p>
              </Section>
            )}

            {/* Next step */}
            {app.nextStep && (
              <Section label="Next Step">
                <p className="text-sm text-text">{app.nextStep}</p>
                {app.nextStepDate && (
                  <p className="mt-0.5 text-xs text-text-muted">
                    by {new Date(app.nextStepDate).toLocaleDateString()}
                  </p>
                )}
              </Section>
            )}

            {/* Rejection reason */}
            {app.rejectionReason && (
              <Section label="Rejection Reason">
                <p className="text-sm capitalize text-text">
                  {app.rejectionReason.replace(/-/g, ' ')}
                </p>
              </Section>
            )}

            {/* Compensation (offer) */}
            {app.compensation && (
              <Section label="Compensation">
                <div className="space-y-1 text-sm text-text">
                  {app.compensation.baseSalary && (
                    <p>Base: {formatCurrency(app.compensation.baseSalary)}</p>
                  )}
                  {app.compensation.equity && (
                    <p>Equity: {app.compensation.equity}</p>
                  )}
                  {app.compensation.bonus && (
                    <p>Bonus: {app.compensation.bonus}</p>
                  )}
                  {app.compensation.notes && (
                    <p className="text-xs text-text-muted">
                      {app.compensation.notes}
                    </p>
                  )}
                </div>
              </Section>
            )}

            {/* Interview Timeline */}
            {app.interviewDates && app.interviewDates.length > 0 && (
              <Section label="Interviews">
                <div className="relative space-y-0 pl-3">
                  {/* Timeline line */}
                  <div className="absolute bottom-2 left-[5px] top-2 w-px bg-line" />
                  {[...app.interviewDates]
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime(),
                    )
                    .map((interview, i) => (
                      <div key={i} className="relative py-2 pl-5">
                        {/* Timeline dot */}
                        <span
                          className={cn(
                            'absolute left-0 top-3.5 h-2.5 w-2.5 rounded-full border-2',
                            interview.gcalEventId
                              ? 'border-green-500 bg-green-500/20'
                              : 'border-line bg-surface',
                          )}
                        />
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm capitalize text-text">
                            {(interview.type || 'interview').replace(/-/g, ' ')}
                          </span>
                          <span className="shrink-0 text-xs text-text-muted">
                            {new Date(interview.date).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {interview.interviewer && (
                          <p className="text-xs text-accent">
                            with {interview.interviewer}
                          </p>
                        )}
                        {interview.notes && (
                          <p className="mt-0.5 text-xs text-text-muted">
                            {interview.notes}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
                {hasUnsyncedInterviews && (
                  <button
                    onClick={handleSync}
                    disabled={isPending}
                    className="mt-3 flex items-center gap-1.5 rounded-md border border-line/50 px-2.5 py-1.5 text-xs text-text-muted transition-colors hover:border-line hover:text-text disabled:opacity-50"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    {isPending ? 'Syncing...' : 'Sync to Google Calendar'}
                  </button>
                )}
                {syncResult && (
                  <p className="mt-1.5 text-[10px] text-text-muted/60">
                    {syncResult}
                  </p>
                )}
              </Section>
            )}

            {/* Contacts */}
            {app.contacts && app.contacts.length > 0 && (
              <Section label="Contacts">
                <div className="space-y-2">
                  {app.contacts.map((contact, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border border-line bg-overlay p-2.5"
                    >
                      <div>
                        <p className="text-sm text-text">{contact.name}</p>
                        {contact.role && (
                          <p className="text-xs text-text-muted">
                            {contact.role}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-xs text-accent hover:underline"
                          >
                            Email
                          </a>
                        )}
                        {contact.linkedin && (
                          <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Notes */}
            {app.notes && (
              <Section label="Notes">
                <p className="whitespace-pre-wrap text-sm text-text">
                  {app.notes}
                </p>
              </Section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line px-5 py-3">
          <a
            href={studioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-muted transition-colors hover:text-accent"
          >
            Edit in Studio &rarr;
          </a>
        </div>
      </div>
    </>
  )
}
