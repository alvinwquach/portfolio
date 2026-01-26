/**
 * Competition Section
 * ===================
 * Visual: A single abstract arc - the curve of a shot trajectory.
 * Stats appear as quiet annotations, not dashboards.
 *
 * Feeling: Decision-making under uncertainty. The stakes are real,
 * but the interface stays calm.
 */

'use client';

import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CompetitionSectionProps {
  className?: string;
}

/**
 * Shot arc visualization - single curved line
 */
function ShotArc({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2/5 aspect-[2/1] opacity-20">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        {/* The arc - a parabolic curve suggesting trajectory */}
        <path
          d="M 20 80 Q 100 -20 180 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className={cn(
            'text-foreground/30 transition-all duration-1000',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            strokeDasharray: 300,
            strokeDashoffset: isVisible ? 0 : 300,
            transition: 'stroke-dashoffset 1.5s ease-out, opacity 0.5s ease-out',
          }}
        />

        {/* Apex point */}
        <circle
          cx="100"
          cy="20"
          r="2"
          className={cn(
            'fill-foreground/20 transition-opacity duration-500',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '1s' }}
        />
      </svg>
    </div>
  );
}

/**
 * Single stat annotation - appears quietly
 */
function StatAnnotation({
  value,
  label,
  delay,
  isVisible,
}: {
  value: string;
  label: string;
  delay: number;
  isVisible: boolean;
}) {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      // Simple count-up for numeric values
      const numericValue = parseInt(value.replace(/\D/g, ''));
      if (!isNaN(numericValue)) {
        let current = 0;
        const increment = numericValue / 30;
        const interval = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            setDisplayValue(value);
            clearInterval(interval);
          } else {
            setDisplayValue(Math.floor(current).toString() + value.replace(/\d/g, ''));
          }
        }, 50);
        return () => clearInterval(interval);
      } else {
        setDisplayValue(value);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <div
      className={cn(
        'transition-opacity duration-700',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="text-2xl md:text-3xl font-light text-foreground/80 tabular-nums">
        {displayValue}
      </p>
      <p className="text-sm text-muted-foreground/60">{label}</p>
    </div>
  );
}

export function CompetitionSection({ className }: CompetitionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn('relative py-32 overflow-hidden', className)}
    >
      {/* Shot arc */}
      <ShotArc isVisible={isVisible} />

      <div className="container relative z-10">
        <div className="max-w-2xl">
          {/* Section label */}
          <p className="text-sm text-muted-foreground/60 uppercase tracking-widest mb-6">
            Domain
          </p>

          {/* The story */}
          <h2 className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
            Basketball taught me to think in probabilities.
          </h2>

          <div className="space-y-6 text-muted-foreground mb-12">
            <p className="text-lg leading-relaxed">
              Fantasy sports is decision-making under uncertainty. You're reading
              probability surfaces, finding edges where others see noise.
            </p>

            <p className="leading-relaxed">
              I built Hoop Almanac to handle real-time drafts with 150 concurrent users.
              The system had to be calm under pressure—sub-100ms latency, no race conditions,
              graceful degradation when things went wrong.
            </p>

            <p className="leading-relaxed text-foreground/70">
              Prediction is cheap. What matters is how you respond when you're wrong.
            </p>
          </div>

          {/* Stats - quiet annotations */}
          <div className="flex gap-12">
            <StatAnnotation
              value="95ms"
              label="Latency"
              delay={800}
              isVisible={isVisible}
            />
            <StatAnnotation
              value="150"
              label="Concurrent users"
              delay={1000}
              isVisible={isVisible}
            />
            <StatAnnotation
              value="99.9%"
              label="Uptime"
              delay={1200}
              isVisible={isVisible}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
