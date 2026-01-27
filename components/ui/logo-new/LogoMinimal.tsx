/**
 * Minimal Logo Component
 * ======================
 * Simplified version for small sizes and constrained spaces.
 *
 * When to Use
 * -----------
 * - Favicon (16x16, 32x32)
 * - Mobile navigation (24-32px)
 * - Tab icons
 * - Loading spinners
 * - Watermarks
 *
 * Design Simplifications
 * ----------------------
 * At small sizes, detail is lost. This version:
 * 1. Removes basketball seam details
 * 2. Simplifies football to a filled ellipse
 * 3. Reduces bracket stroke weights
 * 4. Removes team color indicators
 *
 * The core concept remains:
 * - Vinyl circle
 * - Football center
 * - Code bracket accents
 *
 * Scaling Behavior
 * ----------------
 * - 16-24px: Icon barely recognizable, brackets dominate
 * - 24-32px: Sweet spot for this variant
 * - 32-48px: Use LogoSignatureAlt instead
 * - 48px+: Use LogoSignature for full detail
 */

import type { LogoProps } from './types';
import { WARRIORS, NINERS } from './colors';

export function LogoMinimal({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - minimal"
    >
      {/* Outer ring */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-muted-foreground/30"
      />

      {/* Vinyl circle */}
      <circle
        cx="24"
        cy="24"
        r="14"
        fill="none"
        stroke={WARRIORS.gold}
        strokeWidth="1.5"
      />

      {/* Inner groove hint */}
      <circle
        cx="24"
        cy="24"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-muted-foreground/20"
      />

      {/* Football center */}
      <ellipse
        cx="24"
        cy="24"
        rx="5"
        ry="3"
        fill={NINERS.red}
      />
      {/* Single lace line */}
      <line x1="24" y1="21.5" x2="24" y2="26.5" stroke={NINERS.gold} strokeWidth="1" />

      {/* Left bracket */}
      <path
        d="M10 18 L4 24 L10 30"
        stroke={WARRIORS.blue}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Right bracket */}
      <path
        d="M38 18 L44 24 L38 30"
        stroke={NINERS.red}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Extra-minimal mark for very small spaces.
 * Just brackets and a dot - no vinyl detail.
 */
export function LogoMark({ className, size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AQ"
    >
      {/* Subtle outer ring */}
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-muted-foreground/30"
      />

      {/* Left bracket - Warriors blue */}
      <path
        d="M11 10 L5 16 L11 22"
        stroke={WARRIORS.blue}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Right bracket - 49ers red */}
      <path
        d="M21 10 L27 16 L21 22"
        stroke={NINERS.red}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Center dot - gold */}
      <circle cx="16" cy="16" r="2.5" fill={WARRIORS.gold} />
    </svg>
  );
}
