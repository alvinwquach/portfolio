import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 8. BASKETBALL VINYL + CODE TONEARMS
 * Vinyl record styled as basketball with code brackets as tonearms
 */
export function LogoBasketballVinyl({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Basketball Vinyl"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Vinyl record - basketball orange with grooves */}
      <circle cx="36" cy="36" r="20" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="16" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.3" />
      <circle cx="36" cy="36" r="12" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.3" />
      <circle cx="36" cy="36" r="8" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.3" />

      {/* Basketball lines */}
      <line x1="36" y1="16" x2="36" y2="56" stroke="#000" strokeWidth="1.5" opacity="0.4" />
      <line x1="16" y1="36" x2="56" y2="36" stroke="#000" strokeWidth="1.5" opacity="0.4" />
      <path d="M22 22 Q36 32 22 50" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M50 22 Q36 32 50 50" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.4" />

      {/* Center label - vinyl spindle */}
      <circle cx="36" cy="36" r="4" fill="#111" />
      <circle cx="36" cy="36" r="1.5" fill={NINERS.red} />

      {/* Code brackets AS tonearms - left bracket arm */}
      <path
        d="M14 28 L8 36 L14 44"
        stroke={WARRIORS.blue}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tonearm connection from left bracket to vinyl */}
      <line x1="14" y1="36" x2="20" y2="36" stroke={WARRIORS.blue} strokeWidth="2" />
      <circle cx="20" cy="36" r="2" fill={WARRIORS.blue} />

      {/* Code brackets AS tonearms - right bracket arm */}
      <path
        d="M58 28 L64 36 L58 44"
        stroke={NINERS.red}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tonearm connection from right bracket to vinyl */}
      <line x1="58" y1="36" x2="52" y2="36" stroke={NINERS.red} strokeWidth="2" />
      <circle cx="52" cy="36" r="2" fill={NINERS.red} />

      {/* Football hint at bottom */}
      <ellipse cx="36" cy="60" rx="8" ry="4" fill={NINERS.red} opacity="0.5" />
      <line x1="36" y1="56" x2="36" y2="64" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="33" y1="59" x2="39" y2="59" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="33" y1="61" x2="39" y2="61" stroke={NINERS.gold} strokeWidth="0.75" />
    </svg>
  );
}
