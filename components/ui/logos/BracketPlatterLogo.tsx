import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 49. BRACKET PLATTER
 * Vinyl platter where the grooves are made of code brackets
 */
export function LogoBracketPlatter({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach bracket platter logo"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Outer bracket ring */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x = 36 + 28 * Math.cos(angle);
        const y = 36 + 28 * Math.sin(angle);
        const rotation = i * 30;
        return (
          <g key={i} transform={`rotate(${rotation} ${x} ${y})`}>
            <path
              d={`M${x - 3} ${y - 4} L${x - 5} ${y} L${x - 3} ${y + 4}`}
              stroke={i % 2 === 0 ? WARRIORS.blue : NINERS.red}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
      })}

      {/* Middle bracket ring */}
      {[...Array(8)].map((_, i) => {
        const angle = ((i * 45 + 22.5) * Math.PI) / 180;
        const x = 36 + 20 * Math.cos(angle);
        const y = 36 + 20 * Math.sin(angle);
        const rotation = i * 45 + 22.5;
        return (
          <g key={i} transform={`rotate(${rotation} ${x} ${y})`}>
            <path
              d={`M${x + 2} ${y - 3} L${x + 4} ${y} L${x + 2} ${y + 3}`}
              stroke={i % 2 === 0 ? WARRIORS.gold : NINERS.gold}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
      })}

      {/* Basketball vinyl surface */}
      <circle cx="36" cy="36" r="14" fill={WARRIORS.gold} />

      {/* Basketball seams */}
      <line x1="36" y1="22" x2="36" y2="50" stroke="#000" strokeWidth="1" opacity="0.3" />
      <line x1="22" y1="36" x2="50" y2="36" stroke="#000" strokeWidth="1" opacity="0.3" />
      <path d="M29 26 Q36 32 29 46" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M43 26 Q36 32 43 46" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Football label */}
      <ellipse cx="36" cy="36" rx="5" ry="3" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="36" y1="33.5" x2="36" y2="38.5" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="34" y1="35" x2="38" y2="35" stroke={NINERS.gold} strokeWidth="0.5" />
      <line x1="34" y1="37" x2="38" y2="37" stroke={NINERS.gold} strokeWidth="0.5" />

      {/* Spindle */}
      <circle cx="36" cy="36" r="1" fill="#111" />

      {/* Main tonearm brackets */}
      <path d="M8 30 L4 36 L8 42" stroke={WARRIORS.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M64 30 L68 36 L64 42" stroke={NINERS.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
