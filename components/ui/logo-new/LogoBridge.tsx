/**
 * Bay Bridge Logo Component
 * =========================
 * Incorporates the Bay Area bridge silhouette with the signature elements.
 *
 * Visual Concept
 * --------------
 * The suspension bridge represents Bay Area roots:
 * - Left tower in Warriors blue
 * - Right tower in 49ers red
 * - Gold suspension cables
 * - Basketball vinyl integrated as the "setting sun"
 * - Football as vinyl center
 * - Code brackets frame the entire scene
 *
 * Symbolism
 * ---------
 * The bridge connects two shores (East Bay and SF),
 * just like Alvin bridges:
 * - Software engineering + DJ culture
 * - Warriors + 49ers fandom
 * - Code + creativity
 *
 * Use Cases
 * ---------
 * - Local Bay Area events
 * - "About" or "Location" sections
 * - Bay Area-themed content
 * - Business cards with SF focus
 */

import type { LogoProps } from './types';
import { WARRIORS, NINERS, NEUTRAL } from './colors';

export function LogoBridge({ className, size = 64 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach Bay Bridge logo"
    >
      {/* ===========================================
          BACKGROUND
          =========================================== */}
      <circle cx="40" cy="40" r="38" fill={NEUTRAL.dark} stroke={WARRIORS.gold} strokeWidth="2" />

      {/* ===========================================
          BRIDGE STRUCTURE
          =========================================== */}
      {/* Road deck */}
      <rect x="8" y="50" width="64" height="4" fill={NEUTRAL.border} />

      {/* Left tower - Warriors blue */}
      <rect x="18" y="24" width="6" height="30" fill={WARRIORS.blue} />
      <rect x="16" y="22" width="10" height="4" fill={WARRIORS.gold} />

      {/* Right tower - 49ers red */}
      <rect x="56" y="24" width="6" height="30" fill={NINERS.red} />
      <rect x="54" y="22" width="10" height="4" fill={NINERS.gold} />

      {/* Main suspension cables */}
      <path
        d="M8 46 Q21 16, 40 16 Q59 16, 72 46"
        stroke={WARRIORS.gold}
        strokeWidth="2.5"
        fill="none"
      />

      {/* Vertical suspender cables */}
      <line x1="26" y1="26" x2="26" y2="50" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.6" />
      <line x1="34" y1="20" x2="34" y2="50" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.6" />
      <line x1="40" y1="16" x2="40" y2="50" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.6" />
      <line x1="46" y1="20" x2="46" y2="50" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.6" />
      <line x1="54" y1="26" x2="54" y2="50" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.6" />

      {/* ===========================================
          VINYL "SUN" - Basketball Style
          Behind the bridge, like a setting sun
          =========================================== */}
      <circle cx="40" cy="32" r="12" fill={WARRIORS.gold} opacity="0.9" />

      {/* Basketball seams on sun */}
      <line x1="40" y1="20" x2="40" y2="44" stroke="#000" strokeWidth="1" opacity="0.2" />
      <line x1="28" y1="32" x2="52" y2="32" stroke="#000" strokeWidth="1" opacity="0.2" />
      <path d="M34 24 Q40 28 34 40" stroke="#000" strokeWidth="1" fill="none" opacity="0.2" />
      <path d="M46 24 Q40 28 46 40" stroke="#000" strokeWidth="1" fill="none" opacity="0.2" />

      {/* Football center */}
      <ellipse cx="40" cy="32" rx="4" ry="2.5" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="0.5" />
      <line x1="40" y1="30" x2="40" y2="34" stroke={NINERS.gold} strokeWidth="0.75" />

      {/* ===========================================
          CODE BRACKETS - Frame the scene
          =========================================== */}
      {/* Left bracket */}
      <path
        d="M10 30 L4 40 L10 50"
        stroke={WARRIORS.blue}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Right bracket */}
      <path
        d="M70 30 L76 40 L70 50"
        stroke={NINERS.red}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ===========================================
          WATER REFLECTION HINT
          =========================================== */}
      <path
        d="M12 58 Q26 62 40 58 Q54 54 68 58"
        stroke={WARRIORS.blue}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}
