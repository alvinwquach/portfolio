/**
 * Career Journey Component
 * ========================
 * Clean horizontal timeline showing the path from previous careers to developer.
 * Minimalist design that fits the dark SaaS aesthetic.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Briefcase, Code, TrendingUp, Users, Calculator, Wrench } from 'lucide-react';

interface PreviousCareer {
  title?: string;
  company?: string;
  description?: string;
  transferableSkills?: string[];
}

interface CareerJourneyProps {
  previousCareers: PreviousCareer[];
  currentRole?: string;
  className?: string;
}

// Map career titles to icons
const getCareerIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('pricing') || lowerTitle.includes('analyst')) return Calculator;
  if (lowerTitle.includes('community') || lowerTitle.includes('manager')) return Users;
  if (lowerTitle.includes('program') || lowerTitle.includes('coordinator')) return Briefcase;
  if (lowerTitle.includes('test') || lowerTitle.includes('manufacturing')) return Wrench;
  return TrendingUp;
};

export function CareerJourney({
  previousCareers,
  currentRole = 'Full Stack Developer',
  className,
}: CareerJourneyProps) {
  // Collect all unique transferable skills
  const allSkills = React.useMemo(() => {
    const skills = new Set<string>();
    previousCareers.forEach((career) => {
      career.transferableSkills?.forEach((skill) => skills.add(skill));
    });
    return Array.from(skills);
  }, [previousCareers]);

  return (
    <section id="career" className={cn('py-24 md:py-32', className)}>
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            The Path Here
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Software wasn&apos;t my first language. I learned to read rooms before I learned
            to read codebases — and the skills transfer more than you&apos;d think.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop horizontal timeline */}
          <div className="hidden lg:block">
            {/* Connecting line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-700 via-slate-600 to-emerald-500" />

            {/* Career cards */}
            <div className="grid grid-cols-6 gap-4">
              {previousCareers.slice(0, 5).map((career, index) => {
                const Icon = getCareerIcon(career.title || '');
                return (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-600 z-10" />

                    {/* Card */}
                    <div className="pt-20">
                      <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors h-full">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 rounded-md bg-slate-800">
                            <Icon className="h-4 w-4 text-slate-400" />
                          </div>
                        </div>
                        <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-2">
                          {career.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                          {career.company}
                        </p>
                        {career.transferableSkills && career.transferableSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {career.transferableSkills.slice(0, 2).map((skill, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400"
                              >
                                {skill.split(' ').slice(0, 3).join(' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Current Role - The Destination */}
              <div className="relative">
                {/* Timeline dot - highlighted */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-400 z-10 shadow-lg shadow-emerald-500/50" />

                {/* Card */}
                <div className="pt-20">
                  <div className="p-4 rounded-lg bg-emerald-500 text-white h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-md bg-white/20">
                        <Code className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500 text-slate-900">
                        Now
                      </span>
                    </div>
                    <h3 className="font-medium text-sm mb-1">
                      {currentRole}
                    </h3>
                    <p className="text-xs text-white/70 mb-3">
                      Building systems that matter
                    </p>
                    <p className="text-[10px] text-white/60">
                      All paths led here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="lg:hidden space-y-4">
            {previousCareers.slice(0, 5).map((career, index) => {
              const Icon = getCareerIcon(career.title || '');
              return (
                <div key={index} className="flex gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-600" />
                    <div className="w-0.5 flex-1 bg-slate-700" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 pb-4">
                    <div className="p-4 rounded-lg border border-border/50 bg-card/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-slate-400" />
                        <h3 className="font-medium text-sm text-foreground">
                          {career.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {career.company}
                      </p>
                      {career.transferableSkills && career.transferableSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {career.transferableSkills.slice(0, 2).map((skill, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400"
                            >
                              {skill.split(' ').slice(0, 3).join(' ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Current role - mobile */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-400 shadow-lg shadow-emerald-500/50" />
              </div>
              <div className="flex-1">
                <div className="p-4 rounded-lg bg-emerald-500 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-4 w-4" />
                    <h3 className="font-medium text-sm">{currentRole}</h3>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500 text-slate-900">
                      Now
                    </span>
                  </div>
                  <p className="text-xs text-white/70">
                    Building systems that matter
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills That Transferred */}
        {allSkills.length > 0 && (
          <div className="mt-16 text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Skills That Made the Jump
            </h3>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {allSkills.slice(0, 8).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full text-sm bg-slate-800/50 text-slate-300 border border-slate-700/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
