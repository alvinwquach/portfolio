/**
 * Code Editor Hero
 * ================
 * Info bar → "I build [scramble]" headline → stats → CTA → code editor
 */

'use client';

import Link from 'next/link';
import { MapPin, Download, Briefcase, ArrowRight } from 'lucide-react';
import { ScrollParallax, FadeIn, TextScramble } from '@/components/gsap';
import { CodeEditor } from '@/components/code-editor';
import type { Profile, SkillGroup } from '@/lib/graphql/queries';

interface CodeEditorHeroProps {
  profile?: Profile | null;
  skillGroups?: SkillGroup[];
}

const DEFAULTS = {
  name: 'Alvin Quach',
  headline: 'Full Stack Developer',
  location: 'San Francisco Bay Area',
  availabilityStatus: 'open' as const,
  openToRoles: ['Full Stack Engineer', 'Frontend Engineer', 'Software Engineer'],
  strengths: ['Problem Solving', 'System Design', 'Clean Code'],
};

const CYCLE_PHRASES = [
  'web applications',
  'production software',
  'tools people use',
];

export function CodeEditorHero({ profile, skillGroups }: CodeEditorHeroProps) {
  const p = profile || DEFAULTS;
  const isOpen = p.availabilityStatus === 'open' || p.availabilityStatus === 'both';

  return (
    <section className="relative overflow-hidden px-4" style={{ paddingTop: 32, paddingBottom: 80 }}>
      <div className="container max-w-5xl mx-auto relative z-10">

        {/* ═══ INFO BAR ═══════════════════════════════════ */}
        <FadeIn distance={10} duration={0.4}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 24px', padding: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#3b82f6' }}>AQ</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ds-text)', margin: 0 }}>{p.name || 'Alvin Quach'}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{p.headline || 'Full Stack Developer'}</p>
              </div>
            </div>

            {p.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                <MapPin size={12} /> {p.location}
              </span>
            )}

            {isOpen && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', borderRadius: 10, border: '1px solid rgba(34,197,94,0.2)', backgroundColor: 'rgba(34,197,94,0.05)', fontSize: 11, fontWeight: 500, color: '#22c55e' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#22c55e' }} className="animate-pulse" />
                Available
              </span>
            )}

            {profile?.resume?.url && (
              <a href={`${profile.resume.url}?dl=resume.pdf`} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}
                className="hover:text-white transition-colors">
                <Download size={11} /> Resume
              </a>
            )}

            <Link href="/experience"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}
              className="hover:text-white transition-colors">
              <Briefcase size={11} /> Experience <ArrowRight size={10} />
            </Link>
          </div>
        </FadeIn>
        <div style={{ paddingTop: 40, paddingBottom: 32, maxWidth: 720 }}>
        
          <FadeIn delay={0.5} distance={12}>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', margin: '20px 0 0', lineHeight: 1.7, maxWidth: 520 }}>
              From first commit to deployment. I build with TypeScript, React, Next.js,
              PostgreSQL, and whatever else the problem needs.
            </p>
          </FadeIn>
        </div>

        {/* ═══ CODE EDITOR ═══════════════════════════════ */}
        <div style={{ paddingTop: 40 }}>
          <FadeIn delay={1.0} distance={25} duration={0.8}>
            <ScrollParallax
              startRotateX={0}
              endRotateX={0}
              startY={15}
              endY={0}
              startOpacity={0.85}
              endOpacity={1}
              startScale={0.99}
              endScale={1}
              perspective={1200}
              start="top 90%"
              end="top 50%"
              scrub={1}
              className="relative w-full"
            >
              <CodeEditor
                profile={{
                  name: p.name || DEFAULTS.name,
                  headline: p.headline || DEFAULTS.headline,
                  location: p.location || DEFAULTS.location,
                  availabilityStatus: p.availabilityStatus || DEFAULTS.availabilityStatus,
                  openToRoles: p.openToRoles || DEFAULTS.openToRoles,
                  strengths: p.strengths || DEFAULTS.strengths,
                  previousCareers: profile?.previousCareers as Array<{
                    title?: string;
                    transferableSkills?: string[];
                  }>,
                }}
                skillGroups={skillGroups}
              />
            </ScrollParallax>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
