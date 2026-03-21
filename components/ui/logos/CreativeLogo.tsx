import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 2. CREATIVE / ARTISTIC
 * Expressive, unique, colorful
 * Full team colors, dynamic composition
 */
export function LogoCreative({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Creative"
    >
      {/* Dynamic background - split Warriors/49ers */}
      <clipPath id="leftHalf">
        <rect x="0" y="0" width="36" height="72" />
      </clipPath>
      <clipPath id="rightHalf">
        <rect x="36" y="0" width="36" height="72" />
      </clipPath>

      <circle cx="36" cy="36" r="34" fill={WARRIORS.blue} />
      <circle cx="36" cy="36" r="34" fill={NINERS.red} clipPath="url(#rightHalf)" />

      {/* Golden border */}
      <circle cx="36" cy="36" r="34" fill="none" stroke={WARRIORS.gold} strokeWidth="3" />

      {/* Bridge spanning both sides */}
      <path
        d="M8 44 C8 44, 22 24, 36 24 C50 24, 64 44, 64 44"
        stroke={WARRIORS.gold}
        strokeWidth="2.5"
        fill="none"
      />
      <rect x="18" y="22" width="4" height="26" fill={WARRIORS.gold} />
      <rect x="50" y="22" width="4" height="26" fill={NINERS.gold} />
      <rect x="8" y="46" width="56" height="3" fill={NINERS.gold} />

      {/* Vertical cables */}
      <line x1="26" y1="30" x2="26" y2="46" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.7" />
      <line x1="36" y1="24" x2="36" y2="46" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.7" />
      <line x1="46" y1="30" x2="46" y2="46" stroke={NINERS.gold} strokeWidth="1" opacity="0.7" />

      {/* Large vinyl record */}
      <circle cx="36" cy="36" r="10" fill="#111" />
      <circle cx="36" cy="36" r="7" stroke="#333" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="4" stroke="#333" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="2.5" fill={WARRIORS.gold} />

      {/* Tonearm */}
      <path d="M36 36 L44 28 L46 29" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />

      {/* Code brackets */}
      <path d="M14 30 L8 38 L14 46" stroke={WARRIORS.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 30 L64 38 L58 46" stroke={NINERS.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Basketball texture hint on left */}
      <path d="M20 14 Q28 20 20 26" stroke={WARRIORS.gold} strokeWidth="1" fill="none" opacity="0.5" />

      {/* Football laces hint on right */}
      <line x1="52" y1="14" x2="52" y2="22" stroke={NINERS.gold} strokeWidth="1.5" opacity="0.5" />
      <line x1="50" y1="16" x2="54" y2="16" stroke={NINERS.gold} strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="20" x2="54" y2="20" stroke={NINERS.gold} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
