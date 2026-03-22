/**
 * AnimatedText
 * ============
 * Reusable text-reveal component powered by GSAP SplitText.
 *
 * Design rule: NO fade-in ever.
 * Opacity-based reveals look cheap and read as "loading", not "arriving".
 * Every technique here is physical — text moves through space or is unmasked.
 *
 * Animations available:
 *   words-up   — words rise through a line-height overflow mask
 *   chars-up   — same mechanic, per character (use for short hero words only)
 *   lines-clip — lines unmasked top-to-bottom via clipPath (use for body copy)
 *   scale-in   — lines grow from scaleY:0 at the baseline (use for labels/captions)
 */

'use client';

import { useRef, createElement, type ElementType, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/* ─────────────────────────────────────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────────────────────────────────────── */

type AnimationType = 'words-up' | 'chars-up' | 'lines-clip' | 'scale-in';
type TriggerMode   = 'scroll' | 'load';

type ValidElement =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'p' | 'span' | 'div' | 'li' | 'blockquote' | 'label';

interface AnimatedTextProps {
  children:   ReactNode;
  /** HTML element to render. Default: 'div' */
  as?:        ValidElement;
  /** Which reveal technique to use. Default: 'words-up' */
  animation?: AnimationType;
  /**
   * 'scroll' — plays when element enters the viewport at top:85%.
   * 'load'   — plays immediately on mount (use for above-the-fold content).
   * Default: 'scroll'
   */
  trigger?:   TriggerMode;
  /** Extra delay in seconds before the animation starts. Default: 0 */
  delay?:     number;
  /**
   * Per-unit stagger in seconds. Each animation has a recommended default
   * (documented inline). Override here when rhythm needs tuning.
   */
  stagger?:   number;
  /** Total animation duration in seconds. Default varies per animation. */
  duration?:  number;
  className?: string;
  /** Inline styles forwarded to the rendered element. */
  style?:     React.CSSProperties;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────────────────────────────────────── */

export function AnimatedText({
  children,
  as        = 'div',
  animation = 'words-up',
  trigger   = 'scroll',
  delay     = 0,
  stagger,
  duration,
  className,
  style,
}: AnimatedTextProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el) return;

      // gsap.context() scopes all created tweens and ScrollTrigger instances.
      // OPTIMIZATION: SplitText created inside a context is tracked and
      // reverted automatically when ctx.revert() runs — prevents injected
      // spans from persisting across hot reloads or unmounts and breaking
      // SSR hydration on re-mount.
      const ctx = gsap.context(() => {
        animate(el, { animation, trigger, delay, stagger, duration });
      }, el);

      return () => ctx.revert();
    },
    // Re-run if any prop that changes the animation changes.
    // scope is not set here because rootRef IS the scope root.
    { dependencies: [animation, trigger, delay, stagger, duration] },
  );

  return createElement(as as ElementType, { ref: rootRef, className, style }, children);
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Core animation builder
 * ───────────────────────────────────────────────────────────────────────────── */

interface AnimateOptions {
  animation: AnimationType;
  trigger:   TriggerMode;
  delay:     number;
  stagger?:  number;
  duration?: number;
}

