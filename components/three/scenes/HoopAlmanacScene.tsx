/**
 * HoopAlmanacScene Component
 * ==========================
 * 3D visualization for Hoop Almanac project featuring a basketball
 * with orbiting data particles and ML prediction arcs.
 */

'use client';

import * as React from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Basketball orange color
const BASKETBALL_ORANGE = new THREE.Color(0xe65c00);
// Data particles - cyan for real-time data
const DATA_CYAN = new THREE.Color(0x00d4ff);
// ML prediction - gold/amber
const PREDICTION_GOLD = new THREE.Color(0xffc72c);

interface HoopAlmanacSceneProps {
  scrollProgress?: number;
  isVisible?: boolean;
}

/**
 * Textured basketball with seam lines
 */
function Basketball({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const seamRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    // Slow rotation like a spinning basketball
    meshRef.current.rotation.x = clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = clock.elapsedTime * 0.3;

    // Subtle scale pulse
    const pulse = 1 + Math.sin(clock.elapsedTime * 2) * 0.02;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Main basketball sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={BASKETBALL_ORANGE}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Basketball seams (simplified) */}
        <group ref={seamRef}>
          {/* Horizontal seam */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.01, 0.02, 8, 32]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
          {/* Vertical seam */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[1.01, 0.02, 8, 32]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

/**
 * Orbiting data particles representing player stats
 */
function DataParticles({ count = 50, scrollProgress = 0 }: { count?: number; scrollProgress?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const velocityRef = useRef(0);

  // Generate orbital positions
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.8 + Math.random() * 0.5;
      const height = (Math.random() - 0.5) * 1.5;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      velocities[i] = 0.5 + Math.random() * 0.5;
    }

    return { positions, velocities };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const positionAttr = pointsRef.current.geometry.attributes.position;
    const time = clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + time * velocities[i] * 0.5;
      const radius = 1.8 + Math.sin(time + i) * 0.3;

      positionAttr.array[i * 3] = Math.cos(angle) * radius;
      positionAttr.array[i * 3 + 2] = Math.sin(angle) * radius;
    }

    positionAttr.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={DATA_CYAN}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

/**
 * ML Prediction arcs - curved lines showing predictions
 */
function PredictionArcs({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Rotate the prediction arcs
    groupRef.current.rotation.y = clock.elapsedTime * 0.1;
  });

  // Create arc curve
  const arcCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const angle = t * Math.PI;
      const radius = 2.5;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * 0.5,
          Math.sin(angle) * radius * 0.3
        )
      );
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Prediction arc 1 */}
      <mesh>
        <tubeGeometry args={[arcCurve, 50, 0.02, 8, false]} />
        <meshStandardMaterial
          color={PREDICTION_GOLD}
          emissive={PREDICTION_GOLD}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Prediction arc 2 (rotated) */}
      <mesh rotation={[0, Math.PI / 3, 0]}>
        <tubeGeometry args={[arcCurve, 50, 0.02, 8, false]} />
        <meshStandardMaterial
          color={PREDICTION_GOLD}
          emissive={PREDICTION_GOLD}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Prediction arc 3 (rotated) */}
      <mesh rotation={[0, -Math.PI / 3, 0]}>
        <tubeGeometry args={[arcCurve, 50, 0.02, 8, false]} />
        <meshStandardMaterial
          color={PREDICTION_GOLD}
          emissive={PREDICTION_GOLD}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

/**
 * Scene lighting
 */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#fff5e6" />
      <pointLight position={[-3, 2, -3]} intensity={0.5} color={DATA_CYAN} />
      <pointLight position={[3, -2, 3]} intensity={0.3} color={PREDICTION_GOLD} />
    </>
  );
}

/**
 * Main HoopAlmanacScene component
 */
export function HoopAlmanacScene({ scrollProgress = 0, isVisible = true }: HoopAlmanacSceneProps) {
  if (!isVisible) return null;

  return (
    <>
      <Lighting />
      <group position={[0, 0, 0]}>
        <Basketball scrollProgress={scrollProgress} />
        <DataParticles count={60} scrollProgress={scrollProgress} />
        <PredictionArcs scrollProgress={scrollProgress} />
      </group>
    </>
  );
}
