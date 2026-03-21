import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 26. TERMINAL
 * Command line / terminal aesthetic
 */
export function LogoTerminal({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Terminal"
    >
      {/* Terminal window */}
      <rect x="2" y="2" width="76" height="52" rx="6" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Title bar */}
      <rect x="2" y="2" width="76" height="12" rx="6" fill="#161B22" />
      <rect x="2" y="8" width="76" height="6" fill="#161B22" />

      {/* Traffic lights */}
      <circle cx="12" cy="8" r="3" fill="#FF5F57" />
      <circle cx="22" cy="8" r="3" fill="#FFBD2E" />
      <circle cx="32" cy="8" r="3" fill="#28CA41" />

      {/* Terminal text */}
      <text x="8" y="28" fill="#8B949E" fontSize="8" fontFamily="monospace">$</text>
      <text x="18" y="28" fill="#58A6FF" fontSize="8" fontFamily="monospace">whoami</text>
      <text x="8" y="40" fill={WARRIORS.gold} fontSize="8" fontFamily="monospace">alvin.quach</text>
      <text x="8" y="50" fill="#8B949E" fontSize="8" fontFamily="monospace">$ _</text>

      {/* Code brackets integrated */}
      <path d="M62 24 L58 30 L62 36" stroke={WARRIORS.blue} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68 24 L72 30 L68 36" stroke={NINERS.red} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
