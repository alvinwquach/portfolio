import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 42. VINYL CRATE
 * Record crate/collection view
 */
export function LogoVinylCrate({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Vinyl Crate"
    >
      {/* Crate body */}
      <path
        d="M8 20 L8 60 L64 60 L64 20 L8 20"
        fill="#1A1A1A"
        stroke="#333"
        strokeWidth="2"
      />

      {/* Crate front panel */}
      <rect x="8" y="50" width="56" height="10" fill="#222" stroke="#333" strokeWidth="1" />

      {/* Records in crate - visible spines */}
      <rect x="12" y="22" width="2" height="28" fill={WARRIORS.blue} />
      <rect x="16" y="22" width="2" height="28" fill={WARRIORS.gold} />
      <rect x="20" y="22" width="2" height="28" fill="#333" />
      <rect x="24" y="22" width="2" height="28" fill={NINERS.red} />
      <rect x="28" y="22" width="2" height="28" fill={NINERS.gold} />
      <rect x="32" y="22" width="2" height="28" fill="#333" />
      <rect x="36" y="22" width="2" height="28" fill={WARRIORS.blue} />
      <rect x="40" y="22" width="2" height="28" fill="#333" />
      <rect x="44" y="22" width="2" height="28" fill={WARRIORS.gold} />
      <rect x="48" y="22" width="2" height="28" fill={NINERS.red} />
      <rect x="52" y="22" width="2" height="28" fill="#333" />
      <rect x="56" y="22" width="2" height="28" fill={NINERS.gold} />

      {/* Featured record pulled up */}
      <rect x="30" y="8" width="16" height="16" rx="2" fill={WARRIORS.gold} stroke="#333" strokeWidth="1" />
      <circle cx="38" cy="16" r="5" fill="#111" />
      <circle cx="38" cy="16" r="2" fill={NINERS.red} />

      {/* Code brackets on crate */}
      <path d="M12 54 L8 57 L12 60" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 54 L64 57 L60 60" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
