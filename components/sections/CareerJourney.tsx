/**
 * Career Journey
 * ==============
 * Three-phase spatial career journey connected by a scroll-drawn SVG path.
 * See docs/career-journey-plan.md for full choreography specification.
 *
 * Phases:
 *   1  SYSTEMS   Manufacturing → systems thinking, QA discipline    (cyan)
 *   2  PEOPLE    Community mgmt → user empathy, listening           (amber)
 *   3  CODE      Engineering → combining both into shipped products (violet)
 *
 * Design rule: every transition is physical — clip, translate, scale,
 * stroke-draw. No opacity fades.
 */

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedText } from '@/components/animation/AnimatedText';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
 * Phase data
 * ───────────────────────────────────────────────────────────────────────────── */

interface Role {
  title: string;
  company: string;
  skills: string[];
}

interface Phase {
  number:    string;
  label:     string;
  title:     string;
  subtitle:  string;
  accentHsl: string;
  /** Desktop pin scroll distance. Phase 3 is longer for the convergence moment. */
  pinEnd:    string;
  roles:     Role[];
}

const PHASES: Phase[] = [
  {
    number:    '01',
    label:     'SYSTEMS',
    title:     'Systems',
    subtitle:  'Manufacturing taught me to think in processes — inputs, outputs, tolerances. QA discipline means nothing ships without being verified.',
    accentHsl: '188 95% 43%',  // cyan
    pinEnd:    '+=120%',
    roles: [
      { title: 'Manufacturing Test Technician',    company: 'Verizon (Corvis)',   skills: ['Process rigor', 'Root-cause analysis'] },
      { title: 'Pricing Coordinator',              company: 'Stericycle',         skills: ['Data accuracy', 'System workflows'] },
      { title: 'Program Coordinator',              company: 'Green Dot',          skills: ['Cross-team coordination', 'Deadline discipline'] },
    ],
  },
  {
    number:    '02',
    label:     'PEOPLE',
    title:     'People',
    subtitle:  'Community management is user research at scale. You learn to listen before you build, and to translate between what people say and what they need.',
    accentHsl: '43 96% 56%',   // amber
    pinEnd:    '+=120%',
    roles: [
      { title: 'Community Manager',                company: 'Bird',               skills: ['User empathy', 'Feedback loops'] },
      { title: 'Community Engagement Specialist',   company: 'Lyft',              skills: ['Stakeholder communication', 'Conflict resolution'] },
    ],
  },
  {
    number:    '03',
    label:     'CODE',
    title:     'Code',
    subtitle:  'Engineering is where systems thinking and user empathy converge. Every production deployment carries lessons from both.',
    accentHsl: '262 52% 66%',  // violet
    pinEnd:    '+=150%',       // longer — convergence strip needs breathing room
    roles: [
      { title: 'Full Stack Developer',             company: 'Independent',        skills: ['React / Next.js', 'TypeScript', 'PostgreSQL'] },
    ],
  },
];

/** Skills that converge in Phase 3 — displayed in the convergence strip. */
const CONVERGENCE_SKILLS = [
  'Systems thinking',
  'Process rigor',
  'User empathy',
  'Stakeholder comm.',
  'TypeScript',
  'React / Next.js',
];

/* ─────────────────────────────────────────────────────────────────────────────
 * SVG path builder
 * ───────────────────────────────────────────────────────────────────────────── */

function buildPathD(
  phaseEls: (HTMLDivElement | null)[],
  sectionEl: HTMLElement,
  amplitude: number,
): string {
  const sectionRect = sectionEl.getBoundingClientRect();
  const cx = sectionRect.width / 2;
  const points: number[] = [];

  phaseEls.forEach((el) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    // top and vertical-center relative to the section
    points.push(r.top - sectionRect.top);
    points.push(r.top - sectionRect.top + r.height / 2);
  });

  if (points.length < 6) {
    // fallback: straight vertical line
    return `M ${cx},0 L ${cx},${sectionRect.height}`;
  }

  const [p1Top, p1Mid, p2Top, p2Mid, p3Top, p3Mid] = points;
  const a = amplitude;

  // Flowing S-curve through phase centers
  return [
    `M ${cx},${p1Top}`,
    `C ${cx + a},${p1Mid}, ${cx - a},${p2Top}, ${cx},${p2Mid}`,
    `C ${cx + a},${(p2Mid + p3Top) / 2}, ${cx - a},${p3Top}, ${cx},${p3Mid}`,
  ].join(' ');
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────────────────────────────────────── */

