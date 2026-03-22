/**
 * ProjectGallery
 * ==============
 * Horizontal-scroll gallery on desktop, vertical stack on mobile.
 *
 * Desktop mechanic:
 *   <section ref={pinned}> is pinned by ScrollTrigger.
 *   <div ref={track}> (flex-row) is translated on the x-axis while the section
 *   stays fixed, giving the illusion of horizontal scroll driven by vertical scroll.
 *   scrub: 1 — 1 s smoothing so the motion feels physical, not mechanical.
 *
 * Active card:
 *   onUpdate calculates activeIndex from live scroll progress.
 *   The centered card receives a 3 px amber left border — a visual anchor
 *   that tells users which project is in focus without a separate indicator UI.
 *
 * Mobile:
 *   Cards stack vertically. Each card enters with y:60 + clipPath reveal.
 *   WHY: horizontal scroll on touch is unreliable — scroll momentum fights
 *   iOS Safari's native inertia, causing jumpy gesture conflicts on swipe.
 */

'use client';

import { forwardRef, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnimatedText } from '@/components/animation/AnimatedText';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
 * Data
 * ───────────────────────────────────────────────────────────────────────────── */

interface Project {
  slug:       string;
  name:       string;
  tagline:    string;
  description: string;
  category:   string;
  tech:       string[];
  liveUrl?:   string;
  /** HSL triplet (no 'hsl()' wrapper) used for accent tinting */
  accentHsl:  string;
}

