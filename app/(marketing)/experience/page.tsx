/**
 * Experience Page — Sidebar Tabs + Detail Panel
 * ==============================================
 *
 * LAYOUT (matches /projects and /blog pattern):
 *   LEFT SIDEBAR (280px, sticky):
 *     - Avatar + name
 *     - "Experience" title
 *     - Company tabs grouped by domain
 *     - Resume download
 *
 *   RIGHT CONTENT (flex-1):
 *     - Role title + company (highlighted)
 *     - Date range + duration
 *     - Company description callout
 *     - Achievement bullets
 *     - Tech stack tags
 *     - Client projects (under T Creative Studio)
 */

import { getExperiences, getProfile, getProjects } from '@/lib/graphql/queries';
import { Download } from 'lucide-react';
import { formatDate, calculateDuration } from '@/lib/utils';
import { ExperiencePageClient } from './ExperiencePageClient';

export const metadata = {
  title: 'Experience | Work History',
  description: 'Professional work experience and career timeline. Full Stack Developer with experience across manufacturing, tech, and creative industries.',
};

const DOMAIN_GROUPS = [
  { label: 'Engineering & Studio', companies: ['T Creative Studio', 'Bring the Shreds'] },
  { label: 'Advocacy & Community', companies: ['Tintri', 'Ellie Mae'] },
  { label: 'Manufacturing & Ops', companies: ['Spartronics', 'Safeway'] },
] as const;

export default async function ExperiencePage() {
  const [experiences, profile, projects] = await Promise.all([
    getExperiences(),
    getProfile(),
    getProjects(),
  ]);

  const clientProjects = projects.filter(p => p.projectType === 'freelance');

  // Build domain-grouped experience list
  const experienceByCompany = new Map(
    experiences.map(exp => [exp.company, exp])
  );

  const domainSections = DOMAIN_GROUPS.map(group => ({
    label: group.label,
    items: group.companies
      .map(company => experienceByCompany.get(company))
      .filter(Boolean) as typeof experiences,
  })).filter(section => section.items.length > 0);

  // Serialize for client component
  const sections = domainSections.map(section => ({
    label: section.label,
    items: section.items.map(exp => ({
      _id: exp._id,
      company: exp.company,
      role: exp.role,
      location: exp.location,
      employmentType: exp.employmentType,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      situation: exp.situation,
      tasks: exp.tasks,
      actions: exp.actions,
      results: exp.results,
      tradeoffs: exp.tradeoffs,
      technicalDecisions: exp.technicalDecisions,
      challenges: exp.challenges,
      lessonsLearned: exp.lessonsLearned,
      techStack: exp.techStack,
      duration: calculateDuration(exp.startDate, exp.endDate, exp.isCurrent),
      formattedStart: formatDate(exp.startDate, { month: 'short', year: 'numeric' }),
      formattedEnd: exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate, { month: 'short', year: 'numeric' }) : undefined,
    })),
  }));

  const clients = clientProjects.map(proj => ({
    _id: proj._id,
    name: proj.name,
    clientName: proj.clientName,
    clientIndustry: proj.clientIndustry,
    situation: proj.situation,
    results: proj.results,
    techStack: proj.techStack,
    slug: proj.slug?.current,
    liveUrl: proj.liveUrl,
  }));

  const tCreativeStudioId = experiences.find(e => e.company === 'T Creative Studio')?._id;

  return (
    <ExperiencePageClient
      sections={sections}
      clients={clients}
      tCreativeStudioId={tCreativeStudioId}
      resumeUrl={profile?.resume?.url}
    />
  );
}
