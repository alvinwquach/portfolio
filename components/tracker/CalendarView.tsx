'use client'

import { useState, useMemo } from 'react'
import { ApplicationDetail } from './ApplicationDetail'
import type { JobApplication } from './types'
import { CalendarDay, type CalendarEvent } from './CalendarDay'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export function CalendarView({
  applications,
}: {
  applications: JobApplication[]
}) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<JobApplication | null>(null)

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()

    for (const app of applications) {
      if (app.dateApplied) {
        const existing = map.get(app.dateApplied) || []
        existing.push({ app, type: 'application' })
        map.set(app.dateApplied, existing)
      }

      if (app.interviewDates) {
        for (const interview of app.interviewDates) {
          if (interview.date) {
            const d = new Date(interview.date)
            const key = dateKey(d)
            const existing = map.get(key) || []
            existing.push({
              app,
              type: 'interview',
              interviewType: interview.type,
              interviewer: interview.interviewer,
              notes: interview.notes,
            })
            map.set(key, existing)
          }
        }
      }
    }

    return map
  }, [applications])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const monthLabel = new Date(year, month).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  function goToday() {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  function goPrev() {
    if (month === 0) {
      setYear(year - 1)
      setMonth(11)
    } else {
      setMonth(month - 1)
    }
  }

  function goNext() {
    if (month === 11) {
      setYear(year + 1)
      setMonth(0)
    } else {
      setMonth(month + 1)
    }
  }

  const todayKey = dateKey(today)

  interface CellData {
    day: number
    key: string
    isOutside: boolean
  }

  const cells: CellData[] = []

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i
    const m = month === 0 ? 12 : month
    const y = month === 0 ? year - 1 : year
    cells.push({
      day: d,
      key: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      isOutside: true,
    })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      key: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      isOutside: false,
    })
  }

  let nextDay = 1
  while (cells.length % 7 !== 0) {
    const m = month === 11 ? 1 : month + 2
    const y = month === 11 ? year + 1 : year
    cells.push({
      day: nextDay,
      key: `${y}-${String(m).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`,
      isOutside: true,
    })
    nextDay++
  }

  return (
    <>
      {/* Navigation */}
      <div className="mb-3 flex items-center">
        <div className="flex items-center gap-1">
          <button
            onClick={goPrev}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-line/40 text-text-muted/60 transition-colors hover:border-line hover:text-text-muted"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={goNext}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-line/40 text-text-muted/60 transition-colors hover:border-line hover:text-text-muted"
          >
            <ChevronRight />
          </button>
        </div>
        <button
          onClick={goToday}
          className="ml-2 rounded-md border border-line/40 px-2.5 py-1 text-[11px] font-medium text-text-muted/60 transition-colors hover:border-line hover:text-text-muted"
        >
          Today
        </button>
        <span className="flex-1 text-center text-sm font-medium text-text">
          {monthLabel}
        </span>
      </div>

      {/* Grid */}
      <div className="overflow-hidden rounded-lg border border-line/40">
        <div className="grid grid-cols-7">
          {/* Day headers */}
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="border-b border-line/30 py-2 text-center text-[10px] font-medium uppercase tracking-wider text-text-muted/50"
            >
              {day}
            </div>
          ))}

          {/* Day cells */}
          {cells.map((cell) => (
            <CalendarDay
              key={cell.key}
              day={cell.day}
              isToday={cell.key === todayKey}
              isOutside={cell.isOutside}
              events={eventsByDate.get(cell.key) || []}
              onSelectApp={setSelected}
            />
          ))}
        </div>
      </div>

      {selected && (
        <ApplicationDetail
          app={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
