/**
 * Rhythm Section
 * ==============
 * "Reading the room before reading the code"
 *
 * Visual: Horizontal waveform-like lines that pulse gently with scroll.
 * Not a literal turntable - that's decoration. This is about timing and pacing.
 *
 * Feeling: You understand time as material. You've felt a room respond to pacing.
 */

'use client';

import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface RhythmSectionProps {
  className?: string;
}

/**
 * Waveform visualization - subtle horizontal lines that pulse
 */
function WaveformLines({ isVisible }: { isVisible: boolean }) {
  const lineCount = 5;

  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-48 opacity-20">
      <div className="relative h-full flex flex-col justify-center gap-3">
        {Array.from({ length: lineCount }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-px bg-gradient-to-r from-transparent via-foreground/40 to-transparent',
              'transition-all duration-1000',
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            )}
            style={{
              transitionDelay: `${i * 100}ms`,
              width: `${60 + Math.sin(i * 0.8) * 30}%`,
              marginLeft: `${10 + Math.cos(i * 0.5) * 10}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function RhythmSection({ className }: RhythmSectionProps) {
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
      {/* Waveform accent */}
      <WaveformLines isVisible={isVisible} />

      <div className="container relative z-10">
        <div className="max-w-2xl">
          {/* Section label - understated */}
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-6">
            Background
          </p>

          {/* The story */}
          <h2 className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
            I learned systems thinking in nightclubs.
          </h2>

          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              DJing isn't about playing songs. It's about sensing energy, anticipating shifts,
              knowing when to build tension and when to release it.
            </p>

            <p className="leading-relaxed">
              You're debugging crowd dynamics in real-time. Reading the room before
              you read the tracklist. That's the same skill that makes good software—understanding
              context before reaching for solutions.
            </p>

            <p className="leading-relaxed text-foreground/70">
              Now I build interfaces the same way. Pacing matters. Silence matters.
              Knowing when <em>not</em> to animate is as important as knowing when to.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
