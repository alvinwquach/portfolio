import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 1. PROFESSIONAL / CLEAN
 * Minimal, corporate-friendly, serious
 * Monochrome with subtle team color accents
 */
export function LogoProfessional({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Professional"
    >
      {/* Clean circle badge */}
      <circle cx="32" cy="32" r="30" fill="#0A0A0A" stroke="#333" strokeWidth="2" />

      {/* Subtle bridge silhouette - Bay Area */}
      <path
        d="M12 40 C12 40, 22 28, 32 28 C42 28, 52 40, 52 40"
        stroke="#444"
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="20" y="28" width="2" height="14" fill="#444" />
      <rect x="42" y="28" width="2" height="14" fill="#444" />
      <rect x="12" y="42" width="40" height="2" fill="#555" />

      {/* Code brackets - main focus */}
      <path d="M22 22 L14 32 L22 42" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 22 L50 32 L42 42" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Minimal vinyl center */}
      <circle cx="32" cy="32" r="6" fill="#1A1A1A" stroke="#444" strokeWidth="1" />
      <circle cx="32" cy="32" r="2" fill={WARRIORS.gold} />

      {/* Subtle team color accent line */}
      <line x1="14" y1="50" x2="26" y2="50" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="50" x2="50" y2="50" stroke={NINERS.red} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
