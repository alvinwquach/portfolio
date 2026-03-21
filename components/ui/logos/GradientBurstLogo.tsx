import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 21. GRADIENT BURST
 * Radial gradient explosion
 */
export function LogoGradientBurst({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Gradient Burst"
    >
      <defs>
        <radialGradient id="burstGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={WARRIORS.gold} />
          <stop offset="40%" stopColor={NINERS.red} />
          <stop offset="70%" stopColor={WARRIORS.blue} />
          <stop offset="100%" stopColor="#0D1117" />
        </radialGradient>
      </defs>

      <circle cx="36" cy="36" r="34" fill="url(#burstGrad)" />

      {/* Vinyl grooves */}
      <circle cx="36" cy="36" r="24" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.3" />
      <circle cx="36" cy="36" r="18" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.3" />
      <circle cx="36" cy="36" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.3" />

      {/* Center */}
      <circle cx="36" cy="36" r="6" fill="#0D1117" />
      <circle cx="36" cy="36" r="2" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M12 28 L4 36 L12 44" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 28 L68 36 L60 44" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />

      {/* Tonearm */}
      <path d="M36 36 L50 22" stroke="#FFF" strokeWidth="2" />
      <circle cx="50" cy="22" r="3" fill="#FFF" />
    </svg>
  );
}
