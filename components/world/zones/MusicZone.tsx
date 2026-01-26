/**
 * MusicZone - DJ Corner (Identity)
 * =================================
 * A turntable on a stand with headphones and vinyl crate.
 * Represents: Rhythm, flow, taste, craft.
 */

'use client';

import * as React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface MusicZoneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Vinyl record that spins
 */
function VinylRecord({ position, spinning = true }: { position: [number, number, number]; spinning?: boolean }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !spinning) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.5;
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Main record */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.005, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Label */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.002, 32]} />
        <meshStandardMaterial color="#cc3333" roughness={0.5} />
      </mesh>

      {/* Grooves (subtle rings) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[0.06, 0.14, 64, 3]} />
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
 * Turntable with platter
 */
function Turntable() {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.4]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>

      {/* Platter */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
        <meshStandardMaterial color="#333333" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Spinning record */}
      <VinylRecord position={[0, 0.07, 0]} spinning />

      {/* Tonearm base */}
      <mesh position={[0.18, 0.06, 0.12]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.7} />
      </mesh>

      {/* Tonearm */}
      <group position={[0.18, 0.09, 0.12]} rotation={[0, -0.3, 0]}>
        <mesh position={[-0.08, 0.01, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.18, 0.01, 0.01]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.8} />
        </mesh>
        {/* Headshell */}
        <mesh position={[-0.17, 0.01, 0]}>
          <boxGeometry args={[0.03, 0.015, 0.02]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>

      {/* Pitch slider area */}
      <mesh position={[0.2, 0.045, -0.1]}>
        <boxGeometry args={[0.03, 0.01, 0.12]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
}

/**
 * Headphones draped over stand
 */
function Headphones({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Headband */}
      <mesh rotation={[0, 0, Math.PI / 6]}>
        <torusGeometry args={[0.08, 0.01, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#222222" roughness={0.4} />
      </mesh>

      {/* Left ear cup */}
      <mesh position={[-0.07, -0.02, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.025, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Right ear cup */}
      <mesh position={[0.07, -0.06, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.025, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Ear cushions */}
      <mesh position={[-0.07, -0.02, 0.015]} rotation={[0, 0, 0.2]}>
        <torusGeometry args={[0.03, 0.012, 8, 16]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
      <mesh position={[0.07, -0.06, 0.015]} rotation={[0, 0, -0.2]}>
        <torusGeometry args={[0.03, 0.012, 8, 16]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * Vinyl crate with records
 */
function VinylCrate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Crate */}
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.25, 0.35]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>

      {/* Records inside (visible edges) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[-0.1 + i * 0.04, 0.05, 0]}>
          <boxGeometry args={[0.005, 0.2, 0.3]} />
          <meshStandardMaterial
            color={['#111111', '#1a1a1a', '#0a0a0a', '#151515', '#111111'][i]}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * DJ Stand
 */
function DJStand() {
  return (
    <group>
      {/* Stand top */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.03, 0.45]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Stand legs */}
      {[[-0.25, 0.45, 0.18], [0.25, 0.45, 0.18], [-0.25, 0.45, -0.18], [0.25, 0.45, -0.18]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.03, 0.9, 0.03]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Warm ambient light for the music corner
 */
function WarmLight() {
  return (
    <pointLight
      position={[0, 1.5, 0]}
      intensity={0.5}
      color="#ffaa55"
      distance={4}
    />
  );
}

/**
 * Main Music Zone
 */
export function MusicZone({ position = [0, 0, 0], rotation = [0, 0, 0] }: MusicZoneProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Zone label */}
      <Text
        position={[0, 0.1, 0.8]}
        fontSize={0.1}
        color="#555555"
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        RHYTHM
      </Text>

      {/* Warm lighting */}
      <WarmLight />

      {/* DJ Stand */}
      <DJStand />

      {/* Turntable on stand */}
      <group position={[0, 0.93, 0]}>
        <Turntable />
      </group>

      {/* Headphones */}
      <Headphones position={[0.35, 1.1, 0]} />

      {/* Vinyl crate */}
      <VinylCrate position={[-0.5, 0.125, 0]} />

      {/* Identity text */}
      <Text
        position={[0, 1.6, 0]}
        fontSize={0.06}
        color="#888888"
        anchorX="center"
      >
        Former DJ
      </Text>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.04}
        color="#666666"
        anchorX="center"
      >
        Reading rooms before reading codebases
      </Text>
    </group>
  );
}
