/**
 * Signal Statement Component
 * ==========================
 * The manifesto distilled. What I believe. Why it matters.
 * Not "about me" — about the work.
 */

'use client';

import { FadeIn } from '@/components/gsap/animations/FadeIn';

export function SignalStatement() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed text-foreground mb-8">
              "Software is composition — every decision is a note, and the best
              systems have rhythm you can feel before you understand them."
            </blockquote>

            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                I build software the way a DJ builds a set: reading the room,
                understanding tension and release, knowing when to drop and when to hold back.
              </p>
              <p>
                My code doesn't just work — it <em>breathes</em>.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
