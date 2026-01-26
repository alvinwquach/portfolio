/**
 * Logo Component
 * ==============
 * Personal brand combining:
 * - Code brackets </> (developer)
 * - Vinyl record/turntable ring (DJ)
 * - The blend of technical + creative
 */

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo"
    >
      {/* Vinyl record outer ring */}
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-muted-foreground/30"
      />

      {/* Vinyl grooves - subtle */}
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke="currentColor"
        strokeWidth="1"
        className="text-muted-foreground/20"
      />
      <circle
        cx="24"
        cy="24"
        r="14"
        stroke="currentColor"
        strokeWidth="1"
        className="text-muted-foreground/20"
      />

      {/* Code bracket < */}
      <path
        d="M18 16L10 24L18 32"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-cyan"
      />

      {/* Code bracket > */}
      <path
        d="M30 16L38 24L30 32"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-cyan"
      />

      {/* Center slash / */}
      <path
        d="M27 17L21 31"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-amber"
      />

      {/* Vinyl center label - the "spindle" */}
      <circle
        cx="24"
        cy="24"
        r="4"
        className="fill-amber/20"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="24"
        cy="24"
        r="1.5"
        className="fill-amber"
      />
    </svg>
  );
}

/**
 * Alternate minimal version for smaller spaces
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
      {/* Vinyl ring hint */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="currentColor"
        strokeWidth="1"
        className="text-muted-foreground/30"
      />

      {/* Code brackets */}
      <path
        d="M11 10L5 16L11 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-cyan"
      />
      <path
        d="M21 10L27 16L21 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-cyan"
      />

      {/* Center dot */}
      <circle
        cx="16"
        cy="16"
        r="2"
        className="fill-amber"
      />
    </svg>
  );
}
