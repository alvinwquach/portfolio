import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 46. ULTIMATE TURNTABLE
 * Enhanced turntable with all 4 elements prominently featured
 * Basketball vinyl + Football spindle + Code brackets as dual tonearms + Terminal display
 */
export function LogoUltimateTurntable({ className, size = 32 }: LogoProps) {
  const width = size;
  const height = size * 0.85;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach ultimate turntable logo"
    >
      {/* Turntable base */}
      <rect x="2" y="2" width="96" height="81" rx="6" fill="#0D1117" stroke="#30363D" strokeWidth="2" />

      {/* Top accent bar - split colors */}
      <rect x="2" y="2" width="48" height="5" rx="3" fill={WARRIORS.blue} />
      <rect x="50" y="2" width="48" height="5" rx="3" fill={NINERS.red} />

      {/* LED display panel - shows BPM and waveform hint */}
      <rect x="6" y="10" width="30" height="18" rx="2" fill="#000" stroke="#222" strokeWidth="1" />
      {/* Mini waveform */}
      <path d="M10 18 L14 14 L18 20 L22 12 L26 18 L30 16" stroke={WARRIORS.gold} strokeWidth="1.5" fill="none" />
      <text x="10" y="25" fill="#0F0" fontSize="5" fontFamily="monospace">128.0</text>

      {/* Platter ring */}
      <circle cx="50" cy="52" r="28" fill="#1A1A1A" stroke="#333" strokeWidth="2" />

      {/* Basketball-styled vinyl */}
      <circle cx="50" cy="52" r="24" fill={WARRIORS.gold} />

      {/* Vinyl grooves */}
      <circle cx="50" cy="52" r="20" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.25" />
      <circle cx="50" cy="52" r="16" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.25" />
      <circle cx="50" cy="52" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.25" />

      {/* Basketball seams */}
      <line x1="50" y1="28" x2="50" y2="76" stroke="#000" strokeWidth="1.5" opacity="0.35" />
      <line x1="26" y1="52" x2="74" y2="52" stroke="#000" strokeWidth="1.5" opacity="0.35" />
      <path d="M38 34 Q50 44 38 70" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.35" />
      <path d="M62 34 Q50 44 62 70" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.35" />

      {/* Football center label */}
      <ellipse cx="50" cy="52" rx="7" ry="4.5" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="1" />
      <line x1="50" y1="48" x2="50" y2="56" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="47.5" y1="50" x2="52.5" y2="50" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="47.5" y1="52" x2="52.5" y2="52" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="47.5" y1="54" x2="52.5" y2="54" stroke={NINERS.gold} strokeWidth="0.75" />

      {/* Spindle */}
      <circle cx="50" cy="52" r="1.5" fill="#111" />

      {/* LEFT TONEARM - Code bracket style (Warriors) */}
      <circle cx="12" cy="52" r="5" fill="#222" stroke={WARRIORS.blue} strokeWidth="1.5" />
      <path
        d="M12 52 L20 52 L24 52"
        stroke={WARRIORS.blue}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bracket headshell */}
      <path
        d="M28 48 L24 52 L28 56"
        stroke={WARRIORS.blue}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="24" cy="52" r="2" fill={WARRIORS.gold} />

      {/* RIGHT TONEARM - Code bracket style (49ers) */}
      <circle cx="88" cy="52" r="5" fill="#222" stroke={NINERS.red} strokeWidth="1.5" />
      <path
        d="M88 52 L80 52 L76 52"
        stroke={NINERS.red}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bracket headshell */}
      <path
        d="M72 48 L76 52 L72 56"
        stroke={NINERS.red}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="76" cy="52" r="2" fill={NINERS.gold} />

      {/* Pitch slider */}
      <rect x="82" y="12" width="10" height="24" rx="2" fill="#1A1A1A" stroke="#333" strokeWidth="1" />
      <rect x="84" y="20" width="6" height="8" rx="1" fill={WARRIORS.gold} />

      {/* Control buttons */}
      <circle cx="44" cy="14" r="4" fill="#222" stroke={WARRIORS.gold} strokeWidth="1" />
      <polygon points="43,12 43,16 46,14" fill={WARRIORS.gold} />

      <circle cx="56" cy="14" r="4" fill="#222" stroke={NINERS.red} strokeWidth="1" />
      <rect x="54" y="12" width="4" height="4" fill={NINERS.red} />
    </svg>
  );
}
