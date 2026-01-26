/**
 * ScrollReveal Component
 * ======================
 * Advanced scroll-triggered animations using GSAP ScrollTrigger.
 * Uses dynamic imports - GSAP is never in the initial bundle.
 */

'use client';

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Animation type */
  animation?: 'fade' | 'fade-up' | 'fade-down' | 'scale' | 'slide-left' | 'slide-right';
  /** Duration in seconds */
  duration?: number;
  /** Delay in seconds */
  delay?: number;
  /** Stagger children by this amount (seconds) */
  stagger?: number;
  /** CSS selector for children to stagger */
  staggerSelector?: string;
  /** ScrollTrigger start position */
  start?: string;
  /** Only animate once */
  once?: boolean;
  /** Custom GSAP from/to properties */
  fromVars?: Record<string, unknown>;
  toVars?: Record<string, unknown>;
}

// Initial styles for different animation types
function getInitialStyles(animation: string): CSSProperties {
  switch (animation) {
    case 'fade':
      return { opacity: 0 };
    case 'fade-up':
      return { opacity: 0, transform: 'translateY(40px)' };
    case 'fade-down':
      return { opacity: 0, transform: 'translateY(-40px)' };
    case 'scale':
      return { opacity: 0, transform: 'scale(0.9)' };
    case 'slide-left':
      return { opacity: 0, transform: 'translateX(40px)' };
    case 'slide-right':
      return { opacity: 0, transform: 'translateX(-40px)' };
    default:
      return { opacity: 0 };
  }
}

export function ScrollReveal({
  children,
  className,
  animation = 'fade-up',
  duration = 0.8,
  delay = 0,
  stagger,
  staggerSelector,
  start = 'top 75%',
  once = true,
  fromVars,
  toVars,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Use IntersectionObserver to detect when element enters viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [once]);

  // Dynamically load GSAP and animate when visible
  useEffect(() => {
    if (!isVisible || hasAnimated || !containerRef.current) return;

    const animate = async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      // Wait for next frame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          // Get targets (either children with selector or the container itself)
          const targets = staggerSelector
            ? element.querySelectorAll(staggerSelector)
            : element;

          // Default from/to based on animation type
          const defaultFrom: Record<string, unknown> = {
            'fade': { opacity: 0 },
            'fade-up': { opacity: 0, y: 40 },
            'fade-down': { opacity: 0, y: -40 },
            'scale': { opacity: 0, scale: 0.9 },
            'slide-left': { opacity: 0, x: 40 },
            'slide-right': { opacity: 0, x: -40 },
          }[animation] || { opacity: 0 };

          const defaultTo: Record<string, unknown> = {
            'fade': { opacity: 1 },
            'fade-up': { opacity: 1, y: 0 },
            'fade-down': { opacity: 1, y: 0 },
            'scale': { opacity: 1, scale: 1 },
            'slide-left': { opacity: 1, x: 0 },
            'slide-right': { opacity: 1, x: 0 },
          }[animation] || { opacity: 1 };

          gsap.fromTo(
            targets,
            { ...defaultFrom, ...fromVars },
            {
              ...defaultTo,
              ...toVars,
              duration,
              delay,
              ease: 'power3.out',
              stagger: stagger || 0,
              scrollTrigger: {
                trigger: element,
                start,
                toggleActions: once ? 'play none none none' : 'play reverse play reverse',
              },
            }
          );

          setHasAnimated(true);
        });
      });
    };

    animate();
  }, [isVisible, hasAnimated, animation, duration, delay, stagger, staggerSelector, start, once, fromVars, toVars]);

  return (
    <div
      ref={containerRef}
      className={cn(className)}
      style={!hasAnimated ? getInitialStyles(animation) : undefined}
    >
      {children}
    </div>
  );
}
