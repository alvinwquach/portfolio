/**
 * Hero Section Component
 * ======================
 * Stillness-first hero. Content is present when you arrive.
 * No staggered animations on load. Typography has weight.
 * Editor mockup pulls up as user scrolls (like GreatFrontEnd).
 */

'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWindowScroll } from '@/components/three';
import { ScrollParallax } from '@/components/gsap';
import { EditorMockup } from '@/components/ui/EditorMockup';
import type { Profile } from '@/lib/graphql/queries';

// Dynamically import Three.js components with no SSR
const ThreeCanvas = dynamic(
  () => import('@/components/three').then((mod) => mod.ThreeCanvas),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-background" /> }
);

const HeroScene = dynamic(
  () => import('@/components/three').then((mod) => mod.HeroScene),
  { ssr: false }
);

interface HeroSectionProps {
  profile: Profile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const { scrollProgress, scrollVelocity } = useWindowScroll();
  const [scrolled, setScrolled] = React.useState(false);

  // Hide scroll indicator once user starts scrolling
  React.useEffect(() => {
    if (scrollProgress > 0.02) {
      setScrolled(true);
    }
  }, [scrollProgress]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <ThreeCanvas
          className="absolute inset-0"
          frameloop="always"
          camera={{ position: [0, 0, 5], fov: 75 }}
        >
          <HeroScene scrollProgress={scrollProgress} scrollVelocity={scrollVelocity} />
        </ThreeCanvas>
      </div>

      {/* Content - present immediately, no fade-in */}
      <div className="container relative z-10 pt-20 pb-8">
        <div className="max-w-3xl">
          {/* H1 - Already here when you arrive */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Building full-stack{' '}
            <span className="text-muted-foreground">applications with care</span>
          </h1>

          {/* Value proposition */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Meet <span className="text-foreground font-medium">{profile?.name || 'Alvin Quach'}</span>, a full stack developer who builds performant web applications with modern tooling.
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
              <Link href="/#contact">
                Let's Talk
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Mockup - Tilted back like laptop screen, rotates toward you on scroll */}
      <div className="container relative z-10 mt-8 pb-24">
        <ScrollParallax
          startRotateX={40}
          endRotateX={0}
          startY={80}
          endY={0}
          startScale={0.9}
          endScale={1}
          perspective={1000}
          start="top 100%"
          end="top 20%"
          scrub={1.5}
          className="max-w-4xl mx-auto"
        >
          <EditorMockup />
        </ScrollParallax>
      </div>

      {/* Scroll indicator - disappears once scrolled */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-500 ${
          scrolled ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
          <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
