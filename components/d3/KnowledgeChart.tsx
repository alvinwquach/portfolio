/**
 * Knowledge Chart Component
 * =========================
 * Renders D3 charts for knowledge nodes based on chartType.
 * Supports: bar, line, pie charts.
 * Uses selective D3 imports to minimize bundle size.
 */

'use client';

import * as React from 'react';
// Import d3-transition first to augment Selection with .transition()
import 'd3-transition';
import { select, type Selection } from 'd3-selection';
import { scaleLinear, scaleBand, scalePoint, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, area, pie, arc, curveMonotoneX, type PieArcDatum } from 'd3-shape';
import { max, sum } from 'd3-array';
import { cn } from '@/lib/utils';

interface ChartData {
  chartType?: string;
  data?: string | any[];
  options?: string | Record<string, any>;
}

interface KnowledgeChartProps {
  chartData: ChartData;
  className?: string;
  height?: number;
}

export function KnowledgeChart({
  chartData,
  className,
  height = 300,
}: KnowledgeChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height });

  // Parse data and options if they're strings
  const data = React.useMemo(() => {
    if (!chartData.data) return [];
    if (typeof chartData.data === 'string') {
      try {
        return JSON.parse(chartData.data);
      } catch {
        return [];
      }
    }
    return chartData.data;
  }, [chartData.data]);

  const options = React.useMemo(() => {
    if (!chartData.options) return {};
    if (typeof chartData.options === 'string') {
      try {
        return JSON.parse(chartData.options);
      } catch {
        return {};
      }
    }
    return chartData.options;
  }, [chartData.options]);

  // Resize observer
  React.useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height,
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [height]);

  // Render chart
  React.useEffect(() => {
    if (!containerRef.current || dimensions.width === 0 || data.length === 0) return;

    // Clear previous chart
    select(containerRef.current).select('svg').remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

    const svg = select(containerRef.current)
      .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    switch (chartData.chartType) {
      case 'bar':
        renderBarChart(svg, data, width, chartHeight, options);
        break;
      case 'line':
        renderLineChart(svg, data, width, chartHeight, options);
        break;
      case 'pie':
        renderPieChart(svg, data, width, chartHeight, options);
        break;
      default:
        renderBarChart(svg, data, width, chartHeight, options);
    }
  }, [chartData.chartType, data, dimensions, options]);

  return (
    <div
      ref={containerRef}
      className={cn('w-full', className)}
      style={{ height }}
    />
  );
}

// Bar Chart
function renderBarChart(
  svg: Selection<SVGGElement, unknown, null, undefined>,
  data: any[],
  width: number,
  height: number,
  options: Record<string, any>
) {
  const xKey = options.xAxis || Object.keys(data[0])[0];
  const yKey = options.yAxis || Object.keys(data[0])[1];
  const colors = options.colors || ['#00D4FF'];

  // Scales
  const x = scaleBand()
    .domain(data.map((d) => d[xKey]))
    .range([0, width])
    .padding(0.2);

  const y = scaleLinear()
    .domain([0, max(data, (d) => d[yKey]) || 0])
    .nice()
    .range([height, 0]);

  // X Axis
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(axisBottom(x))
    .selectAll('text')
    .attr('fill', '#858A96')
    .style('font-size', '12px');

  // Y Axis
  svg
    .append('g')
    .call(axisLeft(y).ticks(5))
    .selectAll('text')
    .attr('fill', '#858A96')
    .style('font-size', '12px');

  // Y Axis label
  if (options.yAxisLabel) {
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#858A96')
      .style('font-size', '12px')
      .text(options.yAxisLabel);
  }

  // Bars with animation
  const bars = svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => x(d[xKey]) || 0)
    .attr('y', height)
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .attr('fill', colors[0])
    .attr('rx', 4);

  bars
    .transition()
    .duration(800)
    .delay((_, i) => i * 100)
    .attr('y', (d) => y(d[yKey]))
    .attr('height', (d) => height - y(d[yKey]));

  // Value labels
  const labels = svg
    .selectAll('.label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', (d) => (x(d[xKey]) || 0) + x.bandwidth() / 2)
    .attr('y', (d) => y(d[yKey]) - 5)
    .attr('text-anchor', 'middle')
    .attr('fill', '#858A96')
    .style('font-size', '11px')
    .style('opacity', 0)
    .text((d) => d[yKey]);

  labels
    .transition()
    .duration(800)
    .delay((_, i) => i * 100 + 400)
    .style('opacity', 1);
}

