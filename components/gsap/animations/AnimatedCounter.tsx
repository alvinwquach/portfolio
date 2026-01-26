/**
 * AnimatedCounter Component
 * =========================
 * Animates a number counting up when visible.
 * GSAP is dynamically imported only when needed.
 */

'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  // Intersection Observer
  useEffect(() => {
    if (!spanRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(spanRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Animate when visible
  useEffect(() => {
    if (!isVisible || hasAnimated) return;

    const animate = async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;

      const obj = { val: 0 };

      gsap.to(obj, {
        val: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          setDisplayValue(Math.round(obj.val));
        },
        onComplete: () => {
          setHasAnimated(true);
          setDisplayValue(value);
        },
      });
    };

    animate();
  }, [isVisible, value, duration, hasAnimated]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
