import { LogoProps } from './colors';

/**
 * Minimal mark for small spaces
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
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
      <path d="M11 10L5 16L11 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan" />
      <path d="M21 10L27 16L21 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan" />
      <circle cx="16" cy="16" r="2" className="fill-amber" />
    </svg>
  );
}
