/**
 * FeaturedProjects Section Component
 * ===================================
 * Showcases featured projects with distinction between client work and personal projects.
 * Featured client work gets hero treatment, other client work shown in grid, personal projects in smaller grid.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Github, Briefcase, Code2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/gsap';
import type { Project } from '@/lib/graphql/queries';

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  // Separate client work from personal projects
  const clientProjects = projects.filter(p => p.projectType === 'freelance');
  const personalProjects = projects.filter(p => p.projectType !== 'freelance');

  // First client project gets hero treatment, rest go in grid
  const featuredClientProject = clientProjects[0];
  const otherClientProjects = clientProjects.slice(1);

  return (
    <section id="projects" className="py-24 relative scroll-mt-20">
      <div className="container">
        {/* Client Work Section */}
        {clientProjects.length > 0 && (
          <>
            <FadeIn>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-medium text-amber mb-2">
                    Client Work
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Professional Projects
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Real solutions built for real clients
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Featured Client Project - Hero treatment */}
            {featuredClientProject && (
              <div className="mb-16">
                <FadeIn>
                  <ClientProjectCard project={featuredClientProject} isFeatured />
                </FadeIn>
              </div>
            )}

            {/* Other Client Projects - Grid layout */}
            {otherClientProjects.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6 mb-24">
                {otherClientProjects.map((project) => (
                  <FadeIn key={project._id}>
                    <ClientProjectCardCompact project={project} />
                  </FadeIn>
                ))}
              </div>
            )}
          </>
        )}

        {/* Personal Projects Section */}
        {personalProjects.length > 0 && (
          <>
            <FadeIn>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-medium text-cyan mb-2">
                    Products
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Products
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Ideas I've built to learn, explore, and solve problems
                  </p>
                </div>
                <Button asChild variant="ghost" className="hidden md:flex">
                  <Link href="/projects">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
              {personalProjects.map((project, index) => (
                <FadeIn key={project._id}>
                  <PersonalProjectCard project={project} priority={index < 3} />
                </FadeIn>
              ))}
            </div>
          </>
        )}

        <FadeIn className="mt-16 text-center md:hidden">
          <Button asChild variant="outline">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

/**
 * Client Project Card - Hero-style treatment for featured freelance/client work
 */
