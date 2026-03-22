/**
 * TransitionLink
 * ==============
 * Drop-in replacement for Next.js <Link> on project card navigation.
 * Captures the GSAP Flip state (and click coordinates as fallback) from the
 * source card's image element, stores it in the module-level transition store,
 * then performs the client-side navigation via useRouter.
 *
 * WHY PREVENT DEFAULT + router.push():
 *   Using onClick with e.preventDefault() and router.push() instead of
 *   letting Link handle navigation gives us a synchronous window between
 *   the click event and route change to call Flip.getState(). If we let
 *   Link navigate normally (without prevent), the store still gets written
 *   synchronously — but preventing default gives us explicit control over
 *   the timing and avoids any race with React's concurrent rendering.
 *
 * data-flip-id convention:
 *   Source card image: data-flip-id="project-image-{slug}"
 *   Hero image:        data-flip-id="project-image-{slug}"
 *   GSAP Flip matches these automatically, even across unmount/mount.
 */

'use client';

import { forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flip } from 'gsap/Flip';
import { storeTransition } from '@/lib/pageTransition';
import type { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof Link>;

interface TransitionLinkProps extends Omit<LinkProps, 'onClick'> {
  /**
   * Project slug — identifies which image element to capture and verifies
   * the transition on the destination page.
   */
  slug: string;
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ href, slug, children, ...props }, ref) {
    const router = useRouter();

    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
      e.preventDefault();

      // ── Capture Flip state from the card image ─────────────────────────
      // The card image element carries data-flip-id="project-image-{slug}".
      // Flip.getState() records its current position/size so that Flip.from()
      // on the detail page can animate FROM that rect TO the hero's rect.
      const imageEl = document.querySelector<HTMLElement>(
        `[data-flip-id="project-image-${slug}"]`,
      );

      let flipState = null;
      if (imageEl) {
        try {
          flipState = Flip.getState(imageEl, { props: 'borderRadius' });
        } catch {
          // Flip not registered yet or element measurement failed.
          // The circle-expand fallback in usePageEnter will handle it.
        }
      }

      storeTransition({
        flipState,
        clickX: e.clientX,
        clickY: e.clientY,
        slug,
      });

      router.push(typeof href === 'string' ? href : String(href));
    }

    return (
      <Link ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  },
);
