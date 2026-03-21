import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 17. WAVEFORM
 * Audio waveform style
 */
export function LogoWaveform({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Waveform"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Waveform bars */}
      <rect x="12" y="30" width="3" height="12" fill={WARRIORS.blue} />
      <rect x="17" y="24" width="3" height="24" fill={WARRIORS.blue} />
      <rect x="22" y="18" width="3" height="36" fill={WARRIORS.gold} />
      <rect x="27" y="22" width="3" height="28" fill={WARRIORS.gold} />
      <rect x="32" y="14" width="3" height="44" fill={WARRIORS.gold} />
      <rect x="37" y="20" width="3" height="32" fill={NINERS.gold} />
      <rect x="42" y="16" width="3" height="40" fill={NINERS.gold} />
      <rect x="47" y="24" width="3" height="24" fill={NINERS.red} />
      <rect x="52" y="28" width="3" height="16" fill={NINERS.red} />
      <rect x="57" y="32" width="3" height="8" fill={NINERS.red} />

      {/* Vinyl center overlay */}
      <circle cx="36" cy="36" r="8" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="36" cy="36" r="3" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M8 28 L4 36 L8 44" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M64 28 L68 36 L64 44" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
