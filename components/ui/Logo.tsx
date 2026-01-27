/**
 * Logo Components
 * ===============
 * Personal brand representing:
 * - Bay Area (home)
 * - Warriors & 49ers (sports teams)
 * - DJ/Music (hobby)
 * - Code (career)
 *
 * Four vibes: Professional, Creative, Streetwear, Techy
 */

interface LogoProps {
  className?: string;
  size?: number;
}

// Official team colors
const WARRIORS = {
  blue: '#1D428A',
  gold: '#FDB927',
};

const NINERS = {
  red: '#AA0000',
  gold: '#B3995D',
};

/**
 * Base Logo - Simple code brackets with vinyl
 */
export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo"
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30" />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/20" />
      <path d="M18 16L10 24L18 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan" />
      <path d="M30 16L38 24L30 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan" />
      <path d="M27 17L21 31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-amber" />
      <circle cx="24" cy="24" r="4" className="fill-amber/20" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="1.5" className="fill-amber" />
    </svg>
  );
}

/**
 * 1. PROFESSIONAL / CLEAN
 * Minimal, corporate-friendly, serious
 * Monochrome with subtle team color accents
 */
export function LogoProfessional({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Professional"
    >
      {/* Clean circle badge */}
      <circle cx="32" cy="32" r="30" fill="#0A0A0A" stroke="#333" strokeWidth="2" />

      {/* Subtle bridge silhouette - Bay Area */}
      <path
        d="M12 40 C12 40, 22 28, 32 28 C42 28, 52 40, 52 40"
        stroke="#444"
        strokeWidth="1.5"
        fill="none"
      />
      <rect x="20" y="28" width="2" height="14" fill="#444" />
      <rect x="42" y="28" width="2" height="14" fill="#444" />
      <rect x="12" y="42" width="40" height="2" fill="#555" />

      {/* Code brackets - main focus */}
      <path d="M22 22 L14 32 L22 42" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 22 L50 32 L42 42" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Minimal vinyl center */}
      <circle cx="32" cy="32" r="6" fill="#1A1A1A" stroke="#444" strokeWidth="1" />
      <circle cx="32" cy="32" r="2" fill={WARRIORS.gold} />

      {/* Subtle team color accent line */}
      <line x1="14" y1="50" x2="26" y2="50" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="50" x2="50" y2="50" stroke={NINERS.red} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 2. CREATIVE / ARTISTIC
 * Expressive, unique, colorful
 * Full team colors, dynamic composition
 */
export function LogoCreative({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Creative"
    >
      {/* Dynamic background - split Warriors/49ers */}
      <clipPath id="leftHalf">
        <rect x="0" y="0" width="36" height="72" />
      </clipPath>
      <clipPath id="rightHalf">
        <rect x="36" y="0" width="36" height="72" />
      </clipPath>

      <circle cx="36" cy="36" r="34" fill={WARRIORS.blue} />
      <circle cx="36" cy="36" r="34" fill={NINERS.red} clipPath="url(#rightHalf)" />

      {/* Golden border */}
      <circle cx="36" cy="36" r="34" fill="none" stroke={WARRIORS.gold} strokeWidth="3" />

      {/* Bridge spanning both sides */}
      <path
        d="M8 44 C8 44, 22 24, 36 24 C50 24, 64 44, 64 44"
        stroke={WARRIORS.gold}
        strokeWidth="2.5"
        fill="none"
      />
      <rect x="18" y="22" width="4" height="26" fill={WARRIORS.gold} />
      <rect x="50" y="22" width="4" height="26" fill={NINERS.gold} />
      <rect x="8" y="46" width="56" height="3" fill={NINERS.gold} />

      {/* Vertical cables */}
      <line x1="26" y1="30" x2="26" y2="46" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.7" />
      <line x1="36" y1="24" x2="36" y2="46" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.7" />
      <line x1="46" y1="30" x2="46" y2="46" stroke={NINERS.gold} strokeWidth="1" opacity="0.7" />

      {/* Large vinyl record */}
      <circle cx="36" cy="36" r="10" fill="#111" />
      <circle cx="36" cy="36" r="7" stroke="#333" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="4" stroke="#333" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="2.5" fill={WARRIORS.gold} />

      {/* Tonearm */}
      <path d="M36 36 L44 28 L46 29" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />

      {/* Code brackets */}
      <path d="M14 30 L8 38 L14 46" stroke={WARRIORS.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 30 L64 38 L58 46" stroke={NINERS.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Basketball texture hint on left */}
      <path d="M20 14 Q28 20 20 26" stroke={WARRIORS.gold} strokeWidth="1" fill="none" opacity="0.5" />

      {/* Football laces hint on right */}
      <line x1="52" y1="14" x2="52" y2="22" stroke={NINERS.gold} strokeWidth="1.5" opacity="0.5" />
      <line x1="50" y1="16" x2="54" y2="16" stroke={NINERS.gold} strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="20" x2="54" y2="20" stroke={NINERS.gold} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/**
 * 3. STREETWEAR / URBAN
 * Hip-hop culture, bold, fashion-forward
 * Heavy contrast, graffiti influence
 */
export function LogoStreetwear({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Streetwear"
    >
      {/* Hard black background */}
      <rect x="2" y="2" width="68" height="68" rx="8" fill="#000" stroke={WARRIORS.gold} strokeWidth="3" />

      {/* Diagonal split - Warriors/49ers */}
      <path d="M2 2 L70 70" stroke={NINERS.red} strokeWidth="4" />

      {/* Bold "AQ" letters - graffiti style */}
      {/* A */}
      <path
        d="M14 54 L24 18 L34 54 M18 42 L30 42"
        stroke={WARRIORS.gold}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Q as vinyl */}
      <circle cx="50" cy="36" r="14" fill={NINERS.red} stroke={WARRIORS.gold} strokeWidth="2" />
      <circle cx="50" cy="36" r="10" stroke="#000" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="50" cy="36" r="6" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="50" cy="36" r="3" fill="#000" />
      <circle cx="50" cy="36" r="1.5" fill={WARRIORS.gold} />
      {/* Q tail / tonearm */}
      <path d="M58 44 L66 56" stroke={WARRIORS.gold} strokeWidth="5" strokeLinecap="round" />

      {/* Bridge silhouette at bottom */}
      <path
        d="M10 58 C10 58, 20 52, 36 52 C52 52, 62 58, 62 58"
        stroke={NINERS.gold}
        strokeWidth="2"
        fill="none"
      />
      <rect x="18" y="52" width="2" height="8" fill={NINERS.gold} />
      <rect x="52" y="52" width="2" height="8" fill={NINERS.gold} />
      <rect x="10" y="60" width="52" height="2" fill={WARRIORS.gold} />

      {/* Code bracket accents */}
      <path d="M6 28 L2 36 L6 44" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M66 28 L70 36 L66 44" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/**
 * 4. TECHY / MODERN
 * Futuristic, digital, circuit-board aesthetic
 * Neon accents, geometric
 */
export function LogoTechy({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Techy"
    >
      {/* Dark tech background */}
      <rect x="2" y="2" width="68" height="68" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Circuit board lines */}
      <path d="M10 20 L20 20 L20 10" stroke="#30363D" strokeWidth="1" />
      <path d="M62 20 L52 20 L52 10" stroke="#30363D" strokeWidth="1" />
      <path d="M10 52 L20 52 L20 62" stroke="#30363D" strokeWidth="1" />
      <path d="M62 52 L52 52 L52 62" stroke="#30363D" strokeWidth="1" />

      {/* Glowing bridge - neon effect */}
      <path
        d="M10 42 C10 42, 24 26, 36 26 C48 26, 62 42, 62 42"
        stroke={WARRIORS.blue}
        strokeWidth="3"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M10 42 C10 42, 24 26, 36 26 C48 26, 62 42, 62 42"
        stroke={WARRIORS.gold}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Tower nodes */}
      <rect x="20" y="24" width="4" height="22" fill={WARRIORS.blue} opacity="0.3" />
      <rect x="21" y="25" width="2" height="20" fill={WARRIORS.gold} />
      <rect x="48" y="24" width="4" height="22" fill={NINERS.red} opacity="0.3" />
      <rect x="49" y="25" width="2" height="20" fill={NINERS.gold} />

      {/* Digital road deck */}
      <rect x="10" y="44" width="52" height="2" fill={WARRIORS.gold} />
      <rect x="10" y="44" width="52" height="2" fill={NINERS.red} opacity="0.5" />

      {/* Hexagonal vinyl - tech aesthetic */}
      <polygon
        points="36,28 44,32 44,40 36,44 28,40 28,32"
        fill="#161B22"
        stroke={WARRIORS.gold}
        strokeWidth="1.5"
      />
      <circle cx="36" cy="36" r="4" fill={NINERS.red} opacity="0.8" />
      <circle cx="36" cy="36" r="2" fill={WARRIORS.gold} />

      {/* Tonearm as data connection */}
      <path d="M36 36 L44 30" stroke={WARRIORS.gold} strokeWidth="1.5" />
      <circle cx="44" cy="30" r="2" fill={WARRIORS.gold} />
      <path d="M44 30 L50 26 L52 28" stroke="#30363D" strokeWidth="1" />

      {/* Code brackets - terminal style */}
      <path d="M16 30 L10 36 L16 42" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="square" />
      <path d="M56 30 L62 36 L56 42" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="square" />

      {/* Status indicators */}
      <circle cx="14" cy="14" r="3" fill={WARRIORS.gold} opacity="0.8" />
      <circle cx="58" cy="14" r="3" fill={NINERS.red} opacity="0.8" />

      {/* Binary/data hint */}
      <text x="22" y="60" fill="#30363D" fontSize="6" fontFamily="monospace">01</text>
      <text x="44" y="60" fill="#30363D" fontSize="6" fontFamily="monospace">10</text>
    </svg>
  );
}

/**
 * 5. BRIDGE + DJ
 * Bay Area bridge as the main focus with DJ elements
 */
export function LogoBridgeDJ({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Bridge DJ"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Bay Bridge - suspension style */}
      <path
        d="M8 46 L64 46"
        stroke={NINERS.gold}
        strokeWidth="3"
      />
      {/* Left tower */}
      <rect x="16" y="26" width="4" height="22" fill={WARRIORS.gold} />
      <path d="M18 26 L8 40" stroke={WARRIORS.gold} strokeWidth="1.5" />
      <path d="M18 26 L28 40" stroke={WARRIORS.gold} strokeWidth="1.5" />
      {/* Right tower */}
      <rect x="52" y="26" width="4" height="22" fill={NINERS.gold} />
      <path d="M54 26 L44 40" stroke={NINERS.gold} strokeWidth="1.5" />
      <path d="M54 26 L64 40" stroke={NINERS.gold} strokeWidth="1.5" />
      {/* Main cables */}
      <path
        d="M8 40 Q18 22, 36 22 Q54 22, 64 40"
        stroke={WARRIORS.gold}
        strokeWidth="2"
        fill="none"
      />
      {/* Vertical cables */}
      <line x1="24" y1="28" x2="24" y2="46" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.6" />
      <line x1="36" y1="22" x2="36" y2="46" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.6" />
      <line x1="48" y1="28" x2="48" y2="46" stroke={NINERS.gold} strokeWidth="1" opacity="0.6" />

      {/* Vinyl record in center */}
      <circle cx="36" cy="36" r="8" fill="#111" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="36" cy="36" r="5" stroke="#333" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="2.5" fill={NINERS.red} />
      <circle cx="36" cy="36" r="1" fill={WARRIORS.gold} />

      {/* Tonearm */}
      <path d="M36 36 L46 28 L50 30" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />

      {/* Code brackets */}
      <path d="M12 30 L6 36 L12 42" stroke={WARRIORS.blue} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M60 30 L66 36 L60 42" stroke={NINERS.red} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/**
 * 6. SPORTS + VINYL + CODE
 * Combined elements: basketball, football, vinyl, tonearm, code
 */
export function LogoSportsVinyl({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Sports Vinyl"
    >
      {/* Background - split */}
      <circle cx="36" cy="36" r="34" fill={WARRIORS.blue} />
      <path d="M36 2 A34 34 0 0 1 36 70" fill={NINERS.red} />
      <circle cx="36" cy="36" r="34" fill="none" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Large vinyl record - center */}
      <circle cx="36" cy="36" r="18" fill="#111" />
      <circle cx="36" cy="36" r="14" stroke="#222" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="10" stroke="#222" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="6" stroke="#333" strokeWidth="0.5" fill="none" />

      {/* Basketball texture on vinyl - left side */}
      <path d="M22 30 Q28 36 22 42" stroke={WARRIORS.gold} strokeWidth="1.5" fill="none" />
      <line x1="22" y1="36" x2="30" y2="36" stroke={WARRIORS.gold} strokeWidth="1" />

      {/* Football laces on vinyl - right side */}
      <line x1="46" y1="32" x2="46" y2="40" stroke={NINERS.gold} strokeWidth="1.5" />
      <line x1="44" y1="34" x2="48" y2="34" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="44" y1="38" x2="48" y2="38" stroke={NINERS.gold} strokeWidth="1" />

      {/* Center label */}
      <circle cx="36" cy="36" r="4" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="1.5" fill="#111" />

      {/* Tonearm */}
      <path d="M36 36 L48 24 L52 26" stroke={WARRIORS.gold} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="52" cy="26" r="2" fill={NINERS.gold} />

      {/* Code brackets - outer */}
      <path d="M10 28 L4 36 L10 44" stroke={WARRIORS.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 28 L68 36 L62 44" stroke={NINERS.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Sport icons hint */}
      <circle cx="16" cy="16" r="6" fill={WARRIORS.gold} opacity="0.3" />
      <path d="M13 16 Q16 13, 19 16 Q16 19, 13 16" stroke={WARRIORS.gold} strokeWidth="0.75" fill="none" />
      <ellipse cx="56" cy="16" rx="6" ry="4" fill={NINERS.gold} opacity="0.3" transform="rotate(-30 56 16)" />
    </svg>
  );
}

/**
 * 7. GOLDEN GATE MINIMAL
 * Iconic bridge silhouette with subtle elements
 */
export function LogoGoldenGateMinimal({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Golden Gate"
    >
      {/* Dark background */}
      <rect x="2" y="2" width="60" height="60" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Golden Gate Bridge - International Orange */}
      <rect x="14" y="18" width="4" height="30" fill="#FF6B35" />
      <rect x="46" y="18" width="4" height="30" fill="#FF6B35" />

      {/* Main cables */}
      <path
        d="M6 28 Q16 12, 32 12 Q48 12, 58 28"
        stroke="#FF6B35"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Vertical suspenders */}
      <line x1="22" y1="18" x2="22" y2="46" stroke="#FF6B35" strokeWidth="1" opacity="0.7" />
      <line x1="32" y1="12" x2="32" y2="46" stroke="#FF6B35" strokeWidth="1" opacity="0.7" />
      <line x1="42" y1="18" x2="42" y2="46" stroke="#FF6B35" strokeWidth="1" opacity="0.7" />

      {/* Road deck */}
      <rect x="6" y="46" width="52" height="3" fill="#FF6B35" />

      {/* Vinyl hint at center */}
      <circle cx="32" cy="32" r="6" fill="#111" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="32" cy="32" r="2" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M8 34 L4 40 L8 46" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M56 34 L60 40 L56 46" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Team color accents */}
      <circle cx="10" cy="10" r="3" fill={WARRIORS.blue} />
      <circle cx="54" cy="10" r="3" fill={NINERS.red} />
    </svg>
  );
}

/**
 * 8. BASKETBALL VINYL + CODE TONEARMS
 * Vinyl record styled as basketball with code brackets as tonearms
 */
export function LogoBasketballVinyl({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Basketball Vinyl"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Vinyl record - basketball orange with grooves */}
      <circle cx="36" cy="36" r="20" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="16" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.3" />
      <circle cx="36" cy="36" r="12" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.3" />
      <circle cx="36" cy="36" r="8" stroke="#000" strokeWidth="0.5" fill="none" opacity="0.3" />

      {/* Basketball lines */}
      <line x1="36" y1="16" x2="36" y2="56" stroke="#000" strokeWidth="1.5" opacity="0.4" />
      <line x1="16" y1="36" x2="56" y2="36" stroke="#000" strokeWidth="1.5" opacity="0.4" />
      <path d="M22 22 Q36 32 22 50" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M50 22 Q36 32 50 50" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.4" />

      {/* Center label - vinyl spindle */}
      <circle cx="36" cy="36" r="4" fill="#111" />
      <circle cx="36" cy="36" r="1.5" fill={NINERS.red} />

      {/* Code brackets AS tonearms - left bracket arm */}
      <path
        d="M14 28 L8 36 L14 44"
        stroke={WARRIORS.blue}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tonearm connection from left bracket to vinyl */}
      <line x1="14" y1="36" x2="20" y2="36" stroke={WARRIORS.blue} strokeWidth="2" />
      <circle cx="20" cy="36" r="2" fill={WARRIORS.blue} />

      {/* Code brackets AS tonearms - right bracket arm */}
      <path
        d="M58 28 L64 36 L58 44"
        stroke={NINERS.red}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tonearm connection from right bracket to vinyl */}
      <line x1="58" y1="36" x2="52" y2="36" stroke={NINERS.red} strokeWidth="2" />
      <circle cx="52" cy="36" r="2" fill={NINERS.red} />

      {/* Football hint at bottom */}
      <ellipse cx="36" cy="60" rx="8" ry="4" fill={NINERS.red} opacity="0.5" />
      <line x1="36" y1="56" x2="36" y2="64" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="33" y1="59" x2="39" y2="59" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="33" y1="61" x2="39" y2="61" stroke={NINERS.gold} strokeWidth="0.75" />
    </svg>
  );
}

/**
 * 9. CHAMPIONSHIP RING
 * Sports championship ring style
 */
export function LogoChampionshipRing({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Championship"
    >
      {/* Outer ring - gold */}
      <circle cx="36" cy="36" r="32" fill="none" stroke={WARRIORS.gold} strokeWidth="6" />
      <circle cx="36" cy="36" r="28" fill="none" stroke={NINERS.gold} strokeWidth="2" />

      {/* Inner background */}
      <circle cx="36" cy="36" r="26" fill="#0A0A0A" />

      {/* Diamond/gem facets at top */}
      <polygon points="36,8 42,16 36,14 30,16" fill={WARRIORS.gold} />
      <polygon points="36,14 42,16 36,20 30,16" fill={NINERS.gold} opacity="0.8" />

      {/* "AQ" monogram */}
      <text x="36" y="42" textAnchor="middle" fill={WARRIORS.gold} fontSize="18" fontWeight="bold" fontFamily="serif">AQ</text>

      {/* Warriors side - left */}
      <circle cx="16" cy="36" r="4" fill={WARRIORS.blue} />
      <text x="16" y="38" textAnchor="middle" fill={WARRIORS.gold} fontSize="6" fontWeight="bold">W</text>

      {/* 49ers side - right */}
      <circle cx="56" cy="36" r="4" fill={NINERS.red} />
      <text x="56" y="38" textAnchor="middle" fill={NINERS.gold} fontSize="6" fontWeight="bold">SF</text>

      {/* Vinyl grooves hint */}
      <circle cx="36" cy="36" r="20" fill="none" stroke="#333" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="16" fill="none" stroke="#333" strokeWidth="0.5" />

      {/* Code brackets */}
      <path d="M24 50 L20 54 L24 58" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M48 50 L52 54 L48 58" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />

      {/* Small gems around */}
      <circle cx="36" cy="64" r="2" fill={WARRIORS.gold} />
      <circle cx="26" cy="62" r="1.5" fill={NINERS.gold} />
      <circle cx="46" cy="62" r="1.5" fill={NINERS.gold} />
    </svg>
  );
}

/**
 * 10. NEON GLOW
 * Cyberpunk-inspired with glowing effects
 */
export function LogoNeonGlow({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Neon"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dark background */}
      <rect x="2" y="2" width="68" height="68" rx="8" fill="#0A0A0F" />

      {/* Neon vinyl */}
      <circle cx="36" cy="36" r="18" fill="none" stroke="#FF00FF" strokeWidth="2" filter="url(#glow)" />
      <circle cx="36" cy="36" r="14" fill="none" stroke="#FF00FF" strokeWidth="1" opacity="0.5" />
      <circle cx="36" cy="36" r="10" fill="none" stroke="#00FFFF" strokeWidth="1" opacity="0.5" />
      <circle cx="36" cy="36" r="4" fill="#00FFFF" filter="url(#glow)" />

      {/* Neon brackets */}
      <path d="M14 26 L6 36 L14 46" stroke="#00FFFF" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
      <path d="M58 26 L66 36 L58 46" stroke="#FF00FF" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />

      {/* Tonearm */}
      <path d="M36 36 L48 24" stroke={WARRIORS.gold} strokeWidth="2" filter="url(#glow)" />

      {/* Team color dots */}
      <circle cx="20" cy="12" r="4" fill={WARRIORS.blue} filter="url(#glow)" />
      <circle cx="52" cy="12" r="4" fill={NINERS.red} filter="url(#glow)" />
    </svg>
  );
}

/**
 * 11. RETRO 80s
 * Synthwave/retrowave aesthetic
 */
export function LogoRetro80s({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Retro"
    >
      <defs>
        <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="50%" stopColor="#FF8E53" />
          <stop offset="100%" stopColor="#FDB927" />
        </linearGradient>
        <linearGradient id="gridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect x="2" y="2" width="68" height="68" rx="4" fill="#1A0A2E" />

      {/* Sun/vinyl */}
      <circle cx="36" cy="32" r="16" fill="url(#sunsetGrad)" />
      {/* Horizontal lines through sun */}
      <rect x="20" y="30" width="32" height="2" fill="#1A0A2E" />
      <rect x="20" y="34" width="32" height="2" fill="#1A0A2E" />
      <rect x="20" y="38" width="32" height="3" fill="#1A0A2E" />
      <rect x="20" y="43" width="32" height="5" fill="#1A0A2E" />

      {/* Center vinyl hole */}
      <circle cx="36" cy="32" r="3" fill="#1A0A2E" />
      <circle cx="36" cy="32" r="1.5" fill={WARRIORS.gold} />

      {/* Grid floor */}
      <path d="M2 50 L70 50" stroke="url(#gridGrad)" strokeWidth="1" />
      <path d="M2 56 L70 56" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.7" />
      <path d="M2 62 L70 62" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.4" />
      {/* Vertical grid */}
      <path d="M10 50 L6 70" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.5" />
      <path d="M26 50 L22 70" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.5" />
      <path d="M36 50 L36 70" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.5" />
      <path d="M46 50 L50 70" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.5" />
      <path d="M62 50 L66 70" stroke="url(#gridGrad)" strokeWidth="1" opacity="0.5" />

      {/* Code brackets */}
      <path d="M10 28 L4 36 L10 44" stroke="#00FFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M62 28 L68 36 L62 44" stroke="#FF00FF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Team colors as palm trees hint */}
      <rect x="8" y="42" width="2" height="8" fill={WARRIORS.blue} />
      <rect x="62" y="42" width="2" height="8" fill={NINERS.red} />
    </svg>
  );
}

/**
 * 12. GEOMETRIC MINIMAL
 * Clean geometric shapes, very minimal
 */
export function LogoGeometric({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Geometric"
    >
      {/* Background */}
      <rect x="2" y="2" width="60" height="60" fill="#0D1117" />

      {/* Geometric A */}
      <polygon points="20,48 32,16 44,48" fill="none" stroke={WARRIORS.gold} strokeWidth="2" />
      <line x1="24" y1="38" x2="40" y2="38" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Q as circle with tail */}
      <circle cx="32" cy="36" r="12" fill="none" stroke={NINERS.gold} strokeWidth="2" />
      <line x1="40" y1="44" x2="50" y2="54" stroke={NINERS.gold} strokeWidth="2" />

      {/* Bracket accents */}
      <path d="M8 26 L4 32 L8 38" stroke={WARRIORS.blue} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M56 26 L60 32 L56 38" stroke={NINERS.red} strokeWidth="1.5" strokeLinecap="round" />

      {/* Vinyl center dot */}
      <circle cx="32" cy="36" r="3" fill={WARRIORS.gold} />
    </svg>
  );
}

