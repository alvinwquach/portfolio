import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 43. BPM COUNTER
 * Digital BPM display
 */
export function LogoBPMCounter({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - BPM Counter"
    >
      {/* Background */}
      <rect x="4" y="12" width="64" height="48" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="2" />

      {/* Display screen */}
      <rect x="10" y="18" width="52" height="24" rx="2" fill="#000" stroke="#222" strokeWidth="1" />

      {/* BPM number - 7-segment style */}
      <text x="36" y="36" textAnchor="middle" fill={WARRIORS.gold} fontSize="20" fontWeight="bold" fontFamily="monospace">128</text>

      {/* BPM label */}
      <text x="36" y="50" textAnchor="middle" fill="#666" fontSize="8" fontFamily="sans-serif">BPM</text>

      {/* Beat indicators */}
      <circle cx="16" cy="52" r="4" fill={WARRIORS.gold} />
      <circle cx="28" cy="52" r="4" fill="#222" stroke="#333" strokeWidth="1" />
      <circle cx="44" cy="52" r="4" fill="#222" stroke="#333" strokeWidth="1" />
      <circle cx="56" cy="52" r="4" fill={NINERS.red} />

      {/* Tempo sync indicator */}
      <rect x="10" y="44" width="8" height="4" rx="1" fill={WARRIORS.blue} opacity="0.8" />
      <text x="14" y="47" textAnchor="middle" fill="#FFF" fontSize="3" fontFamily="sans-serif">SYNC</text>

      {/* Vinyl hint */}
      <circle cx="54" cy="22" r="4" fill="#111" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="54" cy="22" r="1.5" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M4 32 L0 38 L4 44" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M68 32 L72 38 L68 44" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
