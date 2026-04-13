'use client'

import { cn } from '@/lib/utils'
import type { JobApplication } from './types'
import {
  STATUS_DOT_COLORS,
  SOURCE_LABELS,
  formatSalaryCompact,
  relativeDate,
  getLatestInterview,
} from './types'

export function ApplicationCard({
  app,
  onClick,
}: {
  app: JobApplication
  onClick: () => void
}) {
  const isGhosted = app.status === 'ghosted'
  const isWithdrawn = app.status === 'withdrawn'
  const salary = formatSalaryCompact(app.salaryRange?.min, app.salaryRange?.max)
  const latestInterview = getLatestInterview(app)

  const interviewLabel = latestInterview
    ? `${(latestInterview.type || 'interview').replace(/-/g, ' ')} \u2014 ${relativeDate(latestInterview.date)}`
    : null

  const isFuture =
    latestInterview && new Date(latestInterview.date) >= new Date()

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-md border border-line/30 bg-surface/80 p-2.5 text-left transition-all hover:border-line/50 hover:bg-surface',
        isGhosted && 'opacity-40',
      )}
    >
      {/* Top row: dot + company/role + salary */}
      <div className="flex items-start gap-2">
        <span
          className={cn(
            'mt-1 h-2 w-2 shrink-0 rounded-full',
            STATUS_DOT_COLORS[app.status],
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-1.5">
            <p
              className={cn(
                'truncate text-xs font-medium text-text',
                isWithdrawn && 'line-through',
              )}
            >
              {app.company}
            </p>
            {salary && (
              <span className="shrink-0 text-[10px] text-text-muted/50">
                {salary}
              </span>
            )}
          </div>
          <p
            className={cn(
              'truncate text-[10px] text-text-muted/60',
              isWithdrawn && 'line-through',
            )}
          >
            {app.role}
          </p>
        </div>
      </div>

      {/* Bottom row: interview tag, source */}
      <div className="mt-1.5 flex items-center gap-1.5 pl-4">
        {interviewLabel && (
          <span
            className={cn(
              'truncate rounded px-1 py-px text-[9px] font-medium capitalize',
              isFuture
                ? 'bg-amber-500/10 text-amber-400/80'
                : 'bg-surface text-text-muted/40',
            )}
          >
            {interviewLabel}
          </span>
        )}
        {app.referral && (
          <span className="rounded bg-accent-warm/10 px-1 py-px text-[9px] font-medium text-accent-warm/70">
            Ref
          </span>
        )}
        <span className="flex-1" />
        {app.source && (
          <span className="text-[9px] text-text-muted/30">
            {SOURCE_LABELS[app.source] || app.source}
          </span>
        )}
      </div>
    </button>
  )
}
