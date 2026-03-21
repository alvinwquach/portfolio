import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 31. DJ MIXER
 * Mixing console with faders and crossfader
 */
export function LogoDJMixer({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - DJ Mixer"
    >
      {/* Mixer body */}
      <rect x="4" y="8" width="64" height="56" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Channel strips */}
      {/* Left channel - Warriors */}
      <rect x="10" y="14" width="18" height="40" rx="2" fill="#161B22" stroke={WARRIORS.blue} strokeWidth="1" />
      <rect x="16" y="18" width="6" height="24" rx="1" fill="#222" />
      <rect x="16" y="30" width="6" height="12" fill={WARRIORS.gold} />
      <circle cx="19" cy="46" r="4" fill={WARRIORS.blue} stroke={WARRIORS.gold} strokeWidth="1" />

      {/* Right channel - 49ers */}
      <rect x="44" y="14" width="18" height="40" rx="2" fill="#161B22" stroke={NINERS.red} strokeWidth="1" />
      <rect x="50" y="18" width="6" height="24" rx="1" fill="#222" />
      <rect x="50" y="22" width="6" height="20" fill={NINERS.red} />
      <circle cx="53" cy="46" r="4" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="1" />

      {/* Crossfader in center */}
      <rect x="30" y="48" width="12" height="8" rx="2" fill="#222" stroke="#444" strokeWidth="1" />
      <rect x="34" y="50" width="4" height="4" rx="1" fill={WARRIORS.gold} />

      {/* Center VU meters */}
      <rect x="32" y="16" width="3" height="20" fill="#222" />
      <rect x="32" y="26" width="3" height="10" fill="#00FF00" />
      <rect x="37" y="16" width="3" height="20" fill="#222" />
      <rect x="37" y="24" width="3" height="12" fill="#00FF00" />

      {/* Code brackets as EQ knobs */}
      <path d="M14 58 L10 62 L14 66" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M58 58 L62 62 L58 66" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
