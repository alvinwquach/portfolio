/**
 * useScrollProgress Hook
 * ======================
 * Tracks scroll progress for scroll-linked animations
 */

'use client';

import * as React from 'react';
import { useFrame } from '@react-three/fiber';

interface ScrollProgressOptions {
  /** Element to track scroll on (default: window) */
  target?: React.RefObject<HTMLElement>;
  /** Smoothing factor (0-1, higher = smoother) */
  smooth?: number;
  /** Offset from top (in pixels) */
  offset?: number;
}

interface ScrollProgress {
  /** Current scroll progress (0-1) */
  progress: number;
  /** Scroll velocity (normalized) */
  velocity: number;
  /** Current scroll position in pixels */
  scrollY: number;
  /** Total scrollable height */
  scrollHeight: number;
}

/**
 * Hook to get scroll progress with optional smoothing
 */
export function useScrollProgress({
  target,
  smooth = 0.1,
  offset = 0,
}: ScrollProgressOptions = {}): ScrollProgress {
  const [state, setState] = React.useState<ScrollProgress>({
    progress: 0,
    velocity: 0,
    scrollY: 0,
    scrollHeight: 0,
  });

  const prevScrollY = React.useRef(0);
  const smoothedProgress = React.useRef(0);
  const smoothedVelocity = React.useRef(0);

  React.useEffect(() => {
    const element = target?.current || window;
    const isWindow = element === window;

    const handleScroll = () => {
      const scrollY = isWindow
        ? window.scrollY
        : (element as HTMLElement).scrollTop;

      const scrollHeight = isWindow
        ? document.documentElement.scrollHeight - window.innerHeight
        : (element as HTMLElement).scrollHeight - (element as HTMLElement).clientHeight;

      const progress = Math.max(0, Math.min(1, (scrollY - offset) / scrollHeight));
      const velocity = (scrollY - prevScrollY.current) / 100; // Normalize velocity

      prevScrollY.current = scrollY;

      setState({
        progress,
        velocity,
        scrollY,
        scrollHeight,
      });
    };

    // Initial call
    handleScroll();

    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [target, offset]);

  // Smooth the values using useFrame (only works inside Canvas)
  useFrame(() => {
    smoothedProgress.current += (state.progress - smoothedProgress.current) * smooth;
    smoothedVelocity.current += (state.velocity - smoothedVelocity.current) * smooth;
  });

  return {
    ...state,
    progress: smoothedProgress.current || state.progress,
    velocity: smoothedVelocity.current || state.velocity,
  };
}

/**
 * Simpler hook for use outside of R3F Canvas
 * Returns scroll position, progress, and velocity
 */
export function useWindowScroll(): {
  scrollY: number;
  scrollProgress: number;
  scrollVelocity: number;
} {
  const [scroll, setScroll] = React.useState({
    scrollY: 0,
    scrollProgress: 0,
    scrollVelocity: 0,
  });
  const prevScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollHeight > 0 ? scrollY / scrollHeight : 0;
      const scrollVelocity = (scrollY - prevScrollY.current) / 100;

      prevScrollY.current = scrollY;

      setScroll({ scrollY, scrollProgress, scrollVelocity });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scroll;
}
