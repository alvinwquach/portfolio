/**
 * ScrollProgress
 * ==============
 * Fixed reading-progress bar at the top of the viewport.
 * Grows from left to right as the user scrolls through the page.
 *
 * OPTIMIZATION — scaleX not width:
 *   Animating CSS `width` from 0% to 100% forces the browser to recalculate
 *   layout on every frame (layout → paint → composite). Animating `scaleX`
 *   from 0 to 1 with `transform-origin: left center` is a pure transform —
 *   handled entirely on the GPU compositor thread with zero layout reflow.
 *   On a 60 fps scrub this avoids ~3,600 layout calculations per minute.
 *
 * will-change: transform
 *   Promotes the element to its own compositor layer before the animation
 *   starts, preventing layer promotion cost mid-animation. Combined with
 *   scaleX, this bar never touches the main thread during scroll.
 *
 * scrub: true (not a number)
 *   Frame-perfect lock to scroll position — no smoothing lag. Reading
 *   progress should feel like a direct extension of the scroll gesture,
 *   not a trailing shadow of it.
 */

'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const bar = barRef.current;
    if (!bar) return;

    gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease:   'none',   // linear — progress should be 1:1 with scroll position
        scrollTrigger: {
          // Track the full document scroll range.
          trigger: document.body,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   true,  // frame-perfect; no smoothing lag
        },
      },
    );
  });

  return (
    <div
      ref={barRef}
      // origin-left = transform-origin: left center (Tailwind utility)
      // will-change-transform = will-change: transform (GPU compositor layer)
      className="fixed top-0 left-0 right-0 h-[2px] bg-amber z-50 origin-left will-change-transform"
      aria-hidden="true"
    />
  );
}