// Line Chart
function renderLineChart(
  svg: Selection<SVGGElement, unknown, null, undefined>,
  data: any[],
  width: number,
  height: number,
  options: Record<string, any>
) {
  const xKey = options.xAxis || Object.keys(data[0])[0];
  const yKey = options.yAxis || Object.keys(data[0])[1];
  const colors = options.colors || ['#00D4FF'];

  // Scales
  const x = scalePoint()
    .domain(data.map((d) => d[xKey]))
    .range([0, width])
    .padding(0.5);

  const y = scaleLinear()
    .domain([0, max(data, (d) => d[yKey]) || 0])
    .nice()
    .range([height, 0]);

  // X Axis
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(axisBottom(x))
    .selectAll('text')
    .attr('fill', '#858A96')
    .style('font-size', '12px');

  // Y Axis
  svg
    .append('g')
    .call(axisLeft(y).ticks(5))
    .selectAll('text')
    .attr('fill', '#858A96')
    .style('font-size', '12px');

  // Y Axis label
  if (options.yAxisLabel) {
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#858A96')
      .style('font-size', '12px')
      .text(options.yAxisLabel);
  }

  // Area fill
  if (options.areaFill) {
    const areaGen = area<any>()
      .x((d) => x(d[xKey]) || 0)
      .y0(height)
      .y1((d) => y(d[yKey]));

    svg
      .append('path')
      .datum(data)
      .attr('fill', `${colors[0]}20`)
      .attr('d', areaGen);
  }

  // Line
  const lineGen = line<any>()
    .x((d) => x(d[xKey]) || 0)
    .y((d) => y(d[yKey]))
    .curve(curveMonotoneX);

  const path = svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', colors[0])
    .attr('stroke-width', 3)
    .attr('d', lineGen);

  // Animate line
  const totalLength = path.node()?.getTotalLength() || 0;
  path
    .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(1500)
    .attr('stroke-dashoffset', 0);

  // Dots
  if (options.showDots !== false) {
    const dots = svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => x(d[xKey]) || 0)
      .attr('cy', (d) => y(d[yKey]))
      .attr('r', 0)
      .attr('fill', colors[0]);

    dots
      .transition()
      .duration(500)
      .delay((_, i) => 1000 + i * 100)
      .attr('r', 5);
  }
}

// Pie Chart
function renderPieChart(
  svg: Selection<SVGGElement, unknown, null, undefined>,
  data: any[],
  width: number,
  height: number,
  options: Record<string, any>
) {
  const radius = Math.min(width, height) / 2;
  const innerRadius = options.innerRadius ? radius * options.innerRadius : 0;

  // Move to center
  const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

  // Color scale
  const color = scaleOrdinal<string>()
    .domain(data.map((d) => d.label))
    .range(data.map((d) => d.color || '#00D4FF'));

  // Pie generator
  const pieGen = pie<any>()
    .value((d) => d.value)
    .sort(null);

  // Arc generator
  const arcGen = arc<PieArcDatum<any>>()
    .innerRadius(innerRadius)
    .outerRadius(radius);

  // Draw slices
  const slices = g
    .selectAll('.slice')
    .data(pieGen(data))
    .enter()
    .append('g')
    .attr('class', 'slice');

  const paths = slices
    .append('path')
    .attr('d', arcGen)
    .attr('fill', (d) => color(d.data.label))
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .style('opacity', 0);

  paths
    .transition()
    .duration(800)
    .delay((_, i) => i * 150)
    .style('opacity', 1);

  // Labels with percentage
  if (options.showPercentage) {
    const total = sum(data, (d) => d.value);
    const labelArc = arc<PieArcDatum<any>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);

    const labels = slices
      .append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .text((d) => `${Math.round((d.data.value / total) * 100)}%`);

    labels
      .transition()
      .duration(500)
      .delay((_, i) => 800 + i * 150)
      .style('opacity', 1);
  }

  // Legend
  if (options.showLegend) {
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 100}, 0)`);

    data.forEach((d, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow
        .append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('rx', 2)
        .attr('fill', d.color || color(d.label));

      legendRow
        .append('text')
        .attr('x', 18)
        .attr('y', 10)
        .attr('fill', '#858A96')
        .style('font-size', '11px')
        .text(d.label);
    });
  }
}
