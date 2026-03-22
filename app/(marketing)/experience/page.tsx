/**
 * Experience Page
 * ===============
 * Professional work history grouped by domain, with client projects
 * nested under T Creative Studio as sub-items.
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

// Domain grouping config — order determines display order
const DOMAIN_GROUPS = [
  {
    label: 'Engineering & Studio Work',
    companies: ['T Creative Studio', 'Bring the Shreds'],
  },
  {
    label: 'Advocacy & Community',
    companies: ['Tintri', 'Ellie Mae'],
  },
  {
    label: 'Manufacturing & Ops',
    companies: ['Spartronics', 'Safeway'],
  },
] as const;

interface ExperienceItem {
  _id: string;
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
}

interface ClientItem {
  _id: string;
  name: string;
  clientName?: string;
  clientIndustry?: string;
  situation?: string;
  results?: string[];
  techStack?: { _id: string; name: string }[];
  slug?: string;
  liveUrl?: string;
}

function ExperienceCard({ item, isCurrent }: { item: ExperienceItem; isCurrent?: boolean }) {
  return (
    <div className={cn(
      'p-4 rounded-lg border bg-card/50 transition-all hover:bg-card hover:shadow-sm',
      isCurrent && 'ring-1 ring-emerald-500/30',
    )}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            {isCurrent && (
              <Badge className="bg-success text-base text-xs py-0">Current</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            <span className="font-medium">{item.subtitle}</span>
          </div>
        </div>
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

      {item.situation && (
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">
          {item.situation}
        </p>
      )}

      {item.results && item.results.length > 0 && (
        <div className="mb-3">
          <ul className="grid gap-1">
            {item.results.slice(0, 3).map((result, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                <span className="line-clamp-1">{result}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {item.techStack && item.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-3 border-t border-border/50">
          {item.techStack.slice(0, 5).map((skill) => (
            <Badge key={skill._id} variant="secondary" className="text-xs py-0">
              {skill.name}
            </Badge>
          ))}
          {item.techStack.length > 5 && (
            <span className="text-xs text-muted-foreground">+{item.techStack.length - 5}</span>
          )}
        </div>
      )}
    </div>
  );
}

function ClientSubItem({ item }: { item: ClientItem }) {
  return (
    <div className="p-3 rounded-md border border-amber/20 bg-amber/5 hover:bg-amber/10 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            {item.slug ? (
              <Link href={`/projects/${item.slug}`} className="text-sm font-semibold hover:text-amber transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className="text-sm font-semibold">{item.name}</span>
            )}
            <Badge className="bg-amber/20 text-amber border-amber/30 text-xs py-0">
              <Briefcase className="h-2.5 w-2.5 mr-1" />
              Client
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {item.clientName && <span>{item.clientName}</span>}
            {item.clientIndustry && <span>• {item.clientIndustry}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
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
            <Link href={`/projects/${item.slug}`} className="text-xs text-amber hover:text-amber/80 font-medium">
              Case Study →
            </Link>
          )}
        </div>
      </div>

      {item.results && item.results.length > 0 && (
        <ul className="grid gap-0.5">
          {item.results.slice(0, 2).map((result, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
              <span className="line-clamp-1">{result}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function ExperiencePage() {
  const [experiences, profile, projects] = await Promise.all([
    getExperiences(),
    getProfile(),
    getProjects(),
  ]);

  const clientProjects = projects.filter(p => p.projectType === 'freelance');

  // Map experiences by company name for domain grouping
  const experienceByCompany = new Map(
    experiences.map(exp => [exp.company, exp])
  );

  // Build grouped sections
  const domainSections = DOMAIN_GROUPS.map(group => ({
    label: group.label,
    items: group.companies
      .map(company => experienceByCompany.get(company))
      .filter(Boolean) as typeof experiences,
  })).filter(section => section.items.length > 0);

  // Determine which experience is T Creative Studio for client nesting
  const tCreativeStudioId = experiences.find(e => e.company === 'T Creative Studio')?._id;

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
        <div className="space-y-14">
          {domainSections.map((section) => (
            <section key={section.label}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6 pb-2 border-b border-border/50">
                {section.label}
              </h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />

                <div className="space-y-6">
                  {section.items.map((exp) => {
                    const isTCreativeStudio = exp._id === tCreativeStudioId;
                    return (
                      <div key={exp._id} className="relative pl-8 md:pl-20">
                        {/* Timeline dot */}
                        <div className={cn(
                          'absolute left-0 md:left-8 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background',
                          exp.isCurrent ? 'bg-success' : 'bg-text-muted'
                        )} />

                        {/* Date badge */}
                        <div className="md:absolute md:left-0 md:top-0 md:w-16 md:text-right md:pr-4 mb-1 md:mb-0">
                          <span className="text-xs text-muted-foreground font-medium">
                            {formatDate(exp.startDate, { month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <ExperienceCard
                          item={{
                            _id: exp._id,
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
                          }}
                          isCurrent={exp.isCurrent}
                        />

                        {/* Client projects nested under T Creative Studio */}
                        {isTCreativeStudio && clientProjects.length > 0 && (
                          <div className="mt-3 ml-4 space-y-2">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                              Client Work
                            </p>
                            {clientProjects.map((proj) => (
                              <ClientSubItem
                                key={proj._id}
                                item={{
                                  _id: proj._id,
                                  name: proj.name,
                                  clientName: proj.clientName,
                                  clientIndustry: proj.clientIndustry,
                                  situation: proj.situation,
                                  results: proj.results,
                                  techStack: proj.techStack,
                                  slug: proj.slug?.current,
                                  liveUrl: proj.liveUrl,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}
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
