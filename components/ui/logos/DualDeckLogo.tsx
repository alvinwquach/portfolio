import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 44. DUAL DECK
 * Two turntables setup view
 */
export function LogoDualDeck({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Dual Deck"
    >
      {/* Background */}
      <rect x="2" y="2" width="68" height="68" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Left turntable - Warriors */}
      <circle cx="22" cy="28" r="14" fill="#111" stroke={WARRIORS.blue} strokeWidth="2" />
      <circle cx="22" cy="28" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="22" cy="28" r="6" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="22" cy="28" r="3" fill={WARRIORS.gold} />

      {/* Right turntable - 49ers */}
      <circle cx="50" cy="28" r="14" fill="#111" stroke={NINERS.red} strokeWidth="2" />
      <circle cx="50" cy="28" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="50" cy="28" r="6" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="50" cy="28" r="3" fill={NINERS.gold} />

      {/* Tonearms */}
      <path d="M22 28 L30 20" stroke={WARRIORS.gold} strokeWidth="1.5" />
      <circle cx="30" cy="20" r="2" fill={WARRIORS.gold} />
      <path d="M50 28 L42 20" stroke={NINERS.gold} strokeWidth="1.5" />
      <circle cx="42" cy="20" r="2" fill={NINERS.gold} />

      {/* Mixer in center bottom */}
      <rect x="28" y="48" width="16" height="16" rx="2" fill="#161B22" stroke="#333" strokeWidth="1" />
      <rect x="32" y="52" width="3" height="8" rx="1" fill={WARRIORS.gold} />
      <rect x="37" y="54" width="3" height="6" rx="1" fill={NINERS.red} />

      {/* Crossfader */}
      <rect x="30" y="66" width="12" height="4" rx="1" fill="#222" stroke="#444" strokeWidth="1" />
      <rect x="34" y="67" width="4" height="2" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M6 28 L2 34 L6 40" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M66 28 L70 34 L66 40" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
