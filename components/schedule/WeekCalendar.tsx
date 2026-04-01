/**
 * WeekCalendar — 3-Step Scheduling Flow (Calendly pattern)
 * =========================================================
 *
 * STEP 1: Pick event type (duration cards) — shown above calendar
 * STEP 2: Pick a time (calendar grid) — shown after event type selected
 * STEP 3: Fill details (form) — replaces calendar
 *
 * The event type cards are always visible above the calendar.
 * Selecting one highlights it and the calendar shows below.
 * Clicking Continue on a selected slot goes to the form.
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { WeekDay, TimeSlot, ApiResponse, BookingFormData } from '@/types/scheduling'
import { getWeekStart, formatSlotForDisplay } from '@/lib/scheduling/slots'
import AvailabilityLegend from './AvailabilityLegend'
import BookingForm from './BookingForm'

const PX_PER_MIN = 1.1
const HOUR_START = 7
const HOUR_END = 19
const GRID_HEIGHT = (HOUR_END - HOUR_START) * 60 * PX_PER_MIN
const MAX_SCROLL_HEIGHT = 460

// Event types — the meeting options visitors choose from.
// Like Calendly's event type cards but inline.
const EVENT_TYPES = [
  { duration: 15, label: 'Quick Chat', desc: 'Brief intro or quick question' },
  { duration: 30, label: 'Meeting', desc: 'Standard conversation' },
  { duration: 60, label: 'Deep Dive', desc: 'In-depth technical discussion' },
] as const

interface WeekCalendarProps {
  advanceBookingDays?: number
  privateLinkData?: Partial<BookingFormData>
  headerTitle?: string
}

export default function WeekCalendar({ advanceBookingDays = 14, privateLinkData, headerTitle }: WeekCalendarProps) {
  const [mounted, setMounted] = useState(false)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [weekData, setWeekData] = useState<WeekDay[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState<'calendar' | 'form'>('calendar')
  const [duration, setDuration] = useState(30)
  const [userTimezone, setUserTimezone] = useState('UTC')
  const [warning, setWarning] = useState<string>()
  const weekCache = useRef<Map<string, WeekDay[]>>(new Map())

  useEffect(() => {
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    setCurrentWeekStart(getWeekStart(new Date()))
    setMounted(true)
  }, [])

  const fetchWeekData = useCallback(async () => {
    if (!currentWeekStart) return
    const dateStr = currentWeekStart.toISOString().split('T')[0]
    const cached = weekCache.current.get(dateStr)
    if (cached) { setWeekData(cached); setIsLoading(false) }
    else { setIsLoading(true) }
    try {
      const res = await fetch(`/api/schedule/slots?weekStart=${dateStr}`)
      const data: ApiResponse<WeekDay[]> = await res.json()
      if (data.success && data.data) { weekCache.current.set(dateStr, data.data); setWeekData(data.data); if (data.warning) setWarning(data.warning) }
    } catch { /* keep existing */ }
    finally { setIsLoading(false) }
  }, [currentWeekStart])

  useEffect(() => { fetchWeekData() }, [fetchWeekData])

  // Nav
  const thisMonday = mounted ? getWeekStart(new Date()) : null
  const canGoPrev = !!(currentWeekStart && thisMonday && currentWeekStart.getTime() > thisMonday.getTime())
  const nextMonday = currentWeekStart ? new Date(currentWeekStart) : null
  if (nextMonday) nextMonday.setUTCDate(nextMonday.getUTCDate() + 7)
  const maxWeekStart = thisMonday ? new Date(thisMonday) : null
  if (maxWeekStart) maxWeekStart.setUTCDate(maxWeekStart.getUTCDate() + advanceBookingDays)
  const canGoNext = !!(nextMonday && maxWeekStart && nextMonday.getTime() <= maxWeekStart.getTime())
  const goPrev = () => { if (!canGoPrev || !currentWeekStart) return; const p = new Date(currentWeekStart); p.setUTCDate(p.getUTCDate() - 7); setCurrentWeekStart(p); setSelectedSlot(null); setStep('calendar') }
  const goNext = () => { if (!canGoNext || !nextMonday) return; setCurrentWeekStart(new Date(nextMonday)); setSelectedSlot(null); setStep('calendar') }

  const weekEnd = currentWeekStart ? new Date(currentWeekStart) : new Date()
  if (currentWeekStart) weekEnd.setUTCDate(weekEnd.getUTCDate() + 6)
  const fmt = (d: Date, yr = false) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', ...(yr && { year: 'numeric' }) }).format(d)
  const dateRange = currentWeekStart ? `${fmt(currentWeekStart)} — ${fmt(weekEnd, true)}` : ''
  const todayStr = mounted ? new Date().toISOString().split('T')[0] : ''

  const getTop = (utcIso: string): number => {
    const parts = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: false, timeZone: userTimezone }).formatToParts(new Date(utcIso))
    return (parseInt(parts.find(p => p.type === 'hour')?.value || '0') * 60 + parseInt(parts.find(p => p.type === 'minute')?.value || '0') - HOUR_START * 60) * PX_PER_MIN
  }
  const getHeight = (s: TimeSlot) => Math.max(((new Date(s.end).getTime() - new Date(s.start).getTime()) / 60000) * PX_PER_MIN, 32)

  /** Format a time range like "9:00 – 9:30 AM" or "9:00 AM – 10:00 AM" */
  const fmtRange = (startIso: string, durationMin: number): string => {
    const start = new Date(startIso)
    const end = new Date(start.getTime() + durationMin * 60000)
    const fmtOpts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', timeZone: userTimezone }
    const startStr = new Intl.DateTimeFormat('en-US', fmtOpts).format(start)
    const endStr = new Intl.DateTimeFormat('en-US', fmtOpts).format(end)
    // If same AM/PM, drop the period from the start: "9:00 – 9:30 AM"
    const startParts = new Intl.DateTimeFormat('en-US', { ...fmtOpts, hour12: true }).formatToParts(start)
    const endParts = new Intl.DateTimeFormat('en-US', { ...fmtOpts, hour12: true }).formatToParts(end)
    const startPeriod = startParts.find(p => p.type === 'dayPeriod')?.value
    const endPeriod = endParts.find(p => p.type === 'dayPeriod')?.value
    if (startPeriod === endPeriod) {
      // Same period — strip AM/PM from start: "9:00 – 9:30 AM"
      return `${startStr.replace(/ ?[AP]M/i, '')} – ${endStr}`
    }
    return `${startStr} – ${endStr}`
  }

  const hourLabels = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => { const h = HOUR_START + i; return { h, top: i * 60 * PX_PER_MIN, label: h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm` } })
  const gridLines = Array.from({ length: (HOUR_END - HOUR_START) * 2 }, (_, i) => ({ top: i * 30 * PX_PER_MIN, full: i % 2 === 0 }))
  const skeletonDays = Array.from({ length: 7 }, (_, i) => { if (!currentWeekStart) return { name: ['MON','TUE','WED','THU','FRI','SAT','SUN'][i], num: 0 }; const d = new Date(currentWeekStart); d.setUTCDate(d.getUTCDate() + i); return { name: ['MON','TUE','WED','THU','FRI','SAT','SUN'][i], num: d.getUTCDate() } })

  // Pre-mount placeholder
  if (!mounted) {
    return (
      <div style={{ padding: '24px 24px 16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[0,1,2].map(i => <div key={i} className="animate-pulse" style={{ flex: 1, height: 64, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />)}
        </div>
        <div style={{ flex: 1, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.01)' }} />
      </div>
    )
  }

  // ═══ STEP: FORM + SUMMARY CARD ═════════════════════════
  if (step === 'form' && selectedSlot) {
    const fmtDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: userTimezone }).format(new Date(selectedSlot.start))
    const fmtDateShort = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: userTimezone }).format(new Date(selectedSlot.start))
    const timeRange = fmtRange(selectedSlot.start, duration)
    const durLabel = duration === 60 ? '1 hour' : `${duration} min`
    return (
      <div className="p-4 lg:px-7 lg:py-5" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header — shows date/time on mobile (since summary card is hidden) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 16, flexShrink: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <button onClick={() => setStep('calendar')} style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }} aria-label="Back to calendar">←</button>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--sched-text-primary)' }}>{fmtDate}</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--sched-accent)', margin: '0 0 0 24px' }}>{timeRange} · {durLabel} · Google Meet</p>
          </div>
          <button onClick={() => setStep('calendar')} style={{ fontSize: 13, color: 'var(--sched-accent)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>Change</button>
        </div>

        {/* Summary Card (top on mobile) + Form — side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row" style={{ flex: 1, minHeight: 0, gap: 20 }}>
          {/* Form */}
          <div className="flex-1 min-w-0 order-2 lg:order-1 lg:overflow-y-auto">
            <BookingForm selectedSlot={selectedSlot} timezone={userTimezone} privateLinkData={privateLinkData} onBack={() => setStep('calendar')} duration={duration} />
          </div>

          {/* Summary Card — top on mobile, right sidebar on desktop */}
          <div className="order-1 lg:order-2 w-full lg:w-[260px] lg:flex-shrink-0">
            <div style={{ position: 'sticky', top: 0, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', margin: '0 0 14px', fontFamily: 'var(--font-mono)' }}>Booking summary</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Date */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="var(--sched-accent)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--sched-text-primary)', margin: 0 }}>{fmtDateShort}</p>
                    <p style={{ fontSize: 13, color: 'var(--sched-accent)', margin: '2px 0 0', fontWeight: 600 }}>{timeRange}</p>
                  </div>
                </div>

                {/* Duration */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{durLabel}</span>
                </div>

                {/* Format */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Google Meet</span>
                </div>
              </div>

              {/* Divider */}
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '16px 0' }} />

              {/* What happens next */}
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', margin: '0 0 12px', fontFamily: 'var(--font-mono)' }}>What happens next</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { n: '1', t: 'Check your email to verify' },
                  { n: '2', t: 'I review your request' },
                  { n: '3', t: 'Calendar invite sent on approval' },
                ].map(({ n, t }) => (
                  <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{n}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═══ STEP: CALENDAR ═══════════════════════════════════
  return (
    <div style={{ padding: '24px 24px 16px', display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ═══ Event Type Cards (Calendly-style) ════════════
          Three cards the visitor picks from BEFORE seeing times.
          This sets the duration for the booking. */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {EVENT_TYPES.map(et => {
          const active = duration === et.duration
          return (
            <button
              key={et.duration}
              type="button"
              onClick={() => { setDuration(et.duration); setSelectedSlot(null) }}
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 10,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s',
                border: active ? '1px solid var(--sched-accent)' : '1px solid rgba(255,255,255,0.06)',
                backgroundColor: active ? 'rgba(59,130,246,0.06)' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={active ? 'var(--sched-accent)' : 'rgba(255,255,255,0.3)'} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                <span style={{ fontSize: 13, fontWeight: 600, color: active ? 'var(--sched-accent)' : 'var(--sched-text-primary)' }}>
                  {et.duration === 60 ? '1 hour' : `${et.duration} min`}
                </span>
              </div>
              <p style={{ fontSize: 12, color: active ? 'rgba(59,130,246,0.7)' : 'rgba(255,255,255,0.25)', margin: 0 }}>{et.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Header: date range + nav */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {headerTitle && <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--sched-text-primary)', margin: '0 0 4px' }}>{headerTitle}</p>}
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--sched-text-primary)', margin: 0 }}>{dateRange}</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: '2px 0 0' }}>Times in {userTimezone}</p>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[{ fn: goPrev, ok: canGoPrev, ch: '‹' }, { fn: goNext, ok: canGoNext, ch: '›' }].map(({ fn, ok, ch }, i) => (
              <button key={i} onClick={fn} disabled={!ok} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: 'none', color: ok ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)', cursor: ok ? 'pointer' : 'default', fontSize: 16 }} aria-label={i === 0 ? 'Previous week' : 'Next week'}>{ch}</button>
            ))}
          </div>
        </div>
      </div>

      {warning && <div style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, backgroundColor: 'rgba(245,158,11,0.08)', color: 'var(--sched-warning)', marginBottom: 8 }}>{warning}</div>}

      {/* Calendar grid */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Day headers */}
        <div style={{ display: 'flex', marginBottom: 4 }}>
          <div style={{ width: 44, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {(weekData || skeletonDays.map((s) => ({ date: '', dayName: s.name, dayNumber: s.num, isToday: false, slots: [] }))).map((day, i) => {
              const isPast = day.date ? day.date < todayStr : false
              return (
                <div key={day.date || `skel-${i}`} style={{ textAlign: 'center', opacity: isLoading ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                  <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: day.isToday ? 'var(--sched-accent)' : isPast ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.35)', margin: 0 }}>{day.dayName}</p>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '3px auto 0', fontSize: 14, fontWeight: 600, ...(day.isToday ? { backgroundColor: 'var(--sched-accent)', color: '#0a0b0f' } : { color: isPast ? 'rgba(255,255,255,0.12)' : 'white' }) }}>{day.dayNumber}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Time grid */}
        <div style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', maxHeight: MAX_SCROLL_HEIGHT }}>
          <div style={{ overflowY: 'auto', maxHeight: MAX_SCROLL_HEIGHT, marginRight: -20, paddingRight: 20 }}>
            <div style={{ display: 'flex', height: GRID_HEIGHT, opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
              <div style={{ width: 44, flexShrink: 0, position: 'relative', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                {hourLabels.map(({ h, top, label }) => <div key={h} style={{ position: 'absolute', right: 8, top, transform: 'translateY(-50%)', fontSize: 10, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>{label}</div>)}
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', height: GRID_HEIGHT }}>
                {(weekData || Array.from({ length: 7 }, () => ({ date: '', slots: [] as TimeSlot[], isToday: false, dayName: '', dayNumber: 0 }))).map((day, colIdx) => {
                  const visible = day.slots.filter(s => s.available || s.isPending)
                  const isWeekday = colIdx < 5
                  return (
                    <div key={day.date || colIdx} style={{ position: 'relative', height: GRID_HEIGHT, borderRight: '1px solid rgba(255,255,255,0.04)', backgroundColor: day.isToday ? 'rgba(59,130,246,0.015)' : undefined }}>
                      {gridLines.map((l, i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: l.top, borderTop: `1px solid rgba(255,255,255,${l.full ? 0.04 : 0.02})` }} />)}
                      {isLoading && !weekData && isWeekday && [9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5].map(hour => (
                        <div key={hour} className="animate-pulse" style={{ position: 'absolute', left: 4, right: 4, top: (hour * 60 - HOUR_START * 60) * PX_PER_MIN, height: 30 * PX_PER_MIN, borderRadius: 6, backgroundColor: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.08)' }} />
                      ))}
                      {visible.map(slot => {
                        const top = getTop(slot.start); const height = getHeight(slot); const sel = selectedSlot?.start === slot.start
                        const time = formatSlotForDisplay(slot.start, userTimezone)
                        const mins = Math.round((new Date(slot.end).getTime() - new Date(slot.start).getTime()) / 60000)
                        return (
                          <button key={slot.start} type="button" onClick={() => { setSelectedSlot(slot); setStep('calendar') }}
                            style={{ position: 'absolute', left: 4, right: 4, top, height, borderRadius: 6, border: `1px solid ${sel ? 'var(--sched-accent)' : 'rgba(59,130,246,0.25)'}`, backgroundColor: sel ? 'var(--sched-accent)' : 'rgba(59,130,246,0.13)', boxShadow: sel ? '0 0 16px rgba(59,130,246,0.35)' : undefined, padding: '4px 6px 2px', textAlign: 'left', cursor: 'pointer', zIndex: 10, overflow: 'hidden', transition: 'all 0.15s' }}
                            aria-label={`${time}${sel ? ' selected' : ''}`}>
                            <p style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.2, color: sel ? '#0a0b0f' : 'var(--sched-accent)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{time}</p>
                            {height > 42 && <p style={{ fontSize: 10, lineHeight: 1.2, marginTop: 2, color: sel ? 'rgba(10,11,15,0.7)' : 'rgba(59,130,246,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mins} min</p>}
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
          <AvailabilityLegend />
        </div>

        {/* Selection bar */}
        <div style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', padding: '14px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 14, color: selectedSlot ? 'var(--sched-text-primary)' : 'rgba(255,255,255,0.3)', margin: 0 }}>
              {selectedSlot
                ? `${fmtRange(selectedSlot.start, duration)} · ${new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: userTimezone }).format(new Date(selectedSlot.start))}`
                : 'Select a time above'}
            </p>
            <button
              onClick={() => selectedSlot && setStep('form')}
              disabled={!selectedSlot}
              style={{ borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 500, border: `1px solid ${selectedSlot ? 'var(--sched-accent)' : 'rgba(255,255,255,0.08)'}`, color: selectedSlot ? 'var(--sched-accent)' : 'rgba(255,255,255,0.15)', background: 'none', cursor: selectedSlot ? 'pointer' : 'default', transition: 'all 0.15s', flexShrink: 0 }}
            >
              Continue &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
