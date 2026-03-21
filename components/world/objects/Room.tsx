/**
 * Room - Isometric Cut-Away Room for Studio Diorama
 * ==================================================
 * A dollhouse-style room with floor, back wall, and left wall.
 * The front and right sides are open for the isometric view.
 * Includes window, door frame, baseboards, and wall details.
 */

import * as THREE from 'three';

interface RoomProps {
  position?: [number, number, number];
  width?: number;
  depth?: number;
  height?: number;
}

/**
 * Baseboard trim along walls
 */
function Baseboard({
  start,
  end,
  height = 0.08,
}: {
  start: [number, number, number];
  end: [number, number, number];
  height?: number;
}) {
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2)
  );
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);

  return (
    <mesh position={[midX, height / 2, midZ]} rotation={[0, -angle, 0]}>
      <boxGeometry args={[length, height, 0.03]} />
      <meshStandardMaterial color="#2a2420" roughness={0.8} />
    </mesh>
  );
}

/**
 * Window frame with glass
 */
function Window({
  position,
  rotation = [0, 0, 0],
  width = 0.8,
  height = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Window frame */}
      <mesh>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.08]} />
        <meshStandardMaterial color="#3d3530" roughness={0.7} />
      </mesh>

      {/* Glass pane */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[width - 0.05, height - 0.05]} />
        <meshStandardMaterial
          color="#1a3a4a"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Window cross frame */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.03, height - 0.1, 0.02]} />
        <meshStandardMaterial color="#3d3530" />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[width - 0.1, 0.03, 0.02]} />
        <meshStandardMaterial color="#3d3530" />
      </mesh>

      {/* Window sill */}
      <mesh position={[0, -height / 2 - 0.03, 0.06]}>
        <boxGeometry args={[width + 0.15, 0.04, 0.12]} />
        <meshStandardMaterial color="#3d3530" roughness={0.7} />
      </mesh>

      {/* Subtle light from outside */}
      <pointLight
        position={[0, 0, -0.5]}
        intensity={0.15}
        color="#87ceeb"
        distance={3}
      />
    </group>
  );
}

/**
 * Door frame (without door - open)
 */
