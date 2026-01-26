/**
 * HeroScene Component
 * ===================
 * Stillness-first 3D scene with ambient particles.
 * Particles drift slowly like dust in light - they exist independently.
 * Responds subtly to scroll velocity, never chases the cursor.
 */

'use client';

import * as React from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Visible but sophisticated palette
const PARTICLE_COLOR = new THREE.Color(0x6b9bd1); // Brighter blue
const ACCENT_COLOR = new THREE.Color(0xffc72c);   // Warriors gold

interface HeroSceneProps {
  /** Scroll progress (0-1) for parallax effect */
  scrollProgress?: number;
  /** Scroll velocity for responsive particle speed */
  scrollVelocity?: number;
}

/**
 * Ambient dust particles - drift slowly like dust in a beam of light
 */
function DustParticles({
  count = 80,
  scrollVelocity = 0
}: {
  count?: number;
  scrollVelocity?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const velocityRef = useRef(0);

  // Generate scattered positions across the view
  const { positions, baseVelocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const baseVelocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread particles across a wide, shallow field
      positions[i * 3] = (Math.random() - 0.5) * 20;     // x: wide spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12; // y: vertical spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2; // z: depth, slightly back

      // Each particle has its own drift speed
      baseVelocities[i] = 0.1 + Math.random() * 0.2;
    }

    return { positions, baseVelocities };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    // Smooth velocity interpolation
    velocityRef.current += (Math.abs(scrollVelocity) - velocityRef.current) * 0.05;
    const speedMultiplier = 1 + velocityRef.current * 2;

    const positionAttr = pointsRef.current.geometry.attributes.position;
    const time = clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const baseSpeed = baseVelocities[i] * speedMultiplier;

      // Gentle drift - mostly horizontal with subtle vertical oscillation
      const x = positionAttr.array[i * 3];
      const y = positionAttr.array[i * 3 + 1];

      // Drift leftward slowly
      let newX = x - baseSpeed * 0.01;
      if (newX < -10) newX = 10; // Wrap around

      // Subtle vertical oscillation
      const verticalOffset = Math.sin(time * 0.3 + i) * 0.002;

      positionAttr.array[i * 3] = newX;
      positionAttr.array[i * 3 + 1] = y + verticalOffset;
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
        color={PARTICLE_COLOR}
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  );
}

/**
 * Sparse accent particles - fewer, slightly brighter
 */
function AccentParticles({ count = 20 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3;
    }

    return positions;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    // Very slow rotation
    pointsRef.current.rotation.y = clock.elapsedTime * 0.005;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={ACCENT_COLOR}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

/**
 * Minimal ambient lighting - no dramatic effects
 */
function AmbientLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.4}
        color="#f5f5f5"
      />
    </>
  );
}

/**
 * Main HeroScene component
 * Stillness first - particles exist independently of the user
 */
export function HeroScene({ scrollProgress = 0, scrollVelocity = 0 }: HeroSceneProps) {
  return (
    <>
      <AmbientLighting />

      {/* Dust particles - the primary visual element */}
      <DustParticles count={120} scrollVelocity={scrollVelocity} />

      {/* Sparse accent particles */}
      <AccentParticles count={30} />
    </>
  );
}
