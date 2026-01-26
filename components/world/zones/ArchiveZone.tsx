/**
 * ArchiveZone - Knowledge Archive (Blog/Learning)
 * ================================================
 * Bookshelves with floating knowledge cards.
 * Represents: Continuous learning, documentation, sharing knowledge.
 */

'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface ArchiveZoneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Single book on shelf
 */
function Book({
  position,
  color,
  height = 0.3,
  width = 0.04,
}: {
  position: [number, number, number];
  color: string;
  height?: number;
  width?: number;
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[width, height, 0.2]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

/**
 * Bookshelf with books
 */
function Bookshelf({ position }: { position: [number, number, number] }) {
  const bookColors = [
    '#2d4a3e', '#4a3d2d', '#3d2d4a', '#2d3d4a', '#4a2d3d',
    '#3d4a2d', '#2d4a4a', '#4a4a2d', '#4a2d4a', '#2d2d4a',
  ];

  return (
    <group position={position}>
      {/* Shelf frame */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 2, 0.35]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
      </mesh>

      {/* Shelf dividers */}
      {[0.6, 0, -0.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0.05]}>
          <boxGeometry args={[1.4, 0.02, 0.3]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
      ))}

      {/* Books on each shelf */}
      {[0.75, 0.15, -0.45].map((shelfY, shelfIndex) => (
        <group key={shelfIndex} position={[0, shelfY, 0.05]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Book
              key={i}
              position={[-0.5 + i * 0.12, 0.1, 0]}
              color={bookColors[(shelfIndex * 3 + i) % bookColors.length]}
              height={0.25 + Math.random() * 0.1}
              width={0.03 + Math.random() * 0.02}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

/**
 * Floating knowledge card
 */
function KnowledgeCard({
  position,
  label,
  category,
  delay = 0,
}: {
  position: [number, number, number];
  label: string;
  category: 'build' | 'bug' | 'decision' | 'concept';
  delay?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const baseY = position[1];
  const [hovered, setHovered] = useState(false);

  const colors = {
    build: '#10b981',
    bug: '#ef4444',
    decision: '#f59e0b',
    concept: '#8b5cf6',
  };

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = baseY + Math.sin(clock.elapsedTime * 0.6 + delay) * 0.08;
    meshRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3 + delay) * 0.1;
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox args={[0.6, 0.35, 0.02]} radius={0.02} smoothness={4}>
        <meshStandardMaterial
          color={colors[category]}
          transparent
          opacity={hovered ? 0.95 : 0.7}
          emissive={colors[category]}
          emissiveIntensity={hovered ? 0.4 : 0.15}
        />
      </RoundedBox>

      {/* Category badge */}
      <mesh position={[-0.2, 0.12, 0.015]}>
        <planeGeometry args={[0.15, 0.06]} />
        <meshBasicMaterial color={colors[category]} />
      </mesh>
      <Text
        position={[-0.2, 0.12, 0.02]}
        fontSize={0.03}
        color="#ffffff"
        anchorX="center"
      >
        {category.toUpperCase()}
      </Text>

      {/* Label */}
      <Text
        position={[0, -0.02, 0.015]}
        fontSize={0.045}
        color="#ffffff"
        anchorX="center"
        maxWidth={0.5}
      >
        {label}
      </Text>
    </group>
  );
}

/**
 * Reading lamp
 */
function ReadingLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.02, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.6} />
      </mesh>

      {/* Arm */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.7} />
      </mesh>

      {/* Lamp head */}
      <mesh position={[0, 0.4, 0.05]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.08, 0.12, 16, 1, true]} />
        <meshStandardMaterial color="#222222" side={THREE.DoubleSide} />
      </mesh>

      {/* Light source */}
      <pointLight
        position={[0, 0.35, 0.1]}
        intensity={0.6}
        color="#fff5e0"
        distance={3}
      />
    </group>
  );
}

/**
 * Small reading table
 */
function ReadingTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Table top */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.03, 0.4]} />
        <meshStandardMaterial color="#3d2817" roughness={0.8} />
      </mesh>

      {/* Legs */}
      {[[-0.25, 0.25, 0.15], [0.25, 0.25, 0.15], [-0.25, 0.25, -0.15], [0.25, 0.25, -0.15]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.03, 0.5, 0.03]} />
          <meshStandardMaterial color="#2a1a0a" />
        </mesh>
      ))}

      {/* Open book on table */}
      <mesh position={[0, 0.53, 0]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <boxGeometry args={[0.25, 0.18, 0.02]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.9} />
      </mesh>

      {/* Reading lamp */}
      <ReadingLamp position={[0.2, 0.52, -0.1]} />
    </group>
  );
}

/**
 * Main Archive Zone
 */
export function ArchiveZone({ position = [0, 0, 0], rotation = [0, 0, 0] }: ArchiveZoneProps) {
  const knowledgeCards = [
    { label: 'Real-Time Draft', category: 'build' as const, position: [-0.8, 2.2, 0.8] as [number, number, number] },
    { label: 'N+1 Query Fix', category: 'bug' as const, position: [0, 2.4, 0.6] as [number, number, number] },
    { label: 'GraphQL vs REST', category: 'decision' as const, position: [0.8, 2.1, 0.9] as [number, number, number] },
    { label: 'Server State', category: 'concept' as const, position: [-0.4, 2.6, 0.4] as [number, number, number] },
  ];

  return (
    <group position={position} rotation={rotation}>
      {/* Zone label */}
      <Text
        position={[0, 0.1, 1.5]}
        fontSize={0.1}
        color="#555555"
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        ARCHIVE
      </Text>

      {/* Bookshelves */}
      <Bookshelf position={[-1.2, 1, 0]} />
      <Bookshelf position={[0, 1, 0]} />
      <Bookshelf position={[1.2, 1, 0]} />

      {/* Reading table */}
      <ReadingTable position={[0, 0, 1]} />

      {/* Floating knowledge cards */}
      {knowledgeCards.map((card, i) => (
        <KnowledgeCard
          key={card.label}
          position={card.position}
          label={card.label}
          category={card.category}
          delay={i * 0.8}
        />
      ))}

      {/* Archive description */}
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.08}
        color="#888888"
        anchorX="center"
      >
        Knowledge Base
      </Text>
      <Text
        position={[0, 2.65, 0]}
        fontSize={0.05}
        color="#555555"
        anchorX="center"
      >
        Build logs, bug fixes, and lessons learned
      </Text>
    </group>
  );
}
