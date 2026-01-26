/**
 * StaggerChildren Animation Component
 * ====================================
 * Animates children with staggered timing on scroll.
 * GSAP is dynamically imported only when element becomes visible.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Intersection Observer
  React.useEffect(() => {
    if (!containerRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Dynamic GSAP import and stagger animation
  React.useEffect(() => {
    if (!isVisible || !containerRef.current || hasAnimated) return;

    const animate = async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;

      const container = containerRef.current;
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
  }, [isVisible, stagger, duration, delay, childSelector, from, distance, hasAnimated]);

  return (
    <div ref={containerRef} className={cn(!hasAnimated && '[&>*]:opacity-0', className)}>
      {children}
    </div>
  );
}
