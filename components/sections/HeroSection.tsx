/**
 * Hero Section
 * ============
 * Pinned full-viewport hero with a GSAP-driven animation sequence.
 *
 * Animation order (all scoped to the section ScrollTrigger pin):
 *   1. Section pins               — user scrolls through 150 % vh of content
 *   2. Headline clip-reveal       — SplitText words rise y:40→0 behind line masks
 *   3. Editor parallax            — right column drifts at 0.8× scroll speed
 *   4. Subtitle x-slide           — paragraph enters from x:–30
 *   5. Scroll indicator           — amber 2 px line grows to 60 px
 */

'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorMockup } from '@/components/ui/EditorMockup';
import type { Profile } from '@/lib/graphql/queries';

interface HeroSectionProps {
  profile: Profile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const sectionRef    = useRef<HTMLElement>(null);
  const headlineRef   = useRef<HTMLHeadingElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const editorRef     = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section    = sectionRef.current;
      const headline   = headlineRef.current;
      const subtitle   = subtitleRef.current;
      const editor     = editorRef.current;
      const scrollLine = scrollLineRef.current;
      if (!section || !headline || !subtitle || !editor || !scrollLine) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: '(min-width: 768px)',
          mobile:  '(max-width: 767px)',
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean };
          const pinEnd = desktop ? '+=150%' : '+=80%';

          /* ----------------------------------------------------------------
           * 1. PIN — keeps the section in the viewport while the timeline plays
           * Mobile gets a shorter pin so the user reaches the next section sooner.
           * ---------------------------------------------------------------- */
          ScrollTrigger.create({
            trigger:    section,
            pin:        true,
            anticipatePin: 1,
            start:      'top top',
            end:        pinEnd,
          });

          /* ----------------------------------------------------------------
           * 2. HEADLINE: SplitText words, y:40→0, stagger:0.08, overflow-hidden clip
           * WHY NOT FADE: clip reveals feel physical, signal craft.
           * Each split line becomes an overflow:hidden mask so words slide up
           * from below the visible boundary — no opacity, pure translate clip.
           * ---------------------------------------------------------------- */
          const split = new SplitText(headline, { type: 'lines,words' });

          // Mask each line so the word translate is clipped at the line boundary
          split.lines.forEach((line) => {
            (line as HTMLElement).style.overflow = 'hidden';
            (line as HTMLElement).style.display  = 'block';
          });

          gsap.from(split.words, {
            y:        40,
            duration: 0.8,
            stagger:  0.08,
            ease:     'power3.out',
            scrollTrigger: {
              trigger:       section,
              start:         'top top',
              end:           '+=20%',
              toggleActions: 'play none none none',
            },
          });

          /* ----------------------------------------------------------------
           * 3. EDITOR PARALLAX — right column drifts at 0.8× scroll speed
           * WHY 0.8×: depth without lag.
           * At 1× the editor would stay perfectly fixed inside the pinned section.
           * At 0.8× it drifts upward slightly, implying a closer focal plane.
           * ---------------------------------------------------------------- */
          gsap.to(editor, {
            y:    () => -(window.innerHeight * (desktop ? 0.12 : 0.06)),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start:   'top top',
              end:     pinEnd,
              scrub:   1,
            },
          });

          /* ----------------------------------------------------------------
           * 4. SUBTITLE — slides in from x:–30 after the headline lands
           * ---------------------------------------------------------------- */
          gsap.from(subtitle, {
            x:        -30,
            opacity:  0,
            duration: 0.7,
            ease:     'power2.out',
            delay:    0.5,
            scrollTrigger: {
              trigger:       section,
              start:         'top top',
              end:           '+=15%',
              toggleActions: 'play none none none',
            },
          });

          /* ----------------------------------------------------------------
           * 5. SCROLL INDICATOR — amber 2 px line grows to 60 px height
           * WHY: signals 'keep scrolling' on fullscreen viewports.
           * Plays once on mount after the headline settles.
           * ---------------------------------------------------------------- */
          gsap.fromTo(
            scrollLine,
            { height: 0 },
            { height: 60, duration: 0.6, ease: 'power2.out', delay: 1.1 },
          );

          // Revert SplitText DOM changes alongside the GSAP context cleanup
          return () => split.revert();
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center bg-background"
    >
      <div className="container relative z-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left column: text ───────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Headline — SplitText target; span nesting is preserved by SplitText */}
            <h1
              ref={headlineRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            >
              Building full-stack{' '}
              <span className="text-muted-foreground">applications with care</span>
            </h1>

            {/* Subtitle — slides from x:–30 */}
            <p
              ref={subtitleRef}
              className="text-lg md:text-xl text-muted-foreground max-w-lg"
            >
              Meet{' '}
              <span className="text-foreground font-medium">
                {profile?.name ?? 'Alvin Quach'}
              </span>
              , a full stack developer who builds performant web applications
              with modern tooling.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/projects">
                  View Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/#contact">Let&apos;s Talk</Link>
              </Button>
            </div>

            {/* ── Scroll indicator ────────────────────────────────────────
             * WHY: signals 'keep scrolling' on fullscreen viewports.
             * A 2 px amber line grows to 60 px — minimal, unambiguous.
             * ──────────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 mt-2" aria-hidden="true">
              <div
                ref={scrollLineRef}
                className="w-0.5 bg-amber-400"
                style={{ height: 0 }}
              />
              <span className="text-xs text-muted-foreground tracking-widest uppercase select-none">
                Scroll
              </span>
            </div>
          </div>

          {/* ── Right column: code editor ───────────────────────────────── */}
          {/* WHY 5 % amber radial: felt not seen — makes the dark background feel
           * alive without competing with the editor chrome or the text.       */}
          <div
            ref={editorRef}
            className="relative"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 50%, hsla(43,96%,56%,0.05) 0%, transparent 70%)',
            }}
          >
            <EditorMockup />
          </div>

        </div>
      </div>
    </section>
  );
}
