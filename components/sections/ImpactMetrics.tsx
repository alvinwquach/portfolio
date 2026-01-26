/**
 * Impact Metrics Component
 * ========================
 * Animated metrics that tell the story through numbers.
 * Uses CSS for initial layout, AnimatedCounter for number animation.
 * No GSAP in initial bundle.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from '@/components/gsap/animations/AnimatedCounter';

interface Metric {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
}

interface ImpactMetricsProps {
  metrics: Metric[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ImpactMetrics({
  metrics,
  title = 'Impact by the Numbers',
  subtitle,
  className,
}: ImpactMetricsProps) {
  return (
    <section className={cn('py-24', className)}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-6 bg-card rounded-xl border text-center hover:border-cyan/50 transition-colors duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold text-cyan mb-2">
                {metric.prefix}
                <AnimatedCounter
                  value={metric.value}
                  duration={2}
                  suffix={metric.suffix}
                />
              </div>
              <div className="font-medium text-foreground mb-1">
                {metric.label}
              </div>
              {metric.description && (
                <div className="text-sm text-muted-foreground">
                  {metric.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
