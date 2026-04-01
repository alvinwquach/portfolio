/**
 * Hobbies Section — Numbered, with subtle depth
 */

'use client';

import dynamic from 'next/dynamic';
import { Music } from 'lucide-react';
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

interface HobbiesSectionProps {
  hobbies?: { name?: string; description?: string }[];
}

export function HobbiesSection({ hobbies }: HobbiesSectionProps) {
  if (!hobbies || hobbies.length === 0) return null;

  const djHobby = hobbies.find(h => h.name?.toLowerCase().includes('dj'));

  return (
    <section id="hobbies" style={{ padding: '80px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Section number + header */}
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>04</span>
            <div style={{ height: 1, width: 32, backgroundColor: 'rgba(59,130,246,0.3)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>Beyond the Code</span>
          </div>
          <TextReveal as="h2" by="word" stagger={0.06} duration={0.5} className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Hobbies and Interests
          </TextReveal>
          <FadeIn delay={0.3} distance={10}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.6 }}>
              What I do when I&apos;m not building software.
            </p>
          </FadeIn>
        </div>

        {/* DJ Feature */}
        {djHobby && (
          <FadeIn delay={0.4} distance={10}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(59,130,246,0.08)', color: '#3b82f6' }}>
              <Music size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ds-text)', margin: 0 }}>{djHobby.name}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, maxWidth: 480 }}>{djHobby.description}</p>
            </div>
          </div>
          </FadeIn>
        )}

        {/* 3D Scene in elevated container */}
        <FadeIn delay={0.5} distance={20}>
        <div className="h-[500px] md:h-[550px] lg:h-[600px]" style={{ position: 'relative', width: '100%', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: '#0d1117' }}>
          <DJScene3D className="w-full h-full" />
        </div>
        </FadeIn>
      </div>
    </section>
  );
}
