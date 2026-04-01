/**
 * ScheduleSidebar — Left Panel
 * Balanced: trust signals have short descriptions, sidebar fills viewport.
 */

'use client'

import type { SchedulingConfig } from '@/types/scheduling'

interface ScheduleSidebarProps {
  config: SchedulingConfig
  recipientName?: string
  personalNote?: string
}

export default function ScheduleSidebar({ config, recipientName, personalNote }: ScheduleSidebarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>

      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--sched-accent)' }}>AQ</div>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.45)' }}>Alvin Quach</span>
      </div>

      {recipientName && <p style={{ fontSize: 14, color: 'var(--sched-accent)', margin: 0 }}>Hi {recipientName}</p>}

      {/* Title */}
      <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: 'var(--sched-text-primary)', margin: 0 }}>Request a Meeting</h1>

      {/* Duration + Format */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        <span>15–60 min</span>
        <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
        <span>Google Meet</span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
        {config.meetingDescription}
      </p>

      {personalNote && <p style={{ fontSize: 13, fontStyle: 'italic', lineHeight: 1.5, color: 'rgba(255,255,255,0.35)', margin: 0 }}>&ldquo;{personalNote}&rdquo;</p>}

      {/* What We Can Discuss */}
      {config.whatWeCanDiscuss?.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>What we can discuss</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {config.whatWeCanDiscuss.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--sched-accent)', flexShrink: 0 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '2px 0' }} />

      {/* Trust Signals — title + short description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TrustItem
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>}
          title="Request-based booking"
          desc="I review before confirming. No accidental double-bookings."
        />
        <TrustItem
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>}
          title="Day-by-day availability"
          desc="Varies daily based on my actual calendar."
        />
        <TrustItem
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>}
          title="Instant calendar invite"
          desc="Meet link sent automatically on approval."
        />
      </div>
    </div>
  )
}

function TrustItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ marginTop: 1, color: 'var(--sched-accent)', flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--sched-text-primary)', margin: 0 }}>{title}</p>
        <p style={{ fontSize: 12, lineHeight: 1.4, color: 'rgba(255,255,255,0.3)', margin: '1px 0 0' }}>{desc}</p>
      </div>
    </div>
  )
}
