/**
 * Blog Page Loading Skeleton — matches sidebar + grid layout
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function BlogLoading() {
  return (
    <div className="hidden lg:flex" style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar skeleton */}
      <aside style={{ width: 280, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', padding: '32px 28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Skeleton className="w-9 h-9 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-7 w-16 mb-3" />
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <Skeleton className="h-10 w-12" />
          <Skeleton className="h-10 w-12" />
          <Skeleton className="h-10 w-12" />
        </div>
        <Skeleton className="h-3 w-12 mb-3" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full mb-1 rounded-md" />
        ))}
        <Skeleton className="h-3 w-14 mt-6 mb-3" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </aside>

      {/* Content skeleton */}
      <main style={{ flex: 1, padding: '32px 32px 48px' }}>
        <Skeleton className="h-10 w-80 mb-6 rounded-lg" />
        <Skeleton className="h-3 w-20 mb-3" />
        <div style={{ padding: '28px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-7 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Skeleton className="w-1.5 h-1.5 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', margin: '14px 0 12px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Skeleton className="w-7 h-7 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
