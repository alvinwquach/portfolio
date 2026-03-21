import { LogoProps, WARRIORS } from './colors';

/**
 * 29. COIN / MEDALLION
 * Currency/medal style
 */
export function LogoCoin({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Coin"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>

      {/* Outer rim */}
      <circle cx="36" cy="36" r="34" fill="url(#goldGrad)" />
      <circle cx="36" cy="36" r="32" fill="none" stroke="#8B7500" strokeWidth="1" />
      <circle cx="36" cy="36" r="30" fill="#DAA520" />
      <circle cx="36" cy="36" r="28" fill="none" stroke="#8B7500" strokeWidth="1" />

      {/* Inner circle */}
      <circle cx="36" cy="36" r="24" fill="#B8860B" />

      {/* AQ embossed */}
      <text x="36" y="44" textAnchor="middle" fill="#FFD700" fontSize="24" fontWeight="bold" fontFamily="serif">AQ</text>

      {/* Stars around edge */}
      <circle cx="36" cy="8" r="2" fill="#FFD700" />
      <circle cx="36" cy="64" r="2" fill="#FFD700" />
      <circle cx="8" cy="36" r="2" fill="#FFD700" />
      <circle cx="64" cy="36" r="2" fill="#FFD700" />

      {/* Vinyl hint */}
      <circle cx="36" cy="36" r="18" fill="none" stroke="#8B7500" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}
