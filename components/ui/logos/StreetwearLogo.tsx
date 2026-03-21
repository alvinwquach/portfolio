import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 3. STREETWEAR / URBAN
 * Hip-hop culture, bold, fashion-forward
 * Heavy contrast, graffiti influence
 */
export function LogoStreetwear({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Streetwear"
    >
      {/* Hard black background */}
      <rect x="2" y="2" width="68" height="68" rx="8" fill="#000" stroke={WARRIORS.gold} strokeWidth="3" />

      {/* Diagonal split - Warriors/49ers */}
      <path d="M2 2 L70 70" stroke={NINERS.red} strokeWidth="4" />

      {/* Bold "AQ" letters - graffiti style */}
      {/* A */}
      <path
        d="M14 54 L24 18 L34 54 M18 42 L30 42"
        stroke={WARRIORS.gold}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Q as vinyl */}
      <circle cx="50" cy="36" r="14" fill={NINERS.red} stroke={WARRIORS.gold} strokeWidth="2" />
      <circle cx="50" cy="36" r="10" stroke="#000" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="50" cy="36" r="6" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="50" cy="36" r="3" fill="#000" />
      <circle cx="50" cy="36" r="1.5" fill={WARRIORS.gold} />
      {/* Q tail / tonearm */}
      <path d="M58 44 L66 56" stroke={WARRIORS.gold} strokeWidth="5" strokeLinecap="round" />

      {/* Bridge silhouette at bottom */}
      <path
        d="M10 58 C10 58, 20 52, 36 52 C52 52, 62 58, 62 58"
        stroke={NINERS.gold}
        strokeWidth="2"
        fill="none"
      />
      <rect x="18" y="52" width="2" height="8" fill={NINERS.gold} />
      <rect x="52" y="52" width="2" height="8" fill={NINERS.gold} />
      <rect x="10" y="60" width="52" height="2" fill={WARRIORS.gold} />

      {/* Code bracket accents */}
      <path d="M6 28 L2 36 L6 44" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M66 28 L70 36 L66 44" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}
