import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 48. SPORTS DJ FUSION
 * Sports arena scoreboard meets DJ deck
 */
export function LogoSportsDJFusion({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach sports DJ fusion logo"
    >
      {/* Arena jumbotron shape */}
      <rect x="4" y="4" width="72" height="72" rx="4" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Split background - arena style */}
      <rect x="4" y="4" width="36" height="72" fill={WARRIORS.blue} opacity="0.15" />
      <rect x="40" y="4" width="36" height="72" fill={NINERS.red} opacity="0.15" />

      {/* Center line */}
      <line x1="40" y1="4" x2="40" y2="76" stroke={WARRIORS.gold} strokeWidth="1" strokeDasharray="4 2" />

      {/* Large vinyl/basketball combo - main focus */}
      <circle cx="40" cy="40" r="24" fill={WARRIORS.gold} />
      <circle cx="40" cy="40" r="20" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="40" cy="40" r="16" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="40" cy="40" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams - more prominent */}
      <line x1="40" y1="16" x2="40" y2="64" stroke="#8B4513" strokeWidth="2" opacity="0.5" />
      <line x1="16" y1="40" x2="64" y2="40" stroke="#8B4513" strokeWidth="2" opacity="0.5" />
      <path d="M28 22 Q40 32 28 58" stroke="#8B4513" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M52 22 Q40 32 52 58" stroke="#8B4513" strokeWidth="2" fill="none" opacity="0.5" />

      {/* Football center - larger, more detailed */}
      <ellipse cx="40" cy="40" rx="8" ry="5" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="1.5" />
      <line x1="40" y1="36" x2="40" y2="44" stroke={NINERS.gold} strokeWidth="1.5" />
      <line x1="36" y1="38" x2="44" y2="38" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="36" y1="40" x2="44" y2="40" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="36" y1="42" x2="44" y2="42" stroke={NINERS.gold} strokeWidth="1" />

      {/* Spindle */}
      <circle cx="40" cy="40" r="1.5" fill="#111" />

      {/* Code bracket tonearms - larger, bolder */}
      <path d="M12 32 L6 40 L12 48" stroke={WARRIORS.blue} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="40" x2="18" y2="40" stroke={WARRIORS.blue} strokeWidth="2" />
      <circle cx="18" cy="40" r="2.5" fill={WARRIORS.gold} />

      <path d="M68 32 L74 40 L68 48" stroke={NINERS.red} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="68" y1="40" x2="62" y2="40" stroke={NINERS.red} strokeWidth="2" />
      <circle cx="62" cy="40" r="2.5" fill={NINERS.gold} />

      {/* Scoreboard-style display */}
      <rect x="12" y="8" width="24" height="10" rx="1" fill="#000" stroke="#333" strokeWidth="1" />
      <text x="24" y="15" textAnchor="middle" fill={WARRIORS.gold} fontSize="6" fontWeight="bold" fontFamily="monospace">128</text>

      <rect x="44" y="8" width="24" height="10" rx="1" fill="#000" stroke="#333" strokeWidth="1" />
      <text x="56" y="15" textAnchor="middle" fill={NINERS.gold} fontSize="6" fontWeight="bold" fontFamily="monospace">BPM</text>

      {/* Bracket accent at bottom */}
      <path d="M34 70 L32 72 L34 74" stroke="#6E7681" strokeWidth="1" strokeLinecap="round" />
      <path d="M46 70 L48 72 L46 74" stroke="#6E7681" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
