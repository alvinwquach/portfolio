/**
 * Blog Page Loading Skeleton
 * ==========================
 * Matches the blog page layout during ISR revalidation.
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function BlogLoading() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-10 w-24 mb-2" />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 pb-6 border-b border-border/30">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>

        {/* Search Bar */}
        <Skeleton className="h-10 w-full max-w-sm mb-10 rounded-md" />

        {/* What's new section */}
        <Skeleton className="h-8 w-36 mb-6" />
        <div className="p-8 md:p-10 rounded-xl bg-card border border-border/50 mb-12">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-8 w-1/2 mb-6" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="w-2 h-2 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-4" />
              <div className="border-t border-dashed border-border/50 my-4" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
