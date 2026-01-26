/**
 * Landing Page
 * ============
 * Clean single-page portfolio with consistent dark background.
 * Structure: CodeEditor Hero → 3D Scene → Projects → Hobbies → Contact
 * Career journey is now integrated into the code editor as career.ts tab
 */

import { getLandingPageData, getSkillGroups } from '@/lib/graphql/queries';
import { CodeEditorHero } from '@/components/sections/CodeEditorHero';
import { WorkshopHero } from '@/components/sections/WorkshopHero';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { HobbiesSection } from '@/components/sections/HobbiesSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default async function HomePage() {
  const [data, skillGroups] = await Promise.all([
    getLandingPageData(),
    getSkillGroups(),
  ]);
  const { profile, featuredProjects } = data;

  return (
    <div className="bg-background">
      {/* Hero - Code editor with tabs: developer.tsx, skills.ts, career.ts */}
      <CodeEditorHero profile={profile} skillGroups={skillGroups} />

      {/* 3D Studio Scene - Interactive navigation to projects */}
      <WorkshopHero
        name={profile?.name || 'Alvin Quach'}
        title={profile?.headline || 'Full-Stack Developer'}
        tagline="Explore my studio — click objects to discover projects"
      />

      {/* Featured Projects */}
      <FeaturedProjects projects={featuredProjects || []} />

      {/* Hobbies - linked from DJ equipment in 3D scene */}
      <HobbiesSection hobbies={profile?.hobbiesAndInterests} />

      {/* Contact */}
      <ContactSection
        email={profile?.email}
        github={profile?.github}
        linkedin={profile?.linkedin}
        twitter={profile?.twitter}
      />
    </div>
  );
}
