import { LogoProps } from './colors';

/**
 * 22. OUTLINE ONLY
 * Pure linework, no fills
 */
export function LogoOutline({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Outline"
    >
      {/* Outer circle */}
      <circle cx="36" cy="36" r="34" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />

      {/* Vinyl */}
      <circle cx="36" cy="36" r="18" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
      <circle cx="36" cy="36" r="12" stroke="currentColor" strokeWidth="0.75" className="text-muted-foreground" />
      <circle cx="36" cy="36" r="6" stroke="currentColor" strokeWidth="0.75" className="text-muted-foreground" />
      <circle cx="36" cy="36" r="2" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />

      {/* Tonearm */}
      <path d="M36 36 L48 24 L52 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-foreground" />

      {/* Code brackets */}
      <path d="M10 28 L4 36 L10 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground" />
      <path d="M62 28 L68 36 L62 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground" />
    </svg>
  );
}
