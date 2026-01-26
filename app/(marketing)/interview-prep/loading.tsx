/**
 * Interview Prep Loading Skeleton
 * ================================
 * Shows placeholder UI while questions are loading
 */

import { Skeleton } from '@/components/ui/skeleton';

function QuestionCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-5 space-y-3">
      {/* Header row with star and difficulty */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      {/* Question text */}
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      {/* Tags */}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-18 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      {/* Click prompt */}
      <div className="pt-2">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export default function InterviewPrepLoading() {
  return (
    <div className="py-24">
      <div className="container">
        {/* Header Skeleton */}
        <div className="max-w-3xl mb-8">
          <Skeleton className="h-12 w-80 mb-4" />
          <Skeleton className="h-6 w-full max-w-xl" />
          <Skeleton className="h-6 w-3/4 max-w-xl mt-2" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 border-b border-border/50 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <Skeleton className="h-10 flex-1 rounded-lg" />
            {/* Filter button */}
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>

          {/* Category filters */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <Skeleton className="h-4 w-20 mb-3" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <Skeleton className="h-5 w-48" />
        </div>

        {/* Card Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <QuestionCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
