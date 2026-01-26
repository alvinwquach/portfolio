/**
 * Vinyl Record Component
 * ======================
 * A 3D vinyl record that spins when playing.
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VinylRecordProps {
  color?: string;
  isPlaying?: boolean;
}

export function VinylRecord({ color = '#00d4ff', isPlaying = false }: VinylRecordProps) {
  const groupRef = useRef<THREE.Group>(null);
  const angleRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isPlaying) {
      // 33 1/3 RPM = 33.33/60 rotations per second = 0.556 RPS
      // In radians: 0.556 * 2 * PI = ~3.49 rad/s
      angleRef.current += delta * 3.49;
    }

    // Apply rotation to the inner group (the record itself)
    groupRef.current.rotation.z = angleRef.current;
  });

  return (
    // Outer group lays flat on the platter
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Inner group that rotates */}
      <group ref={groupRef}>
        {/* Record base - black vinyl with matte finish to prevent reflections */}
        <mesh>
          <circleGeometry args={[0.24, 64]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.95} metalness={0} />
        </mesh>

        {/* Grooves - concentric rings */}
        {[0.22, 0.19, 0.16, 0.13, 0.10].map((radius, i) => (
          <mesh key={i} position={[0, 0, 0.001 + i * 0.0002]}>
            <ringGeometry args={[radius - 0.008, radius, 64]} />
            <meshStandardMaterial color="#151515" roughness={0.9} metalness={0} />
          </mesh>
        ))}

        {/* Label - colored center */}
        <mesh position={[0, 0, 0.002]}>
          <circleGeometry args={[0.06, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isPlaying ? 0.8 : 0.3}
          />
        </mesh>

        {/* Center spindle hole */}
        <mesh position={[0, 0, 0.003]}>
          <ringGeometry args={[0.004, 0.008, 16]} />
          <meshStandardMaterial color="#333" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
