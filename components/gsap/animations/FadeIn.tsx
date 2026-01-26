/**
 * FadeIn Animation Component
 * ==========================
 * Scroll-triggered fade in animation with dynamic GSAP import.
 * GSAP is NOT in the initial bundle - loaded only when element is visible.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type ElementType = 'div' | 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer' | 'nav' | 'span' | 'p' | 'li' | 'ul';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  /** Direction to animate from */
  from?: 'bottom' | 'top' | 'left' | 'right' | 'none';
  /** Distance to animate (in pixels) */
  distance?: number;
  /** Animation duration */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Easing function */
  ease?: string;
  /** Only animate once */
  once?: boolean;
  /** Disable scroll trigger (animate on mount) */
  immediate?: boolean;
  /** Custom scroll trigger start position */
  start?: string;
  /** As which element to render */
  as?: ElementType;
}

export function FadeIn({
  children,
  className,
  from = 'bottom',
  distance = 30,
  duration = 0.5,
  delay = 0,
  ease = 'power2.out',
  once = true,
  immediate = false,
  start = 'top 80%',
  as: Component = 'div',
}: FadeInProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Intersection Observer for visibility detection
  React.useEffect(() => {
    if (!containerRef.current || hasAnimated) return;

    // If immediate, skip observer
    if (immediate) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [immediate, once, hasAnimated]);

  // Dynamic GSAP import and animation
  React.useEffect(() => {
    if (!isVisible || !containerRef.current || hasAnimated) return;

    const animate = async () => {
      // Dynamic import - keeps GSAP out of initial bundle
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;

      const element = containerRef.current;
      if (!element) return;

      // Calculate from position based on direction
      const fromVars: Record<string, number> = {
        opacity: 0,
        x: from === 'left' ? -distance : from === 'right' ? distance : 0,
        y: from === 'bottom' ? distance : from === 'top' ? -distance : 0,
      };

      // Wait for paint before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          gsap.fromTo(
            element,
            fromVars,
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration,
              delay,
              ease,
              clearProps: 'all',
              onComplete: () => setHasAnimated(true),
            }
          );
        });
      });
    };

    animate();
  }, [isVisible, from, distance, duration, delay, ease, hasAnimated]);

  return (
    <Component
      ref={containerRef as React.RefObject<any>}
      className={cn(!hasAnimated && 'opacity-0', className)}
    >
      {children}
    </Component>
  );
}
