import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 25. VINYL ONLY
 * Pure vinyl record focus
 */
export function LogoVinylOnly({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Vinyl"
    >
      {/* Vinyl record */}
      <circle cx="36" cy="36" r="34" fill="#111" stroke="#333" strokeWidth="1" />

      {/* Grooves */}
      <circle cx="36" cy="36" r="30" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="26" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="22" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />

      {/* Label */}
      <circle cx="36" cy="36" r="10" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="8" fill="none" stroke={NINERS.red} strokeWidth="1" />
      <text x="36" y="34" textAnchor="middle" fill="#000" fontSize="6" fontWeight="bold" fontFamily="sans-serif">AQ</text>
      <text x="36" y="42" textAnchor="middle" fill="#000" fontSize="4" fontFamily="sans-serif">BAY AREA</text>

      {/* Center hole */}
      <circle cx="36" cy="36" r="2" fill="#111" />

      {/* Light reflection */}
      <path d="M20 20 Q30 25 25 35" stroke="#333" strokeWidth="0.5" fill="none" opacity="0.5" />
    </svg>
  );
}
