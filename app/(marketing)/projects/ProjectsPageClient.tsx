/**
 * Projects Page Client Component
 * ==============================
 * Case Study Index — not a gallery.
 *
 * Design follows blog page pattern:
 * - Simple text-link filters (not pill buttons)
 * - Clean search bar
 * - Show ALL tech (no truncation)
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  Github,
  ArrowRight,
  Users,
  Clock,
  FolderOpen,
  Search,
  X,
  CheckCircle2,
} from 'lucide-react';
import type { Project } from '@/lib/graphql/queries';

// Category display names
const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  databases: 'Databases',
  'data-ml': 'Data & ML',
  testing: 'Testing',
  'project-tools': 'DevOps',
};

interface ProjectsPageClientProps {
  projects: Project[];
  categories: string[];
}

// Count projects per category
function countProjectsByCategory(projects: Project[], category: string): number {
  return projects.filter((project) =>
    project.techStack?.some((tech) => tech.category === category)
  ).length;
}

/**
 * Simple text filter link - matches blog style
 */
function FilterLink({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-sm transition-colors ${
        active
          ? 'text-foreground font-medium'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className="ml-1 text-muted-foreground">({count})</span>
      )}
    </button>
  );
}

/**
 * Featured Project Card — Full-width hero treatment
 * Shows situation, outcomes, and key details at a glance
 */
