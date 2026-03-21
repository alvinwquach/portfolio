/**
 * AnimatedCounter Component
 * =========================
 * Animates a number counting up when visible.
 * GSAP is dynamically imported only when needed.
 */

'use client';

import { useEffect, useState } from 'react';
import { useInView } from '@/lib/hooks';

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
  const { ref, isInView } = useInView<HTMLSpanElement>({ threshold: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  // Animate when visible
  useEffect(() => {
    if (!isInView || hasAnimated) return;

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
  }, [isInView, value, duration, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
