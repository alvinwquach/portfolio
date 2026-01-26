/**
 * Vision Statement Component
 * ==========================
 * Where I'm headed - the aspirational close.
 * Animated text reveal that builds anticipation.
 * Uses dynamic GSAP imports - never in initial bundle.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Target, Users, Code, Lightbulb } from 'lucide-react';
import { FadeIn, StaggerChildren } from '@/components/gsap';

interface VisionStatementProps {
  careerGoals?: string;
  strengths?: string[];
  whatIEnjoy?: string[];
  className?: string;
}

export function VisionStatement({
  careerGoals,
  strengths,
  whatIEnjoy,
  className,
}: VisionStatementProps) {
  // Split career goals into sentences for emphasis
  const goalSentences = React.useMemo(() => {
    if (!careerGoals) return [];
    return careerGoals.split('.').filter((s) => s.trim()).slice(0, 3);
  }, [careerGoals]);

  // Vision pillars from the data
  const pillars = [
    {
      icon: Target,
      title: 'Technical Growth',
      description: 'Senior/Staff engineer role influencing technical direction while staying hands-on',
      color: 'text-cyan',
      bg: 'bg-cyan/10',
    },
    {
      icon: Users,
      title: 'Mentorship',
      description: 'Teaching and enabling others — skills from community management, applied to engineering',
      color: 'text-amber',
      bg: 'bg-amber/10',
    },
    {
      icon: Code,
      title: 'Impact',
      description: 'Building products that serve education, research, and real people — beyond profit metrics',
      color: 'text-green-600',
      bg: 'bg-green-600/10',
    },
    {
      icon: Lightbulb,
      title: 'Deep Expertise',
      description: 'Real-time systems, data-intensive applications, edge computing, headless CMS',
      color: 'text-purple-600',
      bg: 'bg-purple-600/10',
    },
  ];

  return (
    <section className={cn('py-24 bg-gradient-to-b from-secondary/30 to-background', className)}>
      <div className="container">
        {/* Main Vision Quote */}
        <FadeIn className="max-w-4xl mx-auto text-center mb-20">
          <Badge variant="outline" className="mb-6">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            Where I'm Headed
          </Badge>
          <blockquote className="text-2xl md:text-4xl font-medium leading-relaxed">
            {goalSentences[0] && (
              <span className="block mb-4">
                {goalSentences[0].trim()}.
              </span>
            )}
          </blockquote>
          {goalSentences[1] && (
            <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
              {goalSentences[1].trim()}.
            </p>
          )}
        </FadeIn>

        {/* Vision Pillars */}
        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300"
              >
                <div className={cn('p-3 rounded-lg w-fit mb-4', pillar.bg)}>
                  <Icon className={cn('h-6 w-6', pillar.color)} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </div>
            );
          })}
        </StaggerChildren>

        {/* What I Enjoy */}
        {whatIEnjoy && whatIEnjoy.length > 0 && (
          <FadeIn delay={0.3} className="mt-16 text-center">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
              What Energizes Me
            </h3>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {whatIEnjoy.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {item}
                </Badge>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
