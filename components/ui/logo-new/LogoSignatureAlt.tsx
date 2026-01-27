/**
 * Signature Logo - Alternative Variant
 * =====================================
 * A darker, more subdued version of the signature logo.
 *
 * Use Cases
 * ---------
 * - Dark backgrounds where the full-color version is too bright
 * - Professional contexts (resumes, LinkedIn)
 * - Monochrome print materials
 * - When the logo shouldn't compete with other content
 *
 * Visual Differences from LogoSignature
 * -------------------------------------
 * 1. Dark vinyl background instead of team color split
 * 2. Basketball seams are more subtle (gold instead of black)
 * 3. Football center uses muted gold tones
 * 4. Brackets use gold instead of team colors
 * 5. Overall more cohesive, less "loud"
 *
 * Same Conceptual Elements
 * ------------------------
 * - Basketball-styled vinyl record
 * - Football-shaped center spindle
 * - Code brackets as tonearms
 * - Warriors/49ers gold accent unification
 */

import type { LogoProps } from './types';
import { WARRIORS, NINERS, NEUTRAL } from './colors';

export function LogoSignatureAlt({ className, size = 64 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach signature logo - alternative dark variant"
    >
      {/* ===========================================
          BACKGROUND - Dark with gold accent
          =========================================== */}
      <circle cx="40" cy="40" r="38" fill={NEUTRAL.dark} stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Subtle team color inner glow */}
      <circle cx="40" cy="40" r="36" fill="none" stroke={WARRIORS.blue} strokeWidth="1" opacity="0.3" />
      <circle cx="40" cy="40" r="34" fill="none" stroke={NINERS.red} strokeWidth="1" opacity="0.3" />

      {/* ===========================================
          VINYL RECORD - Muted Basketball Style
          =========================================== */}
      {/* Main vinyl surface - dark with gold tint */}
      <circle cx="40" cy="40" r="24" fill="#1a1a1a" stroke={WARRIORS.gold} strokeWidth="1" />

      {/* Vinyl grooves */}
      <circle cx="40" cy="40" r="20" fill="none" stroke="#333" strokeWidth="0.5" />
      <circle cx="40" cy="40" r="16" fill="none" stroke="#333" strokeWidth="0.5" />
      <circle cx="40" cy="40" r="12" fill="none" stroke="#333" strokeWidth="0.5" />

      {/* Basketball seams - gold on dark vinyl */}
      <line x1="40" y1="16" x2="40" y2="64" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.4" />
      <line x1="16" y1="40" x2="64" y2="40" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.4" />

      {/* Basketball seams - curved lines */}
      <path
        d="M28 24 Q40 32 28 56"
        stroke={WARRIORS.gold}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M52 24 Q40 32 52 56"
        stroke={WARRIORS.gold}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />

      {/* ===========================================
          CENTER LABEL - Football Shaped (Muted)
          =========================================== */}
      <ellipse
        cx="40"
        cy="40"
        rx="8"
        ry="5"
        fill={NINERS.gold}
        stroke={WARRIORS.gold}
        strokeWidth="0.5"
      />

      {/* Football laces */}
      <line x1="40" y1="36" x2="40" y2="44" stroke="#000" strokeWidth="1" opacity="0.5" />
      <line x1="37" y1="38" x2="43" y2="38" stroke="#000" strokeWidth="0.75" opacity="0.5" />
      <line x1="37" y1="40" x2="43" y2="40" stroke="#000" strokeWidth="0.75" opacity="0.5" />
      <line x1="37" y1="42" x2="43" y2="42" stroke="#000" strokeWidth="0.75" opacity="0.5" />

      {/* Spindle hole */}
      <circle cx="40" cy="40" r="1.5" fill="#111" />

      {/* ===========================================
          TONEARMS - Gold Code Brackets
          =========================================== */}
      {/* Left bracket tonearm */}
      <path
        d="M14 30 L6 40 L14 50"
        stroke={WARRIORS.gold}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="14" y1="40" x2="20" y2="40" stroke={WARRIORS.gold} strokeWidth="1.5" />
      <circle cx="20" cy="40" r="1.5" fill={WARRIORS.gold} />

      {/* Right bracket tonearm */}
      <path
        d="M66 30 L74 40 L66 50"
        stroke={NINERS.gold}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="66" y1="40" x2="60" y2="40" stroke={NINERS.gold} strokeWidth="1.5" />
      <circle cx="60" cy="40" r="1.5" fill={NINERS.gold} />

      {/* ===========================================
          TEAM INDICATORS - Subtle dots
          =========================================== */}
      <circle cx="16" cy="16" r="3" fill={WARRIORS.blue} opacity="0.6" />
      <circle cx="64" cy="16" r="3" fill={NINERS.red} opacity="0.6" />
    </svg>
  );
}
