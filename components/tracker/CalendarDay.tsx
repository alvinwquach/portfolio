'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { JobApplication } from './types'
import { STATUS_DOT_COLORS, INTERVIEW_TYPE_ABBR } from './types'

export interface CalendarEvent {
  app: JobApplication
  type: 'application' | 'interview'
  interviewType?: string
  interviewer?: string
  notes?: string
}

export function CalendarDay({
  day,
  isToday,
  isOutside,
  events,
  onSelectApp,
}: {
  day: number
  isToday: boolean
  isOutside: boolean
  events: CalendarEvent[]
  onSelectApp: (app: JobApplication) => void
}) {
  const [tooltip, setTooltip] = useState<CalendarEvent | null>(null)

  return (
    <div
      className={cn(
        'relative min-h-[6.5rem] border-b border-r border-line/20 p-2',
        '[&:nth-child(7n+7)]:border-r-0',
        '[&:nth-last-child(-n+7)]:border-b-0',
        isToday && 'bg-accent/[0.03]',
        isOutside && 'bg-surface/20',
      )}
    >
      {/* Day number */}
      <div className="flex justify-end">
        <span
          className={cn(
            'inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px]',
            isToday
              ? 'bg-accent font-semibold text-white'
              : isOutside
                ? 'text-text-muted/25'
                : 'text-text-muted/70',
          )}
        >
          {day}
        </span>
      </div>

      {/* Events */}
      {events.length > 0 && (
        <div className="mt-1.5 space-y-0.5">
          {events.map((event, j) => {
            if (event.type === 'application') {
              return (
                <button
                  key={`a-${j}`}
                  onClick={() => onSelectApp(event.app)}
                  onMouseEnter={() => setTooltip(event)}
                  onMouseLeave={() => setTooltip(null)}
                  className="flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left transition-colors hover:bg-surface"
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      STATUS_DOT_COLORS[event.app.status],
                    )}
                  />
                  <span className="truncate text-[10px] text-text-muted/70">
                    {event.app.company}
                  </span>
                </button>
              )
            }
            return (
              <button
                key={`i-${j}`}
                onClick={() => onSelectApp(event.app)}
                onMouseEnter={() => setTooltip(event)}
                onMouseLeave={() => setTooltip(null)}
                className="flex w-full items-center gap-1 rounded bg-purple-500/10 px-1.5 py-0.5 text-left transition-colors hover:bg-purple-500/20"
              >
                <span className="text-[9px] font-medium text-purple-400/80">
                  {INTERVIEW_TYPE_ABBR[event.interviewType || ''] || 'IV'}
                </span>
                <span className="truncate text-[10px] text-text-muted/60">
                  {event.app.company}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute left-1/2 top-full z-30 mt-1 w-52 -translate-x-1/2 rounded-lg border border-line/50 bg-surface p-3 text-xs shadow-xl">
          <p className="font-medium text-text">{tooltip.app.company}</p>
          <p className="text-text-muted/70">{tooltip.app.role}</p>
          {tooltip.type === 'interview' && (
            <>
              <p className="mt-1.5 capitalize text-accent">
                {(tooltip.interviewType || 'interview').replace(/-/g, ' ')}
              </p>
              {tooltip.interviewer && (
                <p className="text-text-muted/60">with {tooltip.interviewer}</p>
              )}
              {tooltip.notes && (
                <p className="mt-1 leading-relaxed text-text-muted/50">
                  {tooltip.notes}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
