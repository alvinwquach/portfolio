/**
 * useInfiniteScroll Hook
 * ======================
 * Handles infinite scroll with IntersectionObserver
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  /** Total number of items available */
  totalItems: number;
  /** Number of items to load per batch */
  batchSize?: number;
  /** Threshold for triggering load (0-1) */
  threshold?: number;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
}

interface UseInfiniteScrollReturn {
  /** Current number of items to display */
  displayCount: number;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether currently loading more items */
  isLoading: boolean;
  /** Ref to attach to the sentinel element */
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  /** Reset display count (e.g., when filters change) */
  reset: () => void;
  /** Manually load more items */
  loadMore: () => void;
}

export function useInfiniteScroll({
  totalItems,
  batchSize = 24,
  threshold = 0.1,
  rootMargin = '100px',
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const [displayCount, setDisplayCount] = useState(batchSize);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = displayCount < totalItems;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    // Small delay to show loading state
    requestAnimationFrame(() => {
      setDisplayCount((prev) => Math.min(prev + batchSize, totalItems));
      setIsLoading(false);
    });
  }, [hasMore, isLoading, batchSize, totalItems]);

  const reset = useCallback(() => {
    setDisplayCount(batchSize);
    setIsLoading(false);
  }, [batchSize]);

  // Reset when total items changes (filters applied)
  useEffect(() => {
    setDisplayCount(Math.min(batchSize, totalItems));
  }, [totalItems, batchSize]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, loadMore, threshold, rootMargin]);

  return {
    displayCount,
    hasMore,
    isLoading,
    sentinelRef,
    reset,
    loadMore,
  };
}
