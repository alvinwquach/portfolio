/**
 * DJ Scene 3D Content
 * ===================
 * The 3D scene content (everything inside the Canvas).
 */

'use client';

import { memo } from 'react';
import { Turntable } from './Turntable';
import { Mixer, Speaker, Laptop, Headphones, DJBooth, Lighting, RecordCrate } from './DJEquipment';
import { PLAYLIST } from './constants';

interface SceneContentProps {
  isPlaying: boolean;
  currentTrackIndex: number;
  onTurntableClick: () => void;
}

export const SceneContent = memo(function SceneContent({
  isPlaying,
  currentTrackIndex,
  onTurntableClick,
}: SceneContentProps) {
  return (
    <>
      <Lighting />

      {/* DJ Booth */}
      <DJBooth position={[0, 0, 0]} />

      {/* Turntables */}
      <Turntable
        position={[-1, 0.05, 0]}
        color="#00d4ff"
        isPlaying={isPlaying}
        isActive={currentTrackIndex % 2 === 0}
        onClick={onTurntableClick}
      />
      <Turntable
        position={[1, 0.05, 0]}
        color="#a855f7"
        isPlaying={isPlaying}
        isActive={currentTrackIndex % 2 === 1}
        onClick={onTurntableClick}
      />

      {/* Mixer */}
      <Mixer position={[0, 0.045, 0.05]} />

      {/* Speakers */}
      <Speaker position={[-1.55, 0.24, -0.15]} />
      <Speaker position={[1.55, 0.24, -0.15]} />

      {/* Laptop with animated waveforms */}
      <Laptop position={[0, 0.045, -0.28]} isPlaying={isPlaying} />

      {/* Headphones - draped over the right turntable edge */}
      <Headphones position={[0.65, 0.12, 0.25]} rotation={[0.4, -0.5, 0.2]} />

      {/* Record crate on the floor to the left */}
      <RecordCrate position={[-1.8, -0.17, 0.3]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.32, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#2a2a35" roughness={0.85} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.5, -1.5]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#2d2d38" roughness={0.9} />
      </mesh>
    </>
  );
});

/**
 * Loader fallback for Suspense
 */
export function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="#a855f7" wireframe />
    </mesh>
  );
}
