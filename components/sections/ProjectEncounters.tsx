/**
 * Project Encounters
 * ==================
 * Projects are not cards. They're encounters.
 * Pattern: Context → Artifact → Name
 *
 * You show what the project does before you name it.
 * You let the work speak before the branding.
 */

'use client';

import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  slug: string;
  context: string;
  description: string;
  name: string;
  tech: string[];
}

interface ProjectEncountersProps {
  className?: string;
}

const projects: Project[] = [
  {
    slug: 'hoop-almanac',
    context: 'Real-time draft system. 95ms latency. 150 concurrent users.',
    description:
      'Fantasy basketball platform with ML-powered predictions and live draft rooms. Built to handle pressure—sub-100ms updates, optimistic UI, graceful degradation.',
    name: 'Hoop Almanac',
    tech: ['Next.js', 'WebSocket', 'PostgreSQL', 'Redis'],
  },
  {
    slug: 'sculptql',
    context: 'Developer tool for query complexity analysis.',
    description:
      'Visualizes GraphQL schemas as explorable graphs. Helps teams understand query costs before they become performance problems.',
    name: 'SculptQL',
    tech: ['TypeScript', 'GraphQL', 'D3.js', 'React'],
  },
  {
    slug: 'opportuniq',
    context: 'Research. Weigh options. Collaborate with your group.',
    description:
      'AI-powered research platform that helps you evaluate DIY approaches vs professional solutions. Collaborative decision-making with your team—the value isn\'t just the research, it\'s the structured way you arrive at decisions together.',
    name: 'OpportuniQ',
    tech: ['Next.js', 'OpenAI', 'Prisma', 'TypeScript'],
  },
];

/**
 * Single project encounter
 */
function ProjectEncounter({
  project,
  index,
  isVisible,
}: {
  project: Project;
  index: number;
  isVisible: boolean;
}) {
  const delay = index * 200;

  return (
    <div
      className={cn(
        'py-16 border-b border-border/30 last:border-0',
        'transition-opacity duration-700',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Context first - what it does before what it's called */}
      <p className="text-lg md:text-xl text-foreground/80 mb-4 font-light">
        {project.context}
      </p>

      {/* Description - the artifact */}
      <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
        {project.description}
      </p>

      {/* Tech stack - quiet badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-xs text-muted-foreground px-2 py-1 bg-secondary/30 rounded"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Name last - as a label, not a headline */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground/50 uppercase tracking-wider">
          {project.name}
        </p>

        <Link
          href={`/projects/${project.slug}`}
          className="text-sm text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors"
        >
          View project
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export function ProjectEncounters({ className }: ProjectEncountersProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn('py-24', className)}
    >
      <div className="container">
        <div className="max-w-3xl">
          {/* Section header */}
          <p
            className={cn(
              'text-sm text-muted-foreground uppercase tracking-widest mb-12',
              'transition-opacity duration-500',
              isVisible ? 'opacity-100' : 'opacity-0'
            )}
          >
            Selected Work
          </p>

          {/* Project encounters */}
          {projects.map((project, i) => (
            <ProjectEncounter
              key={project.slug}
              project={project}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
