import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 51. VINYL IDE
 * IDE/code editor with vinyl as the main visual
 */
export function LogoVinylIDE({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach vinyl IDE logo"
    >
      {/* IDE window */}
      <rect x="2" y="2" width="76" height="60" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Title bar */}
      <rect x="2" y="2" width="76" height="10" rx="4" fill="#161B22" />
      <rect x="2" y="8" width="76" height="4" fill="#161B22" />

      {/* Traffic lights */}
      <circle cx="10" cy="7" r="2.5" fill="#FF5F57" />
      <circle cx="18" cy="7" r="2.5" fill="#FFBD2E" />
      <circle cx="26" cy="7" r="2.5" fill="#28CA41" />

      {/* File tabs - just colored indicator */}
      <rect x="36" y="3" width="18" height="8" rx="1" fill="#0D1117" />
      <rect x="40" y="5" width="10" height="4" rx="0.5" fill={WARRIORS.gold} opacity="0.3" />

      {/* Sidebar - abstract file tree using shapes */}
      <rect x="4" y="14" width="16" height="46" fill="#161B22" />
      {/* Folder indicators */}
      <rect x="6" y="18" width="6" height="2" rx="0.5" fill="#6E7681" />
      <rect x="8" y="24" width="8" height="2" rx="0.5" fill={WARRIORS.gold} />
      <rect x="8" y="30" width="6" height="2" rx="0.5" fill="#6E7681" />
      <rect x="8" y="36" width="7" height="2" rx="0.5" fill="#6E7681" />

      {/* Main editor area with vinyl */}
      <rect x="22" y="14" width="54" height="46" fill="#0D1117" />

      {/* Vinyl/basketball in editor */}
      <circle cx="49" cy="38" r="18" fill={WARRIORS.gold} />
      <circle cx="49" cy="38" r="14" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="49" cy="38" r="10" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams */}
      <line x1="49" y1="20" x2="49" y2="56" stroke="#000" strokeWidth="1" opacity="0.3" />
      <line x1="31" y1="38" x2="67" y2="38" stroke="#000" strokeWidth="1" opacity="0.3" />
      <path d="M40 25 Q49 32 40 51" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M58 25 Q49 32 58 51" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Football center */}
      <ellipse cx="49" cy="38" rx="5" ry="3" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="49" y1="35.5" x2="49" y2="40.5" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="47" y1="37" x2="51" y2="37" stroke={NINERS.gold} strokeWidth="0.5" />
      <line x1="47" y1="39" x2="51" y2="39" stroke={NINERS.gold} strokeWidth="0.5" />

      {/* Code bracket tonearms */}
      <path d="M28 32 L24 38 L28 44" stroke={WARRIORS.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 32 L74 38 L70 44" stroke={NINERS.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Line number indicators - just dots */}
      <circle cx="25" cy="20" r="1" fill="#6E7681" />
      <circle cx="25" cy="26" r="1" fill="#6E7681" />
      <circle cx="25" cy="54" r="1" fill="#6E7681" />
    </svg>
  );
}
