import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 34. TURNTABLE PLATTER
 * Top-down view of spinning platter with dots
 */
export function LogoTurntablePlatter({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Turntable Platter"
    >
      {/* Platter base */}
      <circle cx="36" cy="36" r="34" fill="#1A1A1A" stroke="#333" strokeWidth="2" />

      {/* Speed dots ring - outer */}
      {[...Array(24)].map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x = 36 + 28 * Math.cos(angle);
        const y = 36 + 28 * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1.5"
            fill={i % 2 === 0 ? WARRIORS.gold : '#444'}
          />
        );
      })}

      {/* Speed dots ring - inner */}
      {[...Array(16)].map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        const x = 36 + 20 * Math.cos(angle);
        const y = 36 + 20 * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1"
            fill={i % 2 === 0 ? NINERS.red : '#444'}
          />
        );
      })}

      {/* Vinyl record on platter */}
      <circle cx="36" cy="36" r="14" fill="#111" stroke="#222" strokeWidth="1" />
      <circle cx="36" cy="36" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="6" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />

      {/* Label */}
      <circle cx="36" cy="36" r="4" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="1.5" fill="#111" />

      {/* Code brackets */}
      <path d="M8 30 L4 36 L8 42" stroke={WARRIORS.blue} strokeWidth="2" strokeLinecap="round" />
      <path d="M64 30 L68 36 L64 42" stroke={NINERS.red} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