function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <div className="relative rounded-xl border border-border/50 bg-card/50 overflow-hidden group">
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Image */}
        {project.image?.url && (
          <div className="aspect-video lg:aspect-auto lg:h-full relative overflow-hidden bg-muted">
            <Image
              src={project.image.url}
              alt={project.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 lg:p-8 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <span className="text-xs font-medium text-cyan uppercase tracking-wider">
              Featured Project
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold mt-2 mb-2 group-hover:text-cyan transition-colors">
              <Link href={`/projects/${project.slug.current}`}>
                {project.name}
              </Link>
            </h2>
            {project.tagline && (
              <p className="text-lg text-muted-foreground">
                {project.tagline}
              </p>
            )}
          </div>

          {/* Meta: Role, Team, Duration */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
            {project.role && (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{project.role}</span>
              </div>
            )}
            {project.teamSize && (
              <span className="text-foreground font-medium">
                {project.teamSize === 1 ? 'Solo' : `Team of ${project.teamSize}`}
              </span>
            )}
            {project.duration && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{project.duration}</span>
              </div>
            )}
          </div>

          {/* Situation excerpt */}
          {project.situation && (
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {project.situation}
            </p>
          )}

          {/* Tech Stack - ALL of them */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.techStack.map((skill) => (
                <Badge key={skill._id} variant="secondary" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Results */}
          {project.results && project.results.length > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/5 border border-green-500/10">
              <p className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-2">
                Key Outcomes
              </p>
              <ul className="space-y-1.5">
                {project.results.slice(0, 3).map((result, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto flex items-center gap-3">
            <Button asChild>
              <Link href={`/projects/${project.slug.current}`}>
                View Case Study
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-border hover:bg-secondary transition-colors"
                aria-label="View live site"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-border hover:bg-secondary transition-colors"
                aria-label="View source code"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Standard Project Card — Compact but informative
 * Shows role, description, and ALL tech
 */
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group rounded-xl border border-border/50 bg-card/30 overflow-hidden hover:border-border hover:bg-card/50 transition-all">
      {/* Image */}
      {project.image?.url && (
        <div className="aspect-video relative overflow-hidden bg-muted">
          <Image
            src={project.image.url}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-1 group-hover:text-cyan transition-colors">
          <Link href={`/projects/${project.slug.current}`}>
            {project.name}
          </Link>
        </h3>

        {/* Tagline */}
        {project.tagline && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {project.tagline}
          </p>
        )}

        {/* Meta: Role + Team + Duration */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3 text-xs text-muted-foreground">
          {project.role && (
            <span className="font-medium text-foreground">{project.role}</span>
          )}
          {project.teamSize && (
            <>
              <span className="text-border">•</span>
              <span>{project.teamSize === 1 ? 'Solo' : `Team of ${project.teamSize}`}</span>
            </>
          )}
          {project.duration && (
            <>
              <span className="text-border">•</span>
              <span>{project.duration}</span>
            </>
          )}
        </div>

        {/* Tech Stack - ALL of them */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((skill) => (
              <Badge key={skill._id} variant="outline" className="text-xs">
                {skill.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Situation excerpt */}
        {project.situation && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            → {project.situation}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/projects/${project.slug.current}`}>
              View Case Study
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-secondary transition-colors"
              aria-label="View live site"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-secondary transition-colors"
              aria-label="View source code"
            >
              <Github className="h-4 w-4 text-muted-foreground" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectsPageClient({ projects, categories }: ProjectsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('q') || '';

  const [activeTab, setActiveTab] = React.useState(initialCategory);
  const [searchTerm, setSearchTerm] = React.useState(initialSearch);
  const [searchFocused, setSearchFocused] = React.useState(false);

  // Update URL when filters change
  const updateURL = React.useCallback((category: string, search: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (search) params.set('q', search);
    const query = params.toString();
    router.push(query ? `/projects?${query}` : '/projects', { scroll: false });
  }, [router]);

  // Handle tab change - memoized to prevent unnecessary re-renders
  const handleTabChange = React.useCallback((tab: string) => {
    setActiveTab(tab);
    updateURL(tab, searchTerm);
  }, [updateURL, searchTerm]);

  // Handle search change - memoized to prevent unnecessary re-renders
  const handleSearchChange = React.useCallback((term: string) => {
    setSearchTerm(term);
    updateURL(activeTab, term);
  }, [updateURL, activeTab]);

  // Filter projects based on category and search term
  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      // Category filter
      if (activeTab && activeTab !== 'all') {
        const hasCategory = project.techStack?.some(
          (tech) => tech.category === activeTab
        );
        if (!hasCategory) return false;
      }

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const nameMatch = project.name.toLowerCase().includes(search);
        const taglineMatch = project.tagline?.toLowerCase().includes(search);
        const techMatch = project.techStack?.some(
          (tech) => tech.name.toLowerCase().includes(search)
        );
        const situationMatch = project.situation?.toLowerCase().includes(search);
        if (!nameMatch && !taglineMatch && !techMatch && !situationMatch) return false;
      }

      return true;
    });
  }, [projects, activeTab, searchTerm]);

  // Separate featured from rest
  const featuredProject = filteredProjects.find((p) => p.featured);
  const otherProjects = filteredProjects.filter((p) => !p.featured || p !== featuredProject);

  const hasFilters = activeTab !== 'all' || searchTerm;

  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Systems designed, architected, and shipped under real constraints.
          </p>
        </div>

        {/* Category Filters - Simple text links like blog */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 pb-6 border-b border-border/30">
          <FilterLink
            label="All"
            count={projects.length}
            active={activeTab === 'all'}
            onClick={() => handleTabChange('all')}
          />
          {categories.map((cat) => (
            <FilterLink
              key={cat}
              label={CATEGORY_LABELS[cat] || cat}
              count={countProjectsByCategory(projects, cat)}
              active={activeTab === cat}
              onClick={() => handleTabChange(cat)}
            />
          ))}
        </div>

        {/* Search Bar - Matches blog style */}
        <div className={`relative w-full max-w-sm mb-10 transition-all duration-200 ${searchFocused ? 'max-w-md' : ''}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects or technologies..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-10 pr-10 py-2 bg-transparent border border-border/50 rounded-md text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-border transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Results count when filtered */}
        {hasFilters && (
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredProjects.length} of {projects.length} projects
            {activeTab !== 'all' && ` in ${CATEGORY_LABELS[activeTab] || activeTab}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        )}

        {/* Projects */}
        {filteredProjects.length > 0 ? (
          <div className="space-y-12">
            {/* Featured Project */}
            {featuredProject && (
              <section>
                <FeaturedProjectCard project={featuredProject} />
              </section>
            )}

            {/* Other Projects */}
            {otherProjects.length > 0 && (
              <section>
                {featuredProject && (
                  <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
                    All Projects
                  </h2>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  {otherProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">
              {hasFilters
                ? 'No projects match your filters.'
                : 'No projects found.'}
            </p>
            {hasFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                  router.push('/projects', { scroll: false });
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
