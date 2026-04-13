import type { Metadata } from 'next'
import { isTrackerAuthenticated, trackerLogout } from '@/app/actions/tracker-auth'
import { TrackerAuthGate } from '@/components/tracker/TrackerAuthGate'

export const metadata: Metadata = {
  title: 'Job Tracker',
  robots: { index: false, follow: false },
}

export default async function TrackerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authed = await isTrackerAuthenticated()

  return (
    <TrackerAuthGate isAuthenticated={authed}>
      <div className="flex min-h-screen flex-col bg-base">
        <header className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-line/50 bg-base/95 px-5 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-medium text-text-muted">
              Job Tracker
            </span>
            <a
              href="/studio/structure/jobApplication"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-text-muted/50 transition-colors hover:text-accent"
            >
              Studio &#8599;
            </a>
          </div>
          <form action={trackerLogout}>
            <button
              type="submit"
              className="text-xs text-text-muted/50 transition-colors hover:text-text"
            >
              Logout
            </button>
          </form>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </TrackerAuthGate>
  )
}
