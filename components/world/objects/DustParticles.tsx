/**
 * DustParticles - Atmospheric Floating Particles
 * ===============================================
 * Floating dust/snow particles that drift through the scene,
 * creating a cozy, atmospheric effect like in the Christmas diorama.
 */

'use client';

import * as React from 'react';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DustParticlesProps {
  /** Number of particles */
  count?: number;
  /** Bounding box size [width, height, depth] */
  bounds?: [number, number, number];
  /** Center position offset */
  position?: [number, number, number];
  /** Particle color */
  color?: string;
  /** Particle size */
  size?: number;
  /** Drift speed multiplier */
  speed?: number;
}

export function DustParticles({
  count = 100,
  bounds = [5, 3, 5],
  position = [0, 1.5, 0],
  color = '#ffffff',
  size = 0.015,
  speed = 1,
}: DustParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Initialize particle positions and velocities
  const { positions, velocities, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities: { x: number; y: number; z: number }[] = [];
    const phases: number[] = [];

    for (let i = 0; i < count; i++) {
      // Random position within bounds
      positions[i * 3] = (Math.random() - 0.5) * bounds[0];
      positions[i * 3 + 1] = Math.random() * bounds[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * bounds[2];

      // Random drift velocities (very slow)
      velocities.push({
        x: (Math.random() - 0.5) * 0.02 * speed,
        y: (Math.random() - 0.5) * 0.01 * speed - 0.005, // Slight downward bias
        z: (Math.random() - 0.5) * 0.02 * speed,
      });

      // Random phase for sine wave oscillation
      phases.push(Math.random() * Math.PI * 2);
    }

    return { positions, velocities, phases };
  }, [count, bounds, speed]);

  // Create buffer geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  // Animate particles
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const positionAttribute = pointsRef.current.geometry.getAttribute('position');
    const posArray = positionAttribute.array as Float32Array;
    const t = clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const vel = velocities[i];
      const phase = phases[i];

      // Update position with velocity
      posArray[i3] += vel.x;
      posArray[i3 + 1] += vel.y;
      posArray[i3 + 2] += vel.z;

      // Add gentle oscillation
      posArray[i3] += Math.sin(t * 0.5 + phase) * 0.001;
      posArray[i3 + 1] += Math.sin(t * 0.3 + phase * 1.5) * 0.0005;
      posArray[i3 + 2] += Math.cos(t * 0.4 + phase * 0.8) * 0.001;

      // Wrap around bounds
      if (posArray[i3] > bounds[0] / 2) posArray[i3] = -bounds[0] / 2;
      if (posArray[i3] < -bounds[0] / 2) posArray[i3] = bounds[0] / 2;
      if (posArray[i3 + 1] > bounds[1]) posArray[i3 + 1] = 0;
      if (posArray[i3 + 1] < 0) posArray[i3 + 1] = bounds[1];
      if (posArray[i3 + 2] > bounds[2] / 2) posArray[i3 + 2] = -bounds[2] / 2;
      if (posArray[i3 + 2] < -bounds[2] / 2) posArray[i3 + 2] = bounds[2] / 2;
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={position} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Exterior particles (like snow or stars outside the window)
 * These are visible in the background through the window
 */
export function ExteriorParticles({
  count = 200,
  position = [0, 0, -5],
}: {
  count?: number;
  position?: [number, number, number];
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds: number[] = [];

    for (let i = 0; i < count; i++) {
      // Spread particles in a large area behind the scene
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = -3 - Math.random() * 10; // Behind the room

      speeds.push(0.01 + Math.random() * 0.02);
    }

    return { positions, speeds };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  // Gentle falling animation
  useFrame(() => {
    if (!pointsRef.current) return;

    const positionAttribute = pointsRef.current.geometry.getAttribute('position');
    const posArray = positionAttribute.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Fall down
      posArray[i3 + 1] -= speeds[i];

      // Slight horizontal drift
      posArray[i3] += (Math.random() - 0.5) * 0.005;

      // Reset when below view
      if (posArray[i3 + 1] < -2) {
        posArray[i3 + 1] = 10;
        posArray[i3] = (Math.random() - 0.5) * 15;
      }
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={position} geometry={geometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.03}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
