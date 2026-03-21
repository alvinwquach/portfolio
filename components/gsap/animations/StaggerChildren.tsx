/**
 * StaggerChildren Animation Component
 * ====================================
 * Animates children with staggered timing on scroll.
 * GSAP is dynamically imported only when element becomes visible.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/hooks';

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger amount between each child animation */
  stagger?: number;
  /** Animation duration for each child */
  duration?: number;
  /** Delay before first animation */
  delay?: number;
  /** CSS selector for children to animate (default: direct children) */
  childSelector?: string;
  /** Direction to animate from */
  from?: 'bottom' | 'top' | 'left' | 'right';
  /** Distance to animate */
  distance?: number;
}

export function StaggerChildren({
  children,
  className,
  stagger = 0.1,
  duration = 0.5,
  delay = 0,
  childSelector = '> *',
  from = 'bottom',
  distance = 30,
}: StaggerChildrenProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Dynamic GSAP import and stagger animation
  React.useEffect(() => {
    if (!isInView || !ref.current || hasAnimated) return;

    const animate = async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;

      const container = ref.current;
      if (!container) return;

      // Get children to animate
      const targets = childSelector === '> *'
        ? Array.from(container.children)
        : container.querySelectorAll(childSelector);

      if (targets.length === 0) return;

      // Calculate from values
      const fromVars: Record<string, number> = {
        opacity: 0,
        x: from === 'left' ? -distance : from === 'right' ? distance : 0,
        y: from === 'bottom' ? distance : from === 'top' ? -distance : 0,
      };

      // Wait for paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          gsap.fromTo(
            targets,
            fromVars,
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration,
              delay,
              stagger,
              ease: 'power2.out',
              clearProps: 'all',
              onComplete: () => setHasAnimated(true),
            }
          );
        });
      });
    };

    animate();
  }, [isInView, stagger, duration, delay, childSelector, from, distance, hasAnimated, ref]);

  return (
    <div ref={ref} className={cn(!hasAnimated && '[&>*]:opacity-0', className)}>
      {children}
    </div>
  );
}
