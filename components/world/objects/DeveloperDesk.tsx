/**
 * DeveloperDesk - Mini Coding Setup for Studio Diorama
 * =====================================================
 * A miniature developer desk with laptop, monitor, keyboard, and coffee mug.
 * Represents the coding/developer identity.
 */

'use client';

import * as React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DeveloperDeskProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/**
 * Laptop with glowing screen
 */
function Laptop({ position }: { position: [number, number, number] }) {
  const screenRef = useRef<THREE.Mesh>(null);

  // Subtle screen flicker effect
  useFrame(({ clock }) => {
    if (!screenRef.current) return;
    const material = screenRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.05;
  });

  return (
    <group position={position}>
      {/* Base/keyboard part */}
      <mesh castShadow>
        <boxGeometry args={[0.18, 0.008, 0.12]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Keyboard keys (simplified texture) */}
      <mesh position={[0, 0.005, 0.01]}>
        <planeGeometry args={[0.15, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Screen part - angled up */}
      <group position={[0, 0.06, -0.055]} rotation={[-0.3, 0, 0]}>
        {/* Screen frame */}
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.12, 0.005]} />
          <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Screen display */}
        <mesh ref={screenRef} position={[0, 0, 0.003]}>
          <planeGeometry args={[0.16, 0.1]} />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#60a5fa"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Code lines on screen (decorative) */}
        {[0.03, 0.015, 0, -0.015, -0.03].map((y, i) => (
          <mesh key={i} position={[-0.04 + (i % 2) * 0.02, y, 0.004]}>
            <planeGeometry args={[0.08 - (i % 3) * 0.02, 0.006]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? '#60a5fa' : '#34d399'}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * External monitor
 */
function Monitor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Monitor stand base */}
      <mesh position={[0, 0.01, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.02, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} />
      </mesh>

      {/* Monitor stand neck */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[0.015, 0.1, 0.015]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} />
      </mesh>

      {/* Monitor frame */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.22, 0.14, 0.012]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Monitor screen */}
      <mesh position={[0, 0.16, 0.007]}>
        <planeGeometry args={[0.2, 0.12]} />
        <meshStandardMaterial
          color="#0f0f1a"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Terminal/code display */}
      {[0.04, 0.025, 0.01, -0.005, -0.02, -0.035].map((y, i) => (
        <mesh key={i} position={[-0.06 + (i % 2) * 0.015, 0.16 + y, 0.008]}>
          <planeGeometry args={[0.1 - (i % 3) * 0.025, 0.008]} />
          <meshBasicMaterial
            color={['#10b981', '#60a5fa', '#f59e0b', '#10b981', '#a78bfa', '#60a5fa'][i]}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Coffee mug
 */
function CoffeeMug({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Mug body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.02, 0.018, 0.04, 16]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
      </mesh>

      {/* Handle */}
      <mesh position={[0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.012, 0.004, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
      </mesh>

      {/* Coffee inside */}
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.005, 16]} />
        <meshStandardMaterial color="#3d2314" roughness={0.5} />
      </mesh>
    </group>
  );
}

/**
 * Small desk plant
 */
function DeskPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh castShadow>
        <cylinderGeometry args={[0.025, 0.02, 0.035, 12]} />
        <meshStandardMaterial color="#6b5b4f" roughness={0.9} />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.005, 12]} />
        <meshStandardMaterial color="#3d2817" roughness={1} />
      </mesh>

      {/* Plant leaves (simple spheres) */}
      {[
        [0, 0.04, 0],
        [0.015, 0.05, 0.01],
        [-0.012, 0.045, -0.008],
        [0.008, 0.055, -0.01],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#22c55e" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function DeveloperDesk({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: DeveloperDeskProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Desk surface */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.025, 0.35]} />
        <meshStandardMaterial color="#2d1f14" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Desk legs */}
      {[
        [-0.27, 0.14, 0.15],
        [0.27, 0.14, 0.15],
        [-0.27, 0.14, -0.15],
        [0.27, 0.14, -0.15],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.025, 0.28, 0.025]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} />
        </mesh>
      ))}

      {/* Desk drawer */}
      <mesh position={[-0.15, 0.22, 0]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.3]} />
        <meshStandardMaterial color="#251a10" roughness={0.8} />
      </mesh>

      {/* Drawer handle */}
      <mesh position={[-0.15, 0.22, 0.16]}>
        <boxGeometry args={[0.06, 0.01, 0.01]} />
        <meshStandardMaterial color="#888888" metalness={0.8} />
      </mesh>

      {/* Chair */}
      <group position={[0, 0, 0.35]}>
        {/* Seat */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.15, 0.02, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Backrest */}
        <mesh position={[0, 0.28, 0.06]} castShadow>
          <boxGeometry args={[0.14, 0.18, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Chair base */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.16, 8]} />
          <meshStandardMaterial color="#333333" metalness={0.7} />
        </mesh>

        {/* Chair wheel base */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 5]} />
          <meshStandardMaterial color="#333333" metalness={0.6} />
        </mesh>
      </group>

      {/* Items on desk */}
      <Laptop position={[0.08, 0.295, 0.05]} />
      <Monitor position={[-0.12, 0.295, -0.1]} />
      <CoffeeMug position={[0.22, 0.31, 0.1]} />
      <DeskPlant position={[0.22, 0.31, -0.1]} />

      {/* Cool blue light from screens */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={0.3}
        color="#60a5fa"
        distance={1.5}
      />
    </group>
  );
}
