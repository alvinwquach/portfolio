import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 5. BRIDGE + DJ
 * Bay Area bridge as the main focus with DJ elements
 */
export function LogoBridgeDJ({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Bridge DJ"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Bay Bridge - suspension style */}
      <path
        d="M8 46 L64 46"
        stroke={NINERS.gold}
        strokeWidth="3"
      />
      {/* Left tower */}
      <rect x="16" y="26" width="4" height="22" fill={WARRIORS.gold} />
      <path d="M18 26 L8 40" stroke={WARRIORS.gold} strokeWidth="1.5" />
      <path d="M18 26 L28 40" stroke={WARRIORS.gold} strokeWidth="1.5" />
      {/* Right tower */}
      <rect x="52" y="26" width="4" height="22" fill={NINERS.gold} />
      <path d="M54 26 L44 40" stroke={NINERS.gold} strokeWidth="1.5" />
      <path d="M54 26 L64 40" stroke={NINERS.gold} strokeWidth="1.5" />
      {/* Main cables */}
      <path
        d="M8 40 Q18 22, 36 22 Q54 22, 64 40"
        stroke={WARRIORS.gold}
        strokeWidth="2"
        fill="none"
      />
      {/* Vertical cables */}
      <line x1="24" y1="28" x2="24" y2="46" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.6" />
      <line x1="36" y1="22" x2="36" y2="46" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.6" />
      <line x1="48" y1="28" x2="48" y2="46" stroke={NINERS.gold} strokeWidth="1" opacity="0.6" />

      {/* Vinyl record in center */}
      <circle cx="36" cy="36" r="8" fill="#111" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="36" cy="36" r="5" stroke="#333" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="2.5" fill={NINERS.red} />
      <circle cx="36" cy="36" r="1" fill={WARRIORS.gold} />

      {/* Tonearm */}
      <path d="M36 36 L46 28 L50 30" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />

      {/* Code brackets */}
      <path d="M12 30 L6 36 L12 42" stroke={WARRIORS.blue} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M60 30 L66 36 L60 42" stroke={NINERS.red} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
