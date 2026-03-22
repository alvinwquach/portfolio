/**
 * About Snippet Section
 * =====================
 * A brief intro that teases the full about page.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface AboutSnippetProps {
  bio?: string;
  location?: string;
  availabilityStatus?: string;
}

export function AboutSnippet({ bio, location, availabilityStatus }: AboutSnippetProps) {
  // MODIFIED(feat/design-system): Late Night Session palette
  const statusColors: Record<string, string> = {
    open: 'bg-success',
    freelance: 'bg-info',
    both: 'bg-accent',
    unavailable: 'bg-text-muted',
  };

  const statusLabels: Record<string, string> = {
    open: 'Open to opportunities',
    freelance: 'Available for freelance',
    both: 'Open to full-time & freelance',
    unavailable: 'Not currently available',
  };

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container max-w-4xl">
        <div className="space-y-8">
          {/* Section label */}
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-border" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              About
            </span>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-relaxed">
              I build systems that respect complexity.
            </h2>

            <p className="text-lg text-muted-foreground/80 leading-relaxed">
              {bio || `Former DJ turned developer. I spent years reading rooms before I started reading codebases.
              That background taught me something valuable: good systems make trade-offs explicit.
              They don't hide complexity—they make it navigable.`}
            </p>

            {/* Status and location */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {availabilityStatus && (
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusColors[availabilityStatus] || 'bg-gray-500'}`} />
                  <span className="text-sm text-muted-foreground">
                    {statusLabels[availabilityStatus] || availabilityStatus}
                  </span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Based in {location}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group"
          >
            Read my full story
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
