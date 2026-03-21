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
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/hooks';

interface CraftSectionProps {
  className?: string;
}

export function CraftSection({ className }: CraftSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [score, setScore] = useState(0);

  // Animate the score count
  useEffect(() => {
    if (!isInView) return;

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
  }, [isInView]);

  return (
    <section
      ref={ref}
      className={cn('relative py-40', className)}
    >
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {/* The single metric */}
          <div
            className={cn(
              'mb-8 transition-opacity duration-1000',
              isInView ? 'opacity-100' : 'opacity-0'
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
              isInView ? 'opacity-100' : 'opacity-0'
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
