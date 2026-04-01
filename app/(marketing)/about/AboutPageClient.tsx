/**
 * About Page — Single column, centered, personal
 */

'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Download, ArrowRight, Github, Linkedin, Mail, Music } from 'lucide-react';
import { FadeIn, TextReveal } from '@/components/gsap';
import { LogoTurntableAnimated } from '@/components/ui/logo-new/LogoTurntableAnimated';

const DJScene3D = dynamic(
  () => import('@/components/three/DJScene3D').then((mod) => mod.DJScene3D),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
        <LogoTurntableAnimated size={200} autoPlay showControls={false} />
      </div>
    ),
  }
);

interface AboutPageClientProps {
  name: string;
  headline: string;
  location?: string;
  bio?: string;
  hobbies?: { name?: string; description?: string }[];
  strengths?: string[];
  whatIEnjoy?: string[];
  whatImLookingFor?: string[];
  resumeUrl?: string;
  imageUrl?: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

export function AboutPageClient({
  name, headline, location, bio, hobbies, strengths,
  whatIEnjoy, whatImLookingFor, resumeUrl, imageUrl,
  github, linkedin, email,
}: AboutPageClientProps) {
  const djHobby = hobbies?.find(h => h.name?.toLowerCase().includes('dj'));
  const otherHobbies = hobbies?.filter(h => !h.name?.toLowerCase().includes('dj'));

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>

      {/* ═══ HEADER ══════════════════════════════════════ */}
      <FadeIn distance={12}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          {imageUrl ? (
            <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(59,130,246,0.2)', position: 'relative', flexShrink: 0 }}>
              <Image src={imageUrl} alt={name} fill className="object-cover" />
            </div>
          ) : (
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', border: '2px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#3b82f6', flexShrink: 0 }}>AQ</div>
          )}
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--ds-text)', margin: 0 }}>{name}</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {headline}
              {location && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.3)' }}>
                  <MapPin size={12} /> {location}
                </span>
              )}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ═══ BIO ═════════════════════════════════════════ */}
      <FadeIn delay={0.1} distance={10}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, margin: 0 }}>
            I build and ship full-stack web applications — real-time systems,
            AI-powered tools, data visualizations, and production SaaS platforms.
            I care about clean architecture, thoughtful UX, and writing code that
            other engineers want to work with.
          </p>
          {bio && (
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, margin: '16px 0 0' }}>
              {bio}
            </p>
          )}
        </div>
      </FadeIn>

      {/* ═══ LINKS ═══════════════════════════════════════ */}
      <FadeIn delay={0.15} distance={10}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 48, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {resumeUrl && (
            <a href={`${resumeUrl}?dl=resume.pdf`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--ds-text)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}
              className="hover:bg-white/10 transition-colors">
              <Download size={13} /> Resume
            </a>
          )}
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}
              className="hover:text-white hover:border-white/20 transition-colors">
              <Github size={13} /> GitHub
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}
              className="hover:text-white hover:border-white/20 transition-colors">
              <Linkedin size={13} /> LinkedIn
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}
              className="hover:text-white hover:border-white/20 transition-colors">
              <Mail size={13} /> Email
            </a>
          )}
        </div>
      </FadeIn>

      {/* ═══ WHAT I ENJOY / STRENGTHS ════════════════════ */}
      {(whatIEnjoy?.length || strengths?.length) && (
        <FadeIn delay={0.2} distance={10}>
          <div className="grid sm:grid-cols-2" style={{ gap: 32, marginBottom: 48 }}>
            {whatIEnjoy && whatIEnjoy.length > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 12px', fontFamily: 'var(--font-mono)' }}>What I Enjoy</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {whatIEnjoy.map((item, i) => (
                    <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, display: 'flex', gap: 6 }}>
                      <span style={{ color: '#3b82f6' }}>·</span> {item}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {strengths && strengths.length > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 12px', fontFamily: 'var(--font-mono)' }}>Strengths</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {strengths.map((item, i) => (
                    <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, display: 'flex', gap: 6 }}>
                      <span style={{ color: '#22c55e' }}>·</span> {item}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {/* ═══ WHAT I'M LOOKING FOR ════════════════════════ */}
      {whatImLookingFor && whatImLookingFor.length > 0 && (
        <FadeIn delay={0.25} distance={10}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', margin: '0 0 12px', fontFamily: 'var(--font-mono)' }}>What I&apos;m Looking For</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {whatImLookingFor.map((item, i) => (
                <span key={i} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 6, backgroundColor: 'rgba(59,130,246,0.06)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.12)' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* ═══ BEYOND THE CODE ═════════════════════════════ */}
      {hobbies && hobbies.length > 0 && (
        <>
          <FadeIn distance={10}>
            <div style={{ marginBottom: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <TextReveal as="h2" by="word" stagger={0.06} duration={0.5} className="text-2xl font-bold tracking-tight">
                Beyond the Code
              </TextReveal>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: '6px 0 0' }}>
                What I do when I&apos;m not building software.
              </p>
            </div>
          </FadeIn>

          {/* DJ Feature + 3D Scene */}
          {djHobby && (
            <FadeIn delay={0.1} distance={15}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ padding: 8, borderRadius: 8, backgroundColor: 'rgba(59,130,246,0.08)', color: '#3b82f6' }}>
                    <Music size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ds-text)', margin: 0 }}>{djHobby.name}</h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{djHobby.description}</p>
                  </div>
                </div>

                <div style={{ height: 400, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0d1117' }}>
                  <DJScene3D className="w-full h-full" />
                </div>
              </div>
            </FadeIn>
          )}

          {/* Other hobbies */}
          {otherHobbies && otherHobbies.length > 0 && (
            <FadeIn delay={0.2} distance={10}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {otherHobbies.map((hobby, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ds-text)', margin: '0 0 2px' }}>{hobby.name}</h3>
                    {hobby.description && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{hobby.description}</p>}
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </>
      )}

      {/* ═══ CTA ═════════════════════════════════════════ */}
      <FadeIn distance={10}>
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ds-text)', margin: '0 0 6px' }}>Want to work together?</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: '0 0 16px' }}>
            I&apos;m always open to interesting projects and opportunities.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <Link href="/schedule"
              style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none' }}
              className="hover:opacity-85 transition-opacity">
              Schedule a Call
            </Link>
            <Link href="/projects"
              style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
              className="hover:border-white/20 transition-colors">
              View Projects <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
