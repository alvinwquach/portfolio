/**
 * TextReveal Animation Component
 * ==============================
 * Reveals text character by character or word by word.
 * GSAP is dynamically imported only when element becomes visible.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  children: string;
  className?: string;
  /** Reveal by 'word' or 'character' */
  by?: 'word' | 'character';
  /** Stagger amount between elements */
  stagger?: number;
  /** Animation duration */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** HTML element to render */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export function TextReveal({
  children,
  className,
  by = 'word',
  stagger = 0.05,
  duration = 0.5,
  delay = 0,
  as: Component = 'div',
}: TextRevealProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Split text into elements
  const elements = React.useMemo(() => {
    if (by === 'character') {
      return children.split('').map((char, i) => (
        <span key={i} className="inline-block" style={{ opacity: 0 }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }
    return children.split(' ').map((word, i, arr) => (
      <span key={i} className="inline-block" style={{ opacity: 0 }}>
        {word}{i < arr.length - 1 ? '\u00A0' : ''}
      </span>
    ));
  }, [children, by]);

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
      { threshold: 0.2 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Dynamic GSAP import and animation
  React.useEffect(() => {
    if (!isVisible || !containerRef.current || hasAnimated) return;

    const animate = async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;

      const container = containerRef.current;
      if (!container) return;

      const spans = container.querySelectorAll('span');
      if (spans.length === 0) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          gsap.fromTo(
            spans,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration,
              delay,
              stagger,
              ease: 'power2.out',
              onComplete: () => setHasAnimated(true),
            }
          );
        });
      });
    };

    animate();
  }, [isVisible, duration, delay, stagger, hasAnimated]);

  return (
    <Component ref={containerRef as React.RefObject<any>} className={className}>
      {elements}
    </Component>
  );
}
