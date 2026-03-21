/**
 * Decision Section
 * ================
 * Visual: Branching paths - a decision tree that reveals on scroll.
 * Each branch represents a choice point, not a feature list.
 *
 * Feeling: Trade-offs made explicit. Every choice forecloses other choices.
 */

'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/hooks';

interface DecisionSectionProps {
  className?: string;
}

/**
 * Decision tree visualization - branches revealed with opacity
 */
function DecisionTree({ isVisible, progress }: { isVisible: boolean; progress: number }) {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 aspect-square opacity-25">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Root node */}
        <circle
          cx="50"
          cy="15"
          r="3"
          className={cn(
            'fill-foreground/30 transition-opacity duration-500',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* First level branches */}
        <line
          x1="50" y1="18"
          x2="30" y2="40"
          stroke="currentColor"
          strokeWidth="0.5"
          className={cn(
            'text-foreground/20 transition-opacity duration-500',
            isVisible && progress > 0.2 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '200ms' }}
        />
        <line
          x1="50" y1="18"
          x2="70" y2="40"
          stroke="currentColor"
          strokeWidth="0.5"
          className={cn(
            'text-foreground/20 transition-opacity duration-500',
            isVisible && progress > 0.2 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '300ms' }}
        />

        {/* First level nodes */}
        <circle
          cx="30"
          cy="42"
          r="2.5"
          className={cn(
            'fill-foreground/25 transition-opacity duration-500',
            isVisible && progress > 0.3 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '400ms' }}
        />
        <circle
          cx="70"
          cy="42"
          r="2.5"
          className={cn(
            'fill-foreground/25 transition-opacity duration-500',
            isVisible && progress > 0.3 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '500ms' }}
        />

        {/* Second level branches - left */}
        <line
          x1="30" y1="44"
          x2="18" y2="65"
          stroke="currentColor"
          strokeWidth="0.5"
          className={cn(
            'text-foreground/15 transition-opacity duration-500',
            isVisible && progress > 0.5 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '600ms' }}
        />
        <line
          x1="30" y1="44"
          x2="42" y2="65"
          stroke="currentColor"
          strokeWidth="0.5"
          className={cn(
            'text-foreground/15 transition-opacity duration-500',
            isVisible && progress > 0.5 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '700ms' }}
        />

        {/* Second level branches - right */}
        <line
          x1="70" y1="44"
          x2="58" y2="65"
          stroke="currentColor"
          strokeWidth="0.5"
          className={cn(
            'text-foreground/15 transition-opacity duration-500',
            isVisible && progress > 0.5 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '800ms' }}
        />
        <line
          x1="70" y1="44"
          x2="82" y2="65"
          stroke="currentColor"
          strokeWidth="0.5"
          className={cn(
            'text-foreground/15 transition-opacity duration-500',
            isVisible && progress > 0.5 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '900ms' }}
        />

        {/* Leaf nodes */}
        {[18, 42, 58, 82].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy="67"
            r="2"
            className={cn(
              'fill-foreground/20 transition-opacity duration-500',
              isVisible && progress > 0.7 ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: `${1000 + i * 100}ms` }}
          />
        ))}
      </svg>
    </div>
  );
}

export function DecisionSection({ className }: DecisionSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!ref.current || !isInView) return;

    const handleScroll = () => {
      const rect = ref.current!.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1,
        1 - (rect.top / viewportHeight)
      ));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView, ref]);

  return (
    <section
      ref={ref}
      className={cn('relative py-32 overflow-hidden', className)}
    >
      {/* Decision tree */}
      <DecisionTree isVisible={isInView} progress={scrollProgress} />

      <div className="container relative z-10">
        <div className="max-w-2xl ml-auto">
          {/* Section label */}
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-6">
            Philosophy
          </p>

          {/* The story */}
          <h2 className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
            Every choice forecloses other choices.
          </h2>

          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              Building AI agents taught me that automation isn't about doing more.
              It's about knowing when to pause.
            </p>

            <p className="leading-relaxed">
              OpportuniQ helps teams research and weigh DIY vs professional approaches,
              but the interesting part isn't the research—it's the decision points.
              When should you go deeper? When should you collaborate with your group?
              When is the research sufficient to make a call?
            </p>

            <p className="leading-relaxed text-foreground/70">
              Good systems make trade-offs explicit. They don't hide complexity—
              they make it navigable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
