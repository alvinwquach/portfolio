/**
 * Operating Principles Component
 * ==============================
 * Short. Punchy. Memorable.
 * The principles that guide how I build.
 */

'use client';

import { FadeIn } from '@/components/gsap/animations/FadeIn';
import { StaggerChildren } from '@/components/gsap/animations/StaggerChildren';
import { Scale, Zap, Users, Shield } from 'lucide-react';

const principles = [
  {
    icon: Scale,
    title: 'Tradeoffs over trends',
    description:
      'Every architectural choice is a bet. I articulate what I\'m gaining and what I\'m giving up.',
  },
  {
    icon: Zap,
    title: 'Performance is respect',
    description:
      'Every unnecessary render, every bloated bundle — that\'s time stolen from someone.',
  },
  {
    icon: Users,
    title: 'Systems over features',
    description:
      'A feature is a moment. A system is a song. I think in data flows, not checkboxes.',
  },
  {
    icon: Shield,
    title: 'Stillness signals confidence',
    description:
      'The urge to animate everything is the urge to be noticed. Senior work doesn\'t announce itself.',
  },
];

export function OperatingPrinciples() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How I Think
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The principles that guide every decision I make.
          </p>
        </FadeIn>

        {/* Principles Grid */}
        <StaggerChildren className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <div
                key={principle.title}
                className="p-6 bg-card rounded-lg border hover:border-cyan/50 transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-md bg-cyan/10">
                    <Icon className="h-5 w-5 text-cyan" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
