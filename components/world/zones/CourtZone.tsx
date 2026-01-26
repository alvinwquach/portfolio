/**
 * CourtZone - The Basketball Court (Hoop Almanac)
 * ================================================
 * Centerpiece of the workshop. A basketball hoop with interactive ball.
 * Represents: Sports analytics, probability, visualization, early product thinking.
 */

'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface CourtZoneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  onNavigate?: () => void;
}

/**
 * Basketball Hoop with backboard and rim
 */
function BasketballHoop({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Backboard */}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[1.8, 1.2, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Backboard border */}
      <mesh position={[0, 3, 0.03]}>
        <boxGeometry args={[1.85, 1.25, 0.02]} />
        <meshStandardMaterial color="#1d428a" roughness={0.5} />
      </mesh>

      {/* Rim */}
      <mesh position={[0, 2.5, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.23, 0.02, 16, 32]} />
        <meshStandardMaterial color="#ff6b35" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rim connector */}
      <mesh position={[0, 2.5, 0.2]}>
        <boxGeometry args={[0.1, 0.05, 0.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Pole */}
      <mesh position={[0, 1.5, -0.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.1, -0.2]} castShadow>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  );
}

/**
 * Interactive Basketball
 */
function Basketball({
  position,
  onClick,
}: {
  position: [number, number, number];
  onClick?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Subtle idle rotation
    meshRef.current.rotation.y = clock.elapsedTime * 0.2;
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <sphereGeometry args={[0.12, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? '#ff8855' : '#e65c00'}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

/**
 * Court floor markings
 */
function CourtFloor() {
  return (
    <group position={[0, 0.01, 1]}>
      {/* Main court area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>

      {/* Free throw line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[2.4, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Three point arc (simplified) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1.5]}>
        <ringGeometry args={[2.2, 2.25, 32, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/**
 * Stats panel that appears on interaction
 */
function StatsPanel({ visible, position }: { visible: boolean; position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox
        args={[2, 1.2, 0.05]}
        radius={0.05}
        smoothness={4}
        visible={visible}
      >
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={visible ? 0.9 : 0}
        />
      </RoundedBox>

      {visible && (
        <>
          <Text
            position={[0, 0.35, 0.03]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
          >
            HOOP ALMANAC
          </Text>
          <Text
            position={[-0.5, 0.05, 0.03]}
            fontSize={0.15}
            color="#00d4ff"
            anchorX="center"
          >
            95ms
          </Text>
          <Text
            position={[-0.5, -0.1, 0.03]}
            fontSize={0.06}
            color="#888888"
            anchorX="center"
          >
            latency
          </Text>
          <Text
            position={[0.5, 0.05, 0.03]}
            fontSize={0.15}
            color="#ffc72c"
            anchorX="center"
          >
            150
          </Text>
          <Text
            position={[0.5, -0.1, 0.03]}
            fontSize={0.06}
            color="#888888"
            anchorX="center"
          >
            concurrent users
          </Text>
          <Text
            position={[0, -0.35, 0.03]}
            fontSize={0.07}
            color="#666666"
            anchorX="center"
          >
            Real-time fantasy basketball platform
          </Text>
        </>
      )}
    </group>
  );
}

/**
 * Clickable zone overlay for navigation
 */
function ClickableZone({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={[0, 0.02, 1]}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={onClick}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <planeGeometry args={[4, 5]} />
      <meshBasicMaterial
        color="#00d4ff"
        transparent
        opacity={hovered ? 0.1 : 0}
      />
    </mesh>
  );
}

/**
 * Main Court Zone
 */
export function CourtZone({ position = [0, 0, 0], rotation = [0, 0, 0], onNavigate }: CourtZoneProps) {
  const [showStats, setShowStats] = useState(false);

  const handleBallClick = () => {
    setShowStats(!showStats);
  };

  const handleZoneClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Clickable overlay for navigation */}
      <ClickableZone onClick={handleZoneClick} />

      {/* Zone label */}
      <Text
        position={[0, 0.1, 3.5]}
        fontSize={0.15}
        color="#666666"
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        THE COURT
      </Text>

      {/* Court floor */}
      <CourtFloor />

      {/* Basketball hoop */}
      <BasketballHoop position={[0, 0, -1.5]} />

      {/* Interactive basketball */}
      <Basketball position={[0, 0.12, 1]} onClick={handleBallClick} />

      {/* Stats panel */}
      <StatsPanel visible={showStats} position={[2.5, 2, 0]} />

      {/* "View Project" hint */}
      <Text
        position={[0, 0.1, 4]}
        fontSize={0.08}
        color="#00d4ff"
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        Click to view project →
      </Text>
    </group>
  );
}
