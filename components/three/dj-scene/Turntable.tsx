/**
 * Turntable Component
 * ===================
 * A 3D turntable with vinyl record and tonearm.
 */

'use client';

import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VinylRecord } from './VinylRecord';

interface TonearmProps {
  isPlaying?: boolean;
}

function Tonearm({ isPlaying = false }: TonearmProps) {
  const armRef = useRef<THREE.Group>(null);
  // When playing: arm swings over the record (-0.15 rad)
  // When stopped: arm rests to the side (-0.8 rad)
  const targetRotation = isPlaying ? -0.15 : -0.8;

  useFrame(() => {
    if (armRef.current) {
      armRef.current.rotation.y += (targetRotation - armRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group>
      {/* Pivot base */}
      <mesh position={[0.28, 0.05, -0.18]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 24]} />
        <meshStandardMaterial color="#333" metalness={0.8} />
      </mesh>

      {/* Arm assembly */}
      <group ref={armRef} position={[0.28, 0.08, -0.18]} rotation={[0, -0.8, 0]}>
        {/* Arm */}
        <mesh position={[-0.13, 0, 0]}>
          <boxGeometry args={[0.26, 0.008, 0.008]} />
          <meshStandardMaterial color="#444" metalness={0.9} />
        </mesh>
        {/* Headshell */}
        <mesh position={[-0.27, -0.005, 0]}>
          <boxGeometry args={[0.04, 0.012, 0.018]} />
          <meshStandardMaterial color="#333" metalness={0.7} />
        </mesh>
        {/* Counterweight */}
        <mesh position={[0.06, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.025, 16]} />
          <meshStandardMaterial color="#555" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

interface TurntableProps {
  position: [number, number, number];
  color?: string;
  isPlaying?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function Turntable({
  position,
  color = '#00d4ff',
  isPlaying = false,
  isActive = false,
  onClick,
}: TurntableProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* Base */}
      <mesh castShadow>
        <boxGeometry args={[0.85, 0.06, 0.65]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Top plate */}
      <mesh position={[0, 0.031, 0]}>
        <boxGeometry args={[0.83, 0.002, 0.63]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>

      {/* Platter - clickable */}
      <mesh
        position={[-0.08, 0.045, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <circleGeometry args={[0.26, 48]} />
        <meshStandardMaterial
          color={hovered ? '#2a2a2a' : '#1a1a1a'}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* Platter ring - glows when active */}
      <mesh position={[-0.08, 0.046, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.24, 0.26, 48]} />
        <meshStandardMaterial
          color={isActive ? color : '#333'}
          metalness={0.7}
          emissive={isActive ? color : '#000'}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </mesh>

      {/* Vinyl Record */}
      <group position={[-0.08, 0.05, 0]}>
        <VinylRecord color={color} isPlaying={isPlaying && isActive} />
      </group>

      {/* Tonearm */}
      <Tonearm isPlaying={isPlaying && isActive} />

      {/* Pitch fader */}
      <group position={[0.32, 0.04, 0.1]}>
        <mesh>
          <boxGeometry args={[0.03, 0.01, 0.18]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0, 0.012, 0.02]}>
          <boxGeometry args={[0.04, 0.015, 0.03]} />
          <meshStandardMaterial color="#555" metalness={0.7} />
        </mesh>
      </group>

      {/* Play button */}
      <mesh
        position={[0.25, 0.04, 0.24]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.022, 0.022, 0.015, 24]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={isPlaying && isActive ? 1.2 : 0.5}
        />
      </mesh>

      {/* Cue button */}
      <mesh position={[0.32, 0.04, 0.24]}>
        <cylinderGeometry args={[0.022, 0.022, 0.015, 24]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}
