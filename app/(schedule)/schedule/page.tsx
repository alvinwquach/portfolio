/**
 * /schedule — Public Schedule Page
 *
 * Desktop: Two panels locked to viewport. No page scroll.
 *   LEFT: Sidebar (340px) — scrolls independently if needed
 *   RIGHT: Flex column — header + scrollable calendar + sticky bottom bar
 */

import { getSchedulingConfig } from '@/lib/scheduling/sanity-scheduling'
import ScheduleSidebar from '@/components/schedule/ScheduleSidebar'
import WeekCalendar from '@/components/schedule/WeekCalendar'

export default async function SchedulePage() {
  const config = await getSchedulingConfig()

  if (!config.isAcceptingBookings) {
    return (
      <div style={{ display: 'flex', height: 'calc(100vh - 48px)', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--sched-text-primary)', marginBottom: 16 }}>Not Currently Accepting Bookings</h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--sched-text-secondary)' }}>
            I&apos;m not scheduling meetings at the moment. Feel free to reach out via email at{' '}
            <a href="mailto:alvinwquach@gmail.com" style={{ color: 'var(--sched-accent)' }}>alvinwquach@gmail.com</a>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden" style={{ minHeight: 'calc(100vh - 48px)' }}>
        <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <ScheduleSidebar config={config} />
        </div>
        <WeekCalendar advanceBookingDays={config.advanceBookingDays} />
      </div>

      {/* Desktop — both panels locked to viewport */}
      <div className="hidden lg:flex" style={{ height: 'calc(100vh - 48px)' }}>
        <aside style={{
          width: 340,
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          overflowY: 'auto',
          padding: '32px 32px 24px',
        }}>
          <ScheduleSidebar config={config} />
        </aside>

        {/* RIGHT — WeekCalendar manages its own scroll internally */}
        <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <WeekCalendar advanceBookingDays={config.advanceBookingDays} />
        </main>
      </div>
    </>
  )
}
