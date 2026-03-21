/**
 * Skip to Content Link
 * ====================
 * Accessibility feature for keyboard navigation
 * Allows users to skip directly to main content
 */

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[100]
        bg-cyan text-white
        px-4 py-2 rounded-md
        font-medium text-sm
        focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2
        transition-transform duration-200
        focus:translate-y-0 -translate-y-full
      "
    >
      Skip to main content
    </a>
  );
}
