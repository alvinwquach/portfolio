/**
 * Fireplace - Cozy Fireplace with Animated Fire Glow
 * ===================================================
 * A brick fireplace with mantle, animated flickering fire,
 * and warm point light that casts cozy ambient glow.
 */

'use client';

import * as React from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FireplaceProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/**
 * Animated fire flames
 */
function FireFlames() {
  const flameRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Create flame meshes with different sizes
  const flames = useMemo(() => {
    return [
      { x: 0, z: 0, scale: 1, speed: 1.2 },
      { x: -0.08, z: 0.02, scale: 0.7, speed: 1.5 },
      { x: 0.08, z: -0.02, scale: 0.8, speed: 1.3 },
      { x: -0.04, z: -0.03, scale: 0.6, speed: 1.7 },
      { x: 0.05, z: 0.03, scale: 0.65, speed: 1.4 },
    ];
  }, []);

  useFrame(({ clock }) => {
    if (!flameRef.current || !lightRef.current) return;

    const t = clock.elapsedTime;

    // Animate each flame child
    flameRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const flame = flames[i];
        // Flickering scale
        const scaleFlicker = 1 + Math.sin(t * flame.speed * 3) * 0.15;
        child.scale.y = flame.scale * scaleFlicker;
        child.scale.x = flame.scale * (1 + Math.sin(t * flame.speed * 2.5) * 0.1);

        // Slight position wobble
        child.position.x = flame.x + Math.sin(t * flame.speed * 2) * 0.01;
      }
    });

    // Flickering light intensity
    const baseIntensity = 1.2;
    const flicker =
      Math.sin(t * 8) * 0.15 +
      Math.sin(t * 12) * 0.1 +
      Math.sin(t * 5) * 0.1;
    lightRef.current.intensity = baseIntensity + flicker;
  });

  return (
    <group position={[0, 0.15, 0]}>
      {/* Fire glow light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.1, 0.15]}
        color="#ff6622"
        intensity={1.2}
        distance={3}
        decay={2}
        castShadow
      />

      {/* Secondary fill light */}
      <pointLight
        position={[0, 0.05, 0.1]}
        color="#ffaa44"
        intensity={0.5}
        distance={2}
      />

      {/* Flame meshes */}
      <group ref={flameRef}>
        {flames.map((flame, i) => (
          <mesh
            key={i}
            position={[flame.x, 0.08 * flame.scale, flame.z]}
            scale={[flame.scale, flame.scale, flame.scale]}
          >
            <coneGeometry args={[0.06, 0.2, 8]} />
            <meshStandardMaterial
              color="#ff4400"
              emissive="#ff6600"
              emissiveIntensity={1.5}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Glowing embers at base */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`ember-${i}`}
          position={[
            (Math.random() - 0.5) * 0.2,
            0.02,
            (Math.random() - 0.5) * 0.1,
          ]}
        >
          <sphereGeometry args={[0.015 + Math.random() * 0.01, 8, 8]} />
          <meshStandardMaterial
            color="#ff3300"
            emissive="#ff4400"
            emissiveIntensity={0.8 + Math.random() * 0.4}
          />
        </mesh>
      ))}

      {/* Logs */}
      <mesh position={[-0.06, 0.03, 0.02]} rotation={[0, 0.3, Math.PI / 12]}>
        <cylinderGeometry args={[0.025, 0.03, 0.2, 8]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.95} />
      </mesh>
      <mesh position={[0.05, 0.03, -0.02]} rotation={[0, -0.2, -Math.PI / 15]}>
        <cylinderGeometry args={[0.028, 0.032, 0.18, 8]} />
        <meshStandardMaterial color="#1f150a" roughness={0.95} />
      </mesh>
    </group>
  );
}

/**
 * Brick texture pattern (simplified)
 */
function BrickWall({
  position,
  width,
  height,
}: {
  position: [number, number, number];
  width: number;
  height: number;
}) {
  const brickRows = Math.floor(height / 0.06);
  const brickCols = Math.floor(width / 0.1);

  return (
    <group position={position}>
      {/* Base brick color */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.9} />
      </mesh>

      {/* Brick pattern (mortar lines) */}
      {Array.from({ length: brickRows }).map((_, row) => (
        <group key={row}>
          {/* Horizontal mortar line */}
          <mesh position={[0, -height / 2 + 0.06 * row + 0.03, 0.001]}>
            <planeGeometry args={[width, 0.008]} />
            <meshStandardMaterial color="#3a2a20" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Fireplace({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: FireplaceProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Fireplace surround - outer frame */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.9, 1.2, 0.12]} />
        <meshStandardMaterial color="#3d3530" roughness={0.8} />
      </mesh>

      {/* Fireplace opening (cutout effect - dark interior) */}
      <mesh position={[0, 0.4, 0.03]}>
        <boxGeometry args={[0.5, 0.6, 0.1]} />
        <meshStandardMaterial color="#0a0805" roughness={1} />
      </mesh>

      {/* Brick interior back */}
      <BrickWall position={[0, 0.4, -0.02]} width={0.48} height={0.58} />

      {/* Brick interior sides */}
      <group position={[-0.23, 0.4, 0.02]} rotation={[0, Math.PI / 2, 0]}>
        <BrickWall position={[0, 0, 0]} width={0.08} height={0.58} />
      </group>
      <group position={[0.23, 0.4, 0.02]} rotation={[0, -Math.PI / 2, 0]}>
        <BrickWall position={[0, 0, 0]} width={0.08} height={0.58} />
      </group>

      {/* Mantle */}
      <mesh position={[0, 0.95, 0.08]} castShadow>
        <boxGeometry args={[1, 0.06, 0.2]} />
        <meshStandardMaterial color="#2a2420" roughness={0.7} />
      </mesh>

      {/* Mantle decorations */}
      {/* Small clock/object */}
      <mesh position={[0, 1.02, 0.05]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} />
      </mesh>

      {/* Candle holders */}
      {[-0.3, 0.3].map((x, i) => (
        <group key={i} position={[x, 0.98, 0.05]}>
          {/* Holder */}
          <mesh>
            <cylinderGeometry args={[0.025, 0.03, 0.04, 12]} />
            <meshStandardMaterial color="#c0a060" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Candle */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.08, 12]} />
            <meshStandardMaterial color="#f5f0e8" roughness={0.9} />
          </mesh>
          {/* Flame */}
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial
              color="#ffcc00"
              emissive="#ff8800"
              emissiveIntensity={1}
            />
          </mesh>
          <pointLight
            position={[0, 0.12, 0]}
            color="#ffaa44"
            intensity={0.1}
            distance={0.5}
          />
        </group>
      ))}

      {/* Hearth (floor extension) */}
      <mesh position={[0, 0.03, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.06, 0.3]} />
        <meshStandardMaterial color="#4a4035" roughness={0.85} />
      </mesh>

      {/* Fire and flames */}
      <group position={[0, 0.06, 0]}>
        <FireFlames />
      </group>
    </group>
  );
}
