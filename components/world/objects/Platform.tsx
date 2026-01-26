/**
 * Platform - Circular Base for Studio Diorama
 * ============================================
 * A dark charcoal circular platform with a subtle glowing edge ring.
 * Forms the foundation of the miniature studio diorama.
 */

'use client';

import * as React from 'react';
import * as THREE from 'three';

interface PlatformProps {
  position?: [number, number, number];
  radius?: number;
  height?: number;
}

export function Platform({
  position = [0, 0, 0],
  radius = 4,
  height = 0.15,
}: PlatformProps) {
  return (
    <group position={position}>
      {/* Main platform surface */}
      <mesh position={[0, height / 2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[radius, radius, height, 64]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Glowing edge ring */}
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius - 0.02, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Inner subtle ring pattern */}
      <mesh
        position={[0, height + 0.001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[radius * 0.3, radius * 0.32, 64]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Second inner ring */}
      <mesh
        position={[0, height + 0.001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[radius * 0.6, radius * 0.62, 64]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