function ClientProjectCard({ project, isFeatured = false }: { project: Project; isFeatured?: boolean }) {
  return (
    <div className="relative rounded-2xl border border-amber/20 bg-gradient-to-br from-amber/5 via-background to-background overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Side */}
        <div className="relative aspect-[16/10] lg:aspect-auto">
          {project.image?.url ? (
            <Image
              src={project.image.url}
              alt={project.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-amber/5">
              <Briefcase className="h-16 w-16 text-amber/30" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/80 hidden lg:block" />
        </div>

        {/* Content Side */}
        <div className="p-8 lg:py-12 lg:pr-12 lg:pl-0 flex flex-col justify-center">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {isFeatured && (
              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
            <Badge className="bg-amber/20 text-amber border-amber/30">
              <Briefcase className="h-3 w-3 mr-1" />
              Client Work
            </Badge>
            {project.clientIndustry && (
              <Badge variant="secondary" className="text-xs">
                {project.clientIndustry}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            <Link
              href={`/project/${project.slug.current}`}
              className="hover:text-amber transition-colors"
            >
              {project.name}
            </Link>
          </h3>

          {/* Tagline */}
          {project.tagline && (
            <p className="text-xl text-muted-foreground mb-4">
              {project.tagline}
            </p>
          )}

          {/* Tech Stack - max 5 pills */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 5).map((skill) => (
                  <Badge key={skill._id} variant="outline" className="text-xs">
                    {skill.name}
                  </Badge>
                ))}
                {project.techStack.length > 5 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{project.techStack.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Key Result - 1 headline only */}
          {project.results && project.results.length > 0 && (
            <p className="text-sm text-muted-foreground mb-6 flex items-start gap-2">
              <span className="text-amber mt-0.5">•</span>
              <span>{project.results[0]}</span>
            </p>
          )}

          {/* Actions - Always visible */}
          <div className="flex flex-wrap gap-3 mt-auto">
            <Button asChild>
              <Link href={`/project/${project.slug.current}`}>
                View Case Study
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            {project.liveUrl && (
              <Button asChild variant="outline" className="border-amber/30 hover:bg-amber/10">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">{new URL(project.liveUrl).hostname}</span>
                  <span className="sm:hidden">Live Site</span>
                </a>
              </Button>
            )}

            {project.githubUrl && (
              <Button asChild variant="ghost" size="icon">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source code"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Client Project Card Compact - Grid-style card for non-featured client work
 */
function ClientProjectCardCompact({ project }: { project: Project }) {
  return (
    <div className="group relative flex flex-col h-full rounded-xl border border-amber/10 bg-gradient-to-br from-amber/5 via-background to-background hover:border-amber/30 hover:shadow-md transition-all overflow-hidden">
      {/* Image */}
      <div className="aspect-[16/9] relative overflow-hidden">
        {project.image?.url ? (
          <Image
            src={project.image.url}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-amber/5">
            <Briefcase className="h-10 w-10 text-amber/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className="bg-amber/20 text-amber border-amber/30 text-xs">
            <Briefcase className="h-3 w-3 mr-1" />
            Client Work
          </Badge>
          {project.clientIndustry && (
            <Badge variant="secondary" className="text-xs">
              {project.clientIndustry}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2">
          <Link
            href={`/project/${project.slug.current}`}
            className="hover:text-amber transition-colors"
          >
            {project.name}
          </Link>
        </h3>

        {/* Tagline */}
        {project.tagline && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.tagline}
          </p>
        )}

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.techStack.slice(0, 5).map((skill) => (
              <Badge key={skill._id} variant="outline" className="text-xs">
                {skill.name}
              </Badge>
            ))}
            {project.techStack.length > 5 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{project.techStack.length - 5}
              </Badge>
            )}
          </div>
        )}

        {/* Key Result - 1 headline only */}
        {project.results && project.results.length > 0 && (
          <p className="text-xs text-muted-foreground mb-4 flex items-start gap-2">
            <span className="text-amber mt-0.5">•</span>
            <span className="line-clamp-1">{project.results[0]}</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-amber/10">
          <Button asChild size="sm" variant="default" className="flex-1">
            <Link href={`/project/${project.slug.current}`}>
              View Case Study
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>

          {project.liveUrl && (
            <Button asChild size="sm" variant="outline" className="border-amber/30 hover:bg-amber/10">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit live site"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}

          {project.githubUrl && (
            <Button asChild size="sm" variant="ghost">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source code"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Personal Project Card - Compact card for side projects
 */
function PersonalProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <div className="group relative flex flex-col h-full rounded-xl border bg-card/50 hover:bg-card hover:shadow-md transition-all overflow-hidden">
      {/* Image */}
      <div className="aspect-[16/10] relative overflow-hidden">
        {project.image?.url ? (
          <Image
            src={project.image.url}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Code2 className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-2">
          <Link
            href={`/project/${project.slug.current}`}
            className="hover:text-cyan transition-colors"
          >
            {project.name}
          </Link>
        </h3>

        {/* Tagline */}
        {project.tagline && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.tagline}
          </p>
        )}

        {/* Tech Stack - max 5 pills */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.techStack.slice(0, 5).map((skill) => (
              <Badge key={skill._id} variant="secondary" className="text-xs">
                {skill.name}
              </Badge>
            ))}
            {project.techStack.length > 5 && (
              <Badge variant="secondary" className="text-xs text-muted-foreground">
                +{project.techStack.length - 5}
              </Badge>
            )}
          </div>
        )}

        {/* Actions - Always visible at bottom */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/project/${project.slug.current}`}>
              Details
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>

          {project.liveUrl && (
            <Button asChild size="sm" variant="outline" className="flex-1">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                <span className="truncate text-xs">{new URL(project.liveUrl).hostname.replace('www.', '')}</span>
              </a>
            </Button>
          )}

          {project.githubUrl && (
            <Button asChild size="sm" variant="ghost" className="px-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source code"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
