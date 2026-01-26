/**
 * Projects Page Loading Skeleton
 * ==============================
 * Matches the projects page layout during ISR revalidation.
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsLoading() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-10 w-40 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 pb-6 border-b border-border/30">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-18" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Search Bar */}
        <Skeleton className="h-10 w-full max-w-sm mb-10 rounded-md" />

        {/* Featured Project Skeleton */}
        <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden mb-12">
          <div className="grid lg:grid-cols-2 gap-0">
            <Skeleton className="aspect-video lg:aspect-auto lg:h-full" />
            <div className="p-6 lg:p-8">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-48 mb-4" />
              <div className="flex gap-4 mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-16 w-full mb-4" />
              <div className="flex flex-wrap gap-1.5 mb-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Project Grid Skeleton */}
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
              <Skeleton className="aspect-video" />
              <div className="p-5">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-5 w-14 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
