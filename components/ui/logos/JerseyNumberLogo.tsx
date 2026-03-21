import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 24. JERSEY NUMBER
 * Sports jersey style with number
 */
export function LogoJerseyNumber({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Jersey"
    >
      {/* Jersey shape */}
      <path
        d="M20 8 L8 16 L8 64 L28 64 L28 24 L44 24 L44 64 L64 64 L64 16 L52 8 L44 14 L28 14 Z"
        fill={WARRIORS.blue}
        stroke={WARRIORS.gold}
        strokeWidth="2"
      />

      {/* Number - using "1" as a placeholder */}
      <text x="36" y="52" textAnchor="middle" fill={WARRIORS.gold} fontSize="28" fontWeight="bold" fontFamily="sans-serif">1</text>

      {/* Vinyl hint in background */}
      <circle cx="36" cy="44" r="14" fill="none" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.3" />

      {/* Code bracket accents on sleeves */}
      <path d="M12 28 L8 34 L12 40" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 28 L64 34 L60 40" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
