/**
 * Craft Section
 * =============
 * Visual: Nearly empty. The absence of decoration IS the statement.
 * A single performance metric, presented as a quiet fact.
 *
 * Feeling: Discipline. Maximum restraint. This section proves you mean it.
 */

'use client';

import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CraftSectionProps {
  className?: string;
}

export function CraftSection({ className }: CraftSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate the score count
  useEffect(() => {
    if (!isVisible) return;

    const target = 100;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setScore(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(animate, 500);
    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className={cn('relative py-40', className)}
    >
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {/* The single metric */}
          <div
            className={cn(
              'mb-8 transition-opacity duration-1000',
              isVisible ? 'opacity-100' : 'opacity-0'
            )}
          >
            <p className="text-7xl md:text-8xl font-light text-foreground/90 tabular-nums">
              {score}
            </p>
            <p className="text-sm text-muted-foreground/50 mt-2">
              Lighthouse Performance
            </p>
          </div>

          {/* The statement */}
          <p
            className={cn(
              'text-lg text-muted-foreground/70 transition-opacity duration-1000',
              isVisible ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: '1s' }}
          >
            Performance is a feature. Accessibility is a requirement.
            <br />
            The absence of decoration is the discipline.
          </p>
        </div>
      </div>
    </section>
  );
}
