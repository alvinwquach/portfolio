import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 45. TEMPO SLIDER
 * Pitch/tempo fader inspired
 */
export function LogoTempoSlider({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Tempo Slider"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Tempo slider track */}
      <rect x="32" y="10" width="8" height="52" rx="4" fill="#1A1A1A" stroke="#333" strokeWidth="1" />

      {/* Slider markings */}
      <line x1="26" y1="18" x2="30" y2="18" stroke="#333" strokeWidth="1" />
      <line x1="26" y1="26" x2="30" y2="26" stroke="#333" strokeWidth="1" />
      <line x1="26" y1="36" x2="30" y2="36" stroke={WARRIORS.gold} strokeWidth="2" />
      <line x1="26" y1="46" x2="30" y2="46" stroke="#333" strokeWidth="1" />
      <line x1="26" y1="54" x2="30" y2="54" stroke="#333" strokeWidth="1" />

      {/* Percentage labels */}
      <text x="22" y="20" textAnchor="end" fill="#666" fontSize="5" fontFamily="monospace">+8</text>
      <text x="22" y="38" textAnchor="end" fill={WARRIORS.gold} fontSize="5" fontFamily="monospace">0</text>
      <text x="22" y="56" textAnchor="end" fill="#666" fontSize="5" fontFamily="monospace">-8</text>

      {/* Slider knob */}
      <rect x="30" y="30" width="12" height="12" rx="2" fill="#222" stroke={WARRIORS.gold} strokeWidth="2" />
      <line x1="33" y1="36" x2="39" y2="36" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Side vinyl indicators */}
      <circle cx="14" cy="36" r="8" fill="#111" stroke={WARRIORS.blue} strokeWidth="1" />
      <circle cx="14" cy="36" r="3" fill={WARRIORS.gold} />

      <circle cx="58" cy="36" r="8" fill="#111" stroke={NINERS.red} strokeWidth="1" />
      <circle cx="58" cy="36" r="3" fill={NINERS.gold} />

      {/* Code brackets */}
      <path d="M8 48 L4 54 L8 60" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M64 48 L68 54 L64 60" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
