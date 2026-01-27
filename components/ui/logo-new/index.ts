/**
 * Logo Component Library
 * ======================
 *
 * A modular collection of logo components representing Alvin Quach's brand.
 *
 * Brand Elements
 * --------------
 * Each logo incorporates these core elements in different ways:
 *
 * 1. BASKETBALL AS VINYL
 *    - The vinyl record is styled with basketball seams
 *    - Represents Warriors fandom + DJ culture fusion
 *    - Orange/gold color palette
 *
 * 2. FOOTBALL AS SPINDLE
 *    - The center label/spindle is football-shaped
 *    - 49ers red with gold laces
 *    - Connects NorCal football pride to music
 *
 * 3. CODE BRACKETS AS TONEARMS
 *    - < > brackets extend as DJ tonearms
 *    - Left bracket: Warriors blue
 *    - Right bracket: 49ers red
 *    - Represents software engineering career
 *
 * 4. BAY AREA COLORS
 *    - Warriors: Blue (#1D428A) + Gold (#FDB927)
 *    - 49ers: Red (#AA0000) + Gold (#B3995D)
 *    - Shared gold unifies the palette
 *
 * File Structure
 * --------------
 * logo/
 * ├── index.ts           - This file (exports)
 * ├── types.ts           - TypeScript interfaces
 * ├── colors.ts          - Color constants
 * ├── LogoSignature.tsx  - Primary full-featured logo
 * ├── LogoSignatureAlt.tsx - Dark/muted variant
 * ├── LogoMinimal.tsx    - Small size variants
 * ├── LogoTurntable.tsx  - Full turntable representation
 * └── LogoBridge.tsx     - Bay Area bridge variant
 *
 * Usage Guide
 * -----------
 *
 * @example Primary logo for hero sections
 * ```tsx
 * import { LogoSignature } from '@/components/ui/logo';
 * <LogoSignature size={120} />
 * ```
 *
 * @example Navigation/header
 * ```tsx
 * import { LogoMinimal } from '@/components/ui/logo';
 * <LogoMinimal size={36} />
 * ```
 *
 * @example Favicon
 * ```tsx
 * import { LogoMark } from '@/components/ui/logo';
 * <LogoMark size={32} />
 * ```
 *
 * @example DJ/music context
 * ```tsx
 * import { LogoTurntable } from '@/components/ui/logo';
 * <LogoTurntable size={80} />
 * ```
 *
 * @example Bay Area emphasis
 * ```tsx
 * import { LogoBridge } from '@/components/ui/logo';
 * <LogoBridge size={64} />
 * ```
 *
 * Sizing Guidelines
 * -----------------
 * - 16-24px: Use LogoMark only
 * - 24-40px: Use LogoMinimal
 * - 40-80px: Use LogoSignatureAlt or variants
 * - 80px+: Use LogoSignature for full detail
 *
 * Accessibility
 * -------------
 * All logos include:
 * - aria-label describing the logo
 * - role="img" implicit from SVG
 * - Sufficient color contrast
 */

// ===========================================
// TYPE EXPORTS
// ===========================================
export type { LogoProps, AnimatedLogoProps, ThemableLogoProps } from './types';

// ===========================================
// COLOR EXPORTS
// ===========================================
export { WARRIORS, NINERS, NEUTRAL } from './colors';
export type { ColorPalette } from './colors';

// ===========================================
// COMPONENT EXPORTS
// ===========================================

/**
 * Primary signature logo - full detail, all elements
 * Best for: Hero sections, large displays, profile pictures
 */
export { LogoSignature } from './LogoSignature';

/**
 * Alternative signature - darker, more subdued
 * Best for: Dark backgrounds, professional contexts
 */
export { LogoSignatureAlt } from './LogoSignatureAlt';

/**
 * Minimal logo - simplified for small sizes
 * Best for: Navigation, buttons, small UI elements
 */
export { LogoMinimal, LogoMark } from './LogoMinimal';

/**
 * Turntable logo - full DJ deck representation
 * Best for: Music/DJ contexts, horizontal layouts
 */
export { LogoTurntable } from './LogoTurntable';

/**
 * Bridge logo - Bay Area bridge with signature elements
 * Best for: Local Bay Area content, location contexts
 */
export { LogoBridge } from './LogoBridge';
