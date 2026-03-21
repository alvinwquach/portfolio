import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 37. SOUNDWAVE CIRCLE
 * Circular soundwave/oscilloscope pattern
 */
export function LogoSoundwaveCircle({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Soundwave Circle"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Circular soundwave - outer ring */}
      <path
        d="M36 6 Q42 10 42 16 Q38 20 42 26 Q46 30 42 36 Q38 42 42 48 Q46 52 42 58 Q38 62 36 66
           Q34 62 30 58 Q26 52 30 48 Q34 42 30 36 Q26 30 30 26 Q34 20 30 16 Q26 10 36 6"
        stroke={WARRIORS.gold}
        strokeWidth="2"
        fill="none"
      />

      {/* Middle ring */}
      <path
        d="M36 14 Q40 18 40 22 Q36 26 40 32 Q44 36 40 42 Q36 46 40 52 Q36 56 36 58
           Q36 56 32 52 Q28 46 32 42 Q36 36 32 32 Q28 26 32 22 Q36 18 36 14"
        stroke={NINERS.red}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Inner ring */}
      <path
        d="M36 22 Q38 26 38 30 Q36 34 38 40 Q36 44 36 48
           Q36 44 34 40 Q32 34 34 30 Q36 26 36 22"
        stroke={WARRIORS.blue}
        strokeWidth="1"
        fill="none"
      />

      {/* Center dot */}
      <circle cx="36" cy="36" r="4" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="1.5" fill="#0D1117" />

      {/* Code brackets */}
      <path d="M10 30 L6 36 L10 42" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M62 30 L66 36 L62 42" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
