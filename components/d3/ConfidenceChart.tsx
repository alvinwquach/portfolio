/**
 * ConfidenceChart Component
 * =========================
 * D3 horizontal bar chart showing confidence levels by interview category.
 * Uses selective D3 imports to minimize bundle size (~20KB vs ~500KB).
 */

'use client';

import * as React from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { cn } from '@/lib/utils';

// Data viz color palette
const CYAN = '#00D4FF';
const AMBER = '#FFAA00';
const MINT = '#22B07A';
const CORAL = '#F06449';

interface ConfidenceData {
  category: string;
  avgConfidence: number; // 1-5
  count: number;
}

interface ConfidenceChartProps {
  data: ConfidenceData[];
  className?: string;
  height?: number;
}

// Color scale based on confidence
function getColor(value: number): string {
  if (value >= 4) return MINT;
  if (value >= 3) return CYAN;
  if (value >= 2) return AMBER;
  return CORAL;
}

// Format category labels for display
function formatCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    react: 'React',
    nextjs: 'Next.js',
    frontend: 'Frontend',
    fullstack: 'Full Stack',
    'system-design': 'System Design',
    performance: 'Performance',
    security: 'Security',
    debugging: 'Debugging',
    behavioral: 'Behavioral',
    'behavioral-collaboration': 'Collaboration',
    'behavioral-failure': 'Failure/Growth',
    stanford: 'Stanford',
  };
  return labels[category] || category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export function ConfidenceChart({ data, className, height = 300 }: ConfidenceChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);

  // Resize observer
  React.useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Render chart
  React.useEffect(() => {
    if (!containerRef.current || width === 0 || data.length === 0) return;

    // Clear previous
    select(containerRef.current).select('svg').remove();

    const margin = { top: 20, right: 80, bottom: 20, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const barHeight = Math.min(30, innerHeight / data.length - 8);

    // Sort by confidence
    const sortedData = [...data].sort((a, b) => b.avgConfidence - a.avgConfidence);

    // Scales
    const x = scaleLinear().domain([0, 5]).range([0, innerWidth]);
    const y = scaleBand()
      .domain(sortedData.map((d) => d.category))
      .range([0, innerHeight])
      .padding(0.3);

    // Create SVG
    const svg = select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Background bars (show full 5-point scale)
    svg
      .selectAll('.bg-bar')
      .data(sortedData)
      .enter()
      .append('rect')
      .attr('class', 'bg-bar')
      .attr('x', 0)
      .attr('y', (d) => y(d.category) || 0)
      .attr('width', innerWidth)
      .attr('height', barHeight)
      .attr('fill', '#1E222D')
      .attr('rx', 4);

    // Confidence bars (no transition - simpler, more reliable)
    svg
      .selectAll('.bar')
      .data(sortedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', (d) => y(d.category) || 0)
      .attr('width', (d) => x(d.avgConfidence))
      .attr('height', barHeight)
      .attr('fill', (d) => getColor(d.avgConfidence))
      .attr('rx', 4);

    // Category labels
    svg
      .selectAll('.label')
      .data(sortedData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', -8)
      .attr('y', (d) => (y(d.category) || 0) + barHeight / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#AEB1B9')
      .style('font-size', '12px')
      .text((d) => formatCategoryLabel(d.category));

    // Confidence value labels
    svg
      .selectAll('.value')
      .data(sortedData)
      .enter()
      .append('text')
      .attr('class', 'value')
      .attr('x', (d) => x(d.avgConfidence) + 8)
      .attr('y', (d) => (y(d.category) || 0) + barHeight / 2)
      .attr('dominant-baseline', 'middle')
      .attr('fill', (d) => getColor(d.avgConfidence))
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text((d) => d.avgConfidence.toFixed(1));

    // Question count
    svg
      .selectAll('.count')
      .data(sortedData)
      .enter()
      .append('text')
      .attr('class', 'count')
      .attr('x', innerWidth + 8)
      .attr('y', (d) => (y(d.category) || 0) + barHeight / 2)
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#5C6170')
      .style('font-size', '11px')
      .text((d) => `${d.count}q`);
  }, [data, width, height]);

  return <div ref={containerRef} className={cn('w-full', className)} style={{ height }} />;
}
