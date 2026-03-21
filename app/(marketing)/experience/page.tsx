/**
 * Experience Page
 * ===============
 * Professional work history with timeline and STAR format details.
 * Download resume option and link to full experience entries.
 */

import { getExperiences, getProfile, getProjects } from '@/lib/graphql/queries';
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
} from 'lucide-react';
import Link from 'next/link';
import { cn, formatDate, calculateDuration } from '@/lib/utils';

export const metadata = {
  title: 'Experience | Work History',
  description: 'Professional work experience and career timeline. Full Stack Developer with experience across manufacturing, tech, and creative industries.',
};

// Unified timeline item type
interface TimelineItem {
  _id: string;
  type: 'experience' | 'client';
  title: string;
  subtitle: string;
  location?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  situation?: string;
  results?: string[];
  techStack?: { _id: string; name: string }[];
  slug?: string;
  liveUrl?: string;
  clientIndustry?: string;
}

export default async function ExperiencePage() {
  const [experiences, profile, projects] = await Promise.all([
    getExperiences(),
    getProfile(),
    getProjects(),
  ]);

  // Filter to freelance projects only
  const clientProjects = projects.filter(p => p.projectType === 'freelance');

  // Convert experiences to timeline items
  const experienceItems: TimelineItem[] = experiences.map(exp => ({
    _id: exp._id,
    type: 'experience',
    title: exp.role,
    subtitle: exp.company,
    location: exp.location,
    employmentType: exp.employmentType,
    startDate: exp.startDate,
    endDate: exp.endDate,
    isCurrent: exp.isCurrent,
    situation: exp.situation,
    results: exp.results,
    techStack: exp.techStack,
  }));

  // Convert client projects to timeline items
  const clientItems: TimelineItem[] = clientProjects.map(proj => ({
    _id: proj._id,
    type: 'client',
    title: proj.name,
    subtitle: proj.clientName || 'Client Project',
    clientIndustry: proj.clientIndustry,
    isCurrent: false,
    situation: proj.situation,
    results: proj.results,
    techStack: proj.techStack,
    slug: proj.slug.current,
    liveUrl: proj.liveUrl,
  }));

  // Combine and sort by start date descending (most recent first)
  const allItems = [...experienceItems, ...clientItems].sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return dateB - dateA;
  });

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

          {/* Resume Download */}
          {profile?.resume?.url && (
            <Button asChild className="self-start">
              <a href={`${profile.resume.url}?dl=resume.pdf`} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </a>
            </Button>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {allItems.map((item) => (
              <div key={item._id} className="relative pl-8 md:pl-20">
                {/* Timeline dot */}
                <div className={cn(
                  'absolute left-0 md:left-8 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background',
                  item.isCurrent ? 'bg-emerald-500' : item.type === 'client' ? 'bg-amber' : 'bg-muted-foreground'
                )} />

                {/* Date badge - positioned to left on desktop */}
                <div className="md:absolute md:left-0 md:top-0 md:w-16 md:text-right md:pr-4 mb-1 md:mb-0">
                  <span className="text-xs text-muted-foreground font-medium">
                    {formatDate(item.startDate, { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Card - More compact */}
                <div className={cn(
                  'p-4 rounded-lg border bg-card/50 transition-all hover:bg-card hover:shadow-sm',
                  item.isCurrent && 'ring-1 ring-emerald-500/30',
                  item.type === 'client' && 'border-amber/20'
                )}>
                  {/* Header - Tighter */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        {item.type === 'client' && item.slug ? (
                          <Link href={`/projects/${item.slug}`} className="text-lg font-semibold hover:text-amber transition-colors">
                            {item.title}
                          </Link>
                        ) : (
                          <h2 className="text-lg font-semibold">{item.title}</h2>
                        )}
                        {item.isCurrent && (
                          <Badge className="bg-emerald-600 text-white text-xs py-0">
                            Current
                          </Badge>
                        )}
                        {item.type === 'client' && (
                          <Badge className="bg-amber/20 text-amber border-amber/30 text-xs py-0">
                            <Briefcase className="h-2.5 w-2.5 mr-1" />
                            Client
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="font-medium">{item.subtitle}</span>
                        {item.clientIndustry && (
                          <span className="text-xs">• {item.clientIndustry}</span>
                        )}
                      </div>
                    </div>

                    {/* Meta - Compact */}
                    <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                      {item.employmentType && (
                        <Badge variant="outline" className="text-xs capitalize py-0">
                          {item.employmentType}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {calculateDuration(item.startDate, item.endDate, item.isCurrent)}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Situation (brief summary) */}
                  {item.situation && (
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                      {item.situation}
                    </p>
                  )}

                  {/* Key Results - Condensed */}
                  {item.results && item.results.length > 0 && (
                    <div className="mb-3">
                      <ul className="grid gap-1">
                        {item.results.slice(0, 3).map((result, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Footer: Tech Stack + Links */}
                  <div className="flex items-center justify-between gap-4 pt-3 border-t border-border/50">
                    {/* Tech Stack */}
                    {item.techStack && item.techStack.length > 0 ? (
                      <div className="flex flex-wrap gap-1 flex-1">
                        {item.techStack.slice(0, 5).map((skill) => (
                          <Badge key={skill._id} variant="secondary" className="text-xs py-0">
                            {skill.name}
                          </Badge>
                        ))}
                        {item.techStack.length > 5 && (
                          <span className="text-xs text-muted-foreground">+{item.techStack.length - 5}</span>
                        )}
                      </div>
                    ) : <div />}

                    {/* Client project links */}
                    {item.type === 'client' && (
                      <div className="flex items-center gap-2">
                        {item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Live
                          </a>
                        )}
                        {item.slug && (
                          <Link
                            href={`/projects/${item.slug}`}
                            className="text-xs text-amber hover:text-amber/80 font-medium"
                          >
                            Case Study →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 p-8 rounded-xl bg-muted/30 border border-border/50 text-center">
          <h3 className="text-xl font-semibold mb-2">Interested in working together?</h3>
          <p className="text-muted-foreground mb-4">
            I'm always open to discussing new opportunities and interesting projects.
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
