import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 6. SPORTS + VINYL + CODE
 * Combined elements: basketball, football, vinyl, tonearm, code
 */
export function LogoSportsVinyl({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Sports Vinyl"
    >
      {/* Background - split */}
      <circle cx="36" cy="36" r="34" fill={WARRIORS.blue} />
      <path d="M36 2 A34 34 0 0 1 36 70" fill={NINERS.red} />
      <circle cx="36" cy="36" r="34" fill="none" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Large vinyl record - center */}
      <circle cx="36" cy="36" r="18" fill="#111" />
      <circle cx="36" cy="36" r="14" stroke="#222" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="10" stroke="#222" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="6" stroke="#333" strokeWidth="0.5" fill="none" />

      {/* Basketball texture on vinyl - left side */}
      <path d="M22 30 Q28 36 22 42" stroke={WARRIORS.gold} strokeWidth="1.5" fill="none" />
      <line x1="22" y1="36" x2="30" y2="36" stroke={WARRIORS.gold} strokeWidth="1" />

      {/* Football laces on vinyl - right side */}
      <line x1="46" y1="32" x2="46" y2="40" stroke={NINERS.gold} strokeWidth="1.5" />
      <line x1="44" y1="34" x2="48" y2="34" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="44" y1="38" x2="48" y2="38" stroke={NINERS.gold} strokeWidth="1" />

      {/* Center label */}
      <circle cx="36" cy="36" r="4" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="1.5" fill="#111" />

      {/* Tonearm */}
      <path d="M36 36 L48 24 L52 26" stroke={WARRIORS.gold} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="52" cy="26" r="2" fill={NINERS.gold} />

      {/* Code brackets - outer */}
      <path d="M10 28 L4 36 L10 44" stroke={WARRIORS.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 28 L68 36 L62 44" stroke={NINERS.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Sport icons hint */}
      <circle cx="16" cy="16" r="6" fill={WARRIORS.gold} opacity="0.3" />
      <path d="M13 16 Q16 13, 19 16 Q16 19, 13 16" stroke={WARRIORS.gold} strokeWidth="0.75" fill="none" />
      <ellipse cx="56" cy="16" rx="6" ry="4" fill={NINERS.gold} opacity="0.3" transform="rotate(-30 56 16)" />
    </svg>
  );
}
