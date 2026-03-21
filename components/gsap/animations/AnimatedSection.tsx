/**
 * AnimatedSection Component
 * =========================
 * Wraps content and applies scroll-triggered animations.
 * GSAP is dynamically imported only when the section becomes visible.
 * This keeps GSAP out of the initial bundle.
 */

'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/hooks';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'stagger' | 'scale';
  delay?: number;
  duration?: number;
  staggerAmount?: number;
  threshold?: number;
}

export function AnimatedSection({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 0.8,
  staggerAmount = 0.1,
  threshold = 0.2,
}: AnimatedSectionProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Dynamic GSAP import and animation
  useEffect(() => {
    if (!isInView || !ref.current || hasAnimated) return;

    const animate = async () => {
      // Dynamic import - GSAP not in initial bundle
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      const element = ref.current;
      if (!element) return;

      // Get animation targets
      const targets = animation === 'stagger'
        ? element.children
        : element;

      // Define animation based on type
      const animations: Record<string, gsap.TweenVars> = {
        'fade-up': { opacity: 0, y: 40 },
        'fade-in': { opacity: 0 },
        'stagger': { opacity: 0, y: 30 },
        'scale': { opacity: 0, scale: 0.95 },
      };

      const fromVars = animations[animation];

      // Wait for next frame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (animation === 'stagger' && element.children.length > 0) {
            gsap.from(targets, {
              ...fromVars,
              duration,
              delay,
              stagger: staggerAmount,
              ease: 'power2.out',
              clearProps: 'all',
            });
          } else {
            gsap.from(targets, {
              ...fromVars,
              duration,
              delay,
              ease: 'power2.out',
              clearProps: 'all',
            });
          }
          setHasAnimated(true);
        });
      });
    };

    animate();
  }, [isInView, animation, delay, duration, staggerAmount, hasAnimated, ref]);

  return (
    <div
      ref={ref}
      className={cn(
        // Start invisible, CSS handles initial state
        !hasAnimated && 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
}
