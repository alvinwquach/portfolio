/**
 * OpportuniQScene Component
 * =========================
 * 3D visualization for OpportuniQ AI agent featuring neural network nodes
 * and automation workflow visualization.
 */

'use client';

import * as React from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// AI brain - electric blue
const AI_BLUE = new THREE.Color(0x3b82f6);
// Research/workflow nodes - emerald
const AUTO_GREEN = new THREE.Color(0x10b981);
// Data input - amber (research queries, options to evaluate)
const DATA_AMBER = new THREE.Color(0xf59e0b);
// Output - purple (decisions, recommendations)
const OUTPUT_PURPLE = new THREE.Color(0x8b5cf6);

interface OpportuniQSceneProps {
  scrollProgress?: number;
  isVisible?: boolean;
}

/**
 * Central AI brain node with pulsing effect
 */
function AIBrainNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !glowRef.current) return;

    // Pulsing scale
    const pulse = 1 + Math.sin(clock.elapsedTime * 2) * 0.05;
    meshRef.current.scale.setScalar(pulse);

    // Glow expansion
    const glowPulse = 1.2 + Math.sin(clock.elapsedTime * 2) * 0.1;
    glowRef.current.scale.setScalar(glowPulse);
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Outer glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshBasicMaterial
            color={AI_BLUE}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Core sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color={AI_BLUE}
            emissive={AI_BLUE}
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Inner detail rings */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.25, 0.02, 8, 32]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
        </mesh>
        <mesh rotation={[0, Math.PI / 4, Math.PI / 4]}>
          <torusGeometry args={[0.2, 0.015, 8, 32]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

/**
 * Research workflow node (analysis, comparison, recommendation)
 */
function AutomationNode({
  position,
  color,
  delay = 0,
}: {
  position: [number, number, number];
  color: THREE.Color;
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    // Floating animation
    meshRef.current.position.y = initialY + Math.sin(clock.elapsedTime * 1.5 + delay) * 0.1;

    // Rotation
    meshRef.current.rotation.y = clock.elapsedTime * 0.5 + delay;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.3}
        metalness={0.6}
      />
    </mesh>
  );
}

/**
 * Research data nodes flowing into the system
 */
function DataInputNodes({ count = 8 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.8;
      return {
        x: Math.cos(angle) * radius,
        y: (Math.random() - 0.5) * 0.8,
        z: Math.sin(angle) * radius,
        delay: i * 0.2,
      };
    });
  }, [count]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Slow rotation
    groupRef.current.rotation.y = clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <DataNode
          key={i}
          initialPosition={[pos.x, pos.y, pos.z]}
          delay={pos.delay}
        />
      ))}
    </group>
  );
}

/**
 * Individual data input node that pulses inward
 */
function DataNode({
  initialPosition,
  delay,
}: {
  initialPosition: [number, number, number];
  delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    // Pulse toward center periodically
    const t = ((clock.elapsedTime + delay) % 4) / 4;
    const distance = 1 - t * 0.3;

    meshRef.current.position.x = initialPosition[0] * distance;
    meshRef.current.position.y = initialPosition[1] + Math.sin(clock.elapsedTime + delay) * 0.1;
    meshRef.current.position.z = initialPosition[2] * distance;

    // Scale down as it approaches center
    meshRef.current.scale.setScalar(0.8 + (1 - t) * 0.2);

    // Fade as it gets closer
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.opacity = 0.3 + (1 - t) * 0.7;
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <octahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial
        color={DATA_AMBER}
        emissive={DATA_AMBER}
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

/**
 * Connection lines from center to automation nodes
 */
function ConnectionBeam({
  start,
  end,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: THREE.Color;
}) {
  const line = useMemo(() => {
    const points = [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.4
    });
    return new THREE.Line(geometry, material);
  }, [start, end, color]);

  return <primitive object={line} />;
}

/**
 * Pulse traveling along connection
 */
function DataPulse({
  start,
  end,
  delay = 0,
}: {
  start: [number, number, number];
  end: [number, number, number];
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = ((clock.elapsedTime * 0.5 + delay) % 1);
    const x = start[0] + (end[0] - start[0]) * t;
    const y = start[1] + (end[1] - start[1]) * t;
    const z = start[2] + (end[2] - start[2]) * t;

    meshRef.current.position.set(x, y, z);
    meshRef.current.scale.setScalar(0.5 + Math.sin(t * Math.PI) * 0.5);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
    </mesh>
  );
}

/**
 * Scene lighting
 */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={0.6} color={AI_BLUE} />
      <pointLight position={[2, 0, 0]} intensity={0.3} color={AUTO_GREEN} />
      <pointLight position={[-2, 0, 0]} intensity={0.3} color={OUTPUT_PURPLE} />
    </>
  );
}

/**
 * Main OpportuniQScene component
 */
export function OpportuniQScene({ scrollProgress = 0, isVisible = true }: OpportuniQSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Automation node positions
  const automationNodes = useMemo(() => [
    { position: [1, 0.5, 0] as [number, number, number], color: AUTO_GREEN, delay: 0 },
    { position: [-0.5, 0.5, 0.866] as [number, number, number], color: AUTO_GREEN, delay: 0.5 },
    { position: [-0.5, 0.5, -0.866] as [number, number, number], color: OUTPUT_PURPLE, delay: 1 },
  ], []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Very slow rotation
    groupRef.current.rotation.y = clock.elapsedTime * 0.05;
  });

  if (!isVisible) return null;

  return (
    <>
      <Lighting />
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Central AI Brain */}
        <AIBrainNode />

        {/* Automation workflow nodes */}
        {automationNodes.map((node, i) => (
          <React.Fragment key={i}>
            <AutomationNode
              position={node.position}
              color={node.color}
              delay={node.delay}
            />
            <ConnectionBeam
              start={[0, 0, 0]}
              end={node.position}
              color={node.color}
            />
            <DataPulse
              start={[0, 0, 0]}
              end={node.position}
              delay={node.delay}
            />
          </React.Fragment>
        ))}

        {/* Research data flowing in */}
        <DataInputNodes count={10} />
      </group>
    </>
  );
}
