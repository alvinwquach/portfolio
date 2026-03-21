import { LogoProps, WARRIORS } from './colors';

/**
 * 19. STAMP / SEAL
 * Official stamp or wax seal style
 */
export function LogoStamp({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Stamp"
    >
      {/* Wavy seal edge */}
      <path
        d="M36 4
           Q44 8 48 4 Q52 8 56 4 Q60 8 64 8
           Q64 16 68 20 Q64 24 68 28 Q64 32 68 36
           Q64 40 68 44 Q64 48 68 52 Q64 56 64 64
           Q56 64 52 68 Q48 64 44 68 Q40 64 36 68
           Q32 64 28 68 Q24 64 20 68 Q16 64 8 64
           Q8 56 4 52 Q8 48 4 44 Q8 40 4 36
           Q8 32 4 28 Q8 24 4 20 Q8 16 8 8
           Q16 8 20 4 Q24 8 28 4 Q32 8 36 4Z"
        fill="#8B0000"
        stroke="#6B0000"
        strokeWidth="1"
      />

      {/* Inner circle */}
      <circle cx="36" cy="36" r="24" fill="none" stroke={WARRIORS.gold} strokeWidth="2" />
      <circle cx="36" cy="36" r="20" fill="none" stroke={WARRIORS.gold} strokeWidth="1" />

      {/* AQ in center */}
      <text x="36" y="42" textAnchor="middle" fill={WARRIORS.gold} fontSize="18" fontWeight="bold" fontFamily="serif">AQ</text>

      {/* Text around edge */}
      <text x="36" y="18" textAnchor="middle" fill={WARRIORS.gold} fontSize="6" fontFamily="serif">BAY AREA</text>
      <text x="36" y="58" textAnchor="middle" fill={WARRIORS.gold} fontSize="6" fontFamily="serif">CODE • DJ</text>

      {/* Star accents */}
      <polygon points="18,36 20,34 22,36 20,38" fill={WARRIORS.gold} />
      <polygon points="50,36 52,34 54,36 52,38" fill={WARRIORS.gold} />
    </svg>
  );
}
