import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 35. CDJ DISPLAY
 * Digital DJ player screen aesthetic
 */
export function LogoCDJDisplay({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - CDJ Display"
    >
      {/* CDJ body */}
      <rect x="4" y="4" width="64" height="64" rx="6" fill="#0D1117" stroke="#30363D" strokeWidth="2" />

      {/* Display screen */}
      <rect x="10" y="10" width="52" height="32" rx="2" fill="#000" stroke="#222" strokeWidth="1" />

      {/* Waveform display */}
      <path
        d="M14 26 L18 20 L22 30 L26 18 L30 28 L34 22 L38 32 L42 16 L46 28 L50 24 L54 26 L58 22"
        stroke={WARRIORS.gold}
        strokeWidth="2"
        fill="none"
      />
      <line x1="36" y1="14" x2="36" y2="38" stroke={NINERS.red} strokeWidth="1" />

      {/* BPM display */}
      <text x="16" y="20" fill="#0F0" fontSize="6" fontFamily="monospace">128.0</text>
      <text x="44" y="20" fill={WARRIORS.gold} fontSize="5" fontFamily="monospace">BPM</text>

      {/* Jog wheel */}
      <circle cx="36" cy="54" r="12" fill="#111" stroke="#333" strokeWidth="1" />
      <circle cx="36" cy="54" r="8" fill="none" stroke="#222" strokeWidth="0.5" />
      <circle cx="36" cy="54" r="3" fill={WARRIORS.gold} />

      {/* Indicator dot on jog wheel */}
      <circle cx="36" cy="46" r="2" fill={NINERS.red} />

      {/* Play/cue buttons */}
      <rect x="10" y="48" width="8" height="8" rx="1" fill={WARRIORS.blue} />
      <polygon points="12,50 12,54 16,52" fill="#FFF" />
      <rect x="54" y="48" width="8" height="8" rx="1" fill={NINERS.red} />

      {/* Code brackets */}
      <path d="M6 30 L2 36 L6 42" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M66 30 L70 36 L66 42" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
