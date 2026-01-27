/**
 * Logo Component Types
 * ====================
 * Shared TypeScript interfaces for all logo components.
 *
 * Design Decision: Why separate types file?
 * -----------------------------------------
 * 1. Single source of truth for logo prop interfaces
 * 2. Enables consistent API across all logo variants
 * 3. Makes it easy to extend with new props (e.g., animated)
 * 4. Allows consumers to type their own logo wrappers
 */

/**
 * Base props shared by all logo components.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LogoSignature size={64} />
 *
 * // With custom class
 * <LogoSignature size={48} className="hover:scale-110 transition-transform" />
 * ```
 */
export interface LogoProps {
  /**
   * Additional CSS classes to apply to the SVG element.
   * Useful for animations, hover effects, or layout adjustments.
   */
  className?: string;

  /**
   * Logo size in pixels. Applied to both width and height.
   * Default varies by logo type (typically 32px for icons, 64px for display).
   *
   * Common sizes:
   * - 24px: Inline text, favicons
   * - 32px: Navigation, buttons
   * - 48px: Cards, list items
   * - 64px: Hero sections, headers
   * - 96px+: Landing pages, splash screens
   */
  size?: number;
}

/**
 * Extended props for animated logo variants.
 * Reserved for future use with GSAP or Framer Motion.
 */
export interface AnimatedLogoProps extends LogoProps {
  /** Whether the logo should animate on mount */
  animate?: boolean;
  /** Animation delay in milliseconds */
  delay?: number;
}

/**
 * Props for logo variants that support theming.
 * Used by logos that adapt to light/dark mode.
 */
export interface ThemableLogoProps extends LogoProps {
  /** Force a specific color scheme regardless of system preference */
  colorScheme?: 'light' | 'dark' | 'auto';
}
