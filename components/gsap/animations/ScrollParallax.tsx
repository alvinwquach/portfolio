/**
 * ScrollParallax Component
 * ========================
 * Scroll-driven 3D perspective tilt (like a laptop screen rotating into view).
 */

'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin once at module level
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollParallaxProps {
  children: ReactNode;
  className?: string;
  startY?: number;
  endY?: number;
  startRotateX?: number;
  endRotateX?: number;
  startOpacity?: number;
  endOpacity?: number;
  startScale?: number;
  endScale?: number;
  perspective?: number;
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

export function ScrollParallax({
  children,
  className,
  startY = 0,
  endY = 0,
  startRotateX = 0,
  endRotateX = 0,
  startOpacity = 1,
  endOpacity = 1,
  startScale = 1,
  endScale = 1,
  perspective = 1000,
  start = 'top bottom',
  end = 'center center',
  scrub = 1,
}: ScrollParallaxProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    // Set initial state
    gsap.set(inner, {
      y: startY,
      rotateX: startRotateX,
      opacity: startOpacity,
      scale: startScale,
    });

    // Create scroll-driven animation
    const tween = gsap.to(inner, {
      y: endY,
      rotateX: endRotateX,
      opacity: endOpacity,
      scale: endScale,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start,
        end,
        scrub,
        // markers: true, // Uncomment to debug
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [startY, endY, startRotateX, endRotateX, startOpacity, endOpacity, startScale, endScale, start, end, scrub]);

  return (
    <div
      ref={wrapperRef}
      className={cn(className)}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        ref={innerRef}
        style={{
          transformOrigin: 'center top',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
}
