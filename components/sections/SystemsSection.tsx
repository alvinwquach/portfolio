/**
 * Systems Section
 * ===============
 * Visual: Node graphs that emerge on scroll - revealed like a diagram being drawn.
 * Not animated like a simulation - just emergence.
 *
 * Feeling: Everything touches everything else, but it's organized.
 * Complexity made legible.
 */

'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/hooks';

interface SystemsSectionProps {
  className?: string;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
}

/**
 * Simple node graph visualization using SVG
 */
function NodeGraph({ isVisible, progress }: { isVisible: boolean; progress: number }) {
  const nodes: Node[] = [
    { id: 'query', label: 'Query', x: 50, y: 30 },
    { id: 'user', label: 'User', x: 25, y: 60 },
    { id: 'post', label: 'Post', x: 75, y: 60 },
    { id: 'resolver', label: 'Resolver', x: 50, y: 90 },
  ];

  const edges: Edge[] = [
    { from: 'query', to: 'user' },
    { from: 'query', to: 'post' },
    { from: 'user', to: 'resolver' },
    { from: 'post', to: 'resolver' },
  ];

  const getNodePos = (id: string) => {
    const node = nodes.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 aspect-square opacity-30">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Edges - trace in based on progress */}
        {edges.map((edge, i) => {
          const from = getNodePos(edge.from);
          const to = getNodePos(edge.to);
          const edgeProgress = Math.max(0, Math.min(1, (progress - i * 0.15) * 2));

          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={from.x + (to.x - from.x) * edgeProgress}
              y2={from.y + (to.y - from.y) * edgeProgress}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-foreground/30 transition-all duration-500"
              style={{
                opacity: isVisible ? edgeProgress : 0,
              }}
            />
          );
        })}

        {/* Nodes - appear with opacity */}
        {nodes.map((node, i) => {
          const nodeProgress = Math.max(0, Math.min(1, (progress - i * 0.1) * 2));

          return (
            <g
              key={node.id}
              className="transition-opacity duration-500"
              style={{ opacity: isVisible ? nodeProgress : 0 }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r="4"
                className="fill-foreground/20"
              />
              <text
                x={node.x}
                y={node.y + 10}
                textAnchor="middle"
                className="fill-foreground/40 text-[4px] font-mono"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SystemsSection({ className }: SystemsSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!ref.current || !isInView) return;

    const handleScroll = () => {
      const rect = ref.current!.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1,
        1 - (rect.top / viewportHeight)
      ));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView, ref]);

  return (
    <section
      ref={ref}
      className={cn('relative py-32 overflow-hidden', className)}
    >
      {/* Node graph visualization */}
      <NodeGraph isVisible={isInView} progress={scrollProgress} />

      <div className="container relative z-10">
        <div className="max-w-2xl ml-auto">
          {/* Section label */}
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-6">
            Approach
          </p>

          {/* The story */}
          <h2 className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
            I think in graphs, not lists.
          </h2>

          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              Software is about relationships. Types connect to types.
              Queries flow to resolvers. Everything touches everything else.
            </p>

            <p className="leading-relaxed">
              GraphQL clicked for me because it makes these connections explicit.
              You're not just fetching data—you're navigating a graph of relationships.
              The schema is the map.
            </p>

            <p className="leading-relaxed text-foreground/70">
              I build systems where complexity is legible. Where you can trace
              the path from question to answer without getting lost.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
