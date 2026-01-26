/**
 * CareerSankey Component
 * ======================
 * D3 Sankey diagram showing career transition flow:
 * Previous Careers → Transferable Skills → Current Role
 *
 * This visualization tells the unique story of non-traditional
 * paths into software engineering.
 */

'use client';

import * as React from 'react';
import { useRef, useEffect, useState, useMemo } from 'react';
import { select } from 'd3-selection';
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from 'd3-sankey';
import { cn } from '@/lib/utils';

// Color palette
const COLORS = {
  career: '#00D4FF',      // Cyan - previous careers
  skill: '#FFAA00',       // Amber - transferable skills
  current: '#22B07A',     // Mint - current role
  link: '#2D323F',        // Dark gray - connections
  linkHover: '#00D4FF',   // Cyan - hover state
};

interface PreviousCareer {
  title?: string;
  company?: string;
  transferableSkills?: string[];
}

interface CareerSankeyProps {
  previousCareers: PreviousCareer[];
  currentRole?: string;
  className?: string;
  height?: number;
}

interface SankeyNodeData {
  name: string;
  category: 'career' | 'skill' | 'current';
}

interface SankeyLinkData {
  source: number;
  target: number;
  value: number;
}

export function CareerSankey({
  previousCareers,
  currentRole = 'Software Engineer',
  className,
  height = 400,
}: CareerSankeyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Transform data into Sankey format
  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, number>();
    const nodes: SankeyNodeData[] = [];
    const links: SankeyLinkData[] = [];

    // Add career nodes (left column)
    previousCareers.forEach((career) => {
      if (career.title) {
        const idx = nodes.length;
        nodeMap.set(`career:${career.title}`, idx);
        nodes.push({ name: career.title, category: 'career' });
      }
    });

    // Collect all unique skills and their sources
    const skillSources = new Map<string, string[]>();
    previousCareers.forEach((career) => {
      if (career.title && career.transferableSkills) {
        career.transferableSkills.forEach((skill) => {
          if (!skillSources.has(skill)) {
            skillSources.set(skill, []);
          }
          skillSources.get(skill)!.push(career.title!);
        });
      }
    });

    // Add skill nodes (middle column)
    skillSources.forEach((sources, skill) => {
      const idx = nodes.length;
      nodeMap.set(`skill:${skill}`, idx);
      nodes.push({ name: skill, category: 'skill' });

      // Create links from careers to this skill
      sources.forEach((careerTitle) => {
        const sourceIdx = nodeMap.get(`career:${careerTitle}`);
        if (sourceIdx !== undefined) {
          links.push({
            source: sourceIdx,
            target: idx,
            value: 1,
          });
        }
      });
    });

    // Add current role node (right column)
    const currentIdx = nodes.length;
    nodeMap.set(`current:${currentRole}`, currentIdx);
    nodes.push({ name: currentRole, category: 'current' });

    // Link all skills to current role
    skillSources.forEach((_, skill) => {
      const skillIdx = nodeMap.get(`skill:${skill}`);
      if (skillIdx !== undefined) {
        links.push({
          source: skillIdx,
          target: currentIdx,
          value: 1,
        });
      }
    });

    return { nodes, links };
  }, [previousCareers, currentRole]);

  // Resize observer
  useEffect(() => {
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

  // Render Sankey diagram
  useEffect(() => {
    if (!containerRef.current || dimensions.width === 0 || nodes.length === 0) return;

    // Clear previous
    select(containerRef.current).select('svg').remove();

    const margin = { top: 20, right: 150, bottom: 20, left: 150 };
    const width = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

    // Create SVG
    const svg = select(containerRef.current)
      .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create Sankey generator
    const sankeyGenerator = sankey<SankeyNodeData, SankeyLinkData>()
      .nodeWidth(20)
      .nodePadding(15)
      .extent([[0, 0], [width, chartHeight]]);

    // Generate layout
    const { nodes: layoutNodes, links: layoutLinks } = sankeyGenerator({
      nodes: nodes.map(d => ({ ...d })),
      links: links.map(d => ({ ...d })),
    });

    // Draw links
    const link = svg.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(layoutLinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', COLORS.link)
      .attr('stroke-width', (d) => Math.max(1, d.width || 1))
      .attr('stroke-opacity', 0.4)
      .style('mix-blend-mode', 'multiply')
      .on('mouseover', function(event, d) {
        select(this)
          .attr('stroke', COLORS.linkHover)
          .attr('stroke-opacity', 0.8);
      })
      .on('mouseout', function() {
        select(this)
          .attr('stroke', COLORS.link)
          .attr('stroke-opacity', 0.4);
      });

    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(layoutNodes)
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    // Node rectangles
    node.append('rect')
      .attr('height', (d) => (d.y1 || 0) - (d.y0 || 0))
      .attr('width', (d) => (d.x1 || 0) - (d.x0 || 0))
      .attr('fill', (d) => {
        switch (d.category) {
          case 'career': return COLORS.career;
          case 'skill': return COLORS.skill;
          case 'current': return COLORS.current;
          default: return COLORS.link;
        }
      })
      .attr('rx', 4)
      .attr('ry', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        setHoveredNode(d.name);
        select(this).attr('opacity', 0.8);

        // Highlight connected links
        link.attr('stroke-opacity', (l: any) => {
          const sourceNode = l.source as SankeyNode<SankeyNodeData, SankeyLinkData>;
          const targetNode = l.target as SankeyNode<SankeyNodeData, SankeyLinkData>;
          return sourceNode.name === d.name || targetNode.name === d.name ? 0.8 : 0.2;
        }).attr('stroke', (l: any) => {
          const sourceNode = l.source as SankeyNode<SankeyNodeData, SankeyLinkData>;
          const targetNode = l.target as SankeyNode<SankeyNodeData, SankeyLinkData>;
          return sourceNode.name === d.name || targetNode.name === d.name ? COLORS.linkHover : COLORS.link;
        });
      })
      .on('mouseout', function() {
        setHoveredNode(null);
        select(this).attr('opacity', 1);
        link.attr('stroke-opacity', 0.4).attr('stroke', COLORS.link);
      });

    // Node labels
    node.append('text')
      .attr('x', (d) => d.category === 'current' ? (d.x1! - d.x0!) + 8 : -8)
      .attr('y', (d) => ((d.y1 || 0) - (d.y0 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => d.category === 'current' ? 'start' : 'end')
      .attr('fill', '#ECEDEF')
      .style('font-size', '12px')
      .style('font-weight', (d) => d.category === 'current' ? '600' : '400')
      .text((d) => {
        // Truncate long names
        const maxLen = d.category === 'skill' ? 25 : 20;
        return d.name.length > maxLen ? d.name.substring(0, maxLen - 3) + '...' : d.name;
      });

    // Column headers
    const headerY = -10;

    svg.append('text')
      .attr('x', 0)
      .attr('y', headerY)
      .attr('text-anchor', 'middle')
      .attr('fill', COLORS.career)
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('text-transform', 'uppercase')
      .style('letter-spacing', '0.05em')
      .text('Previous Roles');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', headerY)
      .attr('text-anchor', 'middle')
      .attr('fill', COLORS.skill)
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('text-transform', 'uppercase')
      .style('letter-spacing', '0.05em')
      .text('Transferable Skills');

    svg.append('text')
      .attr('x', width)
      .attr('y', headerY)
      .attr('text-anchor', 'middle')
      .attr('fill', COLORS.current)
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('text-transform', 'uppercase')
      .style('letter-spacing', '0.05em')
      .text('Current');

  }, [nodes, links, dimensions]);

  if (nodes.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative', className)}>
      <div ref={containerRef} className="w-full" style={{ height }} />

      {/* Tooltip */}
      {hoveredNode && (
        <div className="absolute top-4 left-4 bg-card px-3 py-2 rounded-md shadow-md border">
          <p className="text-sm font-medium">{hoveredNode}</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.career }} />
          <span className="text-muted-foreground">Previous Roles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.skill }} />
          <span className="text-muted-foreground">Transferable Skills</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.current }} />
          <span className="text-muted-foreground">Current Role</span>
        </div>
      </div>
    </div>
  );
}
