/**
 * Schedule Layout — Minimal Layout for /schedule and /reschedule Pages
 * ====================================================================
 *
 * WHY A SEPARATE LAYOUT?
 * ----------------------
 * The portfolio uses a full layout with sidebar navigation, footer, and
 * all the portfolio chrome. The scheduling pages need a COMPLETELY different
 * layout: minimal, focused, no distractions.
 *
 * HOW NEXT.JS ROUTE GROUPS WORK:
 * ─────────────────────────────
 * Wrapping a folder name in parentheses: (schedule)
 * Creates a "route group" that:
 *   - Shares a layout (this file)
 *   - Does NOT appear in the URL (no /schedule/schedule)
 *
 * URL structure:
 *   app/(schedule)/schedule/page.tsx    → /schedule
 *   app/(schedule)/reschedule/[token]/  → /reschedule/[token]
 *   app/(marketing)/page.tsx            → / (portfolio homepage)
 *
 * Both (schedule) and (marketing) are wrapped by the ROOT layout
 * (app/layout.tsx), which provides fonts, providers, and metadata.
 *
 * LAYOUT STRUCTURE:
 * -----------------
 *
 *   ┌───────────────────────────────────────┐
 *   │  AQ logo   alvinquach.dev   ← Back   │  ← Top bar (48px)
 *   ├───────────────────────────────────────┤
 *   │                                       │
 *   │           Page Content                │  ← Children fill remaining height
 *   │        (schedule or reschedule)       │
 *   │                                       │
 *   └───────────────────────────────────────┘
 *
 * No footer, no sidebar, no portfolio navigation.
 */

import Link from 'next/link'
import type { Metadata } from 'next'

/**
 * Metadata for all schedule pages.
 * This overrides the root layout's portfolio-focused metadata.
 */
export const metadata: Metadata = {
  title: 'Schedule a Meeting — Alvin Quach',
  description: 'Request a 30-minute meeting with Alvin Quach to discuss engineering, projects, or opportunities.',
}

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Full viewport height, dark background
    // flex flex-col: stack top bar and content vertically
    <div data-schedule="" className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--sched-bg-primary)' }}>

      {/* ═══════════════════════════════════════════
          TOP BAR — Minimal navigation
          ═══════════════════════════════════════════

          WHY 48px HEIGHT?
          Small enough to not waste space, large enough for touch targets.
          Same height as many mobile app navigation bars.

          STICKY POSITIONING:
          "sticky top-0" keeps the bar at the top when scrolling.
          z-50 ensures it stays above the calendar content.

          BACKDROP BLUR:
          backdrop-blur-sm adds a frosted-glass effect when content
          scrolls behind the bar. This is a subtle polish detail.
      */}
      <header
        className="sticky top-0 z-50 flex h-12 items-center justify-between border-b px-4 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(7, 9, 13, 0.9)',
          borderColor: 'var(--sched-border)',
        }}
      >
        {/* ── Left side: Logo + site name ─────────────── */}
        <div className="flex items-center gap-3">
          {/* AQ badge — matches the portfolio's branding */}
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white"
            style={{ backgroundColor: 'var(--sched-accent)' }}
          >
            AQ
          </div>
          {/* Site name in monospace font (matching portfolio style) */}
          <span
            className="text-sm font-mono"
            style={{ color: 'var(--sched-text-secondary)' }}
          >
            alvinquach.dev
          </span>
        </div>

        {/* ── Right side: Back to portfolio link ──────── */}
        <Link
          href="/"
          className="text-sm transition-colors hover:opacity-80"
          style={{ color: 'var(--sched-text-secondary)' }}
        >
          &larr; Back to portfolio
        </Link>
      </header>

      {/* ═══════════════════════════════════════════
          MAIN CONTENT AREA
          ═══════════════════════════════════════════

          flex-1: Take up all remaining vertical space after the top bar.
          This makes the calendar grid fill the full viewport height
          minus the 48px top bar.
      */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
