import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 4. TECHY / MODERN
 * Futuristic, digital, circuit-board aesthetic
 * Neon accents, geometric
 */
export function LogoTechy({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Techy"
    >
      {/* Dark tech background */}
      <rect x="2" y="2" width="68" height="68" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Circuit board lines */}
      <path d="M10 20 L20 20 L20 10" stroke="#30363D" strokeWidth="1" />
      <path d="M62 20 L52 20 L52 10" stroke="#30363D" strokeWidth="1" />
      <path d="M10 52 L20 52 L20 62" stroke="#30363D" strokeWidth="1" />
      <path d="M62 52 L52 52 L52 62" stroke="#30363D" strokeWidth="1" />

      {/* Glowing bridge - neon effect */}
      <path
        d="M10 42 C10 42, 24 26, 36 26 C48 26, 62 42, 62 42"
        stroke={WARRIORS.blue}
        strokeWidth="3"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M10 42 C10 42, 24 26, 36 26 C48 26, 62 42, 62 42"
        stroke={WARRIORS.gold}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Tower nodes */}
      <rect x="20" y="24" width="4" height="22" fill={WARRIORS.blue} opacity="0.3" />
      <rect x="21" y="25" width="2" height="20" fill={WARRIORS.gold} />
      <rect x="48" y="24" width="4" height="22" fill={NINERS.red} opacity="0.3" />
      <rect x="49" y="25" width="2" height="20" fill={NINERS.gold} />

      {/* Digital road deck */}
      <rect x="10" y="44" width="52" height="2" fill={WARRIORS.gold} />
      <rect x="10" y="44" width="52" height="2" fill={NINERS.red} opacity="0.5" />

      {/* Hexagonal vinyl - tech aesthetic */}
      <polygon
        points="36,28 44,32 44,40 36,44 28,40 28,32"
        fill="#161B22"
        stroke={WARRIORS.gold}
        strokeWidth="1.5"
      />
      <circle cx="36" cy="36" r="4" fill={NINERS.red} opacity="0.8" />
      <circle cx="36" cy="36" r="2" fill={WARRIORS.gold} />

      {/* Tonearm as data connection */}
      <path d="M36 36 L44 30" stroke={WARRIORS.gold} strokeWidth="1.5" />
      <circle cx="44" cy="30" r="2" fill={WARRIORS.gold} />
      <path d="M44 30 L50 26 L52 28" stroke="#30363D" strokeWidth="1" />

      {/* Code brackets - terminal style */}
      <path d="M16 30 L10 36 L16 42" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="square" />
      <path d="M56 30 L62 36 L56 42" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="square" />

      {/* Status indicators */}
      <circle cx="14" cy="14" r="3" fill={WARRIORS.gold} opacity="0.8" />
      <circle cx="58" cy="14" r="3" fill={NINERS.red} opacity="0.8" />

      {/* Binary/data hint */}
      <text x="22" y="60" fill="#30363D" fontSize="6" fontFamily="monospace">01</text>
      <text x="44" y="60" fill="#30363D" fontSize="6" fontFamily="monospace">10</text>
    </svg>
  );
}
