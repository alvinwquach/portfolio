/**
 * Interview Prep Loading Skeleton — matches sidebar + grid layout
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function InterviewPrepLoading() {
  return (
    <div className="hidden lg:flex" style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar skeleton */}
      <aside style={{ width: 280, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', padding: '32px 28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Skeleton className="w-9 h-9 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-7 w-32 mb-3" />
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <Skeleton className="h-10 w-12" />
          <Skeleton className="h-10 w-12" />
          <Skeleton className="h-10 w-12" />
        </div>
        <Skeleton className="h-3 w-16 mb-3" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full mb-1 rounded-md" />
        ))}
        <Skeleton className="h-3 w-16 mt-5 mb-3" />
        <div style={{ display: 'flex', gap: 6 }}>
          <Skeleton className="h-7 w-14 rounded-md" />
          <Skeleton className="h-7 w-16 rounded-md" />
          <Skeleton className="h-7 w-12 rounded-md" />
        </div>
      </aside>

      {/* Content skeleton */}
      <main style={{ flex: 1, padding: '32px 32px 48px' }}>
        <Skeleton className="h-10 w-80 mb-6 rounded-lg" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-16 ml-auto" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <Skeleton className="h-5 w-14 rounded" />
                <Skeleton className="h-5 w-18 rounded" />
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
