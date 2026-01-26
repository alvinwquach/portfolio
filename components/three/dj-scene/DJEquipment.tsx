/**
 * DJ Equipment Components
 * =======================
 * Mixer, speakers, laptop, headphones, and booth.
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * DJ Mixer
 */
export function Mixer({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.05, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Top */}
      <mesh position={[0, 0.026, 0]}>
        <boxGeometry args={[0.53, 0.002, 0.48]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>

      {/* Channel strips */}
      {[-0.16, -0.053, 0.053, 0.16].map((x, i) => (
        <group key={i} position={[x, 0.035, 0]}>
          {/* Fader track */}
          <mesh>
            <boxGeometry args={[0.015, 0.005, 0.22]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          {/* Fader */}
          <mesh position={[0, 0.01, (i % 2 - 0.5) * 0.08]}>
            <boxGeometry args={[0.022, 0.012, 0.03]} />
            <meshStandardMaterial color="#666" metalness={0.8} />
          </mesh>
          {/* EQ knobs */}
          {[0.12, 0.08, 0.04].map((z, j) => (
            <mesh key={j} position={[0, 0.012, -z - 0.02]}>
              <cylinderGeometry args={[0.012, 0.012, 0.015, 16]} />
              <meshStandardMaterial
                color={['#3b82f6', '#f59e0b', '#ef4444'][j]}
                emissive={['#3b82f6', '#f59e0b', '#ef4444'][j]}
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Crossfader */}
      <mesh position={[0, 0.035, 0.2]}>
        <boxGeometry args={[0.18, 0.005, 0.02]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.02, 0.045, 0.2]}>
        <boxGeometry args={[0.035, 0.015, 0.025]} />
        <meshStandardMaterial color="#888" metalness={0.9} />
      </mesh>

      {/* VU meters */}
      {[-0.06, 0.06].map((x, i) => (
        <group key={i} position={[x, 0.04, -0.18]}>
          {[0, 1, 2, 3, 4, 5].map((j) => (
            <mesh key={j} position={[(j - 2.5) * 0.012, 0, 0]}>
              <boxGeometry args={[0.008, 0.01, 0.006]} />
              <meshStandardMaterial
                color={j < 4 ? '#22c55e' : j < 5 ? '#eab308' : '#ef4444'}
                emissive={j < 4 ? '#22c55e' : j < 5 ? '#eab308' : '#ef4444'}
                emissiveIntensity={j < 5 - i ? 1 : 0.2}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/**
 * Studio Monitor Speaker
 */
export function Speaker({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cabinet */}
      <mesh castShadow>
        <boxGeometry args={[0.28, 0.42, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
      </mesh>

      {/* Front baffle */}
      <mesh position={[0, 0, 0.126]}>
        <boxGeometry args={[0.26, 0.4, 0.002]} />
        <meshStandardMaterial color="#141414" roughness={0.9} />
      </mesh>

      {/* Woofer */}
      <group position={[0, -0.06, 0.128]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.07, 0.095, 32]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <circleGeometry args={[0.07, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <circleGeometry args={[0.025, 24]} />
          <meshStandardMaterial color="#252525" />
        </mesh>
      </group>

      {/* Tweeter */}
      <group position={[0, 0.12, 0.128]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.025, 0.035, 24]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <circleGeometry args={[0.025, 24]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.4} />
        </mesh>
      </group>

      {/* Power LED */}
      <mesh position={[0, 0.17, 0.128]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.006, 12]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
      </mesh>

      {/* Brand plate */}
      <mesh position={[0, -0.17, 0.128]}>
        <boxGeometry args={[0.08, 0.015, 0.002]} />
        <meshStandardMaterial color="#333" metalness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Animated Waveform Bar for Laptop Screen
 */
function WaveformBar({
  position,
  baseHeight,
  color,
  isPlaying,
  index,
}: {
  position: [number, number, number];
  baseHeight: number;
  color: string;
  isPlaying: boolean;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeOffset = index * 0.3;

  useFrame((state) => {
    if (!meshRef.current) return;

    if (isPlaying) {
      // Animated height based on time
      const time = state.clock.elapsedTime;
      const wave = Math.sin(time * 4 + timeOffset) * 0.5 + 0.5;
      const height = baseHeight * (0.3 + wave * 0.7);
      meshRef.current.scale.y = height / baseHeight;
    } else {
      // Static when paused
      meshRef.current.scale.y = 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.012, baseHeight, 0.001]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isPlaying ? 1.2 : 0.5}
      />
    </mesh>
  );
}

/**
 * Laptop with animated waveforms
 */
export function Laptop({
  position,
  isPlaying = false,
}: {
  position: [number, number, number];
  isPlaying?: boolean;
}) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh>
        <boxGeometry args={[0.38, 0.012, 0.26]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, 0.007, 0.02]}>
        <boxGeometry args={[0.32, 0.002, 0.16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.007, 0.1]}>
        <boxGeometry args={[0.09, 0.002, 0.055]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>

      {/* Screen */}
      <group position={[0, 0.13, -0.12]} rotation={[-0.25, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.38, 0.24, 0.008]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Display background */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[0.34, 0.21]} />
          <meshStandardMaterial color="#0f172a" emissive="#1e3a5f" emissiveIntensity={0.3} />
        </mesh>

        {/* Animated waveforms - top row (green) */}
        {Array.from({ length: 16 }).map((_, i) => (
          <WaveformBar
            key={`top-${i}`}
            position={[(i - 7.5) * 0.02, -0.02, 0.006]}
            baseHeight={0.03 + Math.sin(i * 0.7) * 0.025}
            color="#22c55e"
            isPlaying={isPlaying}
            index={i}
          />
        ))}

        {/* Animated waveforms - bottom row (purple) */}
        {Array.from({ length: 16 }).map((_, i) => (
          <WaveformBar
            key={`bottom-${i}`}
            position={[(i - 7.5) * 0.02, 0.04, 0.006]}
            baseHeight={0.025 + Math.cos(i * 0.6) * 0.02}
            color="#a855f7"
            isPlaying={isPlaying}
            index={i + 8}
          />
        ))}
      </group>
    </group>
  );
}

/**
 * Headphones
 */
export function Headphones({
  position,
  rotation = [0.2, 0.3, 0.1],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation} scale={1.8}>
      {/* Headband */}
      <mesh>
        <torusGeometry args={[0.07, 0.012, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Padding */}
      <mesh position={[0, 0.01, 0]}>
        <torusGeometry args={[0.065, 0.008, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#333" roughness={0.9} />
      </mesh>

      {/* Ear cups */}
      {[-0.07, 0.07].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.05, 0.03, 24]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
          </mesh>
          <mesh position={[i === 0 ? -0.016 : 0.016, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.032, 0.01, 8, 24]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
          </mesh>
          <mesh position={[i === 0 ? 0.016 : -0.016, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <ringGeometry args={[0.02, 0.025, 24]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * DJ Table/Booth
 */
export function DJBooth({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Table surface */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.04, 0.9]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Front panel */}
      <mesh position={[0, -0.15, 0.44]}>
        <boxGeometry args={[3.2, 0.34, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* LED strip */}
      <mesh position={[0, 0.005, 0.44]}>
        <boxGeometry args={[3.1, 0.008, 0.008]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

/**
 * Record Crate with vinyl records
 */
export function RecordCrate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Crate body */}
      <mesh>
        <boxGeometry args={[0.35, 0.3, 0.35]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>

      {/* Records stacked inside */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[-0.12 + i * 0.04, 0.02, 0]}>
          <boxGeometry args={[0.008, 0.28, 0.3]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} />
        </mesh>
      ))}

      {/* A few colored record sleeves */}
      <mesh position={[-0.08, 0.02, 0]}>
        <boxGeometry args={[0.01, 0.28, 0.3]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
      </mesh>
      <mesh position={[0.04, 0.02, 0]}>
        <boxGeometry args={[0.01, 0.28, 0.3]} />
        <meshStandardMaterial color="#4a1942" roughness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Scene Lighting
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={3} />
      <directionalLight position={[3, 5, 4]} intensity={4} castShadow />
      <directionalLight position={[-3, 4, 3]} intensity={3} />
      <directionalLight position={[0, 3, 5]} intensity={3} />
      <directionalLight position={[0, 2, 2]} intensity={2} />
      <pointLight position={[-1.2, 1, 0.5]} intensity={2} color="#00d4ff" />
      <pointLight position={[1.2, 1, 0.5]} intensity={2} color="#a855f7" />
      <pointLight position={[0, 1.5, 1]} intensity={3} color="#ffffff" />
    </>
  );
}
