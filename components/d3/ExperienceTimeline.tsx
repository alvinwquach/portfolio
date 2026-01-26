/**
 * ExperienceTimeline Component
 * ============================
 * D3 horizontal timeline visualization for work experience.
 * Uses selective D3 imports to minimize bundle size.
 */

'use client';

import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import { scaleTime, scaleBand } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { timeFormat } from 'd3-time-format';
import { min, max } from 'd3-array';
import { cn } from '@/lib/utils';

// Data viz color palette
const CYAN = '#00D4FF';
const AMBER = '#FFAA00';

interface Experience {
  _id: string;
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

interface ExperienceTimelineProps {
  data: Experience[];
  className?: string;
  width?: number;
  height?: number;
}

// Parse date string like "Aug 2022" into a Date
function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;

  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const parts = dateStr.split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]];
    const year = parseInt(parts[1], 10);
    if (!isNaN(month) && !isNaN(year)) {
      return new Date(year, month);
    }
  }

  // Try parsing as just year
  const year = parseInt(dateStr, 10);
  if (!isNaN(year)) {
    return new Date(year, 0);
  }

  return null;
}

export function ExperienceTimeline({
  data,
  className,
  width = 800,
  height = 400,
}: ExperienceTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredExp, setHoveredExp] = useState<Experience | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear previous content
    select(svgRef.current).selectAll('*').remove();

    // Process data with dates
    const processedData = data.map((exp) => {
      const start = parseDate(exp.startDate);
      const end = exp.isCurrent ? new Date() : parseDate(exp.endDate);

      return {
        ...exp,
        startParsed: start,
        endParsed: end,
      };
    }).filter((d) => d.startParsed !== null);

    if (processedData.length === 0) return;

    // Margins
    const margin = { top: 40, right: 30, bottom: 60, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Find date range
    const allDates = processedData.flatMap((d) => [
      d.startParsed,
      d.endParsed,
    ]).filter(Boolean) as Date[];

    const minDate = min(allDates) || new Date();
    const maxDate = max(allDates) || new Date();

    // Create scales
    const xScale = scaleTime()
      .domain([minDate, maxDate])
      .range([0, innerWidth]);

    const yScale = scaleBand()
      .domain(processedData.map((d, i) => String(i)))
      .range([0, innerHeight])
      .padding(0.3);

    // Create SVG
    const svg = select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add x-axis
    const formatYear = timeFormat('%Y');
    const xAxis = axisBottom(xScale)
      .ticks(6)
      .tickFormat((d) => formatYear(d as Date));

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#8f8070')
      .attr('font-size', '12px');

    g.selectAll('.x-axis path, .x-axis line')
      .attr('stroke', '#ddd');

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(xScale.ticks(6))
      .join('line')
      .attr('x1', (d) => xScale(d))
      .attr('x2', (d) => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#f0f0f0')
      .attr('stroke-dasharray', '2,2');

    // Add experience bars
    const bars = g.selectAll('.bar')
      .data(processedData)
      .join('g')
      .attr('class', 'bar');

    bars.append('rect')
      .attr('x', (d) => xScale(d.startParsed!))
      .attr('y', (d, i) => yScale(String(i)) || 0)
      .attr('width', (d) => {
        const start = xScale(d.startParsed!);
        const end = xScale(d.endParsed || new Date());
        return Math.max(end - start, 10);
      })
      .attr('height', yScale.bandwidth())
      .attr('fill', (d) => d.isCurrent ? AMBER : CYAN)
      .attr('rx', 4)
      .attr('ry', 4)
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.2s ease-out')
      .on('mouseover', function(event, d) {
        select(this).attr('opacity', 0.8);
        setHoveredExp(d);
      })
      .on('mouseout', function() {
        select(this).attr('opacity', 1);
        setHoveredExp(null);
      });

    // Add company labels
    bars.append('text')
      .attr('x', (d) => xScale(d.startParsed!) + 8)
      .attr('y', (d, i) => (yScale(String(i)) || 0) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('pointer-events', 'none')
      .text((d) => {
        const barWidth = xScale(d.endParsed || new Date()) - xScale(d.startParsed!);
        const text = d.company;
        // Truncate if bar is too small
        if (barWidth < 60) return '';
        if (barWidth < 100) return text.substring(0, 8) + '...';
        return text;
      });

    // Add "Current" indicator
    const currentExps = processedData.filter((d) => d.isCurrent);
    if (currentExps.length > 0) {
      g.append('text')
        .attr('x', innerWidth)
        .attr('y', -10)
        .attr('text-anchor', 'end')
        .attr('fill', AMBER)
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .text('Current');
    }

  }, [data, width, height]);

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        className="w-full h-auto"
        style={{ maxHeight: height }}
      />

      {/* Tooltip */}
      {hoveredExp && (
        <div className="absolute top-4 left-4 bg-card px-4 py-3 rounded-md shadow-md border max-w-xs">
          <p className="font-semibold">{hoveredExp.role}</p>
          <p className="text-sm text-muted-foreground">{hoveredExp.company}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {hoveredExp.startDate} - {hoveredExp.isCurrent ? 'Present' : hoveredExp.endDate}
          </p>
        </div>
      )}
    </div>
  );
}
