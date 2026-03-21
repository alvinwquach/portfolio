/**
 * MiniBookshelf - Small Bookshelf for Studio Diorama
 * ===================================================
 * A miniature 2-shelf bookshelf with colored books and reading lamp.
 * Represents continuous learning and knowledge sharing.
 */

import * as THREE from 'three';

interface MiniBookshelfProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/**
 * Single book
 */
function Book({
  position,
  color,
  height = 0.12,
  width = 0.015,
  depth = 0.08,
}: {
  position: [number, number, number];
  color: string;
  height?: number;
  width?: number;
  depth?: number;
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

/**
 * Small reading lamp
 */
function ReadingLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.01, 12]} />
        <meshStandardMaterial color="#333333" metalness={0.6} />
      </mesh>

      {/* Arm */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.1, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.7} />
      </mesh>

      {/* Lamp head */}
      <mesh position={[0, 0.1, 0.02]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.025, 0.04, 12, 1, true]} />
        <meshStandardMaterial color="#222222" side={THREE.DoubleSide} />
      </mesh>

      {/* Light source */}
      <pointLight
        position={[0, 0.09, 0.03]}
        intensity={0.3}
        color="#fff5e0"
        distance={0.8}
      />
    </group>
  );
}

export function MiniBookshelf({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: MiniBookshelfProps) {
  // Muted book colors
  const bookColors = [
    '#2d4a3e', // dark teal
    '#4a3d2d', // brown
    '#3d2d4a', // purple
    '#2d3d4a', // navy
    '#4a2d3d', // burgundy
    '#3d4a2d', // olive
    '#2d4a4a', // teal
    '#4a4a2d', // gold
  ];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Shelf frame - back panel */}
      <mesh position={[0, 0.2, -0.045]} castShadow>
        <boxGeometry args={[0.35, 0.4, 0.01]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
      </mesh>

      {/* Left side panel */}
      <mesh position={[-0.17, 0.2, 0]} castShadow>
        <boxGeometry args={[0.01, 0.4, 0.1]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
      </mesh>

      {/* Right side panel */}
      <mesh position={[0.17, 0.2, 0]} castShadow>
        <boxGeometry args={[0.01, 0.4, 0.1]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
      </mesh>

      {/* Bottom shelf */}
      <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.02, 0.1]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>

      {/* Middle shelf */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.015, 0.1]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>

      {/* Top shelf */}
      <mesh position={[0, 0.39, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.02, 0.1]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>

      {/* Books on bottom shelf */}
      {[-0.12, -0.08, -0.04, 0, 0.04, 0.08, 0.12].map((x, i) => (
        <Book
          key={`bottom-${i}`}
          position={[x, 0.08, 0]}
          color={bookColors[i % bookColors.length]}
          height={0.1 + Math.sin(i * 1.5) * 0.02}
          width={0.018 + Math.cos(i * 2) * 0.004}
        />
      ))}

      {/* Books on top shelf - fewer books, some laying flat */}
      {[-0.1, -0.06, -0.02, 0.02, 0.06].map((x, i) => (
        <Book
          key={`top-${i}`}
          position={[x, 0.28, 0]}
          color={bookColors[(i + 3) % bookColors.length]}
          height={0.11 + Math.cos(i * 1.8) * 0.015}
          width={0.016 + Math.sin(i * 2.5) * 0.003}
        />
      ))}

      {/* One book laying flat on top shelf */}
      <mesh position={[0.12, 0.22, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.015, 0.08, 0.06]} />
        <meshStandardMaterial color="#4a2d3d" roughness={0.85} />
      </mesh>

      {/* Small decorative item on top - could be a small figure or award */}
      <mesh position={[-0.1, 0.42, 0]} castShadow>
        <boxGeometry args={[0.03, 0.05, 0.02]} />
        <meshStandardMaterial color="#c0a060" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Reading lamp on top */}
      <ReadingLamp position={[0.1, 0.4, 0.02]} />
    </group>
  );
}
