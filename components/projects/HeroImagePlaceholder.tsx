/**
 * HeroImagePlaceholder
 * ====================
 * Shown when a project has no hero image in the CMS.
 * Maintains the same aspect-[21/9] bounding box as the real hero image so
 * layout below it is never affected by the presence or absence of a photo.
 *
 * Design: felt, not seen.
 *   A radial gradient tinted with the project's tech stack accent hue,
 *   a sparse dot-grid pattern, and the project name centered at low opacity.
 *   The placeholder signals "image placeholder" without lorem-ipsum or a
 *   broken-image icon — it looks intentional, not incomplete.
 */

import { cn } from '@/lib/utils';

interface HeroImagePlaceholderProps {
  /** Project name — shown centered at low opacity */
  name:          string;
  /** HSL triplet (no wrapper) for accent tint, e.g. "188 95% 43%" */
  accentHsl?:    string;
  className?:    string;
  /** Forwarded to the outer div — used for GSAP Flip matching */
  'data-flip-id'?: string;
}

export function HeroImagePlaceholder({
  name,
  accentHsl = '262 52% 66%', // violet — neutral fallback
  className,
  'data-flip-id': flipId,
}: HeroImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'aspect-[21/9] relative rounded-xl overflow-hidden bg-muted/30 mb-8',
        className,
      )}
      data-flip-id={flipId}
      role="img"
      aria-label={`${name} — image coming soon`}
    >
      {/* Ambient radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, hsl(${accentHsl} / 0.08) 0%, transparent 70%)`,
        }}
      />

      {/* Dot-grid pattern via CSS repeating-linear-gradient */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(${accentHsl} / 0.4) 1px, transparent 1px)`,
          backgroundSize:  '24px 24px',
        }}
      />

      {/* Centered project name */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <p
          className="text-2xl md:text-4xl font-bold tracking-tight text-foreground/10 text-center px-6 select-none"
          aria-hidden="true"
        >
          {name}
        </p>
        <span className="text-xs font-mono text-muted-foreground/30 tracking-widest uppercase">
          Hero image
        </span>
      </div>
    </div>
  );
}
