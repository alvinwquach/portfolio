/**
 * Code Editor Hero Section
 * ========================
 * Hero section featuring an interactive code editor displaying
 * the developer's profile as TypeScript/Python code.
 *
 * Architecture Overview
 * ---------------------
 * This component is the "page-level" container that:
 * 1. Fetches/receives data from Sanity CMS
 * 2. Renders the hero headline and CTAs
 * 3. Wraps the CodeEditor in a scroll-driven animation
 *
 * The actual editor logic is delegated to the CodeEditor component
 * (see components/code-editor/), keeping this file focused on layout.
 *
 * Component Hierarchy:
 * ```
 * CodeEditorHero (layout, animation, CTA buttons)
 * └── ScrollParallax (GSAP scroll animation)
 *     └── CodeEditor (state, composition)
 *         ├── EditorSidebar
 *         ├── EditorTabBar
 *         ├── CodeDisplay
 *         ├── EditorStatusBar
 *         └── EditorOutputPanel
 * ```
 *
 * Design Decisions
 * ----------------
 * 1. Scroll Animation: The editor "opens" as user scrolls, creating
 *    a laptop-opening effect. This draws attention without autoplay video.
 *
 * 2. Data Fetching: Profile data comes from parent (page.tsx) to enable
 *    static generation. This component doesn't fetch its own data.
 *
 * 3. Responsive: Full editor on desktop, simplified on mobile.
 *    Mobile users see tabs without the sidebar.
 *
 * @see /components/code-editor/ for editor implementation details
 */

'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollParallax } from '@/components/gsap';
import { CodeEditor } from '@/components/code-editor';
import type { Profile, SkillGroup } from '@/lib/graphql/queries';

interface CodeEditorHeroProps {
  profile?: Profile | null;
  skillGroups?: SkillGroup[];
}

/**
 * Default profile for when CMS data is unavailable.
 * Ensures the hero always renders meaningful content.
 */
const DEFAULT_PROFILE = {
  name: 'Alvin Quach',
  headline: 'Full Stack Developer',
  tagline: 'Turning ideas into products people use',
  location: 'San Francisco Bay Area',
  availabilityStatus: 'open' as const,
  openToRoles: ['Full Stack Developer', 'Frontend Engineer', 'Software Engineer'],
  strengths: ['Problem Solving', 'System Design', 'Clean Code'],
};

export function CodeEditorHero({ profile, skillGroups }: CodeEditorHeroProps) {
  // Merge with defaults for safe access
  const p = profile || DEFAULT_PROFILE;

  return (
    <section className="relative min-h-screen overflow-hidden py-12 px-4">
      <div className="container max-w-5xl mx-auto relative z-10">
        {/* Hero Content - Headline + CTAs */}
        <div className="pt-16 md:pt-20 pb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
              {p.tagline || DEFAULT_PROFILE.tagline}
            </h1>

            <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl">
              <span className="text-foreground font-medium">{p.name}</span> is a{' '}
              {p.headline?.toLowerCase() || 'full-stack developer'} who ships
              web apps from concept to production—real-time systems, AI tools,
              data visualization, and developer utilities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* MODIFIED(feat/design-system): Late Night Session palette */}
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-base rounded-lg font-medium hover:bg-accent/80 transition-colors group"
              >
                View Projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-line text-foreground rounded-lg font-medium hover:bg-overlay/50 transition-colors"
              >
                Let's Talk
              </Link>
            </div>
          </div>
        </div>

        {/* Code Editor with Scroll Animation */}
        <ScrollParallax
          startRotateX={45}
          endRotateX={0}
          startY={100}
          endY={0}
          startOpacity={0.3}
          endOpacity={1}
          startScale={0.85}
          endScale={1}
          perspective={1200}
          start="top 95%"
          end="top 30%"
          scrub={1.2}
          className="relative w-full"
        >
          <CodeEditor
            profile={{
              name: p.name || DEFAULT_PROFILE.name,
              headline: p.headline || DEFAULT_PROFILE.headline,
              location: p.location || DEFAULT_PROFILE.location,
              availabilityStatus: p.availabilityStatus || DEFAULT_PROFILE.availabilityStatus,
              openToRoles: p.openToRoles || DEFAULT_PROFILE.openToRoles,
              strengths: p.strengths || DEFAULT_PROFILE.strengths,
              previousCareers: profile?.previousCareers as Array<{
                title?: string;
                transferableSkills?: string[];
              }>,
            }}
            skillGroups={skillGroups}
          />
        </ScrollParallax>
      </div>
    </section>
  );
}
