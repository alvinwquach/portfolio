import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 54. VINYL SYNTAX
 * Record label styled as syntax highlighting
 */
export function LogoVinylSyntax({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach vinyl syntax logo"
    >
      {/* Vinyl record */}
      <circle cx="36" cy="36" r="34" fill="#111" stroke="#222" strokeWidth="1" />

      {/* Grooves */}
      <circle cx="36" cy="36" r="30" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="26" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="22" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />

      {/* Large label - basketball colored with code */}
      <circle cx="36" cy="36" r="14" fill={WARRIORS.gold} />

      {/* Basketball seams as code structure */}
      <line x1="36" y1="22" x2="36" y2="50" stroke="#000" strokeWidth="1" opacity="0.3" />
      <line x1="22" y1="36" x2="50" y2="36" stroke="#000" strokeWidth="1" opacity="0.3" />

      {/* AQ monogram with syntax-color inspired styling */}
      <text x="36" y="38" textAnchor="middle" fill="#111" fontSize="10" fontWeight="bold" fontFamily="sans-serif">AQ</text>
      {/* Decorative lines suggesting code structure */}
      <line x1="28" y1="44" x2="32" y2="44" stroke="#FF7B72" strokeWidth="1" />
      <line x1="34" y1="44" x2="38" y2="44" stroke="#79C0FF" strokeWidth="1" />
      <line x1="40" y1="44" x2="44" y2="44" stroke="#7EE787" strokeWidth="1" />

      {/* Football center dot */}
      <ellipse cx="36" cy="47" rx="4" ry="2" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="0.5" />

      {/* Spindle */}
      <circle cx="36" cy="36" r="1" fill="#111" />

      {/* Code bracket tonearms */}
      <path d="M8 28 L4 36 L8 44" stroke={WARRIORS.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8" y1="36" x2="14" y2="36" stroke={WARRIORS.blue} strokeWidth="1.5" />
      <circle cx="14" cy="36" r="2" fill={WARRIORS.gold} />

      <path d="M64 28 L68 36 L64 44" stroke={NINERS.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="64" y1="36" x2="58" y2="36" stroke={NINERS.red} strokeWidth="1.5" />
      <circle cx="58" cy="36" r="2" fill={NINERS.gold} />

      {/* Light reflection */}
      <path d="M18 18 Q28 24 22 34" stroke="#333" strokeWidth="0.5" fill="none" opacity="0.5" />
    </svg>
  );
}
