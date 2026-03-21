import { LogoProps, NINERS } from './colors';

/**
 * 23. GLITCH
 * Glitchy/distorted aesthetic
 */
export function LogoGlitch({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Glitch"
    >
      {/* Background */}
      <rect x="2" y="2" width="68" height="68" fill="#0D1117" />

      {/* Glitch layers - offset copies */}
      {/* Red layer offset */}
      <circle cx="34" cy="36" r="16" fill="none" stroke={NINERS.red} strokeWidth="2" opacity="0.7" />
      <path d="M8 28 L2 36 L8 44" stroke={NINERS.red} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M60 28 L66 36 L60 44" stroke={NINERS.red} strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Cyan layer offset */}
      <circle cx="38" cy="36" r="16" fill="none" stroke="#00FFFF" strokeWidth="2" opacity="0.7" />
      <path d="M12 28 L6 36 L12 44" stroke="#00FFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M64 28 L70 36 L64 44" stroke="#00FFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Main white layer */}
      <circle cx="36" cy="36" r="16" fill="none" stroke="#FFF" strokeWidth="2" />
      <circle cx="36" cy="36" r="4" fill="#FFF" />
      <path d="M10 28 L4 36 L10 44" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
      <path d="M62 28 L68 36 L62 44" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />

      {/* Glitch scan lines */}
      <rect x="2" y="20" width="68" height="2" fill="#FFF" opacity="0.1" />
      <rect x="2" y="40" width="68" height="1" fill="#FFF" opacity="0.1" />
      <rect x="2" y="55" width="68" height="2" fill="#FFF" opacity="0.1" />

      {/* Tonearm */}
      <path d="M36 36 L48 24" stroke="#FFF" strokeWidth="1.5" />
    </svg>
  );
}
