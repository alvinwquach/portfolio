import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 11. RETRO 80s
 * Synthwave/retrowave aesthetic
 */
export function LogoRetro80s({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Retro"
    >
      <defs>
        <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="50%" stopColor="#FF8E53" />
          <stop offset="100%" stopColor="#FDB927" />
        </linearGradient>
        <linearGradient id="gridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect x="2" y="2" width="68" height="68" rx="4" fill="#1A0A2E" />

      {/* Sun/vinyl */}
      <circle cx="36" cy="32" r="16" fill="url(#sunsetGrad)" />
      {/* Horizontal lines through sun */}
      <rect x="20" y="30" width="32" height="2" fill="#1A0A2E" />
      <rect x="20" y="34" width="32" height="2" fill="#1A0A2E" />
      <rect x="20" y="38" width="32" height="3" fill="#1A0A2E" />
      <rect x="20" y="43" width="32" height="5" fill="#1A0A2E" />

      {/* Center vinyl hole */}
      <circle cx="36" cy="32" r="3" fill="#1A0A2E" />
      <circle cx="36" cy="32" r="1.5" fill={WARRIORS.gold} />

      {/* Grid floor */}
      <path d="M2 50 L70 50" stroke="url(#gridGrad)" strokeWidth="1" />
      <path d="M2 56 L70 56" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.7" />
      <path d="M2 62 L70 62" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.4" />
      {/* Vertical grid */}
      <path d="M10 50 L6 70" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.5" />
      <path d="M26 50 L22 70" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.5" />
      <path d="M36 50 L36 70" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.5" />
      <path d="M46 50 L50 70" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.5" />
      <path d="M62 50 L66 70" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.5" />

      {/* Code brackets */}
      <path d="M10 28 L4 36 L10 44" stroke="#00FFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M62 28 L68 36 L62 44" stroke="#FF00FF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Team colors as palm trees hint */}
      <rect x="8" y="42" width="2" height="8" fill={WARRIORS.blue} />
      <rect x="62" y="42" width="2" height="8" fill={NINERS.red} />
    </svg>
  );
}
