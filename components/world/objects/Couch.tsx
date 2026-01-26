/**
 * Couch - Comfortable Couch for the Room
 * =======================================
 * A simple but cozy couch with cushions and throw pillows.
 */

'use client';

import * as React from 'react';

interface CouchProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
}

/**
 * Throw pillow
 */
function ThrowPillow({
  position,
  rotation = [0, 0, 0],
  color,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={[0.18, 0.18, 0.08]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

export function Couch({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#3d3a38',
}: CouchProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Base/frame */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.9, 0.2, 0.45]} />
        <meshStandardMaterial color="#1a1815" roughness={0.8} />
      </mesh>

      {/* Seat cushion */}
      <mesh position={[0, 0.3, 0.02]} castShadow>
        <boxGeometry args={[0.85, 0.1, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Back cushion */}
      <mesh position={[0, 0.45, -0.15]} castShadow>
        <boxGeometry args={[0.85, 0.25, 0.12]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Left armrest */}
      <mesh position={[-0.42, 0.32, 0]} castShadow>
        <boxGeometry args={[0.08, 0.18, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Right armrest */}
      <mesh position={[0.42, 0.32, 0]} castShadow>
        <boxGeometry args={[0.08, 0.18, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Legs */}
      {[
        [-0.35, 0.04, 0.15],
        [0.35, 0.04, 0.15],
        [-0.35, 0.04, -0.15],
        [0.35, 0.04, -0.15],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
          <meshStandardMaterial color="#1a1510" roughness={0.7} />
        </mesh>
      ))}

      {/* Throw pillows */}
      <ThrowPillow
        position={[-0.25, 0.42, 0.08]}
        rotation={[0.2, 0.1, 0.15]}
        color="#4a6050"
      />
      <ThrowPillow
        position={[0.28, 0.4, 0.1]}
        rotation={[0.15, -0.2, -0.1]}
        color="#5a4a40"
      />
    </group>
  );
}
