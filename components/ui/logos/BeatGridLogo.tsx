import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 32. BEAT GRID
 * Music production beat sequencer style
 */
export function LogoBeatGrid({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Beat Grid"
    >
      {/* Background */}
      <rect x="2" y="2" width="68" height="68" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Beat grid - 4x4 */}
      {/* Row 1 */}
      <rect x="8" y="8" width="12" height="12" rx="2" fill={WARRIORS.gold} />
      <rect x="24" y="8" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="40" y="8" width="12" height="12" rx="2" fill={NINERS.red} />
      <rect x="56" y="8" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />

      {/* Row 2 */}
      <rect x="8" y="24" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="24" y="24" width="12" height="12" rx="2" fill={WARRIORS.blue} />
      <rect x="40" y="24" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="56" y="24" width="12" height="12" rx="2" fill={NINERS.gold} />

      {/* Row 3 */}
      <rect x="8" y="40" width="12" height="12" rx="2" fill={WARRIORS.gold} />
      <rect x="24" y="40" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="40" y="40" width="12" height="12" rx="2" fill={NINERS.red} />
      <rect x="56" y="40" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />

      {/* Row 4 */}
      <rect x="8" y="56" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="24" y="56" width="12" height="12" rx="2" fill={WARRIORS.blue} />
      <rect x="40" y="56" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="56" y="56" width="12" height="12" rx="2" fill={NINERS.gold} />

      {/* Vinyl center overlay */}
      <circle cx="36" cy="36" r="8" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="1.5" />
      <circle cx="36" cy="36" r="3" fill={WARRIORS.gold} />
    </svg>
  );
}
