import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 9. CHAMPIONSHIP RING
 * Sports championship ring style
 */
export function LogoChampionshipRing({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Championship"
    >
      {/* Outer ring - gold */}
      <circle cx="36" cy="36" r="32" fill="none" stroke={WARRIORS.gold} strokeWidth="6" />
      <circle cx="36" cy="36" r="28" fill="none" stroke={NINERS.gold} strokeWidth="2" />

      {/* Inner background */}
      <circle cx="36" cy="36" r="26" fill="#0A0A0A" />

      {/* Diamond/gem facets at top */}
      <polygon points="36,8 42,16 36,14 30,16" fill={WARRIORS.gold} />
      <polygon points="36,14 42,16 36,20 30,16" fill={NINERS.gold} opacity="0.8" />

      {/* "AQ" monogram */}
      <text x="36" y="42" textAnchor="middle" fill={WARRIORS.gold} fontSize="18" fontWeight="bold" fontFamily="serif">AQ</text>

      {/* Warriors side - left */}
      <circle cx="16" cy="36" r="4" fill={WARRIORS.blue} />
      <text x="16" y="38" textAnchor="middle" fill={WARRIORS.gold} fontSize="6" fontWeight="bold">W</text>

      {/* 49ers side - right */}
      <circle cx="56" cy="36" r="4" fill={NINERS.red} />
      <text x="56" y="38" textAnchor="middle" fill={NINERS.gold} fontSize="6" fontWeight="bold">SF</text>

      {/* Vinyl grooves hint */}
      <circle cx="36" cy="36" r="20" fill="none" stroke="#333" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="16" fill="none" stroke="#333" strokeWidth="0.5" />

      {/* Code brackets */}
      <path d="M24 50 L20 54 L24 58" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M48 50 L52 54 L48 58" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />

      {/* Small gems around */}
      <circle cx="36" cy="64" r="2" fill={WARRIORS.gold} />
      <circle cx="26" cy="62" r="1.5" fill={NINERS.gold} />
      <circle cx="46" cy="62" r="1.5" fill={NINERS.gold} />
    </svg>
  );
}
