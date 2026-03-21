import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 14. STICKER/PATCH
 * Embroidered patch or sticker style
 */
export function LogoSticker({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Sticker"
    >
      {/* Sticker background with slight shadow */}
      <ellipse cx="36" cy="38" rx="32" ry="30" fill="#000" opacity="0.2" />
      <circle cx="36" cy="36" r="32" fill="#FAFAFA" stroke="#E0E0E0" strokeWidth="2" />

      {/* Inner circle */}
      <circle cx="36" cy="36" r="28" fill="none" stroke={WARRIORS.gold} strokeWidth="3" strokeDasharray="4 2" />

      {/* Vinyl record */}
      <circle cx="36" cy="36" r="16" fill="#222" />
      <circle cx="36" cy="36" r="12" stroke="#333" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="8" stroke="#333" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="4" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="1.5" fill="#222" />

      {/* Tonearm */}
      <path d="M36 36 L46 26 L50 28" stroke="#222" strokeWidth="2" strokeLinecap="round" />

      {/* Code brackets */}
      <path d="M12 30 L6 36 L12 42" stroke={WARRIORS.blue} strokeWidth="3" strokeLinecap="round" />
      <path d="M60 30 L66 36 L60 42" stroke={NINERS.red} strokeWidth="3" strokeLinecap="round" />

      {/* Text banner */}
      <rect x="14" y="54" width="44" height="10" rx="2" fill={WARRIORS.gold} />
      <text x="36" y="62" textAnchor="middle" fill="#000" fontSize="7" fontWeight="bold" fontFamily="sans-serif">BAY AREA</text>

      {/* Sport icons */}
      <circle cx="18" cy="18" r="6" fill={WARRIORS.blue} />
      <circle cx="54" cy="18" r="6" fill={NINERS.red} />
    </svg>
  );
}
