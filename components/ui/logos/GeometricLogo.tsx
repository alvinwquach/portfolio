import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 12. GEOMETRIC MINIMAL
 * Clean geometric shapes, very minimal
 */
export function LogoGeometric({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Geometric"
    >
      {/* Background */}
      <rect x="2" y="2" width="60" height="60" fill="#0D1117" />

      {/* Geometric A */}
      <polygon points="20,48 32,16 44,48" fill="none" stroke={WARRIORS.gold} strokeWidth="2" />
      <line x1="24" y1="38" x2="40" y2="38" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Q as circle with tail */}
      <circle cx="32" cy="36" r="12" fill="none" stroke={NINERS.gold} strokeWidth="2" />
      <line x1="40" y1="44" x2="50" y2="54" stroke={NINERS.gold} strokeWidth="2" />

      {/* Bracket accents */}
      <path d="M8 26 L4 32 L8 38" stroke={WARRIORS.blue} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M56 26 L60 32 L56 38" stroke={NINERS.red} strokeWidth="1.5" strokeLinecap="round" />

      {/* Vinyl center dot */}
      <circle cx="32" cy="36" r="3" fill={WARRIORS.gold} />
    </svg>
  );
}
