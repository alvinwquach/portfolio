/**
 * useInView Hook
 * ==============
 * Detects when an element enters the viewport via IntersectionObserver.
 * Disconnects on cleanup to prevent memory leaks on route transitions.
 *
 * @param options - IntersectionObserver options plus `once` (default: true)
 *   When `once` is true, the observer disconnects after the first intersection.
 */

import { useRef, useState, useEffect, type RefObject } from 'react';

export function useInView<T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit & { once?: boolean }
): { ref: RefObject<T | null>; isInView: boolean } {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const { once = true, ...observerInit } = options ?? {};

    const observer = new IntersectionObserver(([entry]) => {
      const intersecting = entry.isIntersecting;
      setIsInView(intersecting);
      if (intersecting && once) {
        observer.disconnect();
      }
    }, observerInit);

    observer.observe(element);
    return () => observer.disconnect();
    // Options are expected to be static per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isInView };
}
