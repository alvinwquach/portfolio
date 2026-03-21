import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 40. SAMPLE PAD
 * MPC/drum machine pad grid
 */
export function LogoSamplePad({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Sample Pad"
    >
      {/* Device body */}
      <rect x="4" y="4" width="64" height="64" rx="6" fill="#0D1117" stroke="#30363D" strokeWidth="2" />

      {/* 4x4 pad grid */}
      {/* Row 1 */}
      <rect x="10" y="10" width="11" height="11" rx="2" fill={WARRIORS.gold} opacity="0.9" />
      <rect x="25" y="10" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="40" y="10" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="55" y="10" width="11" height="11" rx="2" fill={NINERS.red} opacity="0.9" />

      {/* Row 2 */}
      <rect x="10" y="25" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="25" y="25" width="11" height="11" rx="2" fill={WARRIORS.blue} opacity="0.9" />
      <rect x="40" y="25" width="11" height="11" rx="2" fill={NINERS.gold} opacity="0.9" />
      <rect x="55" y="25" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />

      {/* Row 3 */}
      <rect x="10" y="40" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="25" y="40" width="11" height="11" rx="2" fill={NINERS.gold} opacity="0.9" />
      <rect x="40" y="40" width="11" height="11" rx="2" fill={WARRIORS.blue} opacity="0.9" />
      <rect x="55" y="40" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />

      {/* Row 4 */}
      <rect x="10" y="55" width="11" height="11" rx="2" fill={NINERS.red} opacity="0.9" />
      <rect x="25" y="55" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="40" y="55" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="55" y="55" width="11" height="11" rx="2" fill={WARRIORS.gold} opacity="0.9" />

      {/* Center vinyl overlay */}
      <circle cx="36" cy="36" r="6" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="36" cy="36" r="2" fill={WARRIORS.gold} />
    </svg>
  );
}