/**
 * 13. HOLOGRAPHIC
 * Iridescent/holographic effect
 */
export function LogoHolographic({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Holographic"
    >
      <defs>
        <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="25%" stopColor="#C44AFF" />
          <stop offset="50%" stopColor="#00D4FF" />
          <stop offset="75%" stopColor="#7FFF00" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <linearGradient id="holoGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="50%" stopColor="#FF6B9D" />
          <stop offset="100%" stopColor="#C44AFF" />
        </linearGradient>
      </defs>

      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0A0A0A" stroke="url(#holoGrad)" strokeWidth="2" />

      {/* Holographic vinyl */}
      <circle cx="36" cy="36" r="20" fill="none" stroke="url(#holoGrad)" strokeWidth="3" />
      <circle cx="36" cy="36" r="16" fill="none" stroke="url(#holoGrad2)" strokeWidth="1" opacity="0.7" />
      <circle cx="36" cy="36" r="12" fill="none" stroke="url(#holoGrad)" strokeWidth="1" opacity="0.5" />
      <circle cx="36" cy="36" r="8" fill="none" stroke="url(#holoGrad2)" strokeWidth="1" opacity="0.3" />

      {/* Center */}
      <circle cx="36" cy="36" r="4" fill="url(#holoGrad)" />

      {/* Tonearm */}
      <path d="M36 36 L50 22 L54 24" stroke="url(#holoGrad)" strokeWidth="2" strokeLinecap="round" />

      {/* Holographic brackets */}
      <path d="M12 28 L6 36 L12 44" stroke="url(#holoGrad)" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 28 L66 36 L60 44" stroke="url(#holoGrad2)" strokeWidth="3" strokeLinecap="round" />

      {/* Team color hints */}
      <circle cx="18" cy="14" r="4" fill={WARRIORS.blue} opacity="0.6" />
      <circle cx="54" cy="14" r="4" fill={NINERS.red} opacity="0.6" />
    </svg>
  );
}

/**
 * 14. STICKER/PATCH
 * Embroidered patch or sticker style
 */
export function LogoSticker({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Sticker"
    >
      {/* Sticker background with slight shadow */}
      <ellipse cx="36" cy="38" rx="32" ry="30" fill="#000" opacity="0.2" />
      <circle cx="36" cy="36" r="32" fill="#FAFAFA" stroke="#E0E0E0" strokeWidth="2" />

      {/* Inner circle */}
      <circle cx="36" cy="36" r="28" fill="none" stroke={WARRIORS.gold} strokeWidth="3" strokeDasharray="4 2" />

      {/* Vinyl record */}
      <circle cx="36" cy="36" r="16" fill="#222" />
      <circle cx="36" cy="36" r="12" stroke="#333" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="8" stroke="#333" strokeWidth="0.5" fill="none" />
      <circle cx="36" cy="36" r="4" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="1.5" fill="#222" />

      {/* Tonearm */}
      <path d="M36 36 L46 26 L50 28" stroke="#222" strokeWidth="2" strokeLinecap="round" />

      {/* Code brackets */}
      <path d="M12 30 L6 36 L12 42" stroke={WARRIORS.blue} strokeWidth="3" strokeLinecap="round" />
      <path d="M60 30 L66 36 L60 42" stroke={NINERS.red} strokeWidth="3" strokeLinecap="round" />

      {/* Text banner */}
      <rect x="14" y="54" width="44" height="10" rx="2" fill={WARRIORS.gold} />
      <text x="36" y="62" textAnchor="middle" fill="#000" fontSize="7" fontWeight="bold" fontFamily="sans-serif">BAY AREA</text>

      {/* Sport icons */}
      <circle cx="18" cy="18" r="6" fill={WARRIORS.blue} />
      <circle cx="54" cy="18" r="6" fill={NINERS.red} />
    </svg>
  );
}

/**
 * 15. MONOGRAM SHIELD
 * Classic shield with AQ monogram
 */
export function LogoMonogramShield({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Shield"
    >
      {/* Shield shape */}
      <path
        d="M32 4 L56 12 L56 32 C56 48 32 60 32 60 C32 60 8 48 8 32 L8 12 Z"
        fill="#0D1117"
        stroke={WARRIORS.gold}
        strokeWidth="2"
      />

      {/* Split colors */}
      <path d="M32 4 L32 60 L8 48 C8 48 8 32 8 32 L8 12 Z" fill={WARRIORS.blue} opacity="0.3" />
      <path d="M32 4 L56 12 L56 32 C56 48 32 60 32 60 Z" fill={NINERS.red} opacity="0.3" />

      {/* AQ Monogram */}
      <text x="32" y="38" textAnchor="middle" fill={WARRIORS.gold} fontSize="20" fontWeight="bold" fontFamily="serif">AQ</text>

      {/* Vinyl hint */}
      <circle cx="32" cy="32" r="18" fill="none" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.3" />

      {/* Code brackets at bottom */}
      <path d="M16 48 L12 52 L16 56" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 48 L52 52 L48 56" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 16. CASSETTE TAPE
 * Retro cassette tape style
 */
export function LogoCassette({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Cassette"
    >
      {/* Cassette body */}
      <rect x="2" y="2" width="76" height="48" rx="4" fill="#1A1A1A" stroke="#333" strokeWidth="2" />

      {/* Label area */}
      <rect x="8" y="6" width="64" height="24" rx="2" fill="#F5F5F5" />

      {/* Label text */}
      <text x="40" y="16" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold" fontFamily="sans-serif">ALVIN QUACH</text>
      <text x="40" y="25" textAnchor="middle" fill="#666" fontSize="5" fontFamily="sans-serif">BAY AREA • CODE • BEATS</text>

      {/* Team color stripes on label */}
      <rect x="8" y="6" width="32" height="3" fill={WARRIORS.blue} opacity="0.7" />
      <rect x="40" y="6" width="32" height="3" fill={NINERS.red} opacity="0.7" />

      {/* Tape reels */}
      <circle cx="24" cy="38" r="8" fill="#111" stroke="#333" strokeWidth="1" />
      <circle cx="24" cy="38" r="4" fill="#222" />
      <circle cx="24" cy="38" r="2" fill={WARRIORS.gold} />

      <circle cx="56" cy="38" r="8" fill="#111" stroke="#333" strokeWidth="1" />
      <circle cx="56" cy="38" r="4" fill="#222" />
      <circle cx="56" cy="38" r="2" fill={NINERS.gold} />

      {/* Tape window */}
      <rect x="30" y="34" width="20" height="8" rx="1" fill="#222" stroke="#444" strokeWidth="1" />
      <line x1="32" y1="38" x2="48" y2="38" stroke="#333" strokeWidth="1" />

      {/* Code bracket holes */}
      <path d="M12 38 L8 42 L12 46" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68 38 L72 42 L68 46" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 17. WAVEFORM
 * Audio waveform style
 */
export function LogoWaveform({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Waveform"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Waveform bars */}
      <rect x="12" y="30" width="3" height="12" fill={WARRIORS.blue} />
      <rect x="17" y="24" width="3" height="24" fill={WARRIORS.blue} />
      <rect x="22" y="18" width="3" height="36" fill={WARRIORS.gold} />
      <rect x="27" y="22" width="3" height="28" fill={WARRIORS.gold} />
      <rect x="32" y="14" width="3" height="44" fill={WARRIORS.gold} />
      <rect x="37" y="20" width="3" height="32" fill={NINERS.gold} />
      <rect x="42" y="16" width="3" height="40" fill={NINERS.gold} />
      <rect x="47" y="24" width="3" height="24" fill={NINERS.red} />
      <rect x="52" y="28" width="3" height="16" fill={NINERS.red} />
      <rect x="57" y="32" width="3" height="8" fill={NINERS.red} />

      {/* Vinyl center overlay */}
      <circle cx="36" cy="36" r="8" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="36" cy="36" r="3" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M8 28 L4 36 L8 44" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M64 28 L68 36 L64 44" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/**
 * 18. PIXEL ART
 * 8-bit pixel art style
 */
export function LogoPixel({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Pixel"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Background */}
      <rect width="32" height="32" fill="#0D1117" />

      {/* Vinyl - pixelated circle */}
      <rect x="12" y="8" width="8" height="2" fill="#333" />
      <rect x="10" y="10" width="2" height="2" fill="#333" />
      <rect x="20" y="10" width="2" height="2" fill="#333" />
      <rect x="8" y="12" width="2" height="8" fill="#333" />
      <rect x="22" y="12" width="2" height="8" fill="#333" />
      <rect x="10" y="20" width="2" height="2" fill="#333" />
      <rect x="20" y="20" width="2" height="2" fill="#333" />
      <rect x="12" y="22" width="8" height="2" fill="#333" />

      {/* Center */}
      <rect x="14" y="14" width="4" height="4" fill={WARRIORS.gold} />

      {/* Left bracket */}
      <rect x="4" y="12" width="2" height="2" fill={WARRIORS.blue} />
      <rect x="2" y="14" width="2" height="4" fill={WARRIORS.blue} />
      <rect x="4" y="18" width="2" height="2" fill={WARRIORS.blue} />

      {/* Right bracket */}
      <rect x="26" y="12" width="2" height="2" fill={NINERS.red} />
      <rect x="28" y="14" width="2" height="4" fill={NINERS.red} />
      <rect x="26" y="18" width="2" height="2" fill={NINERS.red} />

      {/* Tonearm */}
      <rect x="18" y="10" width="2" height="2" fill={WARRIORS.gold} />
      <rect x="20" y="8" width="2" height="2" fill={WARRIORS.gold} />
    </svg>
  );
}

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

/**
 * 21. GRADIENT BURST
 * Radial gradient explosion
 */
export function LogoGradientBurst({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Gradient Burst"
    >
      <defs>
        <radialGradient id="burstGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={WARRIORS.gold} />
          <stop offset="40%" stopColor={NINERS.red} />
          <stop offset="70%" stopColor={WARRIORS.blue} />
          <stop offset="100%" stopColor="#0D1117" />
        </radialGradient>
      </defs>

      <circle cx="36" cy="36" r="34" fill="url(#burstGrad)" />

      {/* Vinyl grooves */}
      <circle cx="36" cy="36" r="24" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.3" />
      <circle cx="36" cy="36" r="18" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.3" />
      <circle cx="36" cy="36" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.3" />

      {/* Center */}
      <circle cx="36" cy="36" r="6" fill="#0D1117" />
      <circle cx="36" cy="36" r="2" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M12 28 L4 36 L12 44" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 28 L68 36 L60 44" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />

      {/* Tonearm */}
      <path d="M36 36 L50 22" stroke="#FFF" strokeWidth="2" />
      <circle cx="50" cy="22" r="3" fill="#FFF" />
    </svg>
  );
}

/**
 * 22. OUTLINE ONLY
 * Pure linework, no fills
 */
export function LogoOutline({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Outline"
    >
      {/* Outer circle */}
      <circle cx="36" cy="36" r="34" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />

      {/* Vinyl */}
      <circle cx="36" cy="36" r="18" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
      <circle cx="36" cy="36" r="12" stroke="currentColor" strokeWidth="0.75" className="text-muted-foreground" />
      <circle cx="36" cy="36" r="6" stroke="currentColor" strokeWidth="0.75" className="text-muted-foreground" />
      <circle cx="36" cy="36" r="2" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />

      {/* Tonearm */}
      <path d="M36 36 L48 24 L52 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-foreground" />

      {/* Code brackets */}
      <path d="M10 28 L4 36 L10 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground" />
      <path d="M62 28 L68 36 L62 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground" />
    </svg>
  );
}

/**
 * 23. GLITCH
 * Glitchy/distorted aesthetic
 */
export function LogoGlitch({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Glitch"
    >
      {/* Background */}
      <rect x="2" y="2" width="68" height="68" fill="#0D1117" />

      {/* Glitch layers - offset copies */}
      {/* Red layer offset */}
      <circle cx="34" cy="36" r="16" fill="none" stroke={NINERS.red} strokeWidth="2" opacity="0.7" />
      <path d="M8 28 L2 36 L8 44" stroke={NINERS.red} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M60 28 L66 36 L60 44" stroke={NINERS.red} strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Cyan layer offset */}
      <circle cx="38" cy="36" r="16" fill="none" stroke="#00FFFF" strokeWidth="2" opacity="0.7" />
      <path d="M12 28 L6 36 L12 44" stroke="#00FFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M64 28 L70 36 L64 44" stroke="#00FFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* Main white layer */}
      <circle cx="36" cy="36" r="16" fill="none" stroke="#FFF" strokeWidth="2" />
      <circle cx="36" cy="36" r="4" fill="#FFF" />
      <path d="M10 28 L4 36 L10 44" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
      <path d="M62 28 L68 36 L62 44" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />

      {/* Glitch scan lines */}
      <rect x="2" y="20" width="68" height="2" fill="#FFF" opacity="0.1" />
      <rect x="2" y="40" width="68" height="1" fill="#FFF" opacity="0.1" />
      <rect x="2" y="55" width="68" height="2" fill="#FFF" opacity="0.1" />

      {/* Tonearm */}
      <path d="M36 36 L48 24" stroke="#FFF" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * 24. JERSEY NUMBER
 * Sports jersey style with number
 */
export function LogoJerseyNumber({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Jersey"
    >
      {/* Jersey shape */}
      <path
        d="M20 8 L8 16 L8 64 L28 64 L28 24 L44 24 L44 64 L64 64 L64 16 L52 8 L44 14 L28 14 Z"
        fill={WARRIORS.blue}
        stroke={WARRIORS.gold}
        strokeWidth="2"
      />

      {/* Number - using "1" as a placeholder */}
      <text x="36" y="52" textAnchor="middle" fill={WARRIORS.gold} fontSize="28" fontWeight="bold" fontFamily="sans-serif">1</text>

      {/* Vinyl hint in background */}
      <circle cx="36" cy="44" r="14" fill="none" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.3" />

      {/* Code bracket accents on sleeves */}
      <path d="M12 28 L8 34 L12 40" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 28 L64 34 L60 40" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 25. VINYL ONLY
 * Pure vinyl record focus
 */
export function LogoVinylOnly({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Vinyl"
    >
      {/* Vinyl record */}
      <circle cx="36" cy="36" r="34" fill="#111" stroke="#333" strokeWidth="1" />

      {/* Grooves */}
      <circle cx="36" cy="36" r="30" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="26" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="22" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="14" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />

      {/* Label */}
      <circle cx="36" cy="36" r="10" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="8" fill="none" stroke={NINERS.red} strokeWidth="1" />
      <text x="36" y="34" textAnchor="middle" fill="#000" fontSize="6" fontWeight="bold" fontFamily="sans-serif">AQ</text>
      <text x="36" y="42" textAnchor="middle" fill="#000" fontSize="4" fontFamily="sans-serif">BAY AREA</text>

      {/* Center hole */}
      <circle cx="36" cy="36" r="2" fill="#111" />

      {/* Light reflection */}
      <path d="M20 20 Q30 25 25 35" stroke="#333" strokeWidth="0.5" fill="none" opacity="0.5" />
    </svg>
  );
}

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

/**
 * 27. HEXAGON
 * Hexagonal shape
 */
export function LogoHexagon({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Hexagon"
    >
      {/* Hexagon background */}
      <polygon
        points="36,4 64,20 64,52 36,68 8,52 8,20"
        fill="#0D1117"
        stroke={WARRIORS.gold}
        strokeWidth="2"
      />

      {/* Inner hexagon */}
      <polygon
        points="36,14 54,26 54,46 36,58 18,46 18,26"
        fill="none"
        stroke={WARRIORS.blue}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Vinyl in center */}
      <circle cx="36" cy="36" r="12" fill="#111" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="36" cy="36" r="8" fill="none" stroke="#333" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="4" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="1.5" fill="#111" />

      {/* Tonearm */}
      <path d="M36 36 L48 24" stroke={WARRIORS.gold} strokeWidth="1.5" />
      <circle cx="48" cy="24" r="2" fill={NINERS.red} />

      {/* Code brackets */}
      <path d="M16 32 L12 36 L16 40" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M56 32 L60 36 L56 40" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 28. SPORTS CARD
 * Trading card style
 */
export function LogoSportsCard({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Sports Card"
    >
      {/* Card background */}
      <rect x="2" y="2" width="52" height="68" rx="4" fill="#FFF" stroke="#DDD" strokeWidth="1" />

      {/* Photo area */}
      <rect x="6" y="6" width="44" height="36" fill={WARRIORS.blue} />

      {/* Vinyl in photo area */}
      <circle cx="28" cy="24" r="14" fill="#111" />
      <circle cx="28" cy="24" r="10" fill="none" stroke="#222" strokeWidth="0.5" />
      <circle cx="28" cy="24" r="4" fill={WARRIORS.gold} />

      {/* Name plate */}
      <rect x="6" y="46" width="44" height="12" fill={NINERS.red} />
      <text x="28" y="55" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">ALVIN Q</text>

      {/* Stats area */}
      <text x="10" y="66" fill="#333" fontSize="5" fontFamily="sans-serif">CODE</text>
      <text x="28" y="66" fill="#333" fontSize="5" fontFamily="sans-serif">DJ</text>
      <text x="42" y="66" fill="#333" fontSize="5" fontFamily="sans-serif">BAY</text>

      {/* Code brackets as design element */}
      <path d="M8 24 L4 28 L8 32" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 24 L52 28 L48 32" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 29. COIN / MEDALLION
 * Currency/medal style
 */
export function LogoCoin({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Coin"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>

      {/* Outer rim */}
      <circle cx="36" cy="36" r="34" fill="url(#goldGrad)" />
      <circle cx="36" cy="36" r="32" fill="none" stroke="#8B7500" strokeWidth="1" />
      <circle cx="36" cy="36" r="30" fill="#DAA520" />
      <circle cx="36" cy="36" r="28" fill="none" stroke="#8B7500" strokeWidth="1" />

      {/* Inner circle */}
      <circle cx="36" cy="36" r="24" fill="#B8860B" />

      {/* AQ embossed */}
      <text x="36" y="44" textAnchor="middle" fill="#FFD700" fontSize="24" fontWeight="bold" fontFamily="serif">AQ</text>

      {/* Stars around edge */}
      <circle cx="36" cy="8" r="2" fill="#FFD700" />
      <circle cx="36" cy="64" r="2" fill="#FFD700" />
      <circle cx="8" cy="36" r="2" fill="#FFD700" />
      <circle cx="64" cy="36" r="2" fill="#FFD700" />

      {/* Vinyl hint */}
      <circle cx="36" cy="36" r="18" fill="none" stroke="#8B7500" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

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

/**
 * 31. DJ MIXER
 * Mixing console with faders and crossfader
 */
export function LogoDJMixer({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - DJ Mixer"
    >
      {/* Mixer body */}
      <rect x="4" y="8" width="64" height="56" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Channel strips */}
      {/* Left channel - Warriors */}
      <rect x="10" y="14" width="18" height="40" rx="2" fill="#161B22" stroke={WARRIORS.blue} strokeWidth="1" />
      <rect x="16" y="18" width="6" height="24" rx="1" fill="#222" />
      <rect x="16" y="30" width="6" height="12" fill={WARRIORS.gold} />
      <circle cx="19" cy="46" r="4" fill={WARRIORS.blue} stroke={WARRIORS.gold} strokeWidth="1" />

      {/* Right channel - 49ers */}
      <rect x="44" y="14" width="18" height="40" rx="2" fill="#161B22" stroke={NINERS.red} strokeWidth="1" />
      <rect x="50" y="18" width="6" height="24" rx="1" fill="#222" />
      <rect x="50" y="22" width="6" height="20" fill={NINERS.red} />
      <circle cx="53" cy="46" r="4" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="1" />

      {/* Crossfader in center */}
      <rect x="30" y="48" width="12" height="8" rx="2" fill="#222" stroke="#444" strokeWidth="1" />
      <rect x="34" y="50" width="4" height="4" rx="1" fill={WARRIORS.gold} />

      {/* Center VU meters */}
      <rect x="32" y="16" width="3" height="20" fill="#222" />
      <rect x="32" y="26" width="3" height="10" fill="#00FF00" />
      <rect x="37" y="16" width="3" height="20" fill="#222" />
      <rect x="37" y="24" width="3" height="12" fill="#00FF00" />

      {/* Code brackets as EQ knobs */}
      <path d="M14 58 L10 62 L14 66" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M58 58 L62 62 L58 66" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 32. BEAT GRID
 * Music production beat sequencer style
 */
export function LogoBeatGrid({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Beat Grid"
    >
      {/* Background */}
      <rect x="2" y="2" width="68" height="68" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Beat grid - 4x4 */}
      {/* Row 1 */}
      <rect x="8" y="8" width="12" height="12" rx="2" fill={WARRIORS.gold} />
      <rect x="24" y="8" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="40" y="8" width="12" height="12" rx="2" fill={NINERS.red} />
      <rect x="56" y="8" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />

      {/* Row 2 */}
      <rect x="8" y="24" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="24" y="24" width="12" height="12" rx="2" fill={WARRIORS.blue} />
      <rect x="40" y="24" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="56" y="24" width="12" height="12" rx="2" fill={NINERS.gold} />

      {/* Row 3 */}
      <rect x="8" y="40" width="12" height="12" rx="2" fill={WARRIORS.gold} />
      <rect x="24" y="40" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="40" y="40" width="12" height="12" rx="2" fill={NINERS.red} />
      <rect x="56" y="40" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />

      {/* Row 4 */}
      <rect x="8" y="56" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="24" y="56" width="12" height="12" rx="2" fill={WARRIORS.blue} />
      <rect x="40" y="56" width="12" height="12" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="56" y="56" width="12" height="12" rx="2" fill={NINERS.gold} />

      {/* Vinyl center overlay */}
      <circle cx="36" cy="36" r="8" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="1.5" />
      <circle cx="36" cy="36" r="3" fill={WARRIORS.gold} />
    </svg>
  );
}

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

/**
 * 35. CDJ DISPLAY
 * Digital DJ player screen aesthetic
 */
export function LogoCDJDisplay({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - CDJ Display"
    >
      {/* CDJ body */}
      <rect x="4" y="4" width="64" height="64" rx="6" fill="#0D1117" stroke="#30363D" strokeWidth="2" />

      {/* Display screen */}
      <rect x="10" y="10" width="52" height="32" rx="2" fill="#000" stroke="#222" strokeWidth="1" />

      {/* Waveform display */}
      <path
        d="M14 26 L18 20 L22 30 L26 18 L30 28 L34 22 L38 32 L42 16 L46 28 L50 24 L54 26 L58 22"
        stroke={WARRIORS.gold}
        strokeWidth="2"
        fill="none"
      />
      <line x1="36" y1="14" x2="36" y2="38" stroke={NINERS.red} strokeWidth="1" />

      {/* BPM display */}
      <text x="16" y="20" fill="#0F0" fontSize="6" fontFamily="monospace">128.0</text>
      <text x="44" y="20" fill={WARRIORS.gold} fontSize="5" fontFamily="monospace">BPM</text>

      {/* Jog wheel */}
      <circle cx="36" cy="54" r="12" fill="#111" stroke="#333" strokeWidth="1" />
      <circle cx="36" cy="54" r="8" fill="none" stroke="#222" strokeWidth="0.5" />
      <circle cx="36" cy="54" r="3" fill={WARRIORS.gold} />

      {/* Indicator dot on jog wheel */}
      <circle cx="36" cy="46" r="2" fill={NINERS.red} />

      {/* Play/cue buttons */}
      <rect x="10" y="48" width="8" height="8" rx="1" fill={WARRIORS.blue} />
      <polygon points="12,50 12,54 16,52" fill="#FFF" />
      <rect x="54" y="48" width="8" height="8" rx="1" fill={NINERS.red} />

      {/* Code brackets */}
      <path d="M6 30 L2 36 L6 42" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M66 30 L70 36 L66 42" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 36. SCRATCH PATTERN
 * Vinyl scratch marks aesthetic
 */
export function LogoScratchPattern({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Scratch Pattern"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Vinyl base */}
      <circle cx="36" cy="36" r="28" fill="#111" />

      {/* Scratch marks - diagonal lines suggesting movement */}
      <path d="M20 20 L52 52" stroke={WARRIORS.gold} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M52 20 L20 52" stroke={NINERS.red} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M36 12 L36 60" stroke={WARRIORS.blue} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M12 36 L60 36" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Motion blur lines */}
      <path d="M24 16 L16 24" stroke={WARRIORS.gold} strokeWidth="1" opacity="0.4" />
      <path d="M48 16 L56 24" stroke={NINERS.red} strokeWidth="1" opacity="0.4" />
      <path d="M24 56 L16 48" stroke={WARRIORS.blue} strokeWidth="1" opacity="0.4" />
      <path d="M48 56 L56 48" stroke={NINERS.gold} strokeWidth="1" opacity="0.4" />

      {/* Center label */}
      <circle cx="36" cy="36" r="8" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="5" fill="none" stroke="#000" strokeWidth="1" opacity="0.3" />
      <circle cx="36" cy="36" r="2" fill="#111" />

      {/* Code brackets */}
      <path d="M8 30 L4 36 L8 42" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M64 30 L68 36 L64 42" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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

/**
 * 38. HEADPHONES
 * DJ headphones with team colors
 */
export function LogoHeadphones({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Headphones"
    >
      {/* Headband */}
      <path
        d="M12 36 Q12 12 36 12 Q60 12 60 36"
        stroke="#333"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M12 36 Q12 12 36 12 Q60 12 60 36"
        stroke="#1A1A1A"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left ear cup - Warriors */}
      <rect x="4" y="32" width="16" height="24" rx="4" fill="#1A1A1A" stroke={WARRIORS.blue} strokeWidth="2" />
      <circle cx="12" cy="44" r="6" fill={WARRIORS.gold} />
      <circle cx="12" cy="44" r="3" fill="#111" />
      <circle cx="12" cy="44" r="1" fill={WARRIORS.gold} />

      {/* Right ear cup - 49ers */}
      <rect x="52" y="32" width="16" height="24" rx="4" fill="#1A1A1A" stroke={NINERS.red} strokeWidth="2" />
      <circle cx="60" cy="44" r="6" fill={NINERS.gold} />
      <circle cx="60" cy="44" r="3" fill="#111" />
      <circle cx="60" cy="44" r="1" fill={NINERS.gold} />

      {/* Padding */}
      <rect x="8" y="36" width="8" height="16" rx="2" fill="#222" />
      <rect x="56" y="36" width="8" height="16" rx="2" fill="#222" />

      {/* Code brackets in center */}
      <path d="M28 40 L24 46 L28 52" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M44 40 L48 46 L44 52" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />

      {/* Vinyl hint */}
      <circle cx="36" cy="46" r="6" fill="none" stroke="#333" strokeWidth="1" />
      <circle cx="36" cy="46" r="2" fill={WARRIORS.gold} />
    </svg>
  );
}

/**
 * 39. BASS DROP
 * Subwoofer/bass speaker inspired
 */
export function LogoBassDrop({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Bass Drop"
    >
      {/* Speaker cabinet */}
      <rect x="8" y="8" width="56" height="56" rx="4" fill="#0D1117" stroke="#333" strokeWidth="2" />

      {/* Speaker cone outer */}
      <circle cx="36" cy="36" r="24" fill="#1A1A1A" stroke="#333" strokeWidth="2" />

      {/* Cone ridges */}
      <circle cx="36" cy="36" r="20" fill="none" stroke="#222" strokeWidth="1" />
      <circle cx="36" cy="36" r="16" fill="none" stroke="#222" strokeWidth="1" />
      <circle cx="36" cy="36" r="12" fill="none" stroke="#222" strokeWidth="1" />

      {/* Dust cap */}
      <circle cx="36" cy="36" r="8" fill="#111" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Bass vibration waves */}
      <circle cx="36" cy="36" r="28" fill="none" stroke={WARRIORS.blue} strokeWidth="1" opacity="0.5" />
      <circle cx="36" cy="36" r="32" fill="none" stroke={NINERS.red} strokeWidth="1" opacity="0.3" />

      {/* Center - vinyl label style */}
      <circle cx="36" cy="36" r="4" fill={WARRIORS.gold} />
      <text x="36" y="38" textAnchor="middle" fill="#000" fontSize="4" fontWeight="bold">AQ</text>

      {/* Code brackets */}
      <path d="M4 32 L0 36 L4 40" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M68 32 L72 36 L68 40" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 40. SAMPLE PAD
 * MPC/drum machine pad grid
 */
export function LogoSamplePad({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Sample Pad"
    >
      {/* Device body */}
      <rect x="4" y="4" width="64" height="64" rx="6" fill="#0D1117" stroke="#30363D" strokeWidth="2" />

      {/* 4x4 pad grid */}
      {/* Row 1 */}
      <rect x="10" y="10" width="11" height="11" rx="2" fill={WARRIORS.gold} opacity="0.9" />
      <rect x="25" y="10" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="40" y="10" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="55" y="10" width="11" height="11" rx="2" fill={NINERS.red} opacity="0.9" />

      {/* Row 2 */}
      <rect x="10" y="25" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="25" y="25" width="11" height="11" rx="2" fill={WARRIORS.blue} opacity="0.9" />
      <rect x="40" y="25" width="11" height="11" rx="2" fill={NINERS.gold} opacity="0.9" />
      <rect x="55" y="25" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />

      {/* Row 3 */}
      <rect x="10" y="40" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="25" y="40" width="11" height="11" rx="2" fill={NINERS.gold} opacity="0.9" />
      <rect x="40" y="40" width="11" height="11" rx="2" fill={WARRIORS.blue} opacity="0.9" />
      <rect x="55" y="40" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />

      {/* Row 4 */}
      <rect x="10" y="55" width="11" height="11" rx="2" fill={NINERS.red} opacity="0.9" />
      <rect x="25" y="55" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="40" y="55" width="11" height="11" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="55" y="55" width="11" height="11" rx="2" fill={WARRIORS.gold} opacity="0.9" />

      {/* Center vinyl overlay */}
      <circle cx="36" cy="36" r="6" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="36" cy="36" r="2" fill={WARRIORS.gold} />
    </svg>
  );
}

/**
 * 41. CROSSFADER
 * Isolated crossfader with team colors
 */
export function LogoCrossfader({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Crossfader"
    >
      {/* Background circle */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Crossfader track */}
      <rect x="12" y="30" width="48" height="12" rx="6" fill="#1A1A1A" stroke="#333" strokeWidth="1" />

      {/* Track gradient - Warriors to 49ers */}
      <rect x="14" y="32" width="20" height="8" rx="4" fill={WARRIORS.blue} opacity="0.3" />
      <rect x="38" y="32" width="20" height="8" rx="4" fill={NINERS.red} opacity="0.3" />

      {/* Crossfader knob */}
      <rect x="30" y="26" width="12" height="20" rx="3" fill="#222" stroke={WARRIORS.gold} strokeWidth="2" />
      <rect x="34" y="30" width="4" height="12" rx="1" fill={WARRIORS.gold} />

      {/* Position markers */}
      <line x1="20" y1="46" x2="20" y2="50" stroke={WARRIORS.blue} strokeWidth="2" />
      <line x1="36" y1="46" x2="36" y2="50" stroke={WARRIORS.gold} strokeWidth="2" />
      <line x1="52" y1="46" x2="52" y2="50" stroke={NINERS.red} strokeWidth="2" />

      {/* Labels */}
      <text x="20" y="58" textAnchor="middle" fill={WARRIORS.blue} fontSize="6" fontWeight="bold">A</text>
      <text x="52" y="58" textAnchor="middle" fill={NINERS.red} fontSize="6" fontWeight="bold">B</text>

      {/* Vinyl hint above */}
      <circle cx="36" cy="16" r="6" fill="#111" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="36" cy="16" r="2" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M8 32 L4 36 L8 40" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M64 32 L68 36 L64 40" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 42. VINYL CRATE
 * Record crate/collection view
 */
export function LogoVinylCrate({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Vinyl Crate"
    >
      {/* Crate body */}
      <path
        d="M8 20 L8 60 L64 60 L64 20 L8 20"
        fill="#1A1A1A"
        stroke="#333"
        strokeWidth="2"
      />

      {/* Crate front panel */}
      <rect x="8" y="50" width="56" height="10" fill="#222" stroke="#333" strokeWidth="1" />

      {/* Records in crate - visible spines */}
      <rect x="12" y="22" width="2" height="28" fill={WARRIORS.blue} />
      <rect x="16" y="22" width="2" height="28" fill={WARRIORS.gold} />
      <rect x="20" y="22" width="2" height="28" fill="#333" />
      <rect x="24" y="22" width="2" height="28" fill={NINERS.red} />
      <rect x="28" y="22" width="2" height="28" fill={NINERS.gold} />
      <rect x="32" y="22" width="2" height="28" fill="#333" />
      <rect x="36" y="22" width="2" height="28" fill={WARRIORS.blue} />
      <rect x="40" y="22" width="2" height="28" fill="#333" />
      <rect x="44" y="22" width="2" height="28" fill={WARRIORS.gold} />
      <rect x="48" y="22" width="2" height="28" fill={NINERS.red} />
      <rect x="52" y="22" width="2" height="28" fill="#333" />
      <rect x="56" y="22" width="2" height="28" fill={NINERS.gold} />

      {/* Featured record pulled up */}
      <rect x="30" y="8" width="16" height="16" rx="2" fill={WARRIORS.gold} stroke="#333" strokeWidth="1" />
      <circle cx="38" cy="16" r="5" fill="#111" />
      <circle cx="38" cy="16" r="2" fill={NINERS.red} />

      {/* Code brackets on crate */}
      <path d="M12 54 L8 57 L12 60" stroke={WARRIORS.gold} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 54 L64 57 L60 60" stroke={NINERS.gold} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 43. BPM COUNTER
 * Digital BPM display
 */
export function LogoBPMCounter({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - BPM Counter"
    >
      {/* Background */}
      <rect x="4" y="12" width="64" height="48" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="2" />

      {/* Display screen */}
      <rect x="10" y="18" width="52" height="24" rx="2" fill="#000" stroke="#222" strokeWidth="1" />

      {/* BPM number - 7-segment style */}
      <text x="36" y="36" textAnchor="middle" fill={WARRIORS.gold} fontSize="20" fontWeight="bold" fontFamily="monospace">128</text>

      {/* BPM label */}
      <text x="36" y="50" textAnchor="middle" fill="#666" fontSize="8" fontFamily="sans-serif">BPM</text>

      {/* Beat indicators */}
      <circle cx="16" cy="52" r="4" fill={WARRIORS.gold} />
      <circle cx="28" cy="52" r="4" fill="#222" stroke="#333" strokeWidth="1" />
      <circle cx="44" cy="52" r="4" fill="#222" stroke="#333" strokeWidth="1" />
      <circle cx="56" cy="52" r="4" fill={NINERS.red} />

      {/* Tempo sync indicator */}
      <rect x="10" y="44" width="8" height="4" rx="1" fill={WARRIORS.blue} opacity="0.8" />
      <text x="14" y="47" textAnchor="middle" fill="#FFF" fontSize="3" fontFamily="sans-serif">SYNC</text>

      {/* Vinyl hint */}
      <circle cx="54" cy="22" r="4" fill="#111" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="54" cy="22" r="1.5" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M4 32 L0 38 L4 44" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M68 32 L72 38 L68 44" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 44. DUAL DECK
 * Two turntables setup view
 */
export function LogoDualDeck({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Dual Deck"
    >
      {/* Background */}
      <rect x="2" y="2" width="68" height="68" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Left turntable - Warriors */}
      <circle cx="22" cy="28" r="14" fill="#111" stroke={WARRIORS.blue} strokeWidth="2" />
      <circle cx="22" cy="28" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="22" cy="28" r="6" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="22" cy="28" r="3" fill={WARRIORS.gold} />

      {/* Right turntable - 49ers */}
      <circle cx="50" cy="28" r="14" fill="#111" stroke={NINERS.red} strokeWidth="2" />
      <circle cx="50" cy="28" r="10" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="50" cy="28" r="6" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="50" cy="28" r="3" fill={NINERS.gold} />

      {/* Tonearms */}
      <path d="M22 28 L30 20" stroke={WARRIORS.gold} strokeWidth="1.5" />
      <circle cx="30" cy="20" r="2" fill={WARRIORS.gold} />
      <path d="M50 28 L42 20" stroke={NINERS.gold} strokeWidth="1.5" />
      <circle cx="42" cy="20" r="2" fill={NINERS.gold} />

      {/* Mixer in center bottom */}
      <rect x="28" y="48" width="16" height="16" rx="2" fill="#161B22" stroke="#333" strokeWidth="1" />
      <rect x="32" y="52" width="3" height="8" rx="1" fill={WARRIORS.gold} />
      <rect x="37" y="54" width="3" height="6" rx="1" fill={NINERS.red} />

      {/* Crossfader */}
      <rect x="30" y="66" width="12" height="4" rx="1" fill="#222" stroke="#444" strokeWidth="1" />
      <rect x="34" y="67" width="4" height="2" fill={WARRIORS.gold} />

      {/* Code brackets */}
      <path d="M6 28 L2 34 L6 40" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M66 28 L70 34 L66 40" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 45. TEMPO SLIDER
 * Pitch/tempo fader inspired
 */
export function LogoTempoSlider({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach logo - Tempo Slider"
    >
      {/* Background */}
      <circle cx="36" cy="36" r="34" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Tempo slider track */}
      <rect x="32" y="10" width="8" height="52" rx="4" fill="#1A1A1A" stroke="#333" strokeWidth="1" />

      {/* Slider markings */}
      <line x1="26" y1="18" x2="30" y2="18" stroke="#333" strokeWidth="1" />
      <line x1="26" y1="26" x2="30" y2="26" stroke="#333" strokeWidth="1" />
      <line x1="26" y1="36" x2="30" y2="36" stroke={WARRIORS.gold} strokeWidth="2" />
      <line x1="26" y1="46" x2="30" y2="46" stroke="#333" strokeWidth="1" />
      <line x1="26" y1="54" x2="30" y2="54" stroke="#333" strokeWidth="1" />

      {/* Percentage labels */}
      <text x="22" y="20" textAnchor="end" fill="#666" fontSize="5" fontFamily="monospace">+8</text>
      <text x="22" y="38" textAnchor="end" fill={WARRIORS.gold} fontSize="5" fontFamily="monospace">0</text>
      <text x="22" y="56" textAnchor="end" fill="#666" fontSize="5" fontFamily="monospace">-8</text>

      {/* Slider knob */}
      <rect x="30" y="30" width="12" height="12" rx="2" fill="#222" stroke={WARRIORS.gold} strokeWidth="2" />
      <line x1="33" y1="36" x2="39" y2="36" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Side vinyl indicators */}
      <circle cx="14" cy="36" r="8" fill="#111" stroke={WARRIORS.blue} strokeWidth="1" />
      <circle cx="14" cy="36" r="3" fill={WARRIORS.gold} />

      <circle cx="58" cy="36" r="8" fill="#111" stroke={NINERS.red} strokeWidth="1" />
      <circle cx="58" cy="36" r="3" fill={NINERS.gold} />

      {/* Code brackets */}
      <path d="M8 48 L4 54 L8 60" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M64 48 L68 54 L64 60" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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

/**
 * 47. CODE DECK
 * Terminal/IDE aesthetic turntable - coding as primary focus
 */
export function LogoCodeDeck({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach code deck logo"
    >
      {/* Terminal window frame */}
      <rect x="2" y="2" width="76" height="76" rx="6" fill="#0D1117" stroke="#30363D" strokeWidth="2" />

      {/* Title bar */}
      <rect x="2" y="2" width="76" height="14" rx="6" fill="#161B22" />
      <rect x="2" y="10" width="76" height="6" fill="#161B22" />

      {/* Traffic lights */}
      <circle cx="12" cy="9" r="3" fill="#FF5F57" />
      <circle cx="22" cy="9" r="3" fill="#FFBD2E" />
      <circle cx="32" cy="9" r="3" fill="#28CA41" />

      {/* Tab - basketball icon hint */}
      <circle cx="60" cy="9" r="4" fill={WARRIORS.gold} opacity="0.3" />

      {/* Code content area */}
      <rect x="6" y="18" width="68" height="56" fill="#0D1117" />

      {/* Vinyl/basketball in center of code */}
      <circle cx="40" cy="48" r="20" fill={WARRIORS.gold} opacity="0.9" />
      <circle cx="40" cy="48" r="16" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="40" cy="48" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams */}
      <line x1="40" y1="28" x2="40" y2="68" stroke="#000" strokeWidth="1" opacity="0.3" />
      <line x1="20" y1="48" x2="60" y2="48" stroke="#000" strokeWidth="1" opacity="0.3" />
      <path d="M30 34 Q40 42 30 62" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M50 34 Q40 42 50 62" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Football center */}
      <ellipse cx="40" cy="48" rx="5" ry="3" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="40" y1="45.5" x2="40" y2="50.5" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="38" y1="47" x2="42" y2="47" stroke={NINERS.gold} strokeWidth="0.5" />
      <line x1="38" y1="49" x2="42" y2="49" stroke={NINERS.gold} strokeWidth="0.5" />

      {/* Code brackets as tonearms */}
      <path d="M14 38 L8 48 L14 58" stroke={WARRIORS.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M66 38 L72 48 L66 58" stroke={NINERS.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Stylus tips */}
      <circle cx="18" cy="48" r="2" fill={WARRIORS.gold} />
      <circle cx="62" cy="48" r="2" fill={NINERS.gold} />

      {/* Subtle code-inspired grid lines instead of actual code */}
      <line x1="10" y1="24" x2="18" y2="24" stroke="#30363D" strokeWidth="1" />
      <line x1="10" y1="28" x2="24" y2="28" stroke="#30363D" strokeWidth="1" />
      <line x1="10" y1="68" x2="16" y2="68" stroke="#30363D" strokeWidth="1" />
      <line x1="18" y1="68" x2="28" y2="68" stroke="#30363D" strokeWidth="1" />
    </svg>
  );
}

/**
 * 48. SPORTS DJ FUSION
 * Sports arena scoreboard meets DJ deck
 */
export function LogoSportsDJFusion({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach sports DJ fusion logo"
    >
      {/* Arena jumbotron shape */}
      <rect x="4" y="4" width="72" height="72" rx="4" fill="#0D1117" stroke={WARRIORS.gold} strokeWidth="2" />

      {/* Split background - arena style */}
      <rect x="4" y="4" width="36" height="72" fill={WARRIORS.blue} opacity="0.15" />
      <rect x="40" y="4" width="36" height="72" fill={NINERS.red} opacity="0.15" />

      {/* Center line */}
      <line x1="40" y1="4" x2="40" y2="76" stroke={WARRIORS.gold} strokeWidth="1" strokeDasharray="4 2" />

      {/* Large vinyl/basketball combo - main focus */}
      <circle cx="40" cy="40" r="24" fill={WARRIORS.gold} />
      <circle cx="40" cy="40" r="20" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="40" cy="40" r="16" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="40" cy="40" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams - more prominent */}
      <line x1="40" y1="16" x2="40" y2="64" stroke="#8B4513" strokeWidth="2" opacity="0.5" />
      <line x1="16" y1="40" x2="64" y2="40" stroke="#8B4513" strokeWidth="2" opacity="0.5" />
      <path d="M28 22 Q40 32 28 58" stroke="#8B4513" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M52 22 Q40 32 52 58" stroke="#8B4513" strokeWidth="2" fill="none" opacity="0.5" />

      {/* Football center - larger, more detailed */}
      <ellipse cx="40" cy="40" rx="8" ry="5" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="1.5" />
      <line x1="40" y1="36" x2="40" y2="44" stroke={NINERS.gold} strokeWidth="1.5" />
      <line x1="36" y1="38" x2="44" y2="38" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="36" y1="40" x2="44" y2="40" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="36" y1="42" x2="44" y2="42" stroke={NINERS.gold} strokeWidth="1" />

      {/* Spindle */}
      <circle cx="40" cy="40" r="1.5" fill="#111" />

      {/* Code bracket tonearms - larger, bolder */}
      <path d="M12 32 L6 40 L12 48" stroke={WARRIORS.blue} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="40" x2="18" y2="40" stroke={WARRIORS.blue} strokeWidth="2" />
      <circle cx="18" cy="40" r="2.5" fill={WARRIORS.gold} />

      <path d="M68 32 L74 40 L68 48" stroke={NINERS.red} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="68" y1="40" x2="62" y2="40" stroke={NINERS.red} strokeWidth="2" />
      <circle cx="62" cy="40" r="2.5" fill={NINERS.gold} />

      {/* Scoreboard-style display */}
      <rect x="12" y="8" width="24" height="10" rx="1" fill="#000" stroke="#333" strokeWidth="1" />
      <text x="24" y="15" textAnchor="middle" fill={WARRIORS.gold} fontSize="6" fontWeight="bold" fontFamily="monospace">128</text>

      <rect x="44" y="8" width="24" height="10" rx="1" fill="#000" stroke="#333" strokeWidth="1" />
      <text x="56" y="15" textAnchor="middle" fill={NINERS.gold} fontSize="6" fontWeight="bold" fontFamily="monospace">BPM</text>

      {/* Bracket accent at bottom */}
      <path d="M34 70 L32 72 L34 74" stroke="#6E7681" strokeWidth="1" strokeLinecap="round" />
      <path d="M46 70 L48 72 L46 74" stroke="#6E7681" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

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

/**
 * 50. FULLSTACK DJ
 * Multi-layer representation showing all elements stacked
 */
export function LogoFullstackDJ({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach fullstack DJ logo"
    >
      {/* Background */}
      <rect x="2" y="2" width="68" height="68" rx="6" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Layer indicator dots instead of text labels */}
      <circle cx="8" cy="14" r="2" fill={WARRIORS.blue} />
      <circle cx="8" cy="36" r="2" fill={WARRIORS.gold} />
      <circle cx="8" cy="58" r="2" fill={NINERS.red} />

      {/* Top layer - Code brackets (Frontend) */}
      <rect x="30" y="6" width="36" height="16" rx="2" fill="#161B22" stroke={WARRIORS.blue} strokeWidth="1" />
      <path d="M36 10 L32 14 L36 18" stroke={WARRIORS.gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M54 10 L58 14 L54 18" stroke={NINERS.gold} strokeWidth="2" strokeLinecap="round" />
      <text x="45" y="16" textAnchor="middle" fill="#79C0FF" fontSize="6" fontFamily="monospace">/</text>

      {/* Middle layer - Basketball/Vinyl (Backend/Logic) */}
      <rect x="30" y="26" width="36" height="20" rx="2" fill="#161B22" stroke={WARRIORS.gold} strokeWidth="1" />
      <circle cx="48" cy="36" r="8" fill={WARRIORS.gold} />
      <line x1="48" y1="28" x2="48" y2="44" stroke="#000" strokeWidth="0.75" opacity="0.3" />
      <line x1="40" y1="36" x2="56" y2="36" stroke="#000" strokeWidth="0.75" opacity="0.3" />
      <path d="M44 31 Q48 34 44 41" stroke="#000" strokeWidth="0.75" fill="none" opacity="0.3" />
      <path d="M52 31 Q48 34 52 41" stroke="#000" strokeWidth="0.75" fill="none" opacity="0.3" />
      <circle cx="48" cy="36" r="2" fill={NINERS.red} />

      {/* Bottom layer - Football (Database/Foundation) */}
      <rect x="30" y="50" width="36" height="16" rx="2" fill="#161B22" stroke={NINERS.red} strokeWidth="1" />
      <ellipse cx="48" cy="58" rx="12" ry="5" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="1" />
      <line x1="48" y1="54" x2="48" y2="62" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="43" y1="56" x2="53" y2="56" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="43" y1="58" x2="53" y2="58" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="43" y1="60" x2="53" y2="60" stroke={NINERS.gold} strokeWidth="0.75" />

      {/* Connection lines */}
      <line x1="48" y1="22" x2="48" y2="26" stroke={WARRIORS.gold} strokeWidth="1" strokeDasharray="2 1" />
      <line x1="48" y1="46" x2="48" y2="50" stroke={NINERS.gold} strokeWidth="1" strokeDasharray="2 1" />
    </svg>
  );
}

/**
 * 51. VINYL IDE
 * IDE/code editor with vinyl as the main visual
 */
export function LogoVinylIDE({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach vinyl IDE logo"
    >
      {/* IDE window */}
      <rect x="2" y="2" width="76" height="60" rx="4" fill="#0D1117" stroke="#30363D" strokeWidth="1" />

      {/* Title bar */}
      <rect x="2" y="2" width="76" height="10" rx="4" fill="#161B22" />
      <rect x="2" y="8" width="76" height="4" fill="#161B22" />

      {/* Traffic lights */}
      <circle cx="10" cy="7" r="2.5" fill="#FF5F57" />
      <circle cx="18" cy="7" r="2.5" fill="#FFBD2E" />
      <circle cx="26" cy="7" r="2.5" fill="#28CA41" />

      {/* File tabs - just colored indicator */}
      <rect x="36" y="3" width="18" height="8" rx="1" fill="#0D1117" />
      <rect x="40" y="5" width="10" height="4" rx="0.5" fill={WARRIORS.gold} opacity="0.3" />

      {/* Sidebar - abstract file tree using shapes */}
      <rect x="4" y="14" width="16" height="46" fill="#161B22" />
      {/* Folder indicators */}
      <rect x="6" y="18" width="6" height="2" rx="0.5" fill="#6E7681" />
      <rect x="8" y="24" width="8" height="2" rx="0.5" fill={WARRIORS.gold} />
      <rect x="8" y="30" width="6" height="2" rx="0.5" fill="#6E7681" />
      <rect x="8" y="36" width="7" height="2" rx="0.5" fill="#6E7681" />

      {/* Main editor area with vinyl */}
      <rect x="22" y="14" width="54" height="46" fill="#0D1117" />

      {/* Vinyl/basketball in editor */}
      <circle cx="49" cy="38" r="18" fill={WARRIORS.gold} />
      <circle cx="49" cy="38" r="14" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="49" cy="38" r="10" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams */}
      <line x1="49" y1="20" x2="49" y2="56" stroke="#000" strokeWidth="1" opacity="0.3" />
      <line x1="31" y1="38" x2="67" y2="38" stroke="#000" strokeWidth="1" opacity="0.3" />
      <path d="M40 25 Q49 32 40 51" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M58 25 Q49 32 58 51" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Football center */}
      <ellipse cx="49" cy="38" rx="5" ry="3" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="49" y1="35.5" x2="49" y2="40.5" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="47" y1="37" x2="51" y2="37" stroke={NINERS.gold} strokeWidth="0.5" />
      <line x1="47" y1="39" x2="51" y2="39" stroke={NINERS.gold} strokeWidth="0.5" />

      {/* Code bracket tonearms */}
      <path d="M28 32 L24 38 L28 44" stroke={WARRIORS.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 32 L74 38 L70 44" stroke={NINERS.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Line number indicators - just dots */}
      <circle cx="25" cy="20" r="1" fill="#6E7681" />
      <circle cx="25" cy="26" r="1" fill="#6E7681" />
      <circle cx="25" cy="54" r="1" fill="#6E7681" />
    </svg>
  );
}

/**
 * 52. CHAMPIONSHIP DECK
 * Championship ring combined with DJ deck
 */
export function LogoChampionshipDeck({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach championship deck logo"
    >
      <defs>
        <linearGradient id="championGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
      </defs>

      {/* Championship ring outer */}
      <circle cx="36" cy="36" r="34" fill="none" stroke="url(#championGold)" strokeWidth="6" />
      <circle cx="36" cy="36" r="30" fill="none" stroke="#8B7500" strokeWidth="1" />

      {/* Inner ring fill */}
      <circle cx="36" cy="36" r="28" fill="#0D1117" />

      {/* Diamond at top */}
      <polygon points="36,4 42,12 36,10 30,12" fill="#FFF" opacity="0.9" />
      <polygon points="36,10 42,12 36,16 30,12" fill={WARRIORS.gold} opacity="0.8" />

      {/* Basketball vinyl */}
      <circle cx="36" cy="36" r="20" fill={WARRIORS.gold} />
      <circle cx="36" cy="36" r="16" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="36" cy="36" r="12" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams */}
      <line x1="36" y1="16" x2="36" y2="56" stroke="#000" strokeWidth="1" opacity="0.3" />
      <line x1="16" y1="36" x2="56" y2="36" stroke="#000" strokeWidth="1" opacity="0.3" />
      <path d="M26 22 Q36 30 26 50" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M46 22 Q36 30 46 50" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Football center */}
      <ellipse cx="36" cy="36" rx="6" ry="4" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="1" />
      <line x1="36" y1="33" x2="36" y2="39" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="33" y1="35" x2="39" y2="35" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="33" y1="37" x2="39" y2="37" stroke={NINERS.gold} strokeWidth="0.75" />

      {/* Code bracket gems on sides */}
      <path d="M10 32 L6 36 L10 40" stroke={WARRIORS.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="36" r="3" fill={WARRIORS.blue} opacity="0.5" />

      <path d="M62 32 L66 36 L62 40" stroke={NINERS.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="66" cy="36" r="3" fill={NINERS.red} opacity="0.5" />

      {/* Small gems */}
      <circle cx="20" cy="12" r="2" fill={WARRIORS.gold} />
      <circle cx="52" cy="12" r="2" fill={NINERS.gold} />
      <circle cx="36" cy="66" r="2" fill={WARRIORS.gold} />

      {/* AQ text */}
      <text x="36" y="66" textAnchor="middle" fill={WARRIORS.gold} fontSize="0" fontWeight="bold" fontFamily="serif" opacity="0">AQ</text>
    </svg>
  );
}

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

/**
 * 54. VINYL SYNTAX
 * Record label styled as syntax highlighting
 */
export function LogoVinylSyntax({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach vinyl syntax logo"
    >
      {/* Vinyl record */}
      <circle cx="36" cy="36" r="34" fill="#111" stroke="#222" strokeWidth="1" />

      {/* Grooves */}
      <circle cx="36" cy="36" r="30" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="26" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="22" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="18" fill="none" stroke="#1a1a1a" strokeWidth="0.5" />

      {/* Large label - basketball colored with code */}
      <circle cx="36" cy="36" r="14" fill={WARRIORS.gold} />

      {/* Basketball seams as code structure */}
      <line x1="36" y1="22" x2="36" y2="50" stroke="#000" strokeWidth="1" opacity="0.3" />
      <line x1="22" y1="36" x2="50" y2="36" stroke="#000" strokeWidth="1" opacity="0.3" />

      {/* AQ monogram with syntax-color inspired styling */}
      <text x="36" y="38" textAnchor="middle" fill="#111" fontSize="10" fontWeight="bold" fontFamily="sans-serif">AQ</text>
      {/* Decorative lines suggesting code structure */}
      <line x1="28" y1="44" x2="32" y2="44" stroke="#FF7B72" strokeWidth="1" />
      <line x1="34" y1="44" x2="38" y2="44" stroke="#79C0FF" strokeWidth="1" />
      <line x1="40" y1="44" x2="44" y2="44" stroke="#7EE787" strokeWidth="1" />

      {/* Football center dot */}
      <ellipse cx="36" cy="47" rx="4" ry="2" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="0.5" />

      {/* Spindle */}
      <circle cx="36" cy="36" r="1" fill="#111" />

      {/* Code bracket tonearms */}
      <path d="M8 28 L4 36 L8 44" stroke={WARRIORS.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8" y1="36" x2="14" y2="36" stroke={WARRIORS.blue} strokeWidth="1.5" />
      <circle cx="14" cy="36" r="2" fill={WARRIORS.gold} />

      <path d="M64 28 L68 36 L64 44" stroke={NINERS.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="64" y1="36" x2="58" y2="36" stroke={NINERS.red} strokeWidth="1.5" />
      <circle cx="58" cy="36" r="2" fill={NINERS.gold} />

      {/* Light reflection */}
      <path d="M18 18 Q28 24 22 34" stroke="#333" strokeWidth="0.5" fill="none" opacity="0.5" />
    </svg>
  );
}

/**
 * 55. GAME DAY MIX
 * Stadium/arena atmosphere with DJ elements
 */
export function LogoGameDayMix({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach game day mix logo"
    >
      {/* Stadium lights effect */}
      <rect x="2" y="2" width="68" height="68" rx="4" fill="#0D1117" />

      {/* Light beams */}
      <polygon points="36,2 20,70 52,70" fill={WARRIORS.gold} opacity="0.1" />
      <polygon points="10,2 2,70 18,70" fill={WARRIORS.blue} opacity="0.1" />
      <polygon points="62,2 54,70 70,70" fill={NINERS.red} opacity="0.1" />

      {/* Crowd silhouette hint */}
      <path d="M2 62 Q10 58 18 60 Q26 58 36 60 Q46 58 54 60 Q62 58 70 62 L70 70 L2 70 Z" fill="#161B22" />

      {/* Main vinyl/basketball */}
      <circle cx="36" cy="36" r="22" fill={WARRIORS.gold} stroke={WARRIORS.gold} strokeWidth="2" />
      <circle cx="36" cy="36" r="18" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
      <circle cx="36" cy="36" r="14" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

      {/* Basketball seams */}
      <line x1="36" y1="14" x2="36" y2="58" stroke="#000" strokeWidth="1.5" opacity="0.3" />
      <line x1="14" y1="36" x2="58" y2="36" stroke="#000" strokeWidth="1.5" opacity="0.3" />
      <path d="M26 20 Q36 28 26 52" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M46 20 Q36 28 46 52" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.3" />

      {/* Football center */}
      <ellipse cx="36" cy="36" rx="6" ry="4" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="1" />
      <line x1="36" y1="33" x2="36" y2="39" stroke={NINERS.gold} strokeWidth="1" />
      <line x1="33" y1="35" x2="39" y2="35" stroke={NINERS.gold} strokeWidth="0.75" />
      <line x1="33" y1="37" x2="39" y2="37" stroke={NINERS.gold} strokeWidth="0.75" />

      {/* Code brackets - prominent */}
      <path d="M10 30 L4 36 L10 42" stroke={WARRIORS.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 30 L68 36 L62 42" stroke={NINERS.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Scoreboard - abstract display */}
      <rect x="24" y="6" width="24" height="10" rx="1" fill="#000" stroke="#333" strokeWidth="1" />
      {/* LED-style dots forming pattern */}
      <circle cx="30" cy="11" r="1.5" fill={WARRIORS.gold} />
      <circle cx="36" cy="11" r="1.5" fill={WARRIORS.gold} />
      <circle cx="42" cy="11" r="1.5" fill={NINERS.gold} />
    </svg>
  );
}

// Aliases for backward compatibility
export const LogoShield = LogoCreative;
export const LogoJersey = LogoStreetwear;
export const LogoChampionship = LogoChampionshipRing;
export const LogoTurntable = LogoTechy;
export const LogoBadge = LogoProfessional;
export const LogoBridge = LogoBridgeDJ;
export const LogoBayBridge = LogoBridgeDJ;
export const LogoGoldenGate = LogoGoldenGateMinimal;

/**
 * Minimal mark for small spaces
 */
export function LogoMark({ className, size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AQ"
    >
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
      <path d="M11 10L5 16L11 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan" />
      <path d="M21 10L27 16L21 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan" />
      <circle cx="16" cy="16" r="2" className="fill-amber" />
    </svg>
  );
}
