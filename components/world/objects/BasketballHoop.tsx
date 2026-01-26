/**
 * BasketballHoop - Mini Basketball Setup for Studio Diorama
 * ==========================================================
 * A miniature basketball hoop with backboard, rim, and basketball.
 * Represents sports analytics background (Hoop Almanac).
 */

'use client';

import * as React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BasketballHoopProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/**
 * Basketball with subtle animation
 */
function Basketball({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Subtle idle rotation
    meshRef.current.rotation.y = clock.elapsedTime * 0.15;
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[0.06, 24, 24]} />
      <meshStandardMaterial
        color="#ff6b35"
        roughness={0.85}
        metalness={0.05}
      />
    </mesh>
  );
}

export function BasketballHoop({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: BasketballHoopProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Pole */}
      <mesh position={[0, 0.4, -0.08]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.8, 12]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Base weight */}
      <mesh position={[0, 0.03, -0.08]} castShadow>
        <boxGeometry args={[0.2, 0.06, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Backboard */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.45, 0.3, 0.015]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Backboard blue border */}
      <mesh position={[0, 0.75, 0.01]}>
        <boxGeometry args={[0.47, 0.32, 0.008]} />
        <meshStandardMaterial color="#1d428a" roughness={0.5} />
      </mesh>

      {/* Backboard square target */}
      <mesh position={[0, 0.72, 0.012]}>
        <planeGeometry args={[0.18, 0.12]} />
        <meshStandardMaterial
          color="#1d428a"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Target outline - top */}
      <mesh position={[0, 0.78, 0.012]}>
        <planeGeometry args={[0.18, 0.01]} />
        <meshStandardMaterial color="#1d428a" side={THREE.DoubleSide} />
      </mesh>
      {/* Target outline - bottom */}
      <mesh position={[0, 0.66, 0.012]}>
        <planeGeometry args={[0.18, 0.01]} />
        <meshStandardMaterial color="#1d428a" side={THREE.DoubleSide} />
      </mesh>
      {/* Target outline - left */}
      <mesh position={[-0.085, 0.72, 0.012]}>
        <planeGeometry args={[0.01, 0.12]} />
        <meshStandardMaterial color="#1d428a" side={THREE.DoubleSide} />
      </mesh>
      {/* Target outline - right */}
      <mesh position={[0.085, 0.72, 0.012]}>
        <planeGeometry args={[0.01, 0.12]} />
        <meshStandardMaterial color="#1d428a" side={THREE.DoubleSide} />
      </mesh>

      {/* Rim */}
      <mesh position={[0, 0.62, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.075, 0.008, 12, 24]} />
        <meshStandardMaterial color="#ff6b35" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rim connector bracket */}
      <mesh position={[0, 0.62, 0.05]}>
        <boxGeometry args={[0.04, 0.02, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Net (simplified - just a few rings) */}
      {[0.08, 0.12, 0.16].map((yOffset, i) => (
        <mesh
          key={i}
          position={[0, 0.62 - yOffset, 0.12]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.075 - i * 0.015, 0.003, 8, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Basketball on the ground */}
      <Basketball position={[0.15, 0.06, 0.2]} />

      {/* Mini court marking - painted circle on platform */}
      <mesh position={[0, 0.002, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.27, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
