/**
 * WorkshopScene - The Main 3D World
 * ==================================
 * A single explorable workshop space with distinct narrative zones.
 * Each zone represents a real part of the portfolio story.
 *
 * Layout:
 * - Center: The Court (Hoop Almanac - sports analytics)
 * - Left: Dev Tools Workbench (SculptQL - systems thinking)
 * - Right: Decision Desk (OpportuniQ - AI/judgment)
 * - Back Left: Music Corner (DJ identity)
 * - Back: Knowledge Archive (Blog/learning)
 */

'use client';

import * as React from 'react';
import { Suspense, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  PerspectiveCamera,
  OrbitControls
} from '@react-three/drei';

// Import zones
import { CourtZone } from './zones/CourtZone';
import { WorkbenchZone } from './zones/WorkbenchZone';
import { DecisionZone } from './zones/DecisionZone';
import { MusicZone } from './zones/MusicZone';
import { ArchiveZone } from './zones/ArchiveZone';

interface WorkshopContentProps {
  onNavigate: (path: string) => void;
}

/**
 * Floor - grounds the entire space
 */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#1a1a1a"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

/**
 * Ambient workshop lighting
 */
function WorkshopLighting() {
  return (
    <>
      {/* Main ambient */}
      <ambientLight intensity={0.3} />

      {/* Key light from above-front */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Fill light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#b4c7e0"
      />

      {/* Warm accent from music corner */}
      <pointLight
        position={[-6, 2, -4]}
        intensity={0.4}
        color="#ffaa55"
        distance={8}
      />

      {/* Cool accent from dev workbench */}
      <pointLight
        position={[-6, 2, 4]}
        intensity={0.3}
        color="#55aaff"
        distance={8}
      />
    </>
  );
}

/**
 * Main Workshop Scene Content
 */
function WorkshopContent({ onNavigate }: WorkshopContentProps) {
  return (
    <>
      <WorkshopLighting />

      {/* Ground plane */}
      <Floor />

      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={10}
      />

      {/* === ZONES === */}

      {/* Center: The Court (Hoop Almanac) */}
      <CourtZone
        position={[0, 0, 0]}
        onNavigate={() => onNavigate('/projects/hoop-almanac')}
      />

      {/* Left: Dev Tools Workbench (SculptQL) */}
      <WorkbenchZone
        position={[-6, 0, 3]}
        rotation={[0, Math.PI / 4, 0]}
        onNavigate={() => onNavigate('/projects/sculptql')}
      />

      {/* Right: Decision Desk (OpportuniQ) */}
      <DecisionZone
        position={[6, 0, 0]}
        rotation={[0, -Math.PI / 4, 0]}
        onNavigate={() => onNavigate('/projects/opportuniq')}
      />

      {/* Back Left: Music Corner */}
      <MusicZone position={[-5, 0, -5]} rotation={[0, Math.PI / 3, 0]} />

      {/* Back: Knowledge Archive */}
      <ArchiveZone position={[0, 0, -8]} />
    </>
  );
}

/**
 * Main exported component
 */
export function WorkshopScene() {
  const router = useRouter();

  const handleNavigate = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  return (
    <div className="absolute inset-0">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera
          makeDefault
          position={[0, 4, 12]}
          fov={50}
        />

        {/* Allow subtle orbit for exploration */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          rotateSpeed={0.3}
        />

        <Suspense fallback={null}>
          <WorkshopContent onNavigate={handleNavigate} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
