/**
 * DecisionZone - OpportuniQ Decision Engine
 * ==========================================
 * Visual representation of decision-making systems.
 * Represents: Trade-offs made explicit, opportunity cost visualization.
 *
 * OpportuniQ helps users navigate complex decisions by making
 * trade-offs visible and navigable.
 */

'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

interface DecisionZoneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  onNavigate?: () => void;
}

/**
 * Opportunity card - represents a choice with cost
 */
function OpportunityCard({
  position,
  label,
  cost,
  selected = false,
  onSelect,
}: {
  position: [number, number, number];
  label: string;
  cost: string;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const baseY = position[1];

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Gentle float
    meshRef.current.position.y = baseY + Math.sin(clock.elapsedTime * 0.8) * 0.03;
    // Pulse when selected
    if (selected) {
      const scale = 1 + Math.sin(clock.elapsedTime * 3) * 0.02;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Card background */}
      <RoundedBox args={[0.6, 0.4, 0.05]} radius={0.03} smoothness={4}>
        <meshStandardMaterial
          color={selected ? '#10b981' : hovered ? '#374151' : '#1f2937'}
          emissive={selected ? '#10b981' : '#000000'}
          emissiveIntensity={selected ? 0.3 : 0}
        />
      </RoundedBox>

      {/* Choice label */}
      <Text
        position={[0, 0.08, 0.03]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="center"
        maxWidth={0.5}
      >
        {label}
      </Text>

      {/* Cost indicator */}
      <Text
        position={[0, -0.1, 0.03]}
        fontSize={0.04}
        color={selected ? '#34d399' : '#9ca3af'}
        anchorX="center"
      >
        {cost}
      </Text>

      {/* Selection indicator */}
      {selected && (
        <mesh position={[0.22, 0.12, 0.03]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      )}
    </group>
  );
}

/**
 * Trade-off scale visualization
 */
function TradeoffScale({ leftWeight, rightWeight }: { leftWeight: number; rightWeight: number }) {
  const beamRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(0);

  useFrame(() => {
    if (!beamRef.current) return;
    // Calculate tilt based on weights
    targetRotation.current = (rightWeight - leftWeight) * 0.15;
    beamRef.current.rotation.z = THREE.MathUtils.lerp(
      beamRef.current.rotation.z,
      targetRotation.current,
      0.05
    );
  });

  return (
    <group position={[0, 0.8, 0]}>
      {/* Fulcrum */}
      <mesh position={[0, -0.1, 0]}>
        <coneGeometry args={[0.08, 0.15, 4]} />
        <meshStandardMaterial color="#4b5563" metalness={0.5} />
      </mesh>

      {/* Beam */}
      <group ref={beamRef}>
        <mesh>
          <boxGeometry args={[1.2, 0.03, 0.08]} />
          <meshStandardMaterial color="#6b7280" metalness={0.6} />
        </mesh>

        {/* Left pan */}
        <mesh position={[-0.5, -0.08, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
          <meshStandardMaterial color="#374151" />
        </mesh>

        {/* Right pan */}
        <mesh position={[0.5, -0.08, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      </group>

      {/* Labels */}
      <Text position={[-0.5, 0.15, 0]} fontSize={0.04} color="#9ca3af" anchorX="center">
        Time
      </Text>
      <Text position={[0.5, 0.15, 0]} fontSize={0.04} color="#9ca3af" anchorX="center">
        Quality
      </Text>
    </group>
  );
}

/**
 * Decision desk with monitor showing OpportuniQ
 */
function DecisionDesk() {
  return (
    <group>
      {/* Desk surface - darker, modern */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.04, 0.7]} />
        <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Desk legs - sleek metal */}
      {[[-0.6, 0.3, 0.25], [0.6, 0.3, 0.25], [-0.6, 0.3, -0.25], [0.6, 0.3, -0.25]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
          <meshStandardMaterial color="#4b5563" metalness={0.7} />
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0, 1.1, -0.2]}>
        {/* Screen frame */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.5, 0.03]} />
          <meshStandardMaterial color="#111827" roughness={0.1} />
        </mesh>

        {/* Screen content - OpportuniQ UI */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.75, 0.45]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>

        {/* UI elements on screen */}
        <Text position={[0, 0.15, 0.025]} fontSize={0.05} color="#10b981" anchorX="center">
          OpportuniQ
        </Text>
        <Text position={[0, 0.05, 0.025]} fontSize={0.025} color="#6b7280" anchorX="center">
          Decision Engine
        </Text>

        {/* Decision tree visualization on screen */}
        <mesh position={[-0.15, -0.08, 0.025]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
        <mesh position={[0.15, -0.08, 0.025]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[0, -0.18, 0.025]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>

        {/* Monitor stand */}
        <mesh position={[0, -0.32, 0.08]}>
          <boxGeometry args={[0.08, 0.12, 0.08]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <mesh position={[0, -0.4, 0.08]}>
          <boxGeometry args={[0.25, 0.02, 0.15]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      </group>

      {/* Keyboard */}
      <mesh position={[0, 0.63, 0.15]} castShadow>
        <boxGeometry args={[0.4, 0.015, 0.12]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Mouse */}
      <mesh position={[0.3, 0.625, 0.15]} castShadow>
        <boxGeometry args={[0.05, 0.02, 0.08]} />
        <meshStandardMaterial color="#374151" roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Floating opportunity cost indicator
 */
function OpportunityCostLabel({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <group ref={groupRef} position={position}>
      <RoundedBox args={[1.2, 0.3, 0.02]} radius={0.02} smoothness={4}>
        <meshStandardMaterial
          color="#1f2937"
          transparent
          opacity={0.9}
          emissive="#10b981"
          emissiveIntensity={0.1}
        />
      </RoundedBox>
      <Text position={[0, 0, 0.015]} fontSize={0.06} color="#10b981" anchorX="center">
        Opportunity Cost
      </Text>
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
      position={[0, 0.8, 0.2]}
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
      <boxGeometry args={[2, 2.5, 1.5]} />
      <meshBasicMaterial
        color="#10b981"
        transparent
        opacity={hovered ? 0.1 : 0}
      />
    </mesh>
  );
}

/**
 * Main Decision Zone
 */
export function DecisionZone({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onNavigate
}: DecisionZoneProps) {
  const [selectedChoice, setSelectedChoice] = useState<number>(1);

  const choices = [
    { label: 'Ship Fast', cost: 'Tech debt risk' },
    { label: 'Build Right', cost: 'Slower delivery' },
    { label: 'Scale First', cost: 'Premature optimization' },
  ];

  const handleZoneClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Clickable overlay for navigation */}
      <ClickableZone onClick={handleZoneClick} />

      {/* Zone label on floor */}
      <Text
        position={[0, 0.02, 1]}
        fontSize={0.12}
        color="#4b5563"
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
        fontWeight="bold"
      >
        DECISIONS
      </Text>

      {/* Decision desk with monitor */}
      <DecisionDesk />

      {/* Trade-off scale */}
      <group position={[0, 0.7, 0.5]}>
        <TradeoffScale
          leftWeight={selectedChoice === 0 ? 2 : 1}
          rightWeight={selectedChoice === 1 ? 2 : 1}
        />
      </group>

      {/* Opportunity cards floating around */}
      <group position={[0, 1.8, 0.4]}>
        {choices.map((choice, i) => (
          <OpportunityCard
            key={choice.label}
            position={[-0.7 + i * 0.7, 0, 0] as [number, number, number]}
            label={choice.label}
            cost={choice.cost}
            selected={i === selectedChoice}
            onSelect={() => setSelectedChoice(i)}
          />
        ))}
      </group>

      {/* Floating opportunity cost label */}
      <OpportunityCostLabel position={[0, 2.5, 0]} />

      {/* Project identifier */}
      <group position={[0, 2.9, 0]}>
        <Text fontSize={0.1} color="#10b981" anchorX="center" fontWeight="bold">
          OpportuniQ
        </Text>
        <Text position={[0, -0.15, 0]} fontSize={0.05} color="#6b7280" anchorX="center">
          Every choice forecloses others
        </Text>
      </group>

      {/* Ambient glow */}
      <pointLight position={[0, 2, 0.5]} intensity={0.4} color="#10b981" distance={4} />

      {/* "View Project" hint */}
      <Text
        position={[0, 0.02, 1.3]}
        fontSize={0.06}
        color="#10b981"
        anchorX="center"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        Click to view project →
      </Text>
    </group>
  );
}
