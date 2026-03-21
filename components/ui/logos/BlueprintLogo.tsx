import { LogoProps } from './colors';

/**
 * 20. BLUEPRINT
 * Technical blueprint/schematic style
 */
export function LogoBlueprint({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Blueprint"
    >
      {/* Blueprint background */}
      <rect x="2" y="2" width="68" height="68" fill="#1E3A5F" />

      {/* Grid lines */}
      {[12, 24, 36, 48, 60].map((pos) => (
        <g key={pos}>
          <line x1={pos} y1="2" x2={pos} y2="70" stroke="#2E5A8F" strokeWidth="0.5" />
          <line x1="2" y1={pos} x2="70" y2={pos} stroke="#2E5A8F" strokeWidth="0.5" />
        </g>
      ))}

      {/* Vinyl schematic */}
      <circle cx="36" cy="36" r="18" fill="none" stroke="#FFF" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="36" cy="36" r="14" fill="none" stroke="#FFF" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="10" fill="none" stroke="#FFF" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="4" fill="none" stroke="#FFF" strokeWidth="1" />
      <circle cx="36" cy="36" r="2" fill="#FFF" />

      {/* Dimension lines */}
      <line x1="18" y1="8" x2="54" y2="8" stroke="#FFF" strokeWidth="0.5" />
      <line x1="18" y1="6" x2="18" y2="10" stroke="#FFF" strokeWidth="0.5" />
      <line x1="54" y1="6" x2="54" y2="10" stroke="#FFF" strokeWidth="0.5" />
      <text x="36" y="7" textAnchor="middle" fill="#FFF" fontSize="4" fontFamily="monospace">36px</text>

      {/* Code brackets with callouts */}
      <path d="M14 30 L8 36 L14 42" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M58 30 L64 36 L58 42" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Callout */}
      <line x1="8" y1="36" x2="8" y2="56" stroke="#FFF" strokeWidth="0.5" />
      <circle cx="8" cy="56" r="2" fill="none" stroke="#FFF" strokeWidth="0.5" />
      <text x="8" y="64" textAnchor="middle" fill="#FFF" fontSize="4" fontFamily="monospace">CODE</text>

      {/* Tonearm */}
      <path d="M36 36 L48 24" stroke="#FFF" strokeWidth="1" />
      <circle cx="48" cy="24" r="2" fill="none" stroke="#FFF" strokeWidth="0.5" />
    </svg>
  );
}
