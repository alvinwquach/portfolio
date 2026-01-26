/**
 * Featured Systems Component
 * ==========================
 * Projects framed as systems, not features.
 * Each project gets space. Title + One sentence + The key tradeoff made.
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/gsap/animations/FadeIn';
import { StaggerChildren } from '@/components/gsap/animations/StaggerChildren';
import type { Project } from '@/lib/graphql/queries';

interface FeaturedSystemsProps {
  projects: Project[];
}

export function FeaturedSystems({ projects }: FeaturedSystemsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-24">
      <div className="container">
        {/* Section Header */}
        <FadeIn className="mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground">
              Full-stack systems designed, architected, and shipped under real constraints.
              Click into any project to see the STAR breakdown: what I faced, what I decided, and why.
            </p>
          </div>
        </FadeIn>

        {/* Projects List */}
        <StaggerChildren className="space-y-12">
          {projects.slice(0, 3).map((project, index) => (
            <article
              key={project._id}
              className="group grid lg:grid-cols-2 gap-8 items-center"
            >
              {/* Image */}
              {project.image?.url && (
                <div className={`relative aspect-video rounded-lg overflow-hidden bg-muted ${
                  index % 2 === 1 ? 'lg:order-2' : ''
                }`}>
                  <Image
                    src={project.image.url}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-cyan/0 group-hover:bg-cyan/10 transition-colors duration-300" />
                </div>
              )}

              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                {/* Project Number */}
                <span className="text-sm font-mono text-muted-foreground mb-2 block">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-cyan transition-colors">
                  <Link href={`/projects/${project.slug.current}`}>
                    {project.name}
                  </Link>
                </h3>

                {/* Tagline */}
                {project.tagline && (
                  <p className="text-lg text-muted-foreground mb-4">
                    {project.tagline}
                  </p>
                )}

                {/* Tech Stack */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.slice(0, 5).map((skill) => (
                      <Badge key={skill._id} variant="secondary" className="text-xs">
                        {skill.name}
                      </Badge>
                    ))}
                    {project.techStack.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.techStack.length - 5}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/projects/${project.slug.current}`}>
                      View Project
                      <ArrowRight className="ml-2 h-4 w-4" />
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
                      <ExternalLink className="h-4 w-4" />
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
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </StaggerChildren>

        {/* View All */}
        <FadeIn className="mt-16 text-center">
          <Button asChild variant="default" size="lg">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
