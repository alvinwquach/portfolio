/**
 * TestimonialsSection Component
 * =============================
 * Carousel of testimonial quotes
 */

'use client';

import * as React from 'react';
import Image from 'next/image';
import { Quote, Linkedin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, StaggerChildren } from '@/components/gsap';
import type { Testimonial } from '@/lib/graphql/queries';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24">
      <div className="container">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              What People Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Feedback from colleagues and clients
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} />
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="relative">
      {/* Quote icon */}
      <div className="absolute top-4 right-4 text-amber/20">
        <Quote className="h-10 w-10" />
      </div>

      <CardContent className="p-6">
        {/* Quote */}
        <blockquote className="text-foreground mb-6 relative z-10">
          "{testimonial.quote}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-4">
          {testimonial.image?.url ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
              <Image
                src={testimonial.image.url}
                alt={testimonial.author}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-cyan">
                {testimonial.author.charAt(0)}
              </span>
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{testimonial.author}</p>
              {testimonial.linkedin && (
                <a
                  href={testimonial.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan hover:text-amber transition-colors"
                  aria-label="View LinkedIn profile"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
            {testimonial.role && (
              <p className="text-sm text-muted-foreground">
                {testimonial.role}
                {testimonial.company && ` at ${testimonial.company}`}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
