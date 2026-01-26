/**
 * Projects Page — Systems in Practice
 * ====================================
 * Not a feature list. Systems — designed, architected, and shipped.
 * Each project shows technical decisions, tradeoffs articulated, results measured.
 */

import { getProjects } from '@/lib/graphql/queries';
import { ProjectsPageClient } from './ProjectsPageClient';

export const metadata = {
  title: 'Projects',
  description: 'Full-stack systems designed, architected, and shipped under real constraints. Each project demonstrates technical decisions, articulated tradeoffs, and measured results.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  // Extract unique categories from all projects
  const allCategories = new Set<string>();
  projects.forEach((project) => {
    project.techStack?.forEach((tech: { category?: string }) => {
      if (tech.category) {
        allCategories.add(tech.category);
      }
    });
  });

  return (
    <ProjectsPageClient
      projects={projects}
      categories={Array.from(allCategories).sort()}
    />
  );
}
