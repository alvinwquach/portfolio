/**
 * Logo Color Palette
 * ==================
 * Official team colors and brand colors used across all logo variants.
 *
 * Color Sources:
 * - Warriors: https://teamcolorcodes.com/golden-state-warriors-color-codes/
 * - 49ers: https://teamcolorcodes.com/san-francisco-49ers-color-codes/
 *
 * Design Philosophy:
 * ------------------
 * The color palette represents Alvin's Bay Area identity:
 * - Warriors Blue/Gold: Basketball fandom, Bay Area pride
 * - 49ers Red/Gold: Football fandom, NorCal roots
 *
 * The shared gold between both teams creates visual harmony
 * and represents the unified Bay Area sports culture.
 */

/** Golden State Warriors official colors */
export const WARRIORS = {
  /** Primary blue - jerseys, branding */
  blue: '#1D428A',
  /** Gold accent - "The Town" pride */
  gold: '#FDB927',
} as const;

/** San Francisco 49ers official colors */
export const NINERS = {
  /** Primary red - "Faithful" red */
  red: '#AA0000',
  /** Metallic gold - championship heritage */
  gold: '#B3995D',
} as const;

/** Neutral colors for backgrounds and accents */
export const NEUTRAL = {
  /** Dark background - GitHub dark theme inspired */
  dark: '#0D1117',
  /** Slightly lighter dark */
  darkAlt: '#161B22',
  /** Border color */
  border: '#30363D',
  /** Vinyl black */
  vinyl: '#111111',
  /** Vinyl groove */
  groove: '#1a1a1a',
} as const;

/** Type for the color palette */
export type ColorPalette = {
  warriors: typeof WARRIORS;
  niners: typeof NINERS;
  neutral: typeof NEUTRAL;
};
