import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 39. BASS DROP
 * Subwoofer/bass speaker inspired
 */
export function LogoBassDrop({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Bass Drop"
    >
      {/* Speaker cabinet */}
      <rect x="8" y="8" width="56" height="56" rx="4" fill="#0D1117" stroke="#333" strokeWidth="2" />

      {/* Speaker cone outer */}
      <circle cx="36" cy="36" r="24" fill="#1A1A1A" stroke="#333" strokeWidth="2" />

      {/* Cone ridges */}
      <circle cx="36" cy="36" r="20" fill="none" stroke="#222" strokeWidth="1" />
      <circle cx="36" cy="36" r="16" fill="none" stroke="#222" strokeWidth="1" />
      <circle cx="36" cy="36" r="12" fill="none" stroke="#222" strokeWidth="1" />

      {/* Dust cap */}
      <circle cx="36" cy="36" r="8" fill="#111" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Bass vibration waves */}
      <circle cx="36" cy="36" r="28" fill="none" stroke={WARRIORS.blue} strokeWidth="1" opacity="0.5" />
      <circle cx="36" cy="36" r="32" fill="none" stroke={NINERS.red} strokeWidth="1" opacity="0.3" />

      {/* Center - vinyl label style */}
      <circle cx="36" cy="36" r="4" fill={WARRIORS.gold} />
      <text x="36" y="38" textAnchor="middle" fill="#000" fontSize="4" fontWeight="bold">AQ</text>

      {/* Code brackets */}
      <path d="M4 32 L0 36 L4 40" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M68 32 L72 36 L68 40" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
