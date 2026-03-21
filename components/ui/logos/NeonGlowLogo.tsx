import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 10. NEON GLOW
 * Cyberpunk-inspired with glowing effects
 */
export function LogoNeonGlow({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Neon"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dark background */}
      <rect x="2" y="2" width="68" height="68" rx="8" fill="#0A0A0F" />

      {/* Neon vinyl */}
      <circle cx="36" cy="36" r="18" fill="none" stroke="#FF00FF" strokeWidth="2" filter="url(#glow)" />
      <circle cx="36" cy="36" r="14" fill="none" stroke="#FF00FF" strokeWidth="1" opacity="0.5" />
      <circle cx="36" cy="36" r="10" fill="none" stroke="#00FFFF" strokeWidth="1" opacity="0.5" />
      <circle cx="36" cy="36" r="4" fill="#00FFFF" filter="url(#glow)" />

      {/* Neon brackets */}
      <path d="M14 26 L6 36 L14 46" stroke="#00FFFF" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
      <path d="M58 26 L66 36 L58 46" stroke="#FF00FF" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />

      {/* Tonearm */}
      <path d="M36 36 L48 24" stroke={WARRIORS.gold} strokeWidth="2" filter="url(#glow)" />

      {/* Team color dots */}
      <circle cx="20" cy="12" r="4" fill={WARRIORS.blue} filter="url(#glow)" />
      <circle cx="52" cy="12" r="4" fill={NINERS.red} filter="url(#glow)" />
    </svg>
  );
}
