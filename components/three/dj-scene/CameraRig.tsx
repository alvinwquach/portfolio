/**
 * CameraRig Component
 * ===================
 *
 * PURPOSE:
 * Creates a subtle, breathing camera motion that adds life to the 3D DJ scene.
 * The motion intensity increases when music is playing.
 *
 * THREE.JS CONCEPTS:
 * - PerspectiveCamera: Simulates human eye perspective with depth perception
 * - useFrame: React Three Fiber hook that runs on every animation frame (~60fps)
 * - Vector3: Three.js class for 3D coordinates (x, y, z)
 *
 * ANIMATION TECHNIQUE:
 * Uses sine/cosine waves with different frequencies to create organic,
 * non-repetitive motion. Each axis moves at different speeds to avoid
 * mechanical-looking loops.
 *
 * @example
 * ```tsx
 * <CameraRig isPlaying={true} />
 * ```
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/* ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================ */

interface CameraRigProps {
  /** When true, camera sway is more pronounced */
  isPlaying: boolean;
}

/* ============================================================================
 * CONFIGURATION CONSTANTS
 * ============================================================================
 * Extracted for easy tweaking and documentation
 */

/** Base camera position in 3D space */
const BASE_POSITION = { x: 0, y: 0.6, z: 3.2 };

/** Camera field of view in degrees (50 is moderate, like human vision) */
const CAMERA_FOV = 50;

/** Sway amplitude (how far the camera moves) */
const SWAY_CONFIG = {
  x: { amplitude: 0.015, frequency: 0.5 },
  y: { amplitude: 0.008, frequency: 0.3 },
  z: { amplitude: 0.01, frequency: 0.4 },
  rotation: { amplitude: 0.003, frequency: 0.2 },
} as const;

/** Intensity multiplier when music is NOT playing */
const IDLE_INTENSITY = 0.3;

/* ============================================================================
 * COMPONENT
 * ============================================================================ */

/**
 * Animated camera with subtle breathing motion.
 *
 * REACT PATTERN: Uses useRef to persist the camera reference across renders
 * without causing re-renders when the ref changes.
 *
 * PERFORMANCE: useFrame runs outside React's render cycle, directly
 * manipulating Three.js objects for smooth 60fps animation.
 */
export function CameraRig({ isPlaying }: CameraRigProps) {
  // Ref to the Three.js camera object - allows direct manipulation
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Store base position in ref to avoid recreating Vector3 every frame
  const basePosition = useRef(new THREE.Vector3(BASE_POSITION.x, BASE_POSITION.y, BASE_POSITION.z));

  /**
   * Animation loop - runs every frame (~60fps)
   *
   * IMPORTANT: Never update React state in useFrame - it would cause
   * 60 re-renders per second! Only mutate Three.js objects directly.
   */
  useFrame(({ clock }) => {
    if (!cameraRef.current) return;

    const t = clock.elapsedTime;
    const intensity = isPlaying ? 1 : IDLE_INTENSITY;

    // Calculate offset using trigonometric functions
    // Different frequencies prevent the motion from looking like a simple loop
    const swayX = Math.sin(t * SWAY_CONFIG.x.frequency) * SWAY_CONFIG.x.amplitude * intensity;
    const swayY = Math.sin(t * SWAY_CONFIG.y.frequency) * SWAY_CONFIG.y.amplitude * intensity;
    const swayZ = Math.cos(t * SWAY_CONFIG.z.frequency) * SWAY_CONFIG.z.amplitude * intensity;

    // Apply position offset
    cameraRef.current.position.set(
      basePosition.current.x + swayX,
      basePosition.current.y + swayY,
      basePosition.current.z + swayZ
    );

    // Subtle rotation sway (roll)
    cameraRef.current.rotation.z = Math.sin(t * SWAY_CONFIG.rotation.frequency) * SWAY_CONFIG.rotation.amplitude * intensity;
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault  // Makes this the active camera for the scene
      position={[BASE_POSITION.x, BASE_POSITION.y, BASE_POSITION.z]}
      fov={CAMERA_FOV}
    />
  );
}
