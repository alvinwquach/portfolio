/**
 * SkillRadar Component
 * ====================
 * D3 radar chart showing skill proficiency across domains.
 * Uses selective D3 imports to minimize bundle size.
 */

'use client';

import * as React from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { lineRadial, curveLinearClosed } from 'd3-shape';
import { easeCubicOut } from 'd3-ease';
import 'd3-transition';
import { cn } from '@/lib/utils';

// Data viz color palette
const CYAN = '#00D4FF';

interface SkillDomain {
  domain: string;
  value: number; // 0-100
}

interface SkillRadarProps {
  data: SkillDomain[];
  className?: string;
  size?: number;
}

export function SkillRadar({ data, className, size = 300 }: SkillRadarProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear previous
    select(svgRef.current).selectAll('*').remove();

    const margin = 40;
    const width = size;
    const height = size;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Scales
    const angleSlice = (Math.PI * 2) / data.length;
    const rScale = scaleLinear().domain([0, 100]).range([0, radius]);

    // Draw circular grid lines
    const levels = 4;
    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      svg
        .append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', '#2D323F')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');
    }

    // Draw axis lines
    data.forEach((_, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      svg
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', radius * Math.cos(angle))
        .attr('y2', radius * Math.sin(angle))
        .attr('stroke', '#2D323F')
        .attr('stroke-width', 1);
    });

    // Draw labels
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const labelRadius = radius + 20;
      const x = labelRadius * Math.cos(angle);
      const y = labelRadius * Math.sin(angle);

      svg
        .append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#AEB1B9')
        .style('font-size', '11px')
        .style('font-weight', '500')
        .text(d.domain);
    });

    // Line generator for radar shape
    const radarLine = lineRadial<SkillDomain>()
      .radius((d) => rScale(d.value))
      .angle((_, i) => i * angleSlice)
      .curve(curveLinearClosed);

    // Draw radar area with gradient
    const gradientId = 'radar-gradient';
    const defs = svg.append('defs');
    const gradient = defs
      .append('radialGradient')
      .attr('id', gradientId)
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', CYAN).attr('stop-opacity', 0.3);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', CYAN).attr('stop-opacity', 0.1);

    // Animate radar shape
    const radarPath = svg
      .append('path')
      .datum(data)
      .attr('fill', `url(#${gradientId})`)
      .attr('stroke', CYAN)
      .attr('stroke-width', 2)
      .attr('d', radarLine)
      .style('opacity', 0);

    radarPath.transition().duration(1000).ease(easeCubicOut).style('opacity', 1);

    // Draw data points
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = rScale(d.value) * Math.cos(angle);
      const y = rScale(d.value) * Math.sin(angle);

      svg
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 0)
        .attr('fill', CYAN)
        .attr('stroke', '#0D0F14')
        .attr('stroke-width', 2)
        .transition()
        .duration(500)
        .delay(800 + i * 100)
        .attr('r', 5);
    });
  }, [data, size]);

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <svg ref={svgRef} className="w-full h-auto" style={{ maxWidth: size, maxHeight: size }} />
    </div>
  );
}
