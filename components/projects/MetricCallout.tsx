/**
 * MetricCallout
 * =============
 * Large before→after number display with a count-up animation.
 *
 * WHY COUNT-UP: The eye is drawn to movement. A number climbing toward its
 * final value creates anticipation — the user waits for it to land, which
 * means they read and remember the result. A static number is skipped.
 *
 * TECHNIQUE: GSAP proxy object animation.
 *   A plain object { before: 0, after: 0 } is tweened by GSAP. onUpdate
 *   writes Math.round(proxy.value) directly to the DOM via textContent —
 *   NOT useState — so React never re-renders on each animation frame.
 *   At 60 fps that is 90 prevented re-renders over 1.5 s.
 *
 * SCROLL TRIGGER: plays once when the card enters at top:85%.
 *   toggleActions: 'play none none none' — count-up only happens on first
 *   entry. Replaying on every scroll-back would feel like a slot machine.
 */

'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

interface MetricCalloutProps {
  /** Baseline value (before the improvement) */
  before:    number;
  /** Achieved value (after the improvement) */
  after:     number;
  /** Short description shown below the numbers, e.g. "Response time" */
  label:     string;
  /** Optional unit prefix, e.g. "$" */
  prefix?:   string;
  /** Optional unit suffix, e.g. "%", "ms", "×" */
  suffix?:   string;
  /**
   * Whether a LOWER after value is better (e.g. latency, error rate).
   * Controls whether 'after' is highlighted in success (improvement) or
   * left in the default accent.
   * Default: false (higher is better).
   */
  lowerIsBetter?: boolean;
  className?: string;
}

function formatNum(n: number, prefix = '', suffix = ''): string {
  return `${prefix}${n.toLocaleString()}${suffix}`;
}

export function MetricCallout({
  before,
  after,
  label,
  prefix  = '',
  suffix  = '',
  lowerIsBetter = false,
  className,
}: MetricCalloutProps) {
  const rootRef   = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLSpanElement>(null);
  const afterRef  = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el || !beforeRef.current || !afterRef.current) return;

      // Proxy object — GSAP animates its numeric properties.
      // Math.round on every frame keeps displayed integers crisp.
      const proxy = { before: 0, after: 0 };

      gsap.to(proxy, {
        before,
        after,
        duration: 1.5,
        ease:     'power2.out',
        onUpdate() {
          if (beforeRef.current) {
            beforeRef.current.textContent = formatNum(Math.round(proxy.before), prefix, suffix);
          }
          if (afterRef.current) {
            afterRef.current.textContent = formatNum(Math.round(proxy.after), prefix, suffix);
          }
        },
        scrollTrigger: {
          trigger:       el,
          start:         'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: rootRef, dependencies: [before, after, prefix, suffix] },
  );

  // Determine which side represents improvement.
  const afterIsImprovement = lowerIsBetter ? after < before : after > before;

  return (
    <div
      ref={rootRef}
      className={cn(
        'flex flex-col items-center gap-2 p-6 rounded-xl border bg-card/50 text-center',
        className,
      )}
    >
      {/* Numbers row ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">

        {/* BEFORE — muted baseline */}
        <div className="flex flex-col items-center">
          <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Before
          </span>
          <span
            ref={beforeRef}
            className="text-3xl md:text-4xl font-bold tabular-nums text-muted-foreground"
            aria-label={`Before: ${formatNum(before, prefix, suffix)}`}
          >
            {/* Populated by GSAP onUpdate — initial text avoids layout shift */}
            {formatNum(0, prefix, suffix)}
          </span>
        </div>

        {/* Arrow */}
        <span className="text-muted-foreground/40 text-xl mt-4" aria-hidden="true">→</span>

        {/* AFTER — highlighted result */}
        <div className="flex flex-col items-center">
          <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            After
          </span>
          <span
            ref={afterRef}
            className={cn(
              'text-3xl md:text-4xl font-bold tabular-nums',
              afterIsImprovement ? 'text-success' : 'text-foreground',
            )}
            aria-label={`After: ${formatNum(after, prefix, suffix)}`}
          >
            {formatNum(0, prefix, suffix)}
          </span>
        </div>
      </div>

      {/* Label ────────────────────────────────────────────────────────────── */}
      <p className="text-xs text-muted-foreground max-w-[12rem] leading-snug">{label}</p>
    </div>
  );
}
