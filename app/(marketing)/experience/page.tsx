/**
 * Experience Page
 * ===============
 * Professional work history grouped by domain.
 * Client projects appear as sub-items under T Creative Studio.
 */

import { getExperiences, getProfile, getProjects } from '@/lib/graphql/queries';
import type { Experience, Project } from '@/lib/graphql/queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Calendar,
  MapPin,
  Download,
  Building2,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn, formatDate, calculateDuration } from '@/lib/utils';

export const metadata = {
  title: 'Experience | Work History',
  description: 'Professional work experience and career timeline. Full Stack Developer with experience across manufacturing, tech, and creative industries.',
};

const DOMAIN_GROUPS = [
  { label: 'Engineering & Studio', companies: ['T Creative Studio', 'Bring the Shreds'] },
  { label: 'Advocacy & Community', companies: ['Ellie Mae', 'Tintri'] },
  { label: 'Mfg & Ops', companies: ['Spartronics', 'Safeway'] },
] as const;

export default async function ExperiencePage() {
  const [experiences, profile, projects] = await Promise.all([
    getExperiences(),
    getProfile(),
    getProjects(),
  ]);

  // Freelance client projects nested under T Creative Studio
  // Exclude the T Creative Studio project itself (represented by the experience entry)
  const clientProjects = projects.filter(
    p => p.projectType === 'freelance' && p.name !== 'T Creative Studio'
  );

  return (
    <div className="py-24">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Experience</h1>
            <p className="text-lg text-muted-foreground">
              A career spanning manufacturing, tech, and creative industries.
              Each role taught me something new about building systems that work.
            </p>
          </div>

          {profile?.resume?.url && (
            <Button asChild className="self-start">
              <a href={`${profile.resume.url}?dl=resume.pdf`} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </a>
            </Button>
          )}
        </div>

        {/* Domain Sections */}
        <div className="space-y-16">
          {DOMAIN_GROUPS.map(({ label, companies }) => {
            const group = experiences
              .filter(e => (companies as readonly string[]).includes(e.company))
              .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

            if (group.length === 0) return null;

            return (
              <section key={label}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6 pl-0 md:pl-20">
                  {label}
                </h2>
                <div className="relative">
                  <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-8">
                    {group.map(exp => (
                      <ExperienceCard
                        key={exp._id}
                        exp={exp}
                        clientProjects={exp.company === 'T Creative Studio' ? clientProjects : []}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 p-8 rounded-xl bg-muted/30 border border-border/50 text-center">
          <h3 className="text-xl font-semibold mb-2">Interested in working together?</h3>
          <p className="text-muted-foreground mb-4">
            I&apos;m always open to discussing new opportunities and interesting projects.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <a href="/#contact">Get in Touch</a>
            </Button>
            {profile?.resume?.url && (
              <Button variant="outline" asChild>
                <a href={`${profile.resume.url}?dl=resume.pdf`} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceCard({
  exp,
  clientProjects,
}: {
  exp: Experience;
  clientProjects: Project[];
}) {
  return (
    <div className="relative pl-8 md:pl-20">
      {/* Timeline dot */}
      <div className={cn(
        'absolute left-0 md:left-8 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background',
        exp.isCurrent ? 'bg-emerald-500' : 'bg-muted-foreground'
      )} />

      {/* Date badge */}
      <div className="md:absolute md:left-0 md:top-0 md:w-16 md:text-right md:pr-4 mb-1 md:mb-0">
        <span className="text-xs text-muted-foreground font-medium">
          {formatDate(exp.startDate, { month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* Card */}
      <div className={cn(
        'p-4 rounded-lg border bg-card/50 transition-all hover:bg-card hover:shadow-sm',
        exp.isCurrent && 'ring-1 ring-emerald-500/30'
      )}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-lg font-semibold">{exp.role}</h2>
              {exp.isCurrent && (
                <Badge className="bg-emerald-600 text-white text-xs py-0">Current</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span className="font-medium">{exp.company}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
            {exp.employmentType && (
              <Badge variant="outline" className="text-xs capitalize py-0">
                {exp.employmentType}
              </Badge>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {calculateDuration(exp.startDate, exp.endDate, exp.isCurrent)}
            </span>
            {exp.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {exp.location}
              </span>
            )}
          </div>
        </div>

        {/* Situation */}
        {exp.situation && (
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
            {exp.situation}
          </p>
        )}

        {/* Key Results */}
        {exp.results && exp.results.length > 0 && (
          <div className="mb-3">
            <ul className="grid gap-1">
              {exp.results.slice(0, 3).map((result, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{result}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {exp.techStack && exp.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-3 border-t border-border/50">
            {exp.techStack.slice(0, 5).map((skill) => (
              <Badge key={skill._id} variant="secondary" className="text-xs py-0">
                {skill.name}
              </Badge>
            ))}
            {exp.techStack.length > 5 && (
              <span className="text-xs text-muted-foreground">+{exp.techStack.length - 5}</span>
            )}
          </div>
        )}

        {/* Client sub-items under T Creative Studio */}
        {clientProjects.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Briefcase className="h-3 w-3" />
              Client Engagements
            </p>
            {clientProjects.map(proj => (
              <div key={proj._id} className="pl-3 border-l-2 border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      {proj.slug?.current ? (
                        <Link
                          href={`/projects/${proj.slug.current}`}
                          className="text-sm font-medium hover:text-amber transition-colors"
                        >
                          {proj.name}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium">{proj.name}</span>
                      )}
                      {proj.clientIndustry && (
                        <span className="text-xs text-muted-foreground">· {proj.clientIndustry}</span>
                      )}
                    </div>
                    {proj.situation && (
                      <p className="text-xs text-muted-foreground mt-0.5 pl-4.5 line-clamp-1">
                        {proj.situation}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Live
                      </a>
                    )}
                    {proj.slug?.current && (
                      <Link
                        href={`/projects/${proj.slug.current}`}
                        className="text-xs text-amber hover:text-amber/80 font-medium"
                      >
                        Case Study →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
