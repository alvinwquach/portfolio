import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 15. MONOGRAM SHIELD
 * Classic shield with AQ monogram
 */
export function LogoMonogramShield({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Shield"
    >
      {/* Shield shape */}
      <path
        d="M32 4 L56 12 L56 32 C56 48 32 60 32 60 C32 60 8 48 8 32 L8 12 Z"
        fill="#0D1117"
        stroke={WARRIORS.gold}
        strokeWidth="2"
      />

      {/* Split colors */}
      <path d="M32 4 L32 60 L8 48 C8 48 8 32 8 32 L8 12 Z" fill={WARRIORS.blue} opacity="0.3" />
      <path d="M32 4 L56 12 L56 32 C56 48 32 60 32 60 Z" fill={NINERS.red} opacity="0.3" />

      {/* AQ Monogram */}
      <text x="32" y="38" textAnchor="middle" fill={WARRIORS.gold} fontSize="20" fontWeight="bold" fontFamily="serif">AQ</text>

      {/* Vinyl hint */}
      <circle cx="32" cy="32" r="18" fill="none" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.3" />

      {/* Code brackets at bottom */}
      <path d="M16 48 L12 52 L16 56" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 48 L52 52 L48 56" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
