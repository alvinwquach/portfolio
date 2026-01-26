/**
 * Animation Timing Utilities
 * ==========================
 * DJ-inspired timing constants for consistent animation pacing
 *
 * The timing system is based on musical concepts:
 * - MICRO: Quick hits, like hi-hats (1/8th beat)
 * - BEAT: Standard movement, like a kick drum (1/2 beat)
 * - MEASURE: Smooth transitions, like a full bar (1 beat)
 * - PHRASE: Dramatic reveals, like a verse (2 beats)
 */

// Core timing constants (in seconds)
export const TIMING = {
  /** Quick hits - hover states, micro-interactions (125ms) */
  MICRO: 0.125,

  /** Standard movement - buttons, small transitions (500ms) */
  BEAT: 0.5,

  /** Smooth transitions - sections, modals (1000ms) */
  MEASURE: 1.0,

  /** Dramatic reveals - hero, page transitions (2000ms) */
  PHRASE: 2.0,
} as const;

// Millisecond versions for JavaScript APIs
export const TIMING_MS = {
  MICRO: TIMING.MICRO * 1000,
  BEAT: TIMING.BEAT * 1000,
  MEASURE: TIMING.MEASURE * 1000,
  PHRASE: TIMING.PHRASE * 1000,
} as const;

// Easing functions
export const EASING = {
  /** Smooth ease out - most animations */
  OUT: 'power2.out',

  /** Smooth ease in - exits */
  IN: 'power2.in',

  /** Smooth ease in-out - page transitions */
  IN_OUT: 'power2.inOut',

  /** Elastic bounce - playful interactions */
  ELASTIC: 'elastic.out(1, 0.3)',

  /** Back ease - overshoot */
  BACK: 'back.out(1.7)',

  /** Expo ease - dramatic */
  EXPO: 'expo.out',

  /** Linear - scrolling, progress */
  LINEAR: 'none',
} as const;

// CSS timing variables for use in stylesheets
export const CSS_TIMING_VARS = `
  --timing-micro: ${TIMING.MICRO}s;
  --timing-beat: ${TIMING.BEAT}s;
  --timing-measure: ${TIMING.MEASURE}s;
  --timing-phrase: ${TIMING.PHRASE}s;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  --ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
`;

// Stagger patterns for sequential animations
export const STAGGER = {
  /** Fast stagger - lists, grids */
  FAST: 0.05,

  /** Normal stagger - cards, items */
  NORMAL: 0.1,

  /** Slow stagger - sections */
  SLOW: 0.2,
} as const;

// Stagger helper functions
export const STAGGER_FUNCTIONS = {
  /** From center outward */
  fromCenter: (amount: number = STAGGER.NORMAL) => ({
    amount,
    from: 'center' as const,
  }),

  /** From edges inward */
  fromEdges: (amount: number = STAGGER.NORMAL) => ({
    amount,
    from: 'edges' as const,
  }),

  /** Random order */
  random: (amount: number = STAGGER.NORMAL) => ({
    amount,
    from: 'random' as const,
  }),
} as const;

// Scroll trigger defaults
export const SCROLL_TRIGGER = {
  /** Start when element enters viewport */
  START: 'top 85%',

  /** End when element leaves viewport */
  END: 'top 20%',

  /** Toggle actions for enter/leave */
  TOGGLE_ACTIONS: 'play none none reverse',

  /** Once - play only once */
  ONCE: 'play none none none',
} as const;

/**
 * Create GSAP animation defaults
 */
export function createAnimationDefaults() {
  return {
    duration: TIMING.BEAT,
    ease: EASING.OUT,
  };
}

/**
 * Create scroll trigger config
 */
export function createScrollTrigger(
  trigger: string | Element,
  options?: {
    start?: string;
    end?: string;
    once?: boolean;
    scrub?: boolean | number;
    markers?: boolean;
  }
) {
  return {
    trigger,
    start: options?.start ?? SCROLL_TRIGGER.START,
    end: options?.end ?? SCROLL_TRIGGER.END,
    toggleActions: options?.once ? SCROLL_TRIGGER.ONCE : SCROLL_TRIGGER.TOGGLE_ACTIONS,
    scrub: options?.scrub,
    markers: options?.markers ?? false,
  };
}

/**
 * Calculate delay based on index for staggered animations
 */
export function staggerDelay(index: number, pattern: keyof typeof STAGGER = 'NORMAL'): number {
  return index * STAGGER[pattern];
}
