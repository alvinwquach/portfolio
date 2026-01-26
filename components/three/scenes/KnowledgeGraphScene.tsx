/**
 * KnowledgeGraphScene Component
 * =============================
 * 3D force-directed knowledge graph visualization
 * Nodes colored by type (build=blue, bug=red, decision=gold)
 */

'use client';

import * as React from 'react';
import { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

// Node type colors
const NODE_COLORS: Record<string, THREE.Color> = {
  build: new THREE.Color(0x1d428a),     // Warriors Blue
  bug: new THREE.Color(0xaa0000),        // 49ers Red
  decision: new THREE.Color(0xffc72c),   // Warriors Gold
  concept: new THREE.Color(0x10b981),    // Emerald
  tutorial: new THREE.Color(0x8b5cf6),   // Purple
  chart: new THREE.Color(0x06b6d4),      // Cyan
};

interface GraphNode {
  id: string;
  title: string;
  nodeType: string;
  depthLevel?: number;
  importance?: number;
  slug: string;
}

interface GraphEdge {
  source: string;
  target: string;
}

interface KnowledgeGraphSceneProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick?: (node: GraphNode) => void;
  onNodeHover?: (node: GraphNode | null) => void;
}

/**
 * Individual node sphere
 */
function GraphNodeMesh({
  node,
  position,
  onClick,
  onHover,
}: {
  node: GraphNode;
  position: [number, number, number];
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = NODE_COLORS[node.nodeType] || new THREE.Color(0x8f8070);
  const size = 0.1 + (node.importance || 3) * 0.03;

  useFrame(() => {
    if (!meshRef.current) return;

    // Pulse effect when hovered
    if (hovered) {
      const scale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
      meshRef.current.scale.setScalar(scale);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover?.(true);
    document.body.style.cursor = 'pointer';
  }, [onHover]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    onHover?.(false);
    document.body.style.cursor = 'auto';
  }, [onHover]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick?.();
  }, [onClick]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Node label on hover */}
      {hovered && (
        <Text
          position={[0, size + 0.15, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.01}
          outlineColor="black"
        >
          {node.title}
        </Text>
      )}
    </group>
  );
}

/**
 * Connection line between nodes
 */
function ConnectionLine({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  return (
    <Line
      points={[start, end]}
      color="#736658"
      lineWidth={1}
      transparent
      opacity={0.3}
    />
  );
}

/**
 * Main KnowledgeGraphScene component
 */
export function KnowledgeGraphScene({
  nodes,
  edges,
  onNodeClick,
  onNodeHover,
}: KnowledgeGraphSceneProps) {
  // Calculate node positions using spherical distribution
  const nodePositions = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};

    nodes.forEach((node, index) => {
      // Use fibonacci sphere for even distribution
      const phi = Math.acos(1 - 2 * (index + 0.5) / nodes.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);

      // Adjust radius based on depth level
      const baseRadius = 2;
      const depthOffset = (node.depthLevel || 1) * 0.3;
      const radius = baseRadius + depthOffset;

      positions[node.id] = [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      ];
    });

    return positions;
  }, [nodes]);

  // Group reference for rotation
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Slow auto-rotation
    groupRef.current.rotation.y = clock.elapsedTime * 0.05;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Graph group */}
      <group ref={groupRef}>
        {/* Connection lines */}
        {edges.map((edge, index) => {
          const startPos = nodePositions[edge.source];
          const endPos = nodePositions[edge.target];
          if (!startPos || !endPos) return null;

          return (
            <ConnectionLine
              key={`edge-${index}`}
              start={startPos}
              end={endPos}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const position = nodePositions[node.id];
          if (!position) return null;

          return (
            <GraphNodeMesh
              key={node.id}
              node={node}
              position={position}
              onClick={() => onNodeClick?.(node)}
              onHover={(hovered) => onNodeHover?.(hovered ? node : null)}
            />
          );
        })}
      </group>
    </>
  );
}
