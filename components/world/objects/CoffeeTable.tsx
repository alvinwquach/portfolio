/**
 * CoffeeTable - Simple Coffee Table
 * ==================================
 * A low coffee table with some items on top.
 */

interface CoffeeTableProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export function CoffeeTable({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: CoffeeTableProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Table top */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 24]} />
        <meshStandardMaterial color="#2d2520" roughness={0.7} />
      </mesh>

      {/* Center leg/pedestal */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.2, 12]} />
        <meshStandardMaterial color="#1a1510" roughness={0.6} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.03, 16]} />
        <meshStandardMaterial color="#1a1510" roughness={0.6} />
      </mesh>

      {/* Items on table */}
      {/* Book stack */}
      <group position={[-0.1, 0.25, 0.05]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.12, 0.02, 0.09]} />
          <meshStandardMaterial color="#3d4a5a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[0, -0.15, 0]}>
          <boxGeometry args={[0.11, 0.015, 0.085]} />
          <meshStandardMaterial color="#5a4a3d" roughness={0.9} />
        </mesh>
      </group>

      {/* Small plant/succulent */}
      <group position={[0.12, 0.24, -0.08]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.035, 0.03, 0.04, 8]} />
          <meshStandardMaterial color="#6b5b4f" roughness={0.9} />
        </mesh>
        {/* Plant */}
        <mesh position={[0, 0.055, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#2d5a3d" roughness={0.85} />
        </mesh>
      </group>

      {/* Coaster with mug */}
      <group position={[0.05, 0.24, 0.12]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.045, 16]} />
          <meshStandardMaterial color="#3a3530" roughness={0.9} />
        </mesh>
        {/* Mug */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.025, 0.022, 0.05, 12]} />
          <meshStandardMaterial color="#e8e0d8" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
