/**
 * Turntable - Mini DJ Setup for Studio Diorama
 * =============================================
 * A miniature turntable with spinning vinyl on a stand.
 * Represents the DJ identity/background.
 */

'use client';

import * as React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TurntableProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/**
 * Spinning vinyl record
 */
function VinylRecord({ spinning = true }: { spinning?: boolean }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !spinning) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.8;
  });

  return (
    <group ref={meshRef}>
      {/* Main record */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.004, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Red label */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.002, 32]} />
        <meshStandardMaterial color="#ef4444" roughness={0.5} />
      </mesh>

      {/* Grooves (subtle rings) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <ringGeometry args={[0.05, 0.11, 64, 3]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.2}
          metalness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * Headphones
 */
function Headphones({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0.2, 0.3, 0.1]}>
      {/* Headband */}
      <mesh>
        <torusGeometry args={[0.06, 0.008, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#222222" roughness={0.4} />
      </mesh>

      {/* Left ear cup */}
      <mesh position={[-0.055, -0.015, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Right ear cup */}
      <mesh position={[0.055, -0.015, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

export function Turntable({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: TurntableProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* DJ Stand */}
      <group>
        {/* Stand top */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.025, 0.35]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Stand legs */}
        {[
          [-0.18, 0.17, 0.14],
          [0.18, 0.17, 0.14],
          [-0.18, 0.17, -0.14],
          [0.18, 0.17, -0.14],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <boxGeometry args={[0.025, 0.34, 0.025]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        ))}
      </group>

      {/* Turntable unit on stand */}
      <group position={[0, 0.365, 0]}>
        {/* Base */}
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.06, 0.28]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
        </mesh>

        {/* Platter */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.015, 32]} />
          <meshStandardMaterial color="#333333" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Spinning record */}
        <group position={[0, 0.055, 0]}>
          <VinylRecord spinning />
        </group>

        {/* Tonearm base */}
        <mesh position={[0.14, 0.045, 0.09]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.03, 16]} />
          <meshStandardMaterial color="#888888" metalness={0.7} />
        </mesh>

        {/* Tonearm */}
        <group position={[0.14, 0.065, 0.09]} rotation={[0, -0.4, 0]}>
          <mesh position={[-0.06, 0.008, 0]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[0.14, 0.008, 0.008]} />
            <meshStandardMaterial color="#aaaaaa" metalness={0.8} />
          </mesh>
          {/* Headshell */}
          <mesh position={[-0.13, 0.008, 0]}>
            <boxGeometry args={[0.025, 0.012, 0.015]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
        </group>
      </group>

      {/* Headphones draped on side */}
      <Headphones position={[0.25, 0.42, 0]} />

      {/* Warm point light above */}
      <pointLight
        position={[0, 0.8, 0]}
        intensity={0.4}
        color="#ffaa55"
        distance={2}
      />
    </group>
  );
}
