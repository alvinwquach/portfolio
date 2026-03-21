import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 18. PIXEL ART
 * 8-bit pixel art style
 */
export function LogoPixel({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Pixel"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Background */}
      <rect width="32" height="32" fill="#0D1117" />

      {/* Vinyl - pixelated circle */}
      <rect x="12" y="8" width="8" height="2" fill="#333" />
      <rect x="10" y="10" width="2" height="2" fill="#333" />
      <rect x="20" y="10" width="2" height="2" fill="#333" />
      <rect x="8" y="12" width="2" height="8" fill="#333" />
      <rect x="22" y="12" width="2" height="8" fill="#333" />
      <rect x="10" y="20" width="2" height="2" fill="#333" />
      <rect x="20" y="20" width="2" height="2" fill="#333" />
      <rect x="12" y="22" width="8" height="2" fill="#333" />

      {/* Center */}
      <rect x="14" y="14" width="4" height="4" fill={WARRIORS.gold} />

      {/* Left bracket */}
      <rect x="4" y="12" width="2" height="2" fill={WARRIORS.blue} />
      <rect x="2" y="14" width="2" height="4" fill={WARRIORS.blue} />
      <rect x="4" y="18" width="2" height="2" fill={WARRIORS.blue} />

      {/* Right bracket */}
      <rect x="26" y="12" width="2" height="2" fill={NINERS.red} />
      <rect x="28" y="14" width="2" height="4" fill={NINERS.red} />
      <rect x="26" y="18" width="2" height="2" fill={NINERS.red} />

      {/* Tonearm */}
      <rect x="18" y="10" width="2" height="2" fill={WARRIORS.gold} />
      <rect x="20" y="8" width="2" height="2" fill={WARRIORS.gold} />
    </svg>
  );
}
