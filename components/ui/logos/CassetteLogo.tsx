import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 16. CASSETTE TAPE
 * Retro cassette tape style
 */
export function LogoCassette({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Cassette"
    >
      {/* Cassette body */}
      <rect x="2" y="2" width="76" height="48" rx="4" fill="#1A1A1A" stroke="#333" strokeWidth="2" />

      {/* Label area */}
      <rect x="8" y="6" width="64" height="24" rx="2" fill="#F5F5F5" />

      {/* Label text */}
      <text x="40" y="16" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold" fontFamily="sans-serif">ALVIN QUACH</text>
      <text x="40" y="25" textAnchor="middle" fill="#666" fontSize="5" fontFamily="sans-serif">BAY AREA • CODE • BEATS</text>

      {/* Team color stripes on label */}
      <rect x="8" y="6" width="32" height="3" fill={WARRIORS.blue} opacity="0.7" />
      <rect x="40" y="6" width="32" height="3" fill={NINERS.red} opacity="0.7" />

      {/* Tape reels */}
      <circle cx="24" cy="38" r="8" fill="#111" stroke="#333" strokeWidth="1" />
      <circle cx="24" cy="38" r="4" fill="#222" />
      <circle cx="24" cy="38" r="2" fill={WARRIORS.gold} />

      <circle cx="56" cy="38" r="8" fill="#111" stroke="#333" strokeWidth="1" />
      <circle cx="56" cy="38" r="4" fill="#222" />
      <circle cx="56" cy="38" r="2" fill={NINERS.gold} />

      {/* Tape window */}
      <rect x="30" y="34" width="20" height="8" rx="1" fill="#222" stroke="#444" strokeWidth="1" />
      <line x1="32" y1="38" x2="48" y2="38" stroke="#333" strokeWidth="1" />

      {/* Code bracket holes */}
      <path d="M12 38 L8 42 L12 46" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68 38 L72 42 L68 46" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
