/**
 * Signature Logo Component
 * ========================
 * The primary logo that best represents Alvin's brand identity.
 *
 * Brand Story
 * -----------
 * This logo tells a visual story of Alvin's identity:
 *
 * 1. BASKETBALL AS VINYL RECORD
 *    - The vinyl record is styled like a basketball with seams
 *    - Represents the fusion of Warriors fandom + DJ culture
 *    - Orange color references both basketball and vinyl warmth
 *
 * 2. FOOTBALL AS VINYL SPINDLE
 *    - The center spindle/label is shaped like a football
 *    - 49ers red and gold colors
 *    - The laces detail makes it unmistakably a football
 *
 * 3. CODE BRACKETS AS TONEARMS
 *    - < > brackets extend from the vinyl like DJ tonearms
 *    - Left bracket in Warriors blue, right in 49ers red
 *    - Represents software engineering career
 *    - The brackets "read" the record, like code reads data
 *
 * 4. BAY AREA PRIDE
 *    - Color split: Warriors blue/gold left, 49ers red/gold right
 *    - Unified by the shared gold accent
 *
 * Technical Implementation
 * ------------------------
 * - Pure SVG with no external dependencies
 * - Scales cleanly from 24px to 200px+
 * - Uses team colors from centralized palette
 * - All elements are geometric for crisp rendering
 *
 * Usage
 * -----
 * This is the recommended logo for:
 * - Portfolio hero section
 * - Social media profile pictures
 * - Business cards and resumes
 * - Anywhere the "full" brand should appear
 *
 * @example
 * ```tsx
 * // Hero section
 * <LogoSignature size={120} />
 *
 * // Navigation
 * <LogoSignature size={40} className="hover:rotate-12 transition-transform" />
 * ```
 */

import type { LogoProps } from './types';
import { WARRIORS, NINERS } from './colors';

export function LogoSignature({ className, size = 64 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach signature logo - basketball vinyl with code bracket tonearms"
    >
      {/* ===========================================
          BACKGROUND - Split Warriors/49ers
          =========================================== */}
      <defs>
        <clipPath id="leftHalfSig">
          <rect x="0" y="0" width="40" height="80" />
        </clipPath>
        <clipPath id="rightHalfSig">
          <rect x="40" y="0" width="40" height="80" />
        </clipPath>
      </defs>

      {/* Outer circle - Warriors blue base */}
      <circle cx="40" cy="40" r="38" fill={WARRIORS.blue} />
      {/* Right half - 49ers red */}
      <circle cx="40" cy="40" r="38" fill={NINERS.red} clipPath="url(#rightHalfSig)" />
      {/* Gold border unifying both halves */}
      <circle cx="40" cy="40" r="38" fill="none" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* ===========================================
          VINYL RECORD - Basketball Styled
          =========================================== */}
      {/* Main vinyl surface */}
      <circle cx="40" cy="40" r="24" fill={WARRIORS.gold} />

      {/* Vinyl grooves - darker rings */}
      <circle cx="40" cy="40" r="20" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="40" cy="40" r="16" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="40" cy="40" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams - vertical line */}
      <line x1="40" y1="16" x2="40" y2="64" stroke="#000" strokeWidth="1.5" opacity="0.3" />

      {/* Basketball seams - horizontal line */}
      <line x1="16" y1="40" x2="64" y2="40" stroke="#000" strokeWidth="1.5" opacity="0.3" />

      {/* Basketball seams - curved lines (left) */}
      <path
        d="M28 24 Q40 32 28 56"
        stroke="#000"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />

      {/* Basketball seams - curved lines (right) */}
      <path
        d="M52 24 Q40 32 52 56"
        stroke="#000"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />

      {/* ===========================================
          CENTER LABEL - Football Shaped
          =========================================== */}
      {/* Football shape (ellipse rotated) */}
      <ellipse
        cx="40"
        cy="40"
        rx="8"
        ry="5"
        fill={NINERS.red}
        stroke={NINERS.gold}
        strokeWidth="1"
      />

      {/* Football laces - center line */}
      <line x1="40" y1="36" x2="40" y2="44" stroke={NINERS.gold} strokeWidth="1.5" />

      {/* Football laces - horizontal stitches */}
      <line x1="37" y1="38" x2="43" y2="38" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="37" y1="40" x2="43" y2="40" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="37" y1="42" x2="43" y2="42" stroke={NINERS.gold} strokeWidth="1" />

      {/* Spindle hole */}
      <circle cx="40" cy="40" r="1.5" fill="#111" />

      {/* ===========================================
          TONEARMS - Code Brackets
          Left bracket (Warriors blue) reads from left
          Right bracket (49ers red) reads from right
          =========================================== */}

      {/* Left bracket tonearm - < shape */}
      <path
        d="M14 30 L6 40 L14 50"
        stroke={WARRIORS.blue}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Tonearm connection line from bracket to vinyl */}
      <line x1="14" y1="40" x2="20" y2="40" stroke={WARRIORS.blue} strokeWidth="2" />
      {/* Stylus/needle at vinyl edge */}
      <circle cx="20" cy="40" r="2" fill={WARRIORS.gold} />

      {/* Right bracket tonearm - > shape */}
      <path
        d="M66 30 L74 40 L66 50"
        stroke={NINERS.red}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Tonearm connection line from bracket to vinyl */}
      <line x1="66" y1="40" x2="60" y2="40" stroke={NINERS.red} strokeWidth="2" />
      {/* Stylus/needle at vinyl edge */}
      <circle cx="60" cy="40" r="2" fill={NINERS.gold} />

      {/* ===========================================
          TEAM INDICATORS - Subtle corner accents
          =========================================== */}
      {/* Warriors indicator - top left */}
      <circle cx="16" cy="16" r="4" fill={WARRIORS.gold} opacity="0.8" />

      {/* 49ers indicator - top right */}
      <circle cx="64" cy="16" r="4" fill={NINERS.gold} opacity="0.8" />
    </svg>
  );
}