function animate(el: HTMLElement, opts: AnimateOptions): void {
  const { animation, trigger, delay, stagger: staggerOverride, duration: durationOverride } = opts;

  // Build a shared ScrollTrigger config for the 'scroll' trigger mode.
  // WHY top:85%: the animation plays as the user scrolls *toward* the element,
  // not after it has already centered in the viewport. Text that snaps to life
  // mid-read feels broken; text that arrives just before you reach it feels alive.
  const scrollTriggerVars: ScrollTrigger.Vars | undefined =
    trigger === 'scroll'
      ? {
          trigger:       el,
          start:         'top 85%',
          toggleActions: 'play none none none',
        }
      : undefined;

  switch (animation) {
    /* ──────────────────────────────────────────────────────────────────────
     * words-up
     * ──────────────────────────────────────────────────────────────────────
     * TECHNIQUE: SplitText wraps each word in a span. A second wrapping span
     *   (the "mask") on each line gets overflow:hidden, creating an invisible
     *   bottom-edge boundary. Words translate from y:30 (below boundary) to
     *   y:0 (fully visible). No opacity — the clip is the reveal.
     *
     * WHEN TO USE: headlines, section titles, any display text ≤ ~3 lines.
     *   Word-level stagger preserves natural reading rhythm better than
     *   char-level for longer phrases.
     *
     * DEFAULT STAGGER: 0.06 s — fast enough to feel like one motion,
     *   slow enough that each word lands with distinct weight.
     * ────────────────────────────────────────────────────────────────────── */
    case 'words-up': {
      const split = new SplitText(el, { type: 'lines,words' });

      // Apply the overflow mask to each split line, not the parent, so that
      // multi-line elements clip each line independently.
      split.lines.forEach((line) => {
        (line as HTMLElement).style.overflow = 'hidden';
        (line as HTMLElement).style.display  = 'block';
      });

      gsap.from(split.words, {
        y:           30,
        duration:    durationOverride ?? 0.75,
        stagger:     staggerOverride  ?? 0.06,
        ease:        'power3.out',
        delay,
        scrollTrigger: scrollTriggerVars,
      });
      break;
    }

    /* ──────────────────────────────────────────────────────────────────────
     * chars-up
     * ──────────────────────────────────────────────────────────────────────
     * TECHNIQUE: Same overflow-mask mechanic as words-up but split at the
     *   character level. Each character rises individually.
     *
     * WHEN TO USE: single short words or acronyms used as display type —
     *   role labels, hero eyebrows, stat numbers. Avoid on sentences longer
     *   than ~6 words; at char granularity the total stagger duration grows
     *   long and the reveal loses cohesion.
     *
     * DEFAULT STAGGER: 0.03 s — tight enough that it reads as one sweeping
     *   motion, loose enough that individual characters are distinguishable.
     * ────────────────────────────────────────────────────────────────────── */
    case 'chars-up': {
      const split = new SplitText(el, { type: 'lines,chars' });

      split.lines.forEach((line) => {
        (line as HTMLElement).style.overflow = 'hidden';
        (line as HTMLElement).style.display  = 'block';
      });

      gsap.from(split.chars, {
        y:        30,
        duration: durationOverride ?? 0.6,
        stagger:  staggerOverride  ?? 0.03,
        ease:     'power3.out',
        delay,
        scrollTrigger: scrollTriggerVars,
      });
      break;
    }

    /* ──────────────────────────────────────────────────────────────────────
     * lines-clip
     * ──────────────────────────────────────────────────────────────────────
     * TECHNIQUE: SplitText splits into lines. Each line is unmasked via
     *   clipPath: inset(0 0 100% 0) → inset(0 0 0% 0). The "wipe" travels
     *   upward — lines appear from the bottom edge of their own bounding box.
     *   No y translation; the element never moves, only its visible area grows.
     *
     * WHEN TO USE: body copy, long paragraphs, pull-quotes. The line-by-line
     *   rhythm matches natural reading direction. Prefer over words-up when
     *   there are > 3 lines — individual word motion at that scale reads as
     *   noise, not rhythm.
     *
     * DEFAULT STAGGER: 0.12 s — each line needs time to complete its wipe
     *   before the next begins, otherwise the overlap collapses the stagger
     *   into a single simultaneous reveal.
     * ────────────────────────────────────────────────────────────────────── */
    case 'lines-clip': {
      const split = new SplitText(el, { type: 'lines' });

      gsap.from(split.lines, {
        clipPath:  'inset(0 0 100% 0)',
        duration:  durationOverride ?? 0.7,
        stagger:   staggerOverride  ?? 0.12,
        ease:      'power2.inOut',
        delay,
        scrollTrigger: scrollTriggerVars,
      });
      break;
    }

    /* ──────────────────────────────────────────────────────────────────────
     * scale-in
     * ──────────────────────────────────────────────────────────────────────
     * TECHNIQUE: SplitText splits into lines. Each line scales from
     *   scaleY:0 to scaleY:1 with transformOrigin at 'bottom center' so
     *   the text grows upward from its own baseline — anchored to where it
     *   will ultimately sit, never floating into position from elsewhere.
     *
     * WHEN TO USE: eyebrows, captions, labels, UI micro-copy. The tight
     *   scale anchored at baseline reads as a "stamp" or "print" motion,
     *   distinct from the flowing waves of words-up / lines-clip. Do not use
     *   on body copy — scaleY deforms letterforms and hurts readability mid-
     *   animation for longer text.
     *
     * DEFAULT STAGGER: 0.08 s — slightly slower than chars-up because the
     *   scale motion covers a larger visual area and needs more breathing room
     *   between lines.
     * ────────────────────────────────────────────────────────────────────── */
    case 'scale-in': {
      const split = new SplitText(el, { type: 'lines' });

      gsap.set(split.lines, { transformOrigin: 'bottom center' });

      gsap.from(split.lines, {
        scaleY:   0,
        duration: durationOverride ?? 0.55,
        stagger:  staggerOverride  ?? 0.08,
        ease:     'power2.out',
        delay,
        scrollTrigger: scrollTriggerVars,
      });
      break;
    }
  }
}
