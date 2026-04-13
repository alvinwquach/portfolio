'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { BoardView } from '@/components/tracker/BoardView'
import { AddApplicationModal } from '@/components/tracker/AddApplicationModal'
import { CalendarView } from '@/components/tracker/CalendarView'
import { StatsBar } from '@/components/tracker/StatsBar'
import type { JobApplication } from '@/components/tracker/types'

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted/50"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

export function TrackerTabs({
  applications,
}: {
  applications: JobApplication[]
}) {
  const [tab, setTab] = useState<'board' | 'calendar'>('board')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = useMemo(() => {
    if (!search.trim()) return applications
    const q = search.toLowerCase()
    return applications.filter(
      (a) =>
        a.company.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q),
    )
  }, [applications, search])

  return (
    <div className="px-5 py-4">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-44 rounded-md border border-line/50 bg-transparent py-1.5 pl-8 pr-3 text-xs text-text placeholder:text-text-muted/40 focus:border-line focus:outline-none"
            />
          </div>

          {/* Add button */}
          <button
            onClick={() => setShowAdd(true)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-line/50 text-text-muted/60 transition-colors hover:border-line hover:text-text"
            title="Add application"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>

          {/* Inline stats */}
          <StatsBar applications={applications} />
        </div>

        {/* Segmented tabs */}
        <div className="flex shrink-0 overflow-hidden rounded-md border border-line/50">
          <button
            onClick={() => setTab('board')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
              tab === 'board'
                ? 'bg-surface text-text'
                : 'text-text-muted/60 hover:text-text-muted',
            )}
          >
            <GridIcon />
            Board
          </button>
          <button
            onClick={() => setTab('calendar')}
            className={cn(
              'flex items-center gap-1.5 border-l border-line/50 px-3 py-1.5 text-xs font-medium transition-colors',
              tab === 'calendar'
                ? 'bg-surface text-text'
                : 'text-text-muted/60 hover:text-text-muted',
            )}
          >
            <CalendarIcon />
            Calendar
          </button>
        </div>
      </div>

      {/* Content */}
      {tab === 'board' ? (
        <BoardView applications={filtered} />
      ) : (
        <CalendarView applications={filtered} />
      )}

      {showAdd && <AddApplicationModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
