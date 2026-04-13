'use client'

import { useMemo } from 'react'
import type { JobApplication } from './types'
import { CLOSED_STATUSES } from './types'

export function StatsBar({ applications }: { applications: JobApplication[] }) {
  const stats = useMemo(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const active = applications.filter((a) => !CLOSED_STATUSES.has(a.status)).length

    const thisWeek = applications.filter((a) => {
      const applied = new Date(a.dateApplied)
      if (applied >= weekAgo) return true
      return a.interviewDates?.some((d) => {
        const dt = new Date(d.date)
        return dt >= weekAgo && dt <= now
      })
    }).length

    const interviews = applications.reduce((count, a) => {
      if (!a.interviewDates) return count
      return (
        count +
        a.interviewDates.filter((d) => new Date(d.date) >= now).length
      )
    }, 0)

    const offers = applications.filter((a) => a.status === 'offer').length

    return { active, thisWeek, interviews, offers }
  }, [applications])

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <Pill label="Active" value={stats.active} color="text-accent" />
      <Pill label="This week" value={stats.thisWeek} color="text-amber-400" />
      {stats.interviews > 0 && (
        <Pill label="Upcoming" value={stats.interviews} color="text-purple-400" />
      )}
      {stats.offers > 0 && (
        <Pill label="Offers" value={stats.offers} color="text-green-400" />
      )}
    </div>
  )
}

function Pill({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-line/50 bg-surface/50 px-2 py-1">
      <span className={`font-semibold ${color}`}>{value}</span>
      <span className="text-text-muted/70">{label}</span>
    </span>
  )
}
