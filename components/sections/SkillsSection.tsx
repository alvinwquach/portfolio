/**
 * Skills Section — Clean grouped layout, no cards
 */

import { FadeIn, TextReveal } from '@/components/gsap';
import type { SkillGroup } from '@/lib/graphql/queries';

interface SkillsSectionProps {
  skillGroups: SkillGroup[];
}

export function SkillsSection({ skillGroups }: SkillsSectionProps) {
  if (!skillGroups || skillGroups.length === 0) return null;

  return (
    <section id="skills" style={{ padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <FadeIn>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>03</span>
            <div style={{ height: 1, width: 32, backgroundColor: 'rgba(59,130,246,0.3)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>Tech Stack</span>
          </div>
          <TextReveal as="h2" by="word" stagger={0.06} duration={0.5} className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            Skills and Technologies
          </TextReveal>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '0 0 40px', maxWidth: 480 }}>Tools and technologies I use to build production systems</p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '32px 48px' }}>
          {skillGroups.map((group, i) => (
            <FadeIn key={group.category} delay={i * 0.04}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3b82f6', margin: '0 0 10px', fontFamily: 'var(--font-mono)' }}>
                  {group.categoryLabel}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 0', lineHeight: 1.8 }}>
                  {group.skills.map((skill, j) => (
                    <span key={skill._id} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                      {skill.name}{j < group.skills.length - 1 && <span style={{ margin: '0 6px', color: 'rgba(255,255,255,0.15)' }}>·</span>}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
