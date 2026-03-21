import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 7. GOLDEN GATE MINIMAL
 * Iconic bridge silhouette with subtle elements
 */
export function LogoGoldenGateMinimal({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Golden Gate"
    >
      {/* Dark background */}
      <rect x="2" y="2" width="60" height="60" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Golden Gate Bridge - International Orange */}
      <rect x="14" y="18" width="4" height="30" fill="#FF6B35" />
      <rect x="46" y="18" width="4" height="30" fill="#FF6B35" />

      {/* Main cables */}
      <path
        d="M6 28 Q16 12, 32 12 Q48 12, 58 28"
        stroke="#FF6B35"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Vertical suspenders */}
      <line x1="22" y1="18" x2="22" y2="46" stroke="#FF6B35" strokeWidth="1" opacity="0.7" />
      <line x1="32" y1="12" x2="32" y2="46" stroke="#FF6B35" strokeWidth="1" opacity="0.7" />
      <line x1="42" y1="18" x2="42" y2="46" stroke="#FF6B35" strokeWidth="1" opacity="0.7" />

      {/* Road deck */}
      <rect x="6" y="46" width="52" height="3" fill="#FF6B35" />

      {/* Vinyl hint at center */}
      <circle cx="32" cy="32" r="6" fill="#111" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="32" cy="32" r="2" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M8 34 L4 40 L8 46" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M56 34 L60 40 L56 46" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Team color accents */}
      <circle cx="10" cy="10" r="3" fill={WARRIORS.blue} />
      <circle cx="54" cy="10" r="3" fill={NINERS.red} />
    </svg>
  );
}
