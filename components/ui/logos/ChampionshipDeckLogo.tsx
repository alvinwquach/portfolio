import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 52. CHAMPIONSHIP DECK
 * Championship ring combined with DJ deck
 */
export function LogoChampionshipDeck({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach championship deck logo"
    >
      <defs>
        <linearGradient id="championGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>

      {/* Championship ring outer */}
      <circle cx="36" cy="36" r="34" fill="none" stroke="url(#championGold)" strokeWidth="6" />
      <circle cx="36" cy="36" r="30" fill="none" stroke="#8B7500" strokeWidth="1" />

      {/* Inner ring fill */}
      <circle cx="36" cy="36" r="28" fill="#0D1117" />

      {/* Diamond at top */}
      <polygon points="36,4 42,12 36,10 30,12" fill="#FFF" opacity="0.9" />
      <polygon points="36,10 42,12 36,16 30,12" fill={WARRIORS.gold} opacity="0.8" />

      {/* Basketball vinyl */}
      <circle cx="36" cy="36" r="20" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="16" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="36" cy="36" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams */}
      <line x1="36" y1="16" x2="36" y2="56" stroke="#000" strokeWidth="1" opacity="0.3" />
      <line x1="16" y1="36" x2="56" y2="36" stroke="#000" strokeWidth="1" opacity="0.3" />
      <path d="M26 22 Q36 30 26 50" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M46 22 Q36 30 46 50" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Football center */}
      <ellipse cx="36" cy="36" rx="6" ry="4" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="1" />
      <line x1="36" y1="33" x2="36" y2="39" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="33" y1="35" x2="39" y2="35" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="33" y1="37" x2="39" y2="37" stroke={NINERS.gold} strokeWidth="0.75" />

      {/* Code bracket gems on sides */}
      <path d="M10 32 L6 36 L10 40" stroke={WARRIORS.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="36" r="3" fill={WARRIORS.blue} opacity="0.5" />

      <path d="M62 32 L66 36 L62 40" stroke={NINERS.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="66" cy="36" r="3" fill={NINERS.red} opacity="0.5" />

      {/* Small gems */}
      <circle cx="20" cy="12" r="2" fill={WARRIORS.gold} />
      <circle cx="52" cy="12" r="2" fill={NINERS.gold} />
      <circle cx="36" cy="66" r="2" fill={WARRIORS.gold} />

      {/* AQ text */}
      <text x="36" y="66" textAnchor="middle" fill={WARRIORS.gold} fontSize="0" fontWeight="bold" fontFamily="serif" opacity="0">AQ</text>
    </svg>
  );
}
