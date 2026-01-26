/**
 * TechStackChart Component
 * ========================
 * D3 force-directed graph showing tech stack relationships across projects.
 * Uses selective D3 imports to minimize bundle size.
 */

'use client';

import * as React from 'react';
import { select } from 'd3-selection';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import { drag } from 'd3-drag';
import { cn } from '@/lib/utils';

// Data viz color palette by category
const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#00D4FF',    // Cyan
  backend: '#00B8E6',     // Cyan variant
  databases: '#9B59FF',   // Purple
  'data-ml': '#FFAA00',   // Amber
  testing: '#22B07A',     // Mint
  default: '#5C6170',     // Gray
};

interface TechNode {
  id: string;
  name: string;
  category: string;
  projectCount: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface TechLink {
  source: string | TechNode;
  target: string | TechNode;
  strength: number;
}

interface TechStackChartProps {
  nodes: TechNode[];
  links: TechLink[];
  className?: string;
  height?: number;
}

export function TechStackChart({ nodes, links, className, height = 400 }: TechStackChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height });
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

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
    if (!containerRef.current || dimensions.width === 0 || nodes.length === 0) return;

    // Clear previous
    select(containerRef.current).select('svg').remove();

    const width = dimensions.width;
    const chartHeight = dimensions.height;

    // Clone data to avoid mutating props
    const nodesCopy = nodes.map(n => ({ ...n }));
    const linksCopy = links.map(l => ({ ...l }));

    const svg = select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', chartHeight)
      .attr('viewBox', `0 0 ${width} ${chartHeight}`);

    // Create simulation
    const simulation = forceSimulation(nodesCopy)
      .force(
        'link',
        forceLink(linksCopy)
          .id((d: any) => d.id)
          .distance(80)
          .strength((d: any) => d.strength * 0.3)
      )
      .force('charge', forceManyBody().strength(-150))
      .force('center', forceCenter(width / 2, chartHeight / 2))
      .force('collision', forceCollide().radius((d: any) => Math.sqrt(d.projectCount) * 8 + 10));

    // Draw links
    const link = svg
      .append('g')
      .selectAll('line')
      .data(linksCopy)
      .enter()
      .append('line')
      .attr('stroke', '#2D323F')
      .attr('stroke-width', (d) => Math.max(1, d.strength))
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const node = svg
      .append('g')
      .selectAll('g')
      .data(nodesCopy)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        setHoveredNode(d.id);
        select(this).select('circle').attr('stroke-width', 3);
      })
      .on('mouseout', function () {
        setHoveredNode(null);
        select(this).select('circle').attr('stroke-width', 2);
      });

    // Node circles
    node
      .append('circle')
      .attr('r', (d) => Math.sqrt(d.projectCount) * 8 + 6)
      .attr('fill', (d) => CATEGORY_COLORS[d.category] || CATEGORY_COLORS.default)
      .attr('fill-opacity', 0.3)
      .attr('stroke', (d) => CATEGORY_COLORS[d.category] || CATEGORY_COLORS.default)
      .attr('stroke-width', 2);

    // Node labels
    node
      .append('text')
      .text((d) => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#ECEDEF')
      .style('font-size', (d) => (d.projectCount >= 2 ? '11px' : '9px'))
      .style('font-weight', '500')
      .style('pointer-events', 'none');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => {
        // Keep nodes within bounds
        d.x = Math.max(40, Math.min(width - 40, d.x));
        d.y = Math.max(40, Math.min(chartHeight - 40, d.y));
        return `translate(${d.x},${d.y})`;
      });
    });

    // Drag behavior
    const dragBehavior = drag<SVGGElement, TechNode>()
      .on('start', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d: any) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(dragBehavior);

    return () => {
      simulation.stop();
    };
  }, [nodes, links, dimensions]);

  return (
    <div className={cn('relative', className)}>
      <div ref={containerRef} className="w-full" style={{ height }} />

      {/* Tooltip */}
      {hoveredNode && (
        <div className="absolute top-4 left-4 bg-dark-900 px-3 py-2 rounded-md border border-dark-700 shadow-lg">
          <p className="text-sm font-medium text-dark-100">
            {nodes.find((n) => n.id === hoveredNode)?.name}
          </p>
          <p className="text-xs text-dark-400">
            Used in {nodes.find((n) => n.id === hoveredNode)?.projectCount} project(s)
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex flex-wrap gap-3 text-xs">
        {Object.entries(CATEGORY_COLORS)
          .filter(([key]) => key !== 'default')
          .map(([category, color]) => (
            <div key={category} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-dark-400 capitalize">{category.replace('-', ' ')}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
