/**
 * usePageEnter
 * ============
 * Runs the page-enter animation on the project detail hero.
 * Called on mount — reads the module-level transition store once,
 * consumes it (clears it), and plays whichever technique applies.
 *
 * PRIMARY — GSAP Flip:
 *   If a FlipState was captured from the source card's image element,
 *   Flip.from() animates the hero image FROM the card's stored position
 *   TO its current rendered position. GSAP matches elements by their
 *   shared data-flip-id attribute even though the card is now unmounted.
 *
 * FALLBACK — circle-expand clipPath:
 *   When no image / FlipState is available (project has no thumbnail),
 *   an expanding circle is clipped from the click coordinates. This reads
 *   as a "reveal from where you tapped" — physical, not a fade.
 *
 * SKIP CONDITIONS:
 *   - Direct URL entry (consumeTransition() returns null)
 *   - Slug mismatch (stale store from a cancelled navigation)
 *   - prefers-reduced-motion: reduce
 */

'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { consumeTransition } from '@/lib/pageTransition';

export function usePageEnter(slug: string): void {
  useEffect(() => {
    const transition = consumeTransition();
    if (!transition) return;                              // direct URL — skip
    if (transition.slug !== slug) return;               // stale store — skip

    // Respect reduced-motion preference.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { flipState, clickX, clickY } = transition;

    // ── Primary: Flip ───────────────────────────────────────────────────────
    // Flip.from() searches the DOM for elements with matching data-flip-id
    // values. The hero image has the same flip-id as the card image that was
    // captured, so GSAP animates it from the card's old rect to its current
    // rect — even though the card element itself is no longer in the DOM.
    if (flipState) {
      try {
        Flip.from(flipState, {
          duration: 0.6,
          ease:     'power2.inOut',
        });
        return;
      } catch {
        // Flip threw (plugin not registered, element mismatch, etc.)
        // Fall through to circle fallback.
      }
    }

    // ── Fallback: circle-expand clipPath ────────────────────────────────────
    // Uses the click coordinates as the expansion origin so the reveal feels
    // directly connected to where the user tapped / clicked.
    const imageEl = document.querySelector<HTMLElement>(
      `[data-flip-id="project-image-${slug}"]`,
    );
    if (!imageEl) return;

    gsap.fromTo(
      imageEl,
      { clipPath: `circle(0% at ${clickX}px ${clickY}px)` },
      {
        clipPath: `circle(150% at ${clickX}px ${clickY}px)`,
        duration: 0.6,
        ease:     'power2.inOut',
      },
    );
  // Slug is stable for the lifetime of this page — deps array is intentional.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
