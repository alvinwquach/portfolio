import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 13. HOLOGRAPHIC
 * Iridescent/holographic effect
 */
export function LogoHolographic({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Holographic"
    >
      <defs>
        <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="25%" stopColor="#C44AFF" />
          <stop offset="50%" stopColor="#00D4FF" />
          <stop offset="75%" stopColor="#7FFF00" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <linearGradient id="holoGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="50%" stopColor="#FF6B9D" />
          <stop offset="100%" stopColor="#C44AFF" />
        </linearGradient>
      </defs>

      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0A0A0A" stroke="url(#holoGrad)" strokeWidth="2" />

      {/* Holographic vinyl */}
      <circle cx="36" cy="36" r="20" fill="none" stroke="url(#holoGrad)" strokeWidth="3" />
      <circle cx="36" cy="36" r="16" fill="none" stroke="url(#holoGrad2)" strokeWidth="1" opacity="0.7" />
      <circle cx="36" cy="36" r="12" fill="none" stroke="url(#holoGrad)" strokeWidth="1" opacity="0.5" />
      <circle cx="36" cy="36" r="8" fill="none" stroke="url(#holoGrad2)" strokeWidth="1" opacity="0.3" />

      {/* Center */}
      <circle cx="36" cy="36" r="4" fill="url(#holoGrad)" />

      {/* Tonearm */}
      <path d="M36 36 L50 22 L54 24" stroke="url(#holoGrad)" strokeWidth="2" strokeLinecap="round" />

      {/* Holographic brackets */}
      <path d="M12 28 L6 36 L12 44" stroke="url(#holoGrad)" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 28 L66 36 L60 44" stroke="url(#holoGrad2)" strokeWidth="3" strokeLinecap="round" />

      {/* Team color hints */}
      <circle cx="18" cy="14" r="4" fill={WARRIORS.blue} opacity="0.6" />
      <circle cx="54" cy="14" r="4" fill={NINERS.red} opacity="0.6" />
    </svg>
  );
}
