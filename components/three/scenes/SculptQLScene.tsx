/**
 * SculptQLScene Component
 * =======================
 * 3D visualization for SculptQL project featuring a GraphQL schema
 * as a 3D node graph with query path highlighting.
 */

'use client';

import * as React from 'react';
import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

// GraphQL pink/magenta
const GRAPHQL_PINK = new THREE.Color(0xe535ab);
// Node colors by type
const TYPE_COLORS = {
  query: new THREE.Color(0x00d4ff),    // Cyan for queries
  type: new THREE.Color(0x7c3aed),     // Purple for types
  mutation: new THREE.Color(0xf59e0b), // Amber for mutations
  field: new THREE.Color(0x10b981),    // Emerald for fields
};

interface SculptQLSceneProps {
  scrollProgress?: number;
  isVisible?: boolean;
}

interface NodeData {
  id: string;
  label: string;
  type: keyof typeof TYPE_COLORS;
  position: [number, number, number];
}

interface EdgeData {
  from: string;
  to: string;
}

/**
 * Schema node sphere
 */
function SchemaNode({
  position,
  label,
  type,
  isHighlighted = false,
}: {
  position: [number, number, number];
  label: string;
  type: keyof typeof TYPE_COLORS;
  isHighlighted?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = TYPE_COLORS[type];

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    // Gentle bobbing
    meshRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.05;

    // Pulse when highlighted
    if (isHighlighted) {
      const scale = 1 + Math.sin(clock.elapsedTime * 4) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={position}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isHighlighted ? 0.5 : 0.2}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
        {/* Label */}
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

/**
 * Connection line between nodes
 */
function ConnectionLine({
  start,
  end,
  isActive = false,
  progress = 0,
}: {
  start: [number, number, number];
  end: [number, number, number];
  isActive?: boolean;
  progress?: number;
}) {
  const lineRef = useRef<THREE.Line>(null);

  // Create curved path between points
  const curve = useMemo(() => {
    const midPoint = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 0.3,
      (start[2] + end[2]) / 2,
    ];
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(midPoint[0], midPoint[1], midPoint[2]),
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(20), [curve]);

  return (
    <Line
      points={points}
      color={isActive ? '#00d4ff' : '#4a4a6a'}
      lineWidth={isActive ? 2 : 1}
      transparent
      opacity={isActive ? 0.8 : 0.3}
    />
  );
}

/**
 * Animated query pulse traveling along connection
 */
function QueryPulse({
  start,
  end,
  delay = 0,
}: {
  start: [number, number, number];
  end: [number, number, number];
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = ((clock.elapsedTime + delay) % 2) / 2;
    const x = start[0] + (end[0] - start[0]) * t;
    const y = start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.3;
    const z = start[2] + (end[2] - start[2]) * t;

    meshRef.current.position.set(x, y, z);
    meshRef.current.scale.setScalar(0.5 + Math.sin(t * Math.PI) * 0.5);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
    </mesh>
  );
}

/**
 * Scene lighting
 */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 2, 0]} intensity={0.5} color={GRAPHQL_PINK} />
    </>
  );
}

/**
 * Main SculptQLScene component
 */
export function SculptQLScene({ scrollProgress = 0, isVisible = true }: SculptQLSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Define schema nodes
  const nodes: NodeData[] = useMemo(() => [
    { id: 'query', label: 'Query', type: 'query', position: [0, 1.2, 0] },
    { id: 'user', label: 'User', type: 'type', position: [-1.2, 0.4, 0.5] },
    { id: 'post', label: 'Post', type: 'type', position: [1.2, 0.4, 0.5] },
    { id: 'mutation', label: 'Mutation', type: 'mutation', position: [0, 0, -0.8] },
    { id: 'name', label: 'name', type: 'field', position: [-1.8, -0.4, 0] },
    { id: 'email', label: 'email', type: 'field', position: [-0.8, -0.4, 0.8] },
    { id: 'title', label: 'title', type: 'field', position: [0.8, -0.4, 0.8] },
    { id: 'content', label: 'content', type: 'field', position: [1.8, -0.4, 0] },
  ], []);

  // Define edges
  const edges: EdgeData[] = useMemo(() => [
    { from: 'query', to: 'user' },
    { from: 'query', to: 'post' },
    { from: 'user', to: 'name' },
    { from: 'user', to: 'email' },
    { from: 'post', to: 'title' },
    { from: 'post', to: 'content' },
    { from: 'mutation', to: 'user' },
    { from: 'mutation', to: 'post' },
  ], []);

  // Get node position by id
  const getNodePosition = (id: string): [number, number, number] => {
    const node = nodes.find(n => n.id === id);
    return node?.position || [0, 0, 0];
  };

  // Rotate entire graph slowly
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.3;
  });

  if (!isVisible) return null;

  return (
    <>
      <Lighting />
      <group ref={groupRef} position={[0, -0.2, 0]}>
        {/* Render nodes */}
        {nodes.map((node) => (
          <SchemaNode
            key={node.id}
            position={node.position}
            label={node.label}
            type={node.type}
            isHighlighted={node.type === 'query'}
          />
        ))}

        {/* Render connections */}
        {edges.map((edge, i) => (
          <ConnectionLine
            key={`${edge.from}-${edge.to}`}
            start={getNodePosition(edge.from)}
            end={getNodePosition(edge.to)}
            isActive={edge.from === 'query'}
          />
        ))}

        {/* Query pulses along active paths */}
        <QueryPulse
          start={getNodePosition('query')}
          end={getNodePosition('user')}
          delay={0}
        />
        <QueryPulse
          start={getNodePosition('query')}
          end={getNodePosition('post')}
          delay={1}
        />
        <QueryPulse
          start={getNodePosition('user')}
          end={getNodePosition('name')}
          delay={0.5}
        />
      </group>
    </>
  );
}
