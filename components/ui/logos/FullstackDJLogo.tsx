import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 50. FULLSTACK DJ
 * Multi-layer representation showing all elements stacked
 */
export function LogoFullstackDJ({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach fullstack DJ logo"
    >
      {/* Background */}
      <rect x="2" y="2" width="68" height="68" rx="6" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Layer indicator dots instead of text labels */}
      <circle cx="8" cy="14" r="2" fill={WARRIORS.blue} />
      <circle cx="8" cy="36" r="2" fill={WARRIORS.gold} />
      <circle cx="8" cy="58" r="2" fill={NINERS.red} />

      {/* Top layer - Code brackets (Frontend) */}
      <rect x="30" y="6" width="36" height="16" rx="2" fill="#161B22" stroke={WARRIORS.blue} strokeWidth="1" />
      <path d="M36 10 L32 14 L36 18" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M54 10 L58 14 L54 18" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
      <text x="45" y="16" textAnchor="middle" fill="#79C0FF" fontSize="6" fontFamily="monospace">/</text>

      {/* Middle layer - Basketball/Vinyl (Backend/Logic) */}
      <rect x="30" y="26" width="36" height="20" rx="2" fill="#161B22" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="48" cy="36" r="8" fill={WARRIORS.gold} />
      <line x1="48" y1="28" x2="48" y2="44" stroke="#000" strokeWidth="0.75" opacity="0.3" />
      <line x1="40" y1="36" x2="56" y2="36" stroke="#000" strokeWidth="0.75" opacity="0.3" />
      <path d="M44 31 Q48 34 44 41" stroke="#000" strokeWidth="0.75" fill="none" opacity="0.3" />
      <path d="M52 31 Q48 34 52 41" stroke="#000" strokeWidth="0.75" fill="none" opacity="0.3" />
      <circle cx="48" cy="36" r="2" fill={NINERS.red} />

      {/* Bottom layer - Football (Database/Foundation) */}
      <rect x="30" y="50" width="36" height="16" rx="2" fill="#161B22" stroke={NINERS.red} strokeWidth="1" />
      <ellipse cx="48" cy="58" rx="12" ry="5" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="1" />
      <line x1="48" y1="54" x2="48" y2="62" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="43" y1="56" x2="53" y2="56" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="43" y1="58" x2="53" y2="58" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="43" y1="60" x2="53" y2="60" stroke={NINERS.gold} strokeWidth="0.75" />

      {/* Connection lines */}
      <line x1="48" y1="22" x2="48" y2="26" stroke={WARRIORS.gold} strokeWidth="1" strokeDasharray="2 1" />
      <line x1="48" y1="46" x2="48" y2="50" stroke={NINERS.gold} strokeWidth="1" strokeDasharray="2 1" />
    </svg>
  );
}
