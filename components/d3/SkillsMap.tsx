/**
 * SkillsMap Component
 * ===================
 * D3 packed circle visualization for skills by category.
 * Uses selective D3 imports to minimize bundle size.
 */

'use client';

import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { select } from 'd3-selection';
import { hierarchy, pack } from 'd3-hierarchy';
import { color } from 'd3-color';
import { cn } from '@/lib/utils';

// Data viz color palette - Cyan/Amber/Mint
const CATEGORY_COLORS: Record<string, string> = {
  databases: '#00D4FF',      // Cyan - primary
  frontend: '#00D4FF',       // Cyan
  backend: '#00B8E6',        // Cyan variant
  'data-ml': '#9B59FF',      // Purple (chart-4)
  testing: '#22B07A',        // Mint
  'project-tools': '#FFAA00', // Amber
  analytics: '#F06449',      // Coral
  cms: '#00A3CC',            // Cyan muted
  communication: '#FFAA00',  // Amber
  product: '#FFBB33',        // Amber variant
  community: '#FFCC66',      // Amber light
};

interface Skill {
  _id: string;
  name: string;
  category: string;
}

interface SkillGroup {
  category: string;
  categoryLabel: string;
  skills: Skill[];
}

interface SkillsMapProps {
  data: SkillGroup[];
  className?: string;
  width?: number;
  height?: number;
}

interface HierarchyNode {
  name: string;
  category?: string;
  children?: HierarchyNode[];
  value?: number;
}

export function SkillsMap({
  data,
  className,
  width = 800,
  height = 600,
}: SkillsMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear previous content
    select(svgRef.current).selectAll('*').remove();

    // Transform data into hierarchy format
    const hierarchyData: HierarchyNode = {
      name: 'Skills',
      children: data.map((group) => ({
        name: group.categoryLabel,
        category: group.category,
        children: group.skills.map((skill) => ({
          name: skill.name,
          category: group.category,
          value: 1,
        })),
      })),
    };

    // Create hierarchy
    const root = hierarchy(hierarchyData)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create pack layout
    const packLayout = pack<HierarchyNode>()
      .size([width, height])
      .padding(3);

    const nodes = packLayout(root).descendants();

    // Create SVG
    const svg = select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    // Add groups for each node
    const node = svg.selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    // Add circles
    node.append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', (d) => {
        if (d.depth === 0) return 'transparent';
        if (d.depth === 1) {
          const cat = (d.data as HierarchyNode).category;
          return cat ? CATEGORY_COLORS[cat] || '#5C6170' : '#5C6170';
        }
        const cat = (d.data as HierarchyNode).category;
        const baseColor = cat ? CATEGORY_COLORS[cat] || '#5C6170' : '#5C6170';
        const brighterColor = color(baseColor)?.brighter(0.3);
        return brighterColor?.toString() || '#858A96';
      })
      .attr('fill-opacity', (d) => {
        if (d.depth === 0) return 0;
        if (d.depth === 1) return 0.3;
        return 0.8;
      })
      .attr('stroke', (d) => {
        if (d.depth === 0) return 'none';
        const cat = (d.data as HierarchyNode).category;
        return cat ? CATEGORY_COLORS[cat] || '#5C6170' : '#5C6170';
      })
      .attr('stroke-width', (d) => d.depth === 1 ? 2 : 1)
      .attr('stroke-opacity', 0.5)
      .style('cursor', (d) => d.depth === 2 ? 'pointer' : 'default')
      .style('transition', 'all 0.2s ease-out')
      .on('mouseover', function(event, d) {
        if (d.depth === 2) {
          select(this)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 1);
          setHoveredSkill(d.data.name);
        }
      })
      .on('mouseout', function(event, d) {
        if (d.depth === 2) {
          select(this)
            .attr('fill-opacity', 0.8)
            .attr('stroke-opacity', 0.5);
          setHoveredSkill(null);
        }
      });

    // Add labels for category circles
    node.filter((d) => d.depth === 1)
      .append('text')
      .attr('dy', '0.3em')
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => {
        const cat = (d.data as HierarchyNode).category;
        return cat ? CATEGORY_COLORS[cat] || '#5C6170' : '#5C6170';
      })
      .attr('font-size', (d) => Math.min(d.r / 3, 14))
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .text((d) => d.data.name);

    // Add labels for skill circles (only if large enough)
    node.filter((d) => d.depth === 2 && d.r > 20)
      .append('text')
      .attr('dy', '0.3em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', (d) => Math.min(d.r / 2.5, 11))
      .attr('font-weight', '500')
      .attr('pointer-events', 'none')
      .text((d) => {
        const name = d.data.name;
        return name.length > 10 ? name.substring(0, 8) + '...' : name;
      });

  }, [data, width, height]);

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        className="w-full h-auto"
        style={{ maxHeight: height }}
      />

      {/* Tooltip */}
      {hoveredSkill && (
        <div className="absolute top-4 left-4 bg-card px-3 py-2 rounded-md shadow-md border">
          <p className="text-sm font-medium">{hoveredSkill}</p>
        </div>
      )}
    </div>
  );
}