function DoorFrame({
  position,
  rotation = [0, 0, 0],
  width = 0.7,
  height = 1.8,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}) {
  const frameThickness = 0.08;

  return (
    <group position={position} rotation={rotation}>
      {/* Left frame */}
      <mesh position={[-width / 2 - frameThickness / 2, height / 2, 0]}>
        <boxGeometry args={[frameThickness, height, 0.1]} />
        <meshStandardMaterial color="#2a2420" roughness={0.7} />
      </mesh>

      {/* Right frame */}
      <mesh position={[width / 2 + frameThickness / 2, height / 2, 0]}>
        <boxGeometry args={[frameThickness, height, 0.1]} />
        <meshStandardMaterial color="#2a2420" roughness={0.7} />
      </mesh>

      {/* Top frame */}
      <mesh position={[0, height + frameThickness / 2, 0]}>
        <boxGeometry args={[width + frameThickness * 2, frameThickness, 0.1]} />
        <meshStandardMaterial color="#2a2420" roughness={0.7} />
      </mesh>

      {/* Dark interior beyond door */}
      <mesh position={[0, height / 2, -0.1]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
    </group>
  );
}

/**
 * Wall-mounted shelf
 */
function WallShelf({
  position,
  rotation = [0, 0, 0],
  width = 0.6,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Shelf surface */}
      <mesh castShadow>
        <boxGeometry args={[width, 0.025, 0.15]} />
        <meshStandardMaterial color="#3d3530" roughness={0.8} />
      </mesh>

      {/* Brackets */}
      {[-width / 3, width / 3].map((x, i) => (
        <mesh key={i} position={[x, -0.06, 0.05]}>
          <boxGeometry args={[0.02, 0.1, 0.02]} />
          <meshStandardMaterial color="#444444" metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Picture frame on wall
 */
function PictureFrame({
  position,
  rotation = [0, 0, 0],
  width = 0.3,
  height = 0.4,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[width + 0.04, height + 0.04, 0.02]} />
        <meshStandardMaterial color="#2a2420" roughness={0.6} />
      </mesh>

      {/* Picture (abstract colored rectangle) */}
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[width - 0.02, height - 0.02]} />
        <meshStandardMaterial color="#1a2a3a" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Room({
  position = [0, 0, 0],
  width = 4,
  depth = 4,
  height = 2.8,
}: RoomProps) {
  // Wall colors - darker for better contrast
  const wallColor = '#2d2a28';
  const floorColor = '#1a1815';
  const edgeColor = '#1a1815'; // Dark edge for cutaway look

  // Wall thickness for the 3D cutaway edges
  const wallThickness = 0.15;

  return (
    <group position={position}>
      {/* === FLOOR === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={floorColor} roughness={0.85} />
      </mesh>

      {/* Floor boards pattern */}
      {Array.from({ length: Math.floor(width / 0.3) }).map((_, i) => (
        <mesh
          key={`board-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-width / 2 + 0.15 + i * 0.3, 0.001, 0]}
        >
          <planeGeometry args={[0.02, depth]} />
          <meshStandardMaterial
            color="#151310"
            roughness={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* === BACK WALL (with thickness) === */}
      <mesh position={[0, height / 2, -depth / 2 + wallThickness / 2]} receiveShadow>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>

      {/* === LEFT WALL (with thickness) === */}
      <mesh position={[-width / 2 + wallThickness / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>

      {/* === FLOOR EDGE - Front (visible cutaway edge) === */}
      <mesh position={[0, -wallThickness / 2, depth / 2 - wallThickness / 2]}>
        <boxGeometry args={[width + wallThickness * 2, wallThickness, wallThickness]} />
        <meshStandardMaterial color={edgeColor} roughness={0.8} />
      </mesh>

      {/* === FLOOR EDGE - Right (visible cutaway edge) === */}
      <mesh position={[width / 2 - wallThickness / 2, -wallThickness / 2, 0]}>
        <boxGeometry args={[wallThickness, wallThickness, depth]} />
        <meshStandardMaterial color={edgeColor} roughness={0.8} />
      </mesh>

      {/* === WALL TOP EDGE - Back wall === */}
      <mesh position={[0, height + wallThickness / 2, -depth / 2 + wallThickness / 2]}>
        <boxGeometry args={[width + wallThickness, wallThickness, wallThickness]} />
        <meshStandardMaterial color={edgeColor} roughness={0.8} />
      </mesh>

      {/* === WALL TOP EDGE - Left wall === */}
      <mesh position={[-width / 2 + wallThickness / 2, height + wallThickness / 2, 0]}>
        <boxGeometry args={[wallThickness, wallThickness, depth + wallThickness]} />
        <meshStandardMaterial color={edgeColor} roughness={0.8} />
      </mesh>

      {/* === BASEBOARDS === */}
      {/* Back wall baseboard */}
      <Baseboard
        start={[-width / 2 + wallThickness, 0, -depth / 2 + wallThickness + 0.02]}
        end={[width / 2, 0, -depth / 2 + wallThickness + 0.02]}
      />
      {/* Left wall baseboard */}
      <Baseboard
        start={[-width / 2 + wallThickness + 0.02, 0, -depth / 2 + wallThickness]}
        end={[-width / 2 + wallThickness + 0.02, 0, depth / 2]}
      />

      {/* === WINDOW on back wall === */}
      <Window
        position={[width / 4, height / 2 + 0.2, -depth / 2 + wallThickness + 0.01]}
        width={0.7}
        height={0.9}
      />

      {/* === DOOR FRAME on left wall === */}
      <DoorFrame
        position={[-width / 2 + wallThickness + 0.01, 0, -depth / 4]}
        rotation={[0, Math.PI / 2, 0]}
        width={0.65}
        height={1.7}
      />

      {/* === WALL DECORATIONS === */}
      {/* Picture frame on back wall */}
      <PictureFrame
        position={[-width / 4, height / 2 + 0.3, -depth / 2 + wallThickness + 0.02]}
        width={0.35}
        height={0.25}
      />

      {/* Wall shelf on back wall */}
      <WallShelf
        position={[-width / 4, height / 2 - 0.3, -depth / 2 + wallThickness + 0.08]}
        width={0.5}
      />

      {/* === FLOOR RUG === */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
      >
        <planeGeometry args={[2.8, 2]} />
        <meshStandardMaterial color="#3a3530" roughness={0.95} />
      </mesh>
      {/* Rug border */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.006, 0]}
      >
        <planeGeometry args={[2.6, 1.8]} />
        <meshStandardMaterial
          color="#4a4540"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
