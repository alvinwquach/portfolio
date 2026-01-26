/**
 * WorkbenchZone - Dev Tools Workbench (SculptQL)
 * ===============================================
 * A workbench with monitor and floating schema diagrams.
 * Represents: Systems thinking, tradeoffs, tooling mindset.
 */

'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface WorkbenchZoneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  onNavigate?: () => void;
}

/**
 * Desk with monitor
 */
function Desk() {
  return (
    <group>
      {/* Desk surface */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.05, 0.8]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>

      {/* Desk legs */}
      {[[-0.7, 0.375, 0.3], [0.7, 0.375, 0.3], [-0.7, 0.375, -0.3], [0.7, 0.375, -0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.05, 0.75, 0.05]} />
          <meshStandardMaterial color="#2a1a0a" />
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0, 1.2, -0.2]}>
        {/* Screen */}
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.55, 0.03]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.1} />
        </mesh>
        {/* Screen content glow */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.85, 0.5]} />
          <meshBasicMaterial color="#0a1628" />
        </mesh>
        {/* Monitor stand */}
        <mesh position={[0, -0.35, 0.1]}>
          <boxGeometry args={[0.1, 0.15, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0, -0.45, 0.1]}>
          <boxGeometry args={[0.3, 0.03, 0.2]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      {/* Keyboard */}
      <mesh position={[0, 0.79, 0.15]} castShadow>
        <boxGeometry args={[0.45, 0.02, 0.15]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  );
}

/**
 * Floating schema card
 */
function SchemaCard({
  position,
  label,
  type,
  delay = 0,
  isActive = false,
}: {
  position: [number, number, number];
  label: string;
  type: 'query' | 'type' | 'field';
  delay?: number;
  isActive?: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const baseY = position[1];

  const colors = {
    query: '#00d4ff',
    type: '#7c3aed',
    field: '#10b981',
  };

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Gentle floating
    meshRef.current.position.y = baseY + Math.sin(clock.elapsedTime * 0.8 + delay) * 0.05;
  });

  return (
    <group ref={meshRef} position={position}>
      <RoundedBox args={[0.5, 0.25, 0.02]} radius={0.02} smoothness={4}>
        <meshStandardMaterial
          color={colors[type]}
          transparent
          opacity={isActive ? 0.9 : 0.6}
          emissive={colors[type]}
          emissiveIntensity={isActive ? 0.3 : 0.1}
        />
      </RoundedBox>
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

/**
 * Connection line between schema cards
 */
function ConnectionLine({
  start,
  end,
  isActive = false,
}: {
  start: [number, number, number];
  end: [number, number, number];
  isActive?: boolean;
}) {
  const points = React.useMemo(() => {
    return [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ];
  }, [start, end]);

  const lineGeometry = React.useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <primitive object={new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: isActive ? '#00d4ff' : '#444444',
        transparent: true,
        opacity: isActive ? 0.8 : 0.3,
      })
    )} />
  );
}

/**
 * Clickable zone overlay for navigation
 */
function ClickableZone({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={[0, 0.5, 0.2]}
      onClick={onClick}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <boxGeometry args={[2, 2.5, 1.5]} />
      <meshBasicMaterial
        color="#7c3aed"
        transparent
        opacity={hovered ? 0.1 : 0}
      />
    </mesh>
  );
}

/**
 * Main Workbench Zone
 */
export function WorkbenchZone({ position = [0, 0, 0], rotation = [0, 0, 0], onNavigate }: WorkbenchZoneProps) {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleZoneClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Clickable overlay for navigation */}
      <ClickableZone onClick={handleZoneClick} />

      {/* Zone label */}
      <Text
        position={[0, 0.1, 1]}
        fontSize={0.1}
        color="#555555"
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        DEV TOOLS
      </Text>

      {/* Desk with monitor */}
      <Desk />

      {/* Floating schema cards */}
      <group position={[0, 1.8, 0.3]}>
        <SchemaCard
          position={[0, 0.4, 0]}
          label="Query"
          type="query"
          delay={0}
          isActive={activeCard === 'query'}
        />
        <SchemaCard
          position={[-0.4, 0, 0]}
          label="User"
          type="type"
          delay={0.5}
          isActive={activeCard === 'user'}
        />
        <SchemaCard
          position={[0.4, 0, 0]}
          label="Post"
          type="type"
          delay={1}
          isActive={activeCard === 'post'}
        />
        <SchemaCard
          position={[-0.2, -0.35, 0]}
          label="name"
          type="field"
          delay={1.5}
          isActive={activeCard === 'name'}
        />
        <SchemaCard
          position={[0.2, -0.35, 0]}
          label="title"
          type="field"
          delay={2}
          isActive={activeCard === 'title'}
        />

        {/* Connection lines */}
        <ConnectionLine start={[0, 0.25, 0]} end={[-0.4, 0.12, 0]} isActive />
        <ConnectionLine start={[0, 0.25, 0]} end={[0.4, 0.12, 0]} isActive />
        <ConnectionLine start={[-0.4, -0.12, 0]} end={[-0.2, -0.22, 0]} />
        <ConnectionLine start={[0.4, -0.12, 0]} end={[0.2, -0.22, 0]} />
      </group>

      {/* Project label */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.08}
        color="#888888"
        anchorX="center"
      >
        SculptQL
      </Text>
      <Text
        position={[0, 2.35, 0]}
        fontSize={0.05}
        color="#555555"
        anchorX="center"
      >
        GraphQL schema visualization
      </Text>

      {/* "View Project" hint */}
      <Text
        position={[0, 0.1, 1.2]}
        fontSize={0.06}
        color="#7c3aed"
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        Click to view project →
      </Text>
    </group>
  );
}