const PROJECTS: Project[] = [
  {
    slug:        't-creative-studio',
    name:        'T Creative Studio',
    tagline:     'Brand identity & web presence',
    description:
      'End-to-end brand and web build for a creative studio specializing in editorial photography and visual direction. CMS-driven so the client owns their content from day one.',
    category:    'Client Work',
    tech:        ['Next.js', 'TypeScript', 'Sanity', 'Tailwind CSS'],
    accentHsl:   '43 96% 56%',   // amber
  },
  {
    slug:        'hoparc',
    name:        'Hoparc',
    tagline:     'Outdoor event discovery & booking',
    description:
      'Platform connecting outdoor enthusiasts with curated adventure experiences. Real-time seat availability, group booking, and instructor scheduling in one flow.',
    category:    'Product',
    tech:        ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    accentHsl:   '188 95% 43%',  // cyan
  },
  {
    slug:        'opportuniq',
    name:        'OpportuniQ',
    tagline:     'AI-powered collaborative research',
    description:
      'Research platform that helps teams weigh DIY vs professional approaches through structured decision frameworks and AI-generated trade-off analysis.',
    category:    'Product',
    tech:        ['Next.js', 'OpenAI', 'Prisma', 'TypeScript'],
    accentHsl:   '262 52% 66%',  // violet
  },
  {
    slug:        'sculptql',
    name:        'SculptQL',
    tagline:     'GraphQL schema explorer',
    description:
      'Developer tool that visualizes GraphQL schemas as interactive graphs, surfacing query complexity and field relationships before they become production problems.',
    category:    'Product',
    tech:        ['TypeScript', 'GraphQL', 'D3.js', 'React'],
    accentHsl:   '158 64% 52%',  // emerald
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Gallery
 * ───────────────────────────────────────────────────────────────────────────── */

export function ProjectGallery() {
  const sectionRef  = useRef<HTMLElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track   = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      /* ── Desktop: pin section, translate track on x-axis ─────────────
       * getDistance() is called lazily so it re-measures after fonts and
       * images load (which can shift track.scrollWidth).
       * invalidateOnRefresh: true repeats the measurement on window resize.
       * ─────────────────────────────────────────────────────────────── */
      mm.add('(min-width: 768px)', () => {
        const getDistance = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x:    () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger:             section,
            pin:                 true,
            anticipatePin:       1,
            start:               'top top',
            end:                 () => `+=${getDistance()}`,
            // scrub: 1 (not `true`) — 1 s smoothing gives the track
            // physical inertia rather than locking frame-for-frame to the
            // scroll position, which feels mechanical on a trackpad.
            scrub:               1,
            invalidateOnRefresh: true,
            onUpdate(self) {
              // onUpdate fires during scrub smoothing (not just at toggle points).
              // Math.round snaps active index at the midpoint between cards so
              // the highlight transitions as the card crosses center, not at edges.
              setActiveIndex(
                Math.round(self.progress * (PROJECTS.length - 1)),
              );
            },
          },
        });
      });

      /* ── Mobile: vertical stack, y:60 + clipPath reveal per card ──────
       * WHY: horizontal scroll on touch is unreliable — momentum scrolling
       * on iOS Safari fights GSAP's scroll capture, producing jumpy gesture
       * conflicts that make the experience feel broken rather than crafted.
       * ─────────────────────────────────────────────────────────────── */
      mm.add('(max-width: 767px)', () => {
        cardRefs.current.forEach((card) => {
          if (!card) return;

          gsap.from(card, {
            y:        60,
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.7,
            ease:     'power2.out',
            scrollTrigger: {
              trigger:       card,
              start:         'top 85%',
              toggleActions: 'play none none none',
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      // overflow-x-hidden on the pinned element (not an ancestor) prevents
      // a horizontal scrollbar flash while the track is in normal flow
      // before ScrollTrigger activates the pin.
      className="relative bg-background md:min-h-screen overflow-x-hidden"
      aria-label="Selected projects"
    >
      {/* Track ────────────────────────────────────────────────────────────
       * flex-col on mobile (normal vertical layout)
       * flex-row on desktop (GSAP translates this div on the x-axis)
       *
       * Padding: 10vw left + 10vw right on desktop.
       *   Cards are 80vw wide → 100vw - 80vw = 20vw "leftover" → 10vw each side.
       *   This means both the previous and next cards peek by ~10vw at the edges,
       *   signaling that the gallery continues without an explicit "swipe" hint.
       * ──────────────────────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        className={cn(
          'flex flex-col md:flex-row md:items-stretch',
          'gap-6',
          'px-4 md:pl-[10vw] md:pr-[10vw]',
          'py-12 md:py-20',
        )}
      >
        {PROJECTS.map((project, index) => (
          <GalleryCard
            key={project.slug}
            ref={(el) => { cardRefs.current[index] = el; }}
            project={project}
            isActive={activeIndex === index}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Card
 * ───────────────────────────────────────────────────────────────────────────── */

interface GalleryCardProps {
  project:  Project;
  isActive: boolean;
  /** Card position in the list — used to stagger AnimatedText delays */
  index:    number;
}

const GalleryCard = forwardRef<HTMLDivElement, GalleryCardProps>(
  function GalleryCard({ project, isActive, index }, ref) {
    return (
      <article
        ref={ref}
        className={cn(
          // 80vw width on desktop so adjacent cards peek at edges (see track comment)
          'relative w-full md:w-[80vw] md:flex-shrink-0',
          'flex flex-col md:flex-row',
          'rounded-2xl border bg-card/50 overflow-hidden',
          'transition-colors duration-300',
          isActive ? 'border-border' : 'border-border/40',
        )}
      >
        {/* ── Active indicator ─────────────────────────────────────────────
         * Absolute-positioned so adding/removing it never shifts card width.
         * Uses onUpdate's activeIndex rather than a CSS :nth-child so the
         * highlight responds to the live scrub position, not a click event.
         * ────────────────────────────────────────────────────────────────── */}
        <div
          className="absolute left-0 top-0 h-full w-[3px] z-10 transition-colors duration-500"
          style={{ background: isActive ? `hsl(${PROJECTS[0].accentHsl})` : 'transparent' }}
          aria-hidden="true"
        />

        {/* ── Left 45 %: screenshot placeholder (16:9, bg-surface) ─────────
         * bg-muted/40 = the design system's "surface" tone.
         * Ambient radial gradient tinted with the project's accent color
         * makes each card visually distinct without requiring a real screenshot.
         * ────────────────────────────────────────────────────────────────── */}
        <div className="w-full md:w-[45%] aspect-video md:aspect-auto md:h-full relative bg-muted/40 overflow-hidden">
          {/* Ambient background — felt, not seen */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 40%, hsl(${project.accentHsl} / 0.10) 0%, transparent 70%)`,
            }}
          />

          {/* Placeholder chrome — signals intent without lorem ipsum */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: `hsl(${project.accentHsl} / 0.12)` }}
            >
              {/* Monitor icon — unambiguously "screen / project" */}
              <svg
                className="w-7 h-7"
                style={{ color: `hsl(${project.accentHsl})` }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"
                />
              </svg>
            </div>
            <span className="text-xs font-mono text-muted-foreground/40 tracking-widest">
              {project.slug}
            </span>
          </div>
        </div>

        {/* ── Right 55 %: content ───────────────────────────────────────── */}
        <div className="w-full md:w-[55%] flex flex-col justify-center gap-5 px-6 md:px-10 py-8 md:py-12">

          {/* Category */}
          <Badge
            variant="outline"
            className="self-start text-xs"
            style={{
              color:       `hsl(${project.accentHsl})`,
              borderColor: `hsl(${project.accentHsl} / 0.35)`,
            }}
          >
            {project.category}
          </Badge>

          {/* Title — AnimatedText with trigger="load" not "scroll".
           * Cards 2–4 are off-screen via CSS transform, not DOM position,
           * so ScrollTrigger's getBoundingClientRect() would fire immediately
           * for all cards (they all share the pinned section's viewport rect).
           * trigger="load" + staggered delay ensures titles are revealed in
           * reading order as the user scrolls to each card.               */}
          <AnimatedText
            as="h3"
            animation="words-up"
            trigger="load"
            delay={index * 0.18}
            className="text-2xl md:text-3xl font-bold tracking-tight leading-tight"
          >
            {project.name}
          </AnimatedText>

          {/* Tagline */}
          <p className="text-sm font-medium text-muted-foreground -mt-2">
            {project.tagline}
          </p>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-1">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium transition-[gap] duration-200 hover:gap-3"
              style={{ color: `hsl(${project.accentHsl})` }}
            >
              View project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                Live site
              </a>
            )}
          </div>

        </div>
      </article>
    );
  },
);
