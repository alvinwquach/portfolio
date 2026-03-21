/**
 * Closing Section
 * ===============
 * The final section is nearly empty.
 * A single line of text. Plain links. No icons.
 *
 * The emotion that remains: Quiet confidence.
 * This person didn't try to impress you.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/hooks';

interface ClosingSectionProps {
  email?: string;
  github?: string;
  linkedin?: string;
  className?: string;
}

export function ClosingSection({
  email = 'alvinwquach@gmail.com',
  github = 'https://github.com/alvinwquach',
  linkedin = 'https://linkedin.com/in/alvinwquach',
  className,
}: ClosingSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className={cn('py-32', className)}
    >
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {/* The statement */}
          <p
            className={cn(
              'text-2xl md:text-3xl font-light text-foreground/80 mb-12 leading-relaxed',
              'transition-opacity duration-1000',
              isInView ? 'opacity-100' : 'opacity-0'
            )}
          >
            Let's build something that respects people's time.
          </p>

          {/* Plain text links - no icons */}
          <div
            className={cn(
              'flex flex-wrap justify-center gap-8 text-muted-foreground',
              'transition-opacity duration-1000',
              isInView ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: '500ms' }}
          >
            <a
              href={`mailto:${email}`}
              className="hover:text-foreground transition-colors"
            >
              Email
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
