import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 30. GRAFFITI TAG
 * Street art tag style
 */
export function LogoGraffitiTag({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Graffiti"
    >
      {/* Spray paint drips background */}
      <rect x="10" y="38" width="4" height="8" fill={WARRIORS.gold} opacity="0.5" />
      <rect x="30" y="40" width="3" height="6" fill={NINERS.red} opacity="0.5" />
      <rect x="55" y="36" width="4" height="10" fill={WARRIORS.blue} opacity="0.5" />

      {/* "AQ" graffiti style */}
      <path
        d="M8 36 L20 8 L32 36 M12 28 L28 28"
        stroke={WARRIORS.gold}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M8 36 L20 8 L32 36 M12 28 L28 28"
        stroke="#000"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.3"
        transform="translate(1, 1)"
      />

      {/* Q as stylized circle */}
      <circle cx="52" cy="22" r="14" fill="none" stroke={NINERS.red} strokeWidth="6" />
      <path d="M60 30 L72 42" stroke={NINERS.red} strokeWidth="6" strokeLinecap="round" />
      <circle cx="52" cy="22" r="14" fill="none" stroke="#000" strokeWidth="8" opacity="0.3" transform="translate(1, 1)" />

      {/* Vinyl center in Q */}
      <circle cx="52" cy="22" r="4" fill={WARRIORS.gold} />

      {/* Underline swoosh */}
      <path d="M6 44 Q40 38 76 44" stroke={WARRIORS.blue} strokeWidth="3" fill="none" />
    </svg>
  );
}
