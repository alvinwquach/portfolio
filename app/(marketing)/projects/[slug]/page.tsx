/**
 * Project Detail Page
 * ===================
 * Interview-ready project page with STAR format, Q&A, trade-offs, and challenges.
 * Every section is designed to answer hiring manager questions before they're asked.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProject, getProjects } from '@/lib/graphql/queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjectRoadmap } from '@/components/projects';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Play,
  Users,
  Clock,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  Scale,
  Code,
  BookOpen,
  Rocket,
  Map,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Target,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectHeroEnter } from '@/components/transitions/ProjectHeroEnter';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug.current,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alvinquach.dev';

  return {
    title: `${project.name} | Projects`,
    description: project.tagline || `Details about the ${project.name} project`,
    alternates: {
      canonical: `${baseUrl}/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="container max-w-5xl">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* Hero */}
        <div className="mb-12">
          {/* Mounts the page-enter animation (Flip or circle-expand). Renders nothing. */}
          <ProjectHeroEnter slug={slug} />

          {/* Image */}
          {project.image?.url && (
            <div
              className="aspect-[21/9] relative rounded-xl overflow-hidden bg-muted mb-8"
              data-flip-id={`project-image-${slug}`}
            >
              <Image
                src={project.image.url}
                alt={project.name}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Info */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold mb-3">{project.name}</h1>
              {project.tagline && (
                <p className="text-lg text-muted-foreground mb-4 max-w-2xl">
                  {project.tagline}
                </p>
              )}

              {/* Meta Pills */}
              <div className="flex flex-wrap gap-3 mb-4">
                {project.role && (
                  <div className="inline-flex items-center gap-1.5 text-sm bg-secondary/50 px-3 py-1 rounded-full">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{project.role}</span>
                  </div>
                )}
                {project.teamSize && (
                  <div className="inline-flex items-center gap-1.5 text-sm bg-secondary/50 px-3 py-1 rounded-full">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Team of {project.teamSize}</span>
                  </div>
                )}
                {project.duration && (
                  <div className="inline-flex items-center gap-1.5 text-sm bg-secondary/50 px-3 py-1 rounded-full">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{project.duration}</span>
                  </div>
                )}
              </div>

              {/* Tech Stack */}
              {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((skill) => (
                    <Badge key={skill._id} variant="secondary" className="text-xs">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex gap-3 lg:flex-col">
              {project.liveUrl && (
                <Button asChild size="sm">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Site
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button asChild variant="outline" size="sm">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Source
                  </a>
                </Button>
              )}
              {project.demoUrl && (
                <Button asChild variant="outline" size="sm">
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4 mr-2" />
                    Demo
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* The Problem (Situation + Task) - Simple prose */}
        {(project.situation || project.task) && (
          <section className="mb-12 max-w-3xl">
            <SectionHeader
              icon={Target}
              iconColor="text-amber"
              iconBg="bg-amber/10"
              title="The Problem"
            />
            <div className="space-y-6">
              {project.situation && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Situation</h3>
                  <p className="text-muted-foreground leading-relaxed">{project.situation}</p>
                </div>
              )}
              {project.task && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">My Goal</h3>
                  <p className="text-muted-foreground leading-relaxed">{project.task}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* My Approach (Actions) - Compact numbered list */}
        {project.actions && project.actions.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              icon={Zap}
              iconColor="text-cyan"
              iconBg="bg-cyan/10"
              title="My Approach"
            />
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
              {project.actions.map((action, index) => (
                <div key={index} className="flex gap-3 py-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan/10 text-cyan text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{action}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* The Outcome (Results) - Compact grid with icons */}
        {project.results && project.results.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              icon={Rocket}
              iconColor="text-success"
              iconBg="bg-success/10"
              title="The Outcome"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-success/5 border border-success/10"
                >
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-snug">{result}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Project Roadmap */}
        {project.roadmap && project.roadmap.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              icon={Map}
              iconColor="text-accent"
              iconBg="bg-accent/10"
              title="Project Roadmap"
              subtitle="MVP, stretch goals, and future vision"
            />
            <div className="rounded-xl border bg-card/30 p-6">
              <ProjectRoadmap roadmap={project.roadmap} />
            </div>
          </section>
        )}

        {/* Interview Questions - Cleaner cards */}
        {project.interviewQuestions && project.interviewQuestions.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              icon={MessageSquare}
              iconColor="text-cyan"
              iconBg="bg-cyan/10"
              title="Interview Questions"
              subtitle="Common questions about this project, answered in STAR format"
            />
            <div className="space-y-4">
              {project.interviewQuestions.map((q, index) => (
                <details
                  key={index}
                  className="group rounded-lg border bg-card/50 overflow-hidden"
                >
                  <summary className="flex items-start gap-3 p-4 cursor-pointer list-none hover:bg-muted/50 transition-colors">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan/10 text-cyan text-sm font-bold flex items-center justify-center">
                      Q{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-snug pr-6">{q.question}</p>
                      {q.category && (
                        <Badge variant="outline" className="mt-1.5 text-[10px] capitalize">
                          {q.category.replace('-', ' ')}
                        </Badge>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90 mt-1" />
                  </summary>
                  <div className="px-4 pb-4 pt-2">
                    <div className="ml-11 space-y-3">
                      {q.situation && (
                        <STARBlock letter="S" label="Situation" color="amber">
                          {q.situation}
                        </STARBlock>
                      )}
                      {q.task && (
                        <STARBlock letter="T" label="Task" color="blue">
                          {q.task}
                        </STARBlock>
                      )}
                      {q.actions && q.actions.length > 0 && (
                        <STARBlock letter="A" label="Actions" color="cyan">
                          <ul className="space-y-1">
                            {q.actions.map((action, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-cyan">→</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </STARBlock>
                      )}
                      {q.result && (
                        <STARBlock letter="R" label="Result" color="emerald">
                          {q.result}
                        </STARBlock>
                      )}
                      {q.keyTakeaway && (
                        <div className="flex gap-2 p-3 bg-secondary/50 rounded-lg text-sm">
                          <Lightbulb className="h-4 w-4 text-amber flex-shrink-0 mt-0.5" />
                          <p><span className="font-medium text-amber">Key Takeaway:</span> {q.keyTakeaway}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Technical Q&A - Clean list */}
        {project.technicalDecisions && project.technicalDecisions.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              icon={HelpCircle}
              iconColor="text-accent"
              iconBg="bg-accent/10"
              title="Technical Decisions"
              subtitle="Quick answers to 'Why did you choose X?' questions"
            />
            <div className="space-y-3">
              {project.technicalDecisions.map((decision, index) => (
                <details
                  key={index}
                  className="group rounded-lg border bg-card/50 overflow-hidden"
                >
                  <summary className="flex items-center gap-3 p-3 cursor-pointer list-none hover:bg-muted/50 transition-colors">
                    <span className="text-accent font-mono text-xs bg-accent/20 px-2 py-0.5 rounded">Q{index + 1}</span>
                    <span className="text-sm font-medium flex-1">{decision.question}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-4 pb-4 pt-1">
                    <div className="ml-10 pl-4 border-l-2 border-accent/20">
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {decision.answer}
                      </p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Trade-offs Section - Horizontal cards */}
        {project.tradeoffs && project.tradeoffs.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              icon={Scale}
              iconColor="text-amber"
              iconBg="bg-amber/10"
              title="Key Trade-offs"
              subtitle="Every decision has costs — here's how I thought through them"
            />
            <div className="space-y-4">
              {project.tradeoffs.map((tradeoff, index) => (
                <div key={index} className="rounded-lg border bg-card/50 overflow-hidden">
                  <div className="p-4 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-amber" />
                      <h3 className="font-medium text-sm">{tradeoff.decision}</h3>
                    </div>
                  </div>
                  <div className="p-4 grid md:grid-cols-3 gap-4 text-sm">
                    {tradeoff.prosGained && tradeoff.prosGained.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-success mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Gained
                        </h4>
                        <ul className="space-y-1.5 text-muted-foreground">
                          {tradeoff.prosGained.map((pro, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-success">+</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tradeoff.consAccepted && tradeoff.consAccepted.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-error mb-2 flex items-center gap-1.5">
                          <XCircle className="h-3.5 w-3.5" /> Gave Up
                        </h4>
                        <ul className="space-y-1.5 text-muted-foreground">
                          {tradeoff.consAccepted.map((con, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-error">−</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tradeoff.whyWorthIt && (
                      <div>
                        <h4 className="text-xs font-semibold text-amber mb-2 flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5" /> Why Worth It
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {tradeoff.whyWorthIt}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Challenges Section - Clean expandable */}
        {project.challenges && project.challenges.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              icon={AlertTriangle}
              iconColor="text-error"
              iconBg="bg-error/10"
              title="Challenges & Solutions"
              subtitle="The hardest problems I solved on this project"
            />
            <div className="space-y-3">
              {project.challenges.map((challenge, index) => (
                <details
                  key={index}
                  className="group rounded-lg border bg-card/50 overflow-hidden"
                >
                  <summary className="flex items-center gap-3 p-3 cursor-pointer list-none hover:bg-muted/50 transition-colors">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-error/10 text-error text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium flex-1">{challenge.problem}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-4 pb-4 pt-2">
                    <div className="ml-9 space-y-3 text-sm">
                      {challenge.approach && (
                        <div>
                          <h4 className="text-xs font-semibold text-cyan mb-1">Approach</h4>
                          <p className="text-muted-foreground leading-relaxed">{challenge.approach}</p>
                        </div>
                      )}
                      {challenge.solution && (
                        <div>
                          <h4 className="text-xs font-semibold text-success mb-1">Solution</h4>
                          <p className="text-muted-foreground leading-relaxed">{challenge.solution}</p>
                        </div>
                      )}
                      {challenge.lesson && (
                        <div className="flex gap-2 p-3 bg-amber/5 rounded-lg border border-amber/10">
                          <Lightbulb className="h-4 w-4 text-amber flex-shrink-0 mt-0.5" />
                          <p className="text-muted-foreground">
                            <span className="font-medium text-amber">Lesson:</span> {challenge.lesson}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Code Highlights - Simpler cards */}
        {project.codeHighlights && project.codeHighlights.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              icon={Code}
              iconColor="text-cyan"
              iconBg="bg-cyan/10"
              title="Code Highlights"
              subtitle="Key sections I'd walk through in a code review"
            />
            <div className="grid md:grid-cols-2 gap-4">
              {project.codeHighlights.map((highlight, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card/50">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-medium text-sm">{highlight.title}</h3>
                    {highlight.filePath && (
                      <code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                        {highlight.filePath}
                      </code>
                    )}
                  </div>
                  {highlight.explanation && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {highlight.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              icon={Play}
              iconColor="text-muted-foreground"
              iconBg="bg-muted"
              title="Screenshots"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.gallery.map((image, index) => (
                image?.url && (
                  <div
                    key={index}
                    className="aspect-video relative rounded-lg overflow-hidden bg-muted group cursor-pointer"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${project.name} screenshot ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )
              ))}
            </div>
          </section>
        )}

        {/* Lessons Learned & Future - Side by side or full width */}
        {((project.lessonsLearned && project.lessonsLearned.length > 0) ||
          (project.futureImprovements && project.futureImprovements.length > 0)) && (
          <section className="mb-12">
            {/* Use grid only if both sections exist */}
            <div className={
              ((project.lessonsLearned?.length ?? 0) > 0 && (project.futureImprovements?.length ?? 0) > 0)
                ? "grid md:grid-cols-2 gap-6"
                : ""
            }>
              {/* Lessons Learned */}
              {project.lessonsLearned && project.lessonsLearned.length > 0 && (
                <div>
                  <SectionHeader
                    icon={BookOpen}
                    iconColor="text-amber"
                    iconBg="bg-amber/10"
                    title="What I Learned"
                    size="sm"
                  />
                  <ul className={
                    ((project.futureImprovements?.length ?? 0) > 0)
                      ? "space-y-2"
                      : "grid md:grid-cols-2 gap-2"
                  }>
                    {project.lessonsLearned.map((lesson, index) => (
                      <li
                        key={index}
                        className="flex gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-amber/5 border border-amber/10"
                      >
                        <span className="text-amber">→</span>
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Future Improvements */}
              {project.futureImprovements && project.futureImprovements.length > 0 && (
                <div>
                  <SectionHeader
                    icon={Rocket}
                    iconColor="text-cyan"
                    iconBg="bg-cyan/10"
                    title="Future Plans"
                    size="sm"
                  />
                  <ul className={
                    ((project.lessonsLearned?.length ?? 0) > 0)
                      ? "space-y-2"
                      : "grid md:grid-cols-2 gap-2"
                  }>
                    {project.futureImprovements.map((improvement, index) => (
                      <li
                        key={index}
                        className="flex gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-cyan/5 border border-cyan/10"
                      >
                        <span className="text-cyan">+</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Back to Projects CTA */}
        <div className="text-center pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">Want to discuss this project?</p>
          <div className="flex justify-center gap-3">
            <Button asChild size="sm">
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">View More Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Header Component
function SectionHeader({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  size = 'default',
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle?: string;
  size?: 'default' | 'sm';
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={cn('p-2 rounded-lg', iconBg)}>
        <Icon className={cn('h-4 w-4', iconColor)} />
      </div>
      <div>
        <h2 className={cn(
          'font-bold',
          size === 'sm' ? 'text-lg' : 'text-xl'
        )}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// STAR Block Component
function STARBlock({
  letter,
  label,
  color,
  children,
}: {
  letter: string;
  label: string;
  color: 'amber' | 'blue' | 'cyan' | 'emerald';
  children: React.ReactNode;
}) {
  const colorClasses = {
    amber: 'bg-amber/5 border-amber/10 text-amber',
    blue: 'bg-info/5 border-info/10 text-info',
    cyan: 'bg-cyan/5 border-cyan/10 text-cyan',
    emerald: 'bg-success/5 border-success/10 text-success',
  };

  return (
    <div className={cn('p-3 rounded-lg border text-sm', colorClasses[color].split(' ').slice(0, 2).join(' '))}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={cn(
          'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
          color === 'amber' && 'bg-amber/20 text-amber',
          color === 'blue' && 'bg-info/20 text-info',
          color === 'cyan' && 'bg-cyan/20 text-cyan',
          color === 'emerald' && 'bg-success/20 text-success'
        )}>
          {letter}
        </span>
        <span className={cn('text-xs font-semibold uppercase tracking-wider', colorClasses[color].split(' ').pop())}>
          {label}
        </span>
      </div>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
