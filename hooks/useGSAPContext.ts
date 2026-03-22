'use client';

import { useRef, useLayoutEffect, useEffect, type RefObject } from 'react';
import gsap from 'gsap';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * useGSAPContext
 * ==============
 * Creates a gsap.context() scoped to a React ref so all GSAP child
 * animations are tracked and automatically reverted on unmount.
 * Safe in React Strict Mode (double-invoke creates then cleans up correctly).
 *
 * @param callback - Function that creates GSAP animations inside the context
 * @param deps     - Dependency array (re-runs callback when deps change)
 * @returns ref    - Attach to the root DOM element of your component
 *
 * @example
 * const ref = useGSAPContext((ctx) => {
 *   ctx.add(() => {
 *     gsap.from('.hero-title', { opacity: 0, y: 40 });
 *   });
 * });
 * return <section ref={ref}>...</section>;
 */
export function useGSAPContext<T extends HTMLElement = HTMLElement>(
  callback: (context: gsap.Context) => void,
  deps: React.DependencyList = [],
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      callback(self);
    }, ref);

    // Revert on unmount — rolls back all animations created in this context,
    // prevents memory leaks and Strict Mode double-fire issues
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
