import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 55. GAME DAY MIX
 * Stadium/arena atmosphere with DJ elements
 */
export function LogoGameDayMix({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach game day mix logo"
    >
      {/* Stadium lights effect */}
      <rect x="2" y="2" width="68" height="68" rx="4" fill="#0D1117" />

      {/* Light beams */}
      <polygon points="36,2 20,70 52,70" fill={WARRIORS.gold} opacity="0.1" />
      <polygon points="10,2 2,70 18,70" fill={WARRIORS.blue} opacity="0.1" />
      <polygon points="62,2 54,70 70,70" fill={NINERS.red} opacity="0.1" />

      {/* Crowd silhouette hint */}
      <path d="M2 62 Q10 58 18 60 Q26 58 36 60 Q46 58 54 60 Q62 58 70 62 L70 70 L2 70 Z" fill="#161B22" />

      {/* Main vinyl/basketball */}
      <circle cx="36" cy="36" r="22" fill={WARRIORS.gold} stroke={WARRIORS.gold} strokeWidth="2" />
      <circle cx="36" cy="36" r="18" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="36" cy="36" r="14" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams */}
      <line x1="36" y1="14" x2="36" y2="58" stroke="#000" strokeWidth="1.5" opacity="0.3" />
      <line x1="14" y1="36" x2="58" y2="36" stroke="#000" strokeWidth="1.5" opacity="0.3" />
      <path d="M26 20 Q36 28 26 52" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M46 20 Q36 28 46 52" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.3" />

      {/* Football center */}
      <ellipse cx="36" cy="36" rx="6" ry="4" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="1" />
      <line x1="36" y1="33" x2="36" y2="39" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="33" y1="35" x2="39" y2="35" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="33" y1="37" x2="39" y2="37" stroke={NINERS.gold} strokeWidth="0.75" />

      {/* Code brackets - prominent */}
      <path d="M10 30 L4 36 L10 42" stroke={WARRIORS.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 30 L68 36 L62 42" stroke={NINERS.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Scoreboard - abstract display */}
      <rect x="24" y="6" width="24" height="10" rx="1" fill="#000" stroke="#333" strokeWidth="1" />
      {/* LED-style dots forming pattern */}
      <circle cx="30" cy="11" r="1.5" fill={WARRIORS.gold} />
      <circle cx="36" cy="11" r="1.5" fill={WARRIORS.gold} />
      <circle cx="42" cy="11" r="1.5" fill={NINERS.gold} />
    </svg>
  );
}
