import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 41. CROSSFADER
 * Isolated crossfader with team colors
 */
export function LogoCrossfader({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Crossfader"
    >
      {/* Background circle */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Crossfader track */}
      <rect x="12" y="30" width="48" height="12" rx="6" fill="#1A1A1A" stroke="#333" strokeWidth="1" />

      {/* Track gradient - Warriors to 49ers */}
      <rect x="14" y="32" width="20" height="8" rx="4" fill={WARRIORS.blue} opacity="0.3" />
      <rect x="38" y="32" width="20" height="8" rx="4" fill={NINERS.red} opacity="0.3" />

      {/* Crossfader knob */}
      <rect x="30" y="26" width="12" height="20" rx="3" fill="#222" stroke={WARRIORS.gold} strokeWidth="2" />
      <rect x="34" y="30" width="4" height="12" rx="1" fill={WARRIORS.gold} />

      {/* Position markers */}
      <line x1="20" y1="46" x2="20" y2="50" stroke={WARRIORS.blue} strokeWidth="2" />
      <line x1="36" y1="46" x2="36" y2="50" stroke={WARRIORS.gold} strokeWidth="2" />
      <line x1="52" y1="46" x2="52" y2="50" stroke={NINERS.red} strokeWidth="2" />

      {/* Labels */}
      <text x="20" y="58" textAnchor="middle" fill={WARRIORS.blue} fontSize="6" fontWeight="bold">A</text>
      <text x="52" y="58" textAnchor="middle" fill={NINERS.red} fontSize="6" fontWeight="bold">B</text>

      {/* Vinyl hint above */}
      <circle cx="36" cy="16" r="6" fill="#111" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="36" cy="16" r="2" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M8 32 L4 36 L8 40" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M64 32 L68 36 L64 40" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
