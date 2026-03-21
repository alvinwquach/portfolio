import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 53. CONTROLLER PRO
 * DJ controller with basketball jog wheels and code display
 */
export function LogoControllerPro({ className, size = 32 }: LogoProps) {
  const width = size;
  const height = size * 0.6;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach controller pro logo"
    >
      {/* Controller body */}
      <rect x="2" y="2" width="116" height="68" rx="6" fill="#0D1117" stroke="#30363D" strokeWidth="2" />

      {/* Top panel accent */}
      <rect x="2" y="2" width="58" height="4" fill={WARRIORS.blue} opacity="0.7" />
      <rect x="60" y="2" width="58" height="4" fill={NINERS.red} opacity="0.7" />

      {/* Left jog wheel - basketball */}
      <circle cx="32" cy="42" r="24" fill="#1A1A1A" stroke={WARRIORS.blue} strokeWidth="2" />
      <circle cx="32" cy="42" r="20" fill={WARRIORS.gold} />
      <circle cx="32" cy="42" r="16" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="32" cy="42" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <line x1="32" y1="22" x2="32" y2="62" stroke="#000" strokeWidth="1" opacity="0.3" />
      <line x1="12" y1="42" x2="52" y2="42" stroke="#000" strokeWidth="1" opacity="0.3" />
      <path d="M23 28 Q32 35 23 56" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M41 28 Q32 35 41 56" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="32" cy="42" r="4" fill={NINERS.red} />
      <circle cx="32" cy="42" r="1.5" fill="#111" />

      {/* Right jog wheel - basketball */}
      <circle cx="88" cy="42" r="24" fill="#1A1A1A" stroke={NINERS.red} strokeWidth="2" />
      <circle cx="88" cy="42" r="20" fill={WARRIORS.gold} />
      <circle cx="88" cy="42" r="16" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="88" cy="42" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <line x1="88" y1="22" x2="88" y2="62" stroke="#000" strokeWidth="1" opacity="0.3" />
      <line x1="68" y1="42" x2="108" y2="42" stroke="#000" strokeWidth="1" opacity="0.3" />
      <path d="M79 28 Q88 35 79 56" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M97 28 Q88 35 97 56" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="88" cy="42" r="4" fill={NINERS.red} />
      <circle cx="88" cy="42" r="1.5" fill="#111" />

      {/* Center mixer section */}
      <rect x="54" y="10" width="12" height="52" rx="2" fill="#161B22" stroke="#333" strokeWidth="1" />

      {/* Channel faders */}
      <rect x="56" y="14" width="3" height="20" rx="1" fill="#222" />
      <rect x="56" y="24" width="3" height="8" fill={WARRIORS.gold} rx="1" />
      <rect x="61" y="14" width="3" height="20" rx="1" fill="#222" />
      <rect x="61" y="20" width="3" height="12" fill={NINERS.red} rx="1" />

      {/* Crossfader */}
      <rect x="56" y="50" width="8" height="6" rx="1" fill="#222" stroke="#444" strokeWidth="0.5" />
      <rect x="58" y="51" width="4" height="4" rx="0.5" fill={WARRIORS.gold} />

      {/* Display screen with code */}
      <rect x="56" y="38" width="8" height="8" rx="1" fill="#000" stroke="#222" strokeWidth="0.5" />
      <text x="60" y="43" textAnchor="middle" fill="#0F0" fontSize="4" fontFamily="monospace">128</text>

      {/* Code bracket accents */}
      <path d="M6 38 L2 42 L6 46" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M114 38 L118 42 L114 46" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />

      {/* Performance pads hint */}
      <rect x="10" y="10" width="4" height="4" rx="0.5" fill={WARRIORS.blue} />
      <rect x="16" y="10" width="4" height="4" rx="0.5" fill="#222" />
      <rect x="100" y="10" width="4" height="4" rx="0.5" fill="#222" />
      <rect x="106" y="10" width="4" height="4" rx="0.5" fill={NINERS.red} />
    </svg>
  );
}
