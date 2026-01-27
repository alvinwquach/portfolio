/**
 * Turntable Logo Component
 * ========================
 * Full turntable/DJ deck representation with the signature elements.
 *
 * Visual Concept
 * --------------
 * This logo shows a complete DJ turntable setup:
 * - Platter (vinyl) styled as a basketball
 * - Spindle styled as a football
 * - Code brackets positioned as the tonearm
 * - Turntable base in team colors
 *
 * The perspective is top-down, like looking at a real turntable.
 *
 * Differences from LogoSignature
 * ------------------------------
 * - More rectangular/turntable-shaped (not circular)
 * - Shows more DJ equipment context
 * - Pitch slider and other deck elements
 * - Better for horizontal layouts
 *
 * Use Cases
 * ---------
 * - DJ event posters
 * - Music-focused contexts
 * - Banner headers
 * - Business cards (landscape)
 */

import type { LogoProps } from './types';
import { WARRIORS, NINERS, NEUTRAL } from './colors';

export function LogoTurntable({ className, size = 64 }: LogoProps) {
  // Maintain 4:3 aspect ratio for turntable shape
  const width = size;
  const height = size * 0.75;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 96 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach turntable logo"
    >
      {/* ===========================================
          TURNTABLE BASE
          =========================================== */}
      {/* Main deck body */}
      <rect
        x="4"
        y="4"
        width="88"
        height="64"
        rx="6"
        fill={NEUTRAL.dark}
        stroke={NEUTRAL.border}
        strokeWidth="2"
      />

      {/* Split color accent line at top */}
      <rect x="4" y="4" width="44" height="4" rx="2" fill={WARRIORS.blue} opacity="0.7" />
      <rect x="48" y="4" width="44" height="4" rx="2" fill={NINERS.red} opacity="0.7" />

      {/* ===========================================
          PLATTER - Basketball Vinyl
          =========================================== */}
      {/* Platter ring */}
      <circle cx="36" cy="38" r="26" fill="#222" stroke="#333" strokeWidth="2" />

      {/* Vinyl/Basketball surface */}
      <circle cx="36" cy="38" r="22" fill={WARRIORS.gold} />

      {/* Vinyl grooves */}
      <circle cx="36" cy="38" r="18" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="36" cy="38" r="14" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="36" cy="38" r="10" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams */}
      <line x1="36" y1="16" x2="36" y2="60" stroke="#000" strokeWidth="1.5" opacity="0.3" />
      <line x1="14" y1="38" x2="58" y2="38" stroke="#000" strokeWidth="1.5" opacity="0.3" />
      <path d="M24 22 Q36 30 24 54" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M48 22 Q36 30 48 54" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.3" />

      {/* Football center label */}
      <ellipse cx="36" cy="38" rx="6" ry="4" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="0.5" />
      <line x1="36" y1="35" x2="36" y2="41" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="34" y1="36.5" x2="38" y2="36.5" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="34" y1="38" x2="38" y2="38" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="34" y1="39.5" x2="38" y2="39.5" stroke={NINERS.gold} strokeWidth="0.75" />

      {/* Spindle hole */}
      <circle cx="36" cy="38" r="1" fill="#111" />

      {/* ===========================================
          TONEARM - Code Bracket
          =========================================== */}
      {/* Tonearm base */}
      <circle cx="72" cy="20" r="6" fill="#333" stroke={WARRIORS.gold} strokeWidth="1" />

      {/* Tonearm as bracket shape */}
      <path
        d="M72 20 L66 38 L58 38"
        stroke={WARRIORS.gold}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Headshell/cartridge (bracket tip) */}
      <path
        d="M62 34 L56 38 L62 42"
        stroke={WARRIORS.gold}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Stylus */}
      <circle cx="56" cy="38" r="1.5" fill={NINERS.red} />

      {/* ===========================================
          CONTROLS SECTION
          =========================================== */}
      {/* Pitch slider */}
      <rect x="76" y="32" width="8" height="28" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="78" y="40" width="4" height="8" rx="1" fill={WARRIORS.gold} />

      {/* Play button */}
      <circle cx="80" cy="58" r="4" fill="#222" stroke={WARRIORS.gold} strokeWidth="1" />
      <polygon points="79,56 79,60 82,58" fill={WARRIORS.gold} />

      {/* ===========================================
          BRAND TEXT
          =========================================== */}
      <text x="80" y="16" textAnchor="middle" fill={WARRIORS.gold} fontSize="6" fontWeight="bold" fontFamily="monospace">AQ</text>
    </svg>
  );
}
