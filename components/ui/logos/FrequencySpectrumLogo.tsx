import { LogoProps, WARRIORS, NINERS } from './colors';

/**
 * 33. FREQUENCY SPECTRUM
 * Audio frequency analyzer visualization
 */
export function LogoFrequencySpectrum({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Frequency Spectrum"
    >
      <defs>
        <linearGradient id="spectrumGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={WARRIORS.blue} />
          <stop offset="50%" stopColor={WARRIORS.gold} />
          <stop offset="100%" stopColor={NINERS.red} />
        </linearGradient>
      </defs>

      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Frequency bars - arranged in arc */}
      <rect x="12" y="42" width="4" height="8" fill="url(#spectrumGrad)" rx="1" />
      <rect x="18" y="36" width="4" height="14" fill="url(#spectrumGrad)" rx="1" />
      <rect x="24" y="28" width="4" height="22" fill="url(#spectrumGrad)" rx="1" />
      <rect x="30" y="20" width="4" height="30" fill="url(#spectrumGrad)" rx="1" />
      <rect x="36" y="16" width="4" height="34" fill="url(#spectrumGrad)" rx="1" />
      <rect x="42" y="22" width="4" height="28" fill="url(#spectrumGrad)" rx="1" />
      <rect x="48" y="30" width="4" height="20" fill="url(#spectrumGrad)" rx="1" />
      <rect x="54" y="38" width="4" height="12" fill="url(#spectrumGrad)" rx="1" />

      {/* Vinyl center */}
      <circle cx="36" cy="56" r="6" fill="#111" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="36" cy="56" r="2" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M8 32 L4 38 L8 44" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M64 32 L68 38 L64 44" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