interface CareerJourneyProps {
  className?: string;
}

export function CareerJourney({ className }: CareerJourneyProps) {
  const sectionRef    = useRef<HTMLElement>(null);
  const pathRef       = useRef<SVGPathElement>(null);
  const phaseRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRefs     = useRef<(HTMLDivElement | null)[][]>([[], [], []]);
  const convergeRef   = useRef<HTMLDivElement>(null);
  const skillBadgeRef = useRef<HTMLDivElement>(null);
  const [pathD, setPathD] = useState('');

  /* ── Compute SVG path from DOM positions ──────────────────────────────── */
  const computePath = useCallback((amplitude: number) => {
    if (!sectionRef.current) return;
    const d = buildPathD(phaseRefs.current, sectionRef.current, amplitude);
    setPathD(d);
  }, []);

  /* Recalculate path on mount and on resize */
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    computePath(isMobile ? 20 : 80);

    const ro = new ResizeObserver(() => {
      const mobile = window.innerWidth < 768;
      computePath(mobile ? 20 : 80);
    });
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => ro.disconnect();
  }, [computePath]);

  /* ── GSAP choreography ────────────────────────────────────────────────── */
  useGSAP(
    () => {
      const section = sectionRef.current;
      const path    = pathRef.current;
      if (!section || !path) return;

      // Set initial phase accent (cyan — Phase 1)
      gsap.set(section, { '--phase-accent': `hsl(${PHASES[0].accentHsl})` });

      const mm = gsap.matchMedia();

      /* ── Shared: SVG path draw ──────────────────────────────────────────
       * SVG path: stroke-dashoffset from pathLength→0 on scroll.
       * pathLength="1" normalizes offset: 1 = hidden, 0 = fully drawn.
       * scrub: 0.5 — tighter coupling than the 1 s in ProjectGallery
       * because the path should feel directly wired to scroll position.
       * ────────────────────────────────────────────────────────────────── */
      gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   0.5,
        },
      });

      /* ── Desktop: pinned phases + color shifts ─────────────────────── */
      mm.add('(min-width: 768px)', () => {
        PHASES.forEach((phase, i) => {
          const phaseEl  = phaseRefs.current[i];
          const numberEl = numberRefs.current[i];
          const cards    = cardsRefs.current[i];
          if (!phaseEl || !numberEl) return;

          // Pin each phase individually
          ScrollTrigger.create({
            trigger:       phaseEl,
            pin:           true,
            anticipatePin: 1,
            start:         'top top',
            end:           phase.pinEnd,
          });

          // Phase numbers: scale(2)→1 (pull-back reveal, not fade)
          // WHY pull-back: starting large and shrinking into position
          // conveys "arriving at a destination" rather than "appearing".
          gsap.set(numberEl, { transformOrigin: 'center center' });
          gsap.from(numberEl, {
            scale:    2,
            duration: 0.8,
            ease:     'power3.out',
            scrollTrigger: {
              trigger:       phaseEl,
              start:         'top top',
              toggleActions: 'play none none none',
            },
          });

          // Role cards: y:40 + clipPath, stagger:0.1
          // WHY clipPath not opacity: consistent reveal language with
          // AnimatedText lines-clip — the entire site speaks "clip".
          cards.forEach((card, ci) => {
            if (!card) return;
            gsap.from(card, {
              y:        40,
              clipPath: 'inset(0 0 100% 0)',
              duration: 0.6,
              ease:     'power2.out',
              delay:    0.7 + ci * 0.1,
              scrollTrigger: {
                trigger:       phaseEl,
                start:         'top top',
                toggleActions: 'play none none none',
              },
            });
          });

          // Color shift: animate --phase-accent CSS custom property
          // WHY discrete (not scrubbed): mid-blend between cyan and amber
          // produces muddy green; discrete swap with 0.4 s ease looks intentional.
          if (i > 0) {
            gsap.to(section, {
              '--phase-accent': `hsl(${phase.accentHsl})`,
              duration: 0.4,
              ease:     'power2.inOut',
              scrollTrigger: {
                trigger:       phaseEl,
                start:         'top top',
                toggleActions: 'play none none none',
              },
            });
          }
        });

        // Phase 3 convergence strip
        const converge   = convergeRef.current;
        const skillBadge = skillBadgeRef.current;
        const phase3     = phaseRefs.current[2];
        if (converge && skillBadge && phase3) {
          gsap.from(converge, {
            scaleY:          0,
            transformOrigin: 'bottom center',
            duration:        0.55,
            ease:            'power2.out',
            delay:           1.2,
            scrollTrigger: {
              trigger:       phase3,
              start:         'top top',
              toggleActions: 'play none none none',
            },
          });

          const badges = skillBadge.children;
          gsap.from(badges, {
            y:        20,
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.5,
            ease:     'power2.out',
            stagger:  0.08,
            delay:    1.4,
            scrollTrigger: {
              trigger:       phase3,
              start:         'top top',
              toggleActions: 'play none none none',
            },
          });
        }
      });

      /* ── Mobile: no pin, individual ScrollTriggers at top 85% ────────
       * WHY no pin: multiple consecutive pinned sections on mobile create
       * "scroll jail". Vertical scroll is the native mobile idiom.
       * ────────────────────────────────────────────────────────────────── */
      mm.add('(max-width: 767px)', () => {
        PHASES.forEach((phase, i) => {
          const phaseEl  = phaseRefs.current[i];
          const numberEl = numberRefs.current[i];
          const cards    = cardsRefs.current[i];
          if (!phaseEl || !numberEl) return;

          // Phase numbers: scale(2)→1 (pull-back reveal, not fade)
          gsap.set(numberEl, { transformOrigin: 'center center' });
          gsap.from(numberEl, {
            scale:    2,
            duration: 0.8,
            ease:     'power3.out',
            scrollTrigger: {
              trigger:       phaseEl,
              start:         'top 85%',
              toggleActions: 'play none none none',
            },
          });

          // Color shift
          if (i > 0) {
            gsap.to(section, {
              '--phase-accent': `hsl(${phase.accentHsl})`,
              duration: 0.4,
              ease:     'power2.inOut',
              scrollTrigger: {
                trigger:       phaseEl,
                start:         'top 85%',
                toggleActions: 'play none none none',
              },
            });
          }

          // Role cards: y:40 + clipPath, stagger:0.1
          cards.forEach((card, ci) => {
            if (!card) return;
            gsap.from(card, {
              y:        40,
              clipPath: 'inset(0 0 100% 0)',
              duration: 0.6,
              ease:     'power2.out',
              delay:    ci * 0.1,
              scrollTrigger: {
                trigger:       card,
                start:         'top 85%',
                toggleActions: 'play none none none',
              },
            });
          });
        });

        // Convergence strip — own trigger
        const converge   = convergeRef.current;
        const skillBadge = skillBadgeRef.current;
        if (converge && skillBadge) {
          gsap.from(converge, {
            scaleY:          0,
            transformOrigin: 'bottom center',
            duration:        0.55,
            ease:            'power2.out',
            scrollTrigger: {
              trigger:       converge,
              start:         'top 85%',
              toggleActions: 'play none none none',
            },
          });
          gsap.from(skillBadge.children, {
            y:        20,
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.5,
            ease:     'power2.out',
            stagger:  0.08,
            scrollTrigger: {
              trigger:       skillBadge,
              start:         'top 85%',
              toggleActions: 'play none none none',
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [pathD] },
  );

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      id="career"
      className={cn('relative', className)}
      style={{ '--phase-accent': `hsl(${PHASES[0].accentHsl})` } as React.CSSProperties}
    >
      {/* ── Connecting SVG path ──────────────────────────────────────────
       * SVG path: stroke-dashoffset from pathLength→0 on scroll.
       * position:absolute spans the full section height so GSAP can scrub
       * the draw across the entire combined pin distance.
       * ────────────────────────────────────────────────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        {pathD && (
          <path
            ref={pathRef}
            d={pathD}
            pathLength={1}
            stroke="var(--phase-accent)"
            strokeWidth={2}
            strokeDasharray={1}
            strokeDashoffset={1}
            fill="none"
          />
        )}
      </svg>

      {/* ── Phases ──────────────────────────────────────────────────────── */}
      {PHASES.map((phase, i) => (
        <div
          key={phase.label}
          ref={(el) => { phaseRefs.current[i] = el; }}
          className={cn(
            'relative z-10 min-h-screen flex items-center',
            'bg-background', // opaque so pinned phases stack cleanly
          )}
        >
          <div className="container py-20">
            <div
              className={cn(
                'grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center',
                // Phase 2: mirror layout on desktop (cards left, text right)
                i === 1 && 'md:[&>*:last-child]:order-first',
              )}
            >
              {/* ── Text column ──────────────────────────────────────── */}
              <div className="flex flex-col gap-6">
                {/* Phase number — scale(2)→1, transformOrigin center center
                 * WHY pull-back: large → resting size reads as "arriving",
                 * not "appearing". The number IS the room; you walk into it. */}
                <div
                  ref={(el) => { numberRefs.current[i] = el; }}
                  className="text-[8rem] md:text-[10rem] font-bold leading-none select-none"
                  style={{ color: 'var(--phase-accent)', opacity: 0.12 }}
                  aria-hidden="true"
                >
                  {phase.number}
                </div>

                {/* Label */}
                <AnimatedText
                  as="span"
                  animation="scale-in"
                  trigger="scroll"
                  delay={i === 0 ? 0.2 : 0}
                  className="text-xs font-medium tracking-[0.2em] uppercase"
                  style={{ color: 'var(--phase-accent)' }}
                >
                  {phase.label}
                </AnimatedText>

                {/* Title */}
                <AnimatedText
                  as="h2"
                  animation="words-up"
                  trigger="scroll"
                  delay={0.3}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
                >
                  {phase.title}
                </AnimatedText>

                {/* Subtitle */}
                <AnimatedText
                  as="p"
                  animation="lines-clip"
                  trigger="scroll"
                  delay={0.5}
                  className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed"
                >
                  {phase.subtitle}
                </AnimatedText>
              </div>

              {/* ── Role cards column ────────────────────────────────── */}
              <div className="flex flex-col gap-4">
                {phase.roles.map((role, ri) => (
                  <div
                    key={role.title}
                    ref={(el) => { cardsRefs.current[i][ri] = el; }}
                    className={cn(
                      'rounded-xl border bg-card/40 p-6',
                      'transition-colors duration-300',
                    )}
                    style={{ borderLeftColor: 'var(--phase-accent)', borderLeftWidth: 3 }}
                  >
                    <h3 className="font-semibold text-foreground mb-1">
                      {role.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {role.company}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Convergence strip (Phase 3 only) ──────────────────── */}
            {i === 2 && (
              <div
                ref={convergeRef}
                className="mt-16 pt-8 border-t"
                style={{ borderColor: 'var(--phase-accent)' }}
              >
                <AnimatedText
                  as="p"
                  animation="scale-in"
                  trigger="scroll"
                  delay={1.2}
                  className="text-sm font-medium tracking-[0.15em] uppercase mb-6"
                  style={{ color: 'var(--phase-accent)' }}
                >
                  What converged
                </AnimatedText>

                <div ref={skillBadgeRef} className="flex flex-wrap gap-2">
                  {CONVERGENCE_SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-full text-sm border bg-card/30"
                      style={{
                        borderColor: 'var(--phase-accent)',
                        color:       'var(--phase-accent)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
