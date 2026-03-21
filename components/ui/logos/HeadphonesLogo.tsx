import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 38. HEADPHONES
 * DJ headphones with team colors
 */
export function LogoHeadphones({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Headphones"
    >
      {/* Headband */}
      <path
        d="M12 36 Q12 12 36 12 Q60 12 60 36"
        stroke="#333"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M12 36 Q12 12 36 12 Q60 12 60 36"
        stroke="#1A1A1A"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left ear cup - Warriors */}
      <rect x="4" y="32" width="16" height="24" rx="4" fill="#1A1A1A" stroke={WARRIORS.blue} strokeWidth="2" />
      <circle cx="12" cy="44" r="6" fill={WARRIORS.gold} />
      <circle cx="12" cy="44" r="3" fill="#111" />
      <circle cx="12" cy="44" r="1" fill={WARRIORS.gold} />

      {/* Right ear cup - 49ers */}
      <rect x="52" y="32" width="16" height="24" rx="4" fill="#1A1A1A" stroke={NINERS.red} strokeWidth="2" />
      <circle cx="60" cy="44" r="6" fill={NINERS.gold} />
      <circle cx="60" cy="44" r="3" fill="#111" />
      <circle cx="60" cy="44" r="1" fill={NINERS.gold} />

      {/* Padding */}
      <rect x="8" y="36" width="8" height="16" rx="2" fill="#222" />
      <rect x="56" y="36" width="8" height="16" rx="2" fill="#222" />

      {/* Code brackets in center */}
      <path d="M28 40 L24 46 L28 52" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M44 40 L48 46 L44 52" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />

      {/* Vinyl hint */}
      <circle cx="36" cy="46" r="6" fill="none" stroke="#333" strokeWidth="1" />
      <circle cx="36" cy="46" r="2" fill={WARRIORS.gold} />
    </svg>
  );
}
