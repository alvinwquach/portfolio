import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 28. SPORTS CARD
 * Trading card style
 */
export function LogoSportsCard({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Sports Card"
    >
      {/* Card background */}
      <rect x="2" y="2" width="52" height="68" rx="4" fill="#FFF" stroke="#DDD" strokeWidth="1" />

      {/* Photo area */}
      <rect x="6" y="6" width="44" height="36" fill={WARRIORS.blue} />

      {/* Vinyl in photo area */}
      <circle cx="28" cy="24" r="14" fill="#111" />
      <circle cx="28" cy="24" r="10" fill="none" stroke="#222" strokeWidth="0.5" />
      <circle cx="28" cy="24" r="4" fill={WARRIORS.gold} />

      {/* Name plate */}
      <rect x="6" y="46" width="44" height="12" fill={NINERS.red} />
      <text x="28" y="55" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">ALVIN Q</text>

      {/* Stats area */}
      <text x="10" y="66" fill="#333" fontSize="5" fontFamily="sans-serif">CODE</text>
      <text x="28" y="66" fill="#333" fontSize="5" fontFamily="sans-serif">DJ</text>
      <text x="42" y="66" fill="#333" fontSize="5" fontFamily="sans-serif">BAY</text>

      {/* Code brackets as design element */}
      <path d="M8 24 L4 28 L8 32" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 24 L52 28 L48 32" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
