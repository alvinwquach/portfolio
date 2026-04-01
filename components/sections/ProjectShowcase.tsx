/**
 * Project Showcase Component
 * ==========================
 * Deep dive into each project with STAR format.
 * Uses dynamic GSAP imports through animation wrappers - never in initial bundle.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ArrowRight,
  Target,
  ClipboardList,
  Zap,
  TrendingUp,
  ExternalLink,
  Github,
} from 'lucide-react';
import { FadeIn, StaggerChildren } from '@/components/gsap';
import type { Project } from '@/lib/graphql/queries';

interface ProjectShowcaseProps {
  projects: Project[];
  className?: string;
}

export function ProjectShowcase({ projects, className }: ProjectShowcaseProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-24', className)}>
      <div className="container">
        {/* Header */}
        <FadeIn className="mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Systems Deep Dive
            </h2>
            <p className="text-lg text-muted-foreground">
              Each project tells a story. Click to reveal the STAR breakdown —
              the same format you'd hear in an interview.
            </p>
          </div>
          {/* STAR Legend */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Badge variant="outline" className="gap-1">
              <Target className="h-3 w-3" /> Situation
            </Badge>
            <Badge variant="outline" className="gap-1">
              <ClipboardList className="h-3 w-3" /> Task
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" /> Actions
            </Badge>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3 w-3" /> Results
            </Badge>
          </div>
        </FadeIn>

        {/* Projects */}
        <StaggerChildren className="space-y-8">
          {projects.map((project, index) => (
            <Card
              key={project._id}
              className="overflow-hidden border-2 hover:border-cyan/30 transition-colors duration-300"
            >
              <CardHeader className="bg-secondary/30">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {project.featured && (
                        <Badge variant="gold" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl md:text-3xl mb-2">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {project.tagline}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-secondary hover:bg-cyan/10 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-secondary hover:bg-cyan/10 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Tech Stack */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((skill) => (
                      <Badge key={skill._id} variant="secondary" className="text-xs">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* STAR Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  {/* Situation */}
                  {project.situation && (
                    <AccordionItem value="situation">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-cyan" />
                          <span className="font-semibold">Situation</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            The context & challenge
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground pl-6">
                          {project.situation}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Task */}
                  {project.task && (
                    <AccordionItem value="task">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4 text-amber" />
                          <span className="font-semibold">Task</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            What needed to be done
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground pl-6">
                          {project.task}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Actions */}
                  {project.actions && project.actions.length > 0 && (
                    <AccordionItem value="actions">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-coral" />
                          <span className="font-semibold">Actions</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            What I specifically did
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pl-6">
                          {project.actions.map((action, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-muted-foreground"
                            >
                              <span className="text-cyan shrink-0">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Results */}
                  {project.results && project.results.length > 0 && (
                    <AccordionItem value="results">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="font-semibold">Results</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            Measurable outcomes
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pl-6">
                          {project.results.map((result, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-muted-foreground"
                            >
                              <span className="text-success shrink-0">✓</span>
                              <span className="font-medium">{result}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>

                {/* View Full Case Study */}
                <div className="mt-6 pt-6 border-t">
                  <Button asChild variant="outline">
                    <Link href={`/project/${project.slug.current}`}>
                      Full Case Study
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
