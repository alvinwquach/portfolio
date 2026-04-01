/**
 * Landing Page
 * ============
 * Hero → About → Projects → Skills → Hobbies → Contact
 * Alternating backgrounds, gradient dividers, numbered sections.
 */

import { getLandingPageData, getSkillGroups } from '@/lib/graphql/queries';
import { CodeEditorHero } from '@/components/sections/CodeEditorHero';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';

function GradientDivider() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.15) 30%, rgba(59,130,246,0.15) 70%, transparent 100%)' }} />
    </div>
  );
}

export default async function HomePage() {
  const [data, skillGroups] = await Promise.all([
    getLandingPageData(),
    getSkillGroups(),
  ]);
  const { profile, featuredProjects } = data;

  return (
    <div>
      {/* Hero — code editor */}
      <CodeEditorHero profile={profile} skillGroups={skillGroups} />

      <GradientDivider />

      {/* Projects — client work + products */}
      <FeaturedProjects projects={featuredProjects || []} />

      <GradientDivider />

      {/* Skills — grouped tech stack */}
      <div style={{ backgroundColor: '#0a0c10' }}>
        <SkillsSection skillGroups={skillGroups || []} />
      </div>

      <GradientDivider />

      {/* Contact */}
      <div style={{ backgroundColor: '#0a0c10' }}>
        <ContactSection
          email={profile?.email}
          github={profile?.github}
          linkedin={profile?.linkedin}
          twitter={profile?.twitter}
        />
      </div>
    </div>
  );
}
