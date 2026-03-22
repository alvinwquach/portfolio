'use client';

import { useRef, useLayoutEffect, useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface UseScrollTriggerOptions {
  /** ScrollTrigger vars — merged with the trigger element */
  vars: Omit<ScrollTrigger.Vars, 'trigger'>;
  /** Animation factory called with the scoped element as the trigger */
  animation?: (trigger: HTMLElement) => gsap.core.Tween | gsap.core.Timeline;
  /** Re-run when these deps change */
  deps?: React.DependencyList;
}

/**
 * useScrollTrigger
 * ================
 * Convenience hook for a single ScrollTrigger instance scoped to a ref.
 * Automatically kills the trigger on unmount to prevent memory leaks.
 *
 * @returns ref — attach to the element you want to use as the trigger
 *
 * @example
 * const ref = useScrollTrigger({
 *   vars: { start: 'top 80%', toggleClass: 'is-visible', once: true },
 * });
 * return <section ref={ref}>...</section>;
 *
 * @example — with animation
 * const ref = useScrollTrigger({
 *   vars: { start: 'top 75%', end: 'bottom 25%', scrub: true },
 *   animation: (el) =>
 *     gsap.to(el.querySelectorAll('.card'), { y: -20, stagger: 0.1 }),
 * });
 */
export function useScrollTrigger<T extends HTMLElement = HTMLElement>({
  vars,
  animation,
  deps = [],
}: UseScrollTriggerOptions): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = animation?.(el);

    const trigger = ScrollTrigger.create({
      trigger: el,
      animation: tween ?? undefined,
      ...vars,
    });

    return () => {
      trigger.kill();
      tween?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
