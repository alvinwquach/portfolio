import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 47. CODE DECK
 * Terminal/IDE aesthetic turntable - coding as primary focus
 */
export function LogoCodeDeck({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach code deck logo"
    >
      {/* Terminal window frame */}
      <rect x="2" y="2" width="76" height="76" rx="6" fill="#0D1117" stroke="#30363D" strokeWidth="2" />

      {/* Title bar */}
      <rect x="2" y="2" width="76" height="14" rx="6" fill="#161B22" />
      <rect x="2" y="10" width="76" height="6" fill="#161B22" />

      {/* Traffic lights */}
      <circle cx="12" cy="9" r="3" fill="#FF5F57" />
      <circle cx="22" cy="9" r="3" fill="#FFBD2E" />
      <circle cx="32" cy="9" r="3" fill="#28CA41" />

      {/* Tab - basketball icon hint */}
      <circle cx="60" cy="9" r="4" fill={WARRIORS.gold} opacity="0.3" />

      {/* Code content area */}
      <rect x="6" y="18" width="68" height="56" fill="#0D1117" />

      {/* Vinyl/basketball in center of code */}
      <circle cx="40" cy="48" r="20" fill={WARRIORS.gold} opacity="0.9" />
      <circle cx="40" cy="48" r="16" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="40" cy="48" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams */}
      <line x1="40" y1="28" x2="40" y2="68" stroke="#000" strokeWidth="1" opacity="0.3" />
      <line x1="20" y1="48" x2="60" y2="48" stroke="#000" strokeWidth="1" opacity="0.3" />
      <path d="M30 34 Q40 42 30 62" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M50 34 Q40 42 50 62" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Football center */}
      <ellipse cx="40" cy="48" rx="5" ry="3" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="40" y1="45.5" x2="40" y2="50.5" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="38" y1="47" x2="42" y2="47" stroke={NINERS.gold} strokeWidth="0.5" />
      <line x1="38" y1="49" x2="42" y2="49" stroke={NINERS.gold} strokeWidth="0.5" />

      {/* Code brackets as tonearms */}
      <path d="M14 38 L8 48 L14 58" stroke={WARRIORS.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M66 38 L72 48 L66 58" stroke={NINERS.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Stylus tips */}
      <circle cx="18" cy="48" r="2" fill={WARRIORS.gold} />
      <circle cx="62" cy="48" r="2" fill={NINERS.gold} />

      {/* Subtle code-inspired grid lines instead of actual code */}
      <line x1="10" y1="24" x2="18" y2="24" stroke="#30363D" strokeWidth="1" />
      <line x1="10" y1="28" x2="24" y2="28" stroke="#30363D" strokeWidth="1" />
      <line x1="10" y1="68" x2="16" y2="68" stroke="#30363D" strokeWidth="1" />
      <line x1="18" y1="68" x2="28" y2="68" stroke="#30363D" strokeWidth="1" />
    </svg>
  );
}
