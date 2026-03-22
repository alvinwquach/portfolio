/**
 * ArchitecturePlaceholder
 * =======================
 * Shown in the Architecture section when no diagram asset exists yet.
 * Renders a generic web-app node/edge diagram in SVG so the section has
 * meaningful visual weight rather than an empty box or lorem ipsum.
 *
 * The placeholder is intentionally generic — it communicates "layered
 * architecture" without making claims about any specific project. Real
 * project-specific diagrams can replace this once authored in the CMS.
 *
 * Node layout (left → right, two rows):
 *
 *   [Client]  →  [CDN]  →  [Load Balancer]
 *                               ↓
 *            [API Layer]  →  [Cache]  →  [Database]
 */

import { cn } from '@/lib/utils';

interface ArchitecturePlaceholderProps {
  className?: string;
}

/* ─── Node definitions ───────────────────────────────────────────────────── */
const NODE_W  = 90;
const NODE_H  = 34;
const RADIUS  = 6;

interface Node {
  id:    string;
  label: string;
  x:     number;
  y:     number;
  accent?: boolean; // highlight in amber
}

interface Edge {
  from: string;
  to:   string;
}

const NODES: Node[] = [
  { id: 'client', label: 'Client',        x:  20, y:  20 },
  { id: 'cdn',    label: 'CDN',           x: 135, y:  20 },
  { id: 'lb',     label: 'Load Balancer', x: 250, y:  20, accent: true },
  { id: 'api',    label: 'API Layer',     x: 135, y:  90, accent: true },
  { id: 'cache',  label: 'Cache',         x: 250, y:  90 },
  { id: 'db',     label: 'Database',      x: 365, y:  90 },
];

const EDGES: Edge[] = [
  { from: 'client', to: 'cdn'   },
  { from: 'cdn',    to: 'lb'    },
  { from: 'lb',     to: 'api'   },
  { from: 'api',    to: 'cache' },
  { from: 'cache',  to: 'db'    },
];

function nodeCenter(n: Node) {
  return { cx: n.x + NODE_W / 2, cy: n.y + NODE_H / 2 };
}

export function ArchitecturePlaceholder({ className }: ArchitecturePlaceholderProps) {
  const svgW = Math.max(...NODES.map((n) => n.x + NODE_W)) + 20;
  const svgH = Math.max(...NODES.map((n) => n.y + NODE_H)) + 20;

  return (
    <div
      className={cn(
        'rounded-xl border bg-card/30 p-6 flex flex-col items-center gap-4',
        className,
      )}
      role="img"
      aria-label="Architecture diagram placeholder"
    >
      <p className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest self-start">
        Architecture overview
      </p>

      {/* SVG diagram ──────────────────────────────────────────────────────── */}
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width="100%"
        style={{ maxWidth: svgW, opacity: 0.6 }}
        aria-hidden="true"
      >
        {/* Edges */}
        {EDGES.map(({ from, to }) => {
          const a = NODES.find((n) => n.id === from)!;
          const b = NODES.find((n) => n.id === to)!;
          const { cx: x1, cy: y1 } = nodeCenter(a);
          const { cx: x2, cy: y2 } = nodeCenter(b);
          return (
            <line
              key={`${from}-${to}`}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              stroke="hsl(var(--border))"
              strokeWidth={1.5}
              markerEnd="url(#arrow)"
            />
          );
        })}

        {/* Arrow marker */}
        <defs>
          <marker
            id="arrow"
            markerWidth="6" markerHeight="6"
            refX="5" refY="3"
            orient="auto"
          >
            <path
              d="M0,0 L0,6 L6,3 z"
              fill="hsl(var(--border))"
            />
          </marker>
        </defs>

        {/* Nodes */}
        {NODES.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x} y={node.y}
              width={NODE_W} height={NODE_H}
              rx={RADIUS}
              fill={node.accent ? 'hsl(var(--amber) / 0.08)' : 'hsl(var(--card))'}
              stroke={node.accent ? 'hsl(var(--amber) / 0.4)' : 'hsl(var(--border))'}
              strokeWidth={1}
            />
            <text
              x={node.x + NODE_W / 2}
              y={node.y + NODE_H / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="hsl(var(--foreground))"
              fontFamily="var(--font-dm-sans, sans-serif)"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      <p className="text-xs text-muted-foreground/40 text-center">
        Detailed architecture diagram coming soon
      </p>
    </div>
  );
}
