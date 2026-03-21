import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 27. HEXAGON
 * Hexagonal shape
 */
export function LogoHexagon({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Hexagon"
    >
      {/* Hexagon background */}
      <polygon
        points="36,4 64,20 64,52 36,68 8,52 8,20"
        fill="#0D1117"
        stroke={WARRIORS.gold}
        strokeWidth="2"
      />

      {/* Inner hexagon */}
      <polygon
        points="36,14 54,26 54,46 36,58 18,46 18,26"
        fill="none"
        stroke={WARRIORS.blue}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Vinyl in center */}
      <circle cx="36" cy="36" r="12" fill="#111" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="36" cy="36" r="8" fill="none" stroke="#333" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="4" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="1.5" fill="#111" />

      {/* Tonearm */}
      <path d="M36 36 L48 24" stroke={WARRIORS.gold} strokeWidth="1.5" />
      <circle cx="48" cy="24" r="2" fill={NINERS.red} />

      {/* Code brackets */}
      <path d="M16 32 L12 36 L16 40" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M56 32 L60 36 L56 40" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
