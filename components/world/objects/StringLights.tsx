/**
 * StringLights - Decorative String Lights for Diorama
 * ====================================================
 * Draped string lights along walls with glowing bulbs.
 * Uses CatmullRomCurve3 for the wire path and instanced spheres for bulbs.
 */

'use client';

import * as React from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StringLightsProps {
  /** Array of 3D points the string passes through */
  points: [number, number, number][];
  /** Number of bulbs along the string */
  bulbCount?: number;
  /** Base color of the bulbs */
  bulbColor?: string;
  /** Whether bulbs should twinkle */
  twinkle?: boolean;
  /** Wire color */
  wireColor?: string;
}

/**
 * Individual light bulb with glow
 */
function LightBulb({
  position,
  color,
  twinkle,
  index,
}: {
  position: THREE.Vector3;
  color: string;
  twinkle: boolean;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseIntensity = 0.8;

  useFrame(({ clock }) => {
    if (!meshRef.current || !twinkle) return;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;

    // Each bulb twinkles at slightly different rate
    const twinkleSpeed = 1.5 + (index % 5) * 0.3;
    const phase = index * 0.7;
    const flicker = Math.sin(clock.elapsedTime * twinkleSpeed + phase) * 0.3 + 0.7;

    material.emissiveIntensity = baseIntensity * flicker;
  });

  return (
    <group position={position}>
      {/* Bulb socket */}
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.012, 0.008, 0.025, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.6} />
      </mesh>

      {/* Bulb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={baseIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Point light for actual illumination (subtle) */}
      <pointLight
        color={color}
        intensity={0.08}
        distance={0.8}
        decay={2}
      />
    </group>
  );
}

export function StringLights({
  points,
  bulbCount = 12,
  bulbColor = '#ffdd88',
  twinkle = true,
  wireColor = '#1a1a1a',
}: StringLightsProps) {
  // Create smooth curve through points
  const { curve, wireGeometry, bulbPositions } = useMemo(() => {
    const curvePoints = points.map((p) => new THREE.Vector3(...p));
    const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5);

    // Create tube geometry for the wire
    const wireGeometry = new THREE.TubeGeometry(curve, 64, 0.008, 8, false);

    // Calculate bulb positions along curve
    const bulbPositions: THREE.Vector3[] = [];
    for (let i = 0; i < bulbCount; i++) {
      // Distribute bulbs evenly, but skip the very ends
      const t = (i + 0.5) / bulbCount;
      const point = curve.getPoint(t);
      // Add slight droop between bulbs
      const droopAmount = Math.sin(t * Math.PI * bulbCount) * 0.03;
      point.y -= droopAmount;
      bulbPositions.push(point);
    }

    return { curve, wireGeometry, bulbPositions };
  }, [points, bulbCount]);

  // Varied bulb colors for visual interest
  const bulbColors = useMemo(() => {
    const colors = ['#ffdd88', '#ffaa66', '#ff8866', '#ffcc77', '#ffffaa'];
    return bulbPositions.map((_, i) => colors[i % colors.length]);
  }, [bulbPositions]);

  return (
    <group>
      {/* Wire/string */}
      <mesh geometry={wireGeometry}>
        <meshStandardMaterial color={wireColor} roughness={0.8} />
      </mesh>

      {/* Bulbs */}
      {bulbPositions.map((pos, i) => (
        <LightBulb
          key={i}
          position={pos}
          color={bulbColors[i]}
          twinkle={twinkle}
          index={i}
        />
      ))}
    </group>
  );
}

/**
 * Pre-configured string lights for room corners
 * Drapes from back-left corner along back wall and down left wall
 */
export function RoomStringLights({
  roomWidth = 4,
  roomDepth = 4,
  roomHeight = 2.8,
}: {
  roomWidth?: number;
  roomDepth?: number;
  roomHeight?: number;
}) {
  // String lights path - drapes along top of walls with natural sag
  const stringPath: [number, number, number][] = [
    // Start at left wall near front
    [-roomWidth / 2 + 0.1, roomHeight - 0.3, roomDepth / 2 - 0.5],
    // Drape down and up along left wall
    [-roomWidth / 2 + 0.1, roomHeight - 0.5, roomDepth / 4],
    [-roomWidth / 2 + 0.1, roomHeight - 0.35, 0],
    [-roomWidth / 2 + 0.1, roomHeight - 0.55, -roomDepth / 4],
    // Corner
    [-roomWidth / 2 + 0.15, roomHeight - 0.4, -roomDepth / 2 + 0.15],
    // Along back wall
    [-roomWidth / 4, roomHeight - 0.55, -roomDepth / 2 + 0.1],
    [0, roomHeight - 0.4, -roomDepth / 2 + 0.1],
    [roomWidth / 4, roomHeight - 0.5, -roomDepth / 2 + 0.1],
    // End at right side of back wall
    [roomWidth / 2 - 0.3, roomHeight - 0.35, -roomDepth / 2 + 0.1],
  ];

  return <StringLights points={stringPath} bulbCount={15} twinkle />;
}
