import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 36. SCRATCH PATTERN
 * Vinyl scratch marks aesthetic
 */
export function LogoScratchPattern({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Scratch Pattern"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Vinyl base */}
      <circle cx="36" cy="36" r="28" fill="#111" />

      {/* Scratch marks - diagonal lines suggesting movement */}
      <path d="M20 20 L52 52" stroke={WARRIORS.gold} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M52 20 L20 52" stroke={NINERS.red} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M36 12 L36 60" stroke={WARRIORS.blue} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M12 36 L60 36" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Motion blur lines */}
      <path d="M24 16 L16 24" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.4" />
      <path d="M48 16 L56 24" stroke={NINERS.red} strokeWidth="1" opacity="0.4" />
      <path d="M24 56 L16 48" stroke={WARRIORS.blue} strokeWidth="1" opacity="0.4" />
      <path d="M48 56 L56 48" stroke={NINERS.gold} strokeWidth="1" opacity="0.4" />

      {/* Center label */}
      <circle cx="36" cy="36" r="8" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="5" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
      <circle cx="36" cy="36" r="2" fill="#111" />

      {/* Code brackets */}
      <path d="M8 30 L4 36 L8 42" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M64 30 L68 36 L64 42" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
