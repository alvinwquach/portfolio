'use client';

import { useLayoutEffect, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { Observer } from 'gsap/Observer';

// SSR-safe layout effect: useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface GSAPProviderProps {
  children: ReactNode;
}

/**
 * GSAPProvider
 * ============
 * Registers the 4 GSAP plugins once at app startup and configures
 * global reduced-motion preferences via gsap.matchMedia().
 *
 * Plugins registered: ScrollTrigger, SplitText, Flip, Observer
 * NOT registered: ScrollSmoother (hijacks native scroll, breaks a11y)
 *                 Draggable (OrbitControls handles diorama interaction)
 *                 MotionPathPlugin (stroke-dashoffset achieves path drawing)
 *
 * Renders children directly — no wrapper divs.
 */
export function GSAPProvider({ children }: GSAPProviderProps) {
  useIsomorphicLayoutEffect(() => {
    // Register exactly 4 plugins — called once, idempotent on repeat renders
    gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Observer);

    // Reduced-motion: only run animations when the user has no preference
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Full animation defaults when reduced motion is not preferred
      gsap.defaults({ ease: 'power2.out', duration: 0.5 });

      // Clean up matchMedia context when this condition no longer matches
      return () => {
        gsap.defaults({ ease: 'none', duration: 0 });
      };
    });

    // When reduced motion IS preferred: zero out durations globally
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.defaults({ duration: 0, delay: 0 });
    });

    return () => {
      mm.revert();
    };
  }, []);

  return <>{children}</>;
}
