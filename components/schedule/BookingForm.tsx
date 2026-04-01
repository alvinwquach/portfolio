/**
 * BookingForm — Clean 2-column layout (Calendly/Cal.com style)
 *
 * Row 1: Name · Email (2 cols)
 * Row 2: Company · Job title (2 cols)
 * Row 3: Topic dropdown (full width)
 * Row 4: LinkedIn (full width)
 * Row 5: Message textarea (full width, fixed height)
 * Row 6: Submit button
 */

'use client'

import { useState, useCallback } from 'react'
import type { TimeSlot, ApiResponse, BookingFormData } from '@/types/scheduling'

const TOPIC_OPTIONS = [
  'Career opportunities & roles',
  'Technical architecture discussion',
  'Open source collaboration',
  'Project feedback & code review',
  'Partnership opportunity',
  'Other',
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 0',
  fontSize: 14,
  color: 'var(--sched-text-primary)',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--sched-text-primary)',
  marginBottom: 2,
  display: 'block',
}

interface BookingFormProps {
  selectedSlot: TimeSlot
  timezone: string
  privateLinkData?: Partial<BookingFormData>
  onBack: () => void
  duration?: number
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function BookingForm({ selectedSlot, timezone, privateLinkData, onBack, duration = 30 }: BookingFormProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [name, setName] = useState(privateLinkData?.requesterName || '')
  const [email, setEmail] = useState(privateLinkData?.requesterEmail || '')
  const [company, setCompany] = useState(privateLinkData?.requesterCompany || '')
  const [role, setRole] = useState(privateLinkData?.requesterRole || '')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [message, setMessage] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderBottomColor = 'var(--sched-accent)' }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.08)' }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) { setFormState('success'); return }
    setFormState('loading')
    setErrorMessage('')
    try {
      let recaptchaToken = 'skip'
      const grecaptcha = (window as unknown as Record<string, unknown>).grecaptcha as
        | { execute: (key: string, opts: { action: string }) => Promise<string> } | undefined
      if (grecaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        recaptchaToken = await grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'schedule_request' })
      }
      const fullTopic = selectedTopic === 'Other' || !selectedTopic ? message : `${selectedTopic}${message ? `\n\n${message}` : ''}`
      const body: BookingFormData = {
        requesterName: name, requesterEmail: email,
        requesterCompany: company || undefined, requesterRole: role || undefined,
        topic: fullTopic, requestedSlot: selectedSlot.start, timezone,
        recaptchaToken, privateLinkToken: privateLinkData?.privateLinkToken,
      }
      const res = await fetch('/api/schedule/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data: ApiResponse = await res.json()
      if (data.success) { setFormState('success') }
      else {
        setFormState('error')
        const msgs: Record<string, string> = { SLOT_UNAVAILABLE: 'That slot was just taken.', RATE_LIMITED: 'Too many requests.', RECAPTCHA_FAILED: 'Verification failed.', DAILY_LIMIT_REACHED: 'No more slots that day.' }
        setErrorMessage(msgs[data.code || ''] || data.error || 'Something went wrong.')
      }
    } catch { setFormState('error'); setErrorMessage('Network error.') }
  }, [name, email, company, role, selectedTopic, message, honeypot, selectedSlot, timezone, privateLinkData])

  if (formState === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--sched-text-primary)', margin: '0 0 6px' }}>Request submitted!</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 320, margin: '0 auto' }}>Check your email to verify. I&apos;ll review within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {formState === 'error' && errorMessage && (
        <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 13, backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}>{errorMessage}</div>
      )}

      {/* Row 1: Name · Email — 2 cols on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 18 }}>
        <div>
          <label style={labelStyle}>Name <span style={{ color: '#ef4444' }}>*</span></label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" autoComplete="name" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>
        <div>
          <label style={labelStyle}>Email <span style={{ color: '#ef4444' }}>*</span></label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@company.com" autoComplete="email" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>
      </div>

      {/* Row 2: Company · Job title */}
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 18 }}>
        <div>
          <label style={labelStyle}>Company</label>
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Inc." autoComplete="organization" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>
        <div>
          <label style={labelStyle}>Job title</label>
          <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Senior Engineer" autoComplete="organization-title" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
        </div>
      </div>

      {/* Row 3: Topic */}
      <div>
        <label style={labelStyle}>Topic <span style={{ color: '#ef4444' }}>*</span></label>
        <select required value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} onFocus={onFocus as React.FocusEventHandler<HTMLSelectElement>} onBlur={onBlur as React.FocusEventHandler<HTMLSelectElement>}
          style={{ ...inputStyle, cursor: 'pointer', color: selectedTopic ? 'var(--sched-text-primary)' : 'rgba(255,255,255,0.3)', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center' }}>
          <option value="" disabled>What would you like to discuss?</option>
          {TOPIC_OPTIONS.map(t => <option key={t} value={t} style={{ backgroundColor: '#161b22', color: '#f1f5f9' }}>{t}</option>)}
        </select>
      </div>

      {/* Row 4: LinkedIn */}
      <div>
        <label style={labelStyle}>LinkedIn <span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.2)' }}>(optional)</span></label>
        <input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="linkedin.com/in/yourname" autoComplete="url" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
      </div>

      {/* Row 5: Message */}
      <div>
        <label style={labelStyle}>Brief context for the call <span style={{ color: '#ef4444' }}>*</span></label>
        <textarea required minLength={20} maxLength={500} rows={4} value={message} onChange={e => setMessage(e.target.value)}
          placeholder="A few sentences about what you'd like to discuss..."
          style={{ ...inputStyle, resize: 'vertical', minHeight: 100, lineHeight: 1.6 }}
          onFocus={onFocus as React.FocusEventHandler<HTMLTextAreaElement>} onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>} />
        <div style={{ textAlign: 'right', marginTop: 4 }}><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{message.length}/500</span></div>
      </div>

      {/* Honeypot */}
      <div style={{ position: 'absolute', left: -9999, opacity: 0 }} aria-hidden="true">
        <input type="text" tabIndex={-1} value={honeypot} onChange={e => setHoneypot(e.target.value)} autoComplete="off" />
      </div>

      {/* Submit */}
      <button type="submit" disabled={formState === 'loading'}
        style={{ padding: '12px 24px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600, color: 'white', backgroundColor: 'var(--sched-accent)', cursor: formState === 'loading' ? 'wait' : 'pointer', opacity: formState === 'loading' ? 0.6 : 1, transition: 'opacity 0.15s', width: '100%' }}>
        {formState === 'loading' ? 'Submitting...' : 'Request this slot'}
      </button>
    </form>
  )
}
