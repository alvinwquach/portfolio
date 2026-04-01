/**
 * About Section — Personal details, resume, roles sought
 * Complements the hero (which handles the pitch) with practical info.
 */

import Link from 'next/link';
import { MapPin, Download, ArrowRight, Briefcase } from 'lucide-react';
import { FadeIn, StaggerChildren } from '@/components/gsap';
import type { Profile } from '@/lib/graphql/queries';

interface AboutSectionProps {
  profile: Profile | null;
}

export function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) return null;

  const isOpen = profile.availabilityStatus === 'open' || profile.availabilityStatus === 'both';

  return (
    <section style={{ padding: '64px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <FadeIn distance={15}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 32px', paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Name + headline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#3b82f6' }}>AQ</div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ds-text)', margin: 0 }}>{profile.name || 'Alvin Quach'}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{profile.headline || 'Full Stack Developer'}</p>
              </div>
            </div>

            {/* Location */}
            {profile.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                <MapPin size={13} /> {profile.location}
              </span>
            )}

            {/* Status */}
            {isOpen && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 12, border: '1px solid rgba(34,197,94,0.2)', backgroundColor: 'rgba(34,197,94,0.06)', fontSize: 11, fontWeight: 500, color: '#22c55e' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e' }} className="animate-pulse" />
                Available
              </span>
            )}

            {/* Resume */}
            {profile.resume?.url && (
              <a
                href={`${profile.resume.url}?dl=resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                }}
                className="hover:text-white transition-colors"
              >
                <Download size={12} /> Resume
              </a>
            )}

            {/* Experience link */}
            <Link href="/experience"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
              className="hover:text-white transition-colors">
              <Briefcase size={12} /> Experience <ArrowRight size={11} />
            </Link>
          </div>
        </FadeIn>

        {/* Roles */}
        {profile.openToRoles && profile.openToRoles.length > 0 && (
          <FadeIn delay={0.1} distance={10}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, paddingTop: 16 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Looking for:</span>
              {profile.openToRoles.map((role, i) => (
                <span key={i} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, backgroundColor: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.12)' }}>
                  {role}
                </span>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
