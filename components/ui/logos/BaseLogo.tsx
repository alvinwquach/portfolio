import { LogoProps } from './colors';

/**
 * Base Logo - Simple code brackets with vinyl
 */
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
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30" />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/20" />
      <path d="M18 16L10 24L18 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan" />
      <path d="M30 16L38 24L30 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan" />
      <path d="M27 17L21 31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-amber" />
      <circle cx="24" cy="24" r="4" className="fill-amber/20" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="1.5" className="fill-amber" />
    </svg>
  );
}
