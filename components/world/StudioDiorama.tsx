/**
 * StudioDiorama - Interactive 3D Portfolio Diorama
 * ================================================
 *
 * OVERVIEW:
 * An isometric cutaway diorama showcasing Alvin's studio space with
 * interactive zones that navigate to different portfolio sections.
 * Styled like a cozy Christmas diorama with warm lighting and atmosphere.
 *
 * ARCHITECTURE:
 * ```
 * StudioDiorama
 * ├── Canvas (Three.js scene)
 * │   ├── DioramaControls (fixed camera, no rotation)
 * │   ├── SceneLighting (ambient + directional)
 * │   └── RoomContent
 * │       ├── Room (walls, floor, decorations)
 * │       ├── RoomStringLights (atmospheric)
 * │       ├── Fireplace (animated fire)
 * │       ├── Couch + CoffeeTable
 * │       └── InteractiveZones (7 project stations)
 * │           ├── FitnessCorner → /experience
 * │           ├── BasketballHoop → /projects/hoop-almanac
 * │           ├── DeveloperDesk → /projects/sculptql
 * │           ├── MentorshipStation → /projects/kevin-t-lam-portfolio
 * │           ├── RehabStation → /projects/hoparc
 * │           ├── InvestmentDesk → /projects/lacoda-capital-holdings
 * │           └── DJBooth → /#hobbies
 * ```
 *
 * INTERACTION MODEL:
 * - Camera is fixed at isometric angle (no rotation/pan/zoom)
 * - Hover over stations shows label with glow effect
 * - Click navigates to the corresponding project/section
 *
 * PERFORMANCE:
 * - Uses soft shadows with limited shadow map size (512)
 * - DPR capped at 1 for consistent performance
 * - Only main objects cast shadows, small details don't
 *
 * @example
 * ```tsx
 * <StudioDiorama />
 * ```
 */

'use client';

import * as React from 'react';
import { Suspense, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Room and atmosphere
import { Room } from './objects/Room';
import { Fireplace } from './objects/Fireplace';
import { RoomStringLights } from './objects/StringLights';

// Furniture
import { Couch } from './objects/Couch';
import { CoffeeTable } from './objects/CoffeeTable';

/* ============================================================================
 * CONFIGURATION CONSTANTS
 * ============================================================================ */

/** Room dimensions in world units */
const ROOM_WIDTH = 14;
const ROOM_DEPTH = 14;
const ROOM_HEIGHT = 5;

/** Camera configuration for isometric view */
const CAMERA_CONFIG = {
  position: [22, 10, 22] as [number, number, number],
  fov: 30,
  near: 1,
  far: 100,
} as const;

/** Scene background color */
const SCENE_BACKGROUND = '#0d1117';

/* ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================ */

/**
 * Interactive clickable zone with hover effect and label
 */
interface InteractiveZoneProps {
  position: [number, number, number];
  size: [number, number, number];
  label: string;
  href: string;
  color?: string;
  children: React.ReactNode;
}

function InteractiveZone({
  position,
  size,
  label,
  href,
  color = '#ff6b35',
  children,
}: InteractiveZoneProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const router = useRouter();

  useFrame(() => {
    if (!groupRef.current) return;
    // Subtle hover scale
    const targetScale = hovered ? 1.02 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  const handleClick = () => {
    router.push(href);
  };

  return (
    <group ref={groupRef} position={position}>
      {/* The actual object */}
      {children}

      {/* Invisible clickable box */}
      <mesh
        position={[0, size[1] / 2, 0]}
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={size} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Glow outline on hover */}
      {hovered && (
        <mesh position={[0, size[1] / 2, 0]}>
          <boxGeometry args={[size[0] + 0.05, size[1] + 0.05, size[2] + 0.05]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Label on hover */}
      {hovered && (
        <Html
          position={[0, size[1] + 0.3, 0]}
          center
          style={{
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              border: `1px solid ${color}`,
              boxShadow: `0 0 20px ${color}40`,
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * Fitness Corner - Dumbbell rack, protein shake, workout gear
 * Represents the Bring the Shreds fitness platform
 */
function FitnessCorner({ scale = 1 }: { scale?: number }) {
  const shakerRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    // Subtle shake animation on the protein shaker
    if (shakerRef.current) {
      shakerRef.current.rotation.z = Math.sin(clock.elapsedTime * 3) * 0.02;
    }
  });

  // Dumbbell component
  const Dumbbell = ({ position, rotation = [0, 0, 0], weight = 'heavy' }: {
    position: [number, number, number];
    rotation?: [number, number, number];
    weight?: 'light' | 'medium' | 'heavy';
  }) => {
    const sizes = {
      light: { handle: 0.12, plate: 0.04 },
      medium: { handle: 0.14, plate: 0.055 },
      heavy: { handle: 0.16, plate: 0.07 },
    };
    const size = sizes[weight];
    const plateColor = weight === 'heavy' ? '#1a1a1a' : weight === 'medium' ? '#2a2a2a' : '#3a3a3a';

    return (
      <group position={position} rotation={rotation}>
        {/* Handle - no shadow for small objects */}
        <mesh>
          <cylinderGeometry args={[0.012, 0.012, size.handle, 12]} />
          <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Grip texture */}
        <mesh>
          <cylinderGeometry args={[0.014, 0.014, size.handle * 0.6, 12]} />
          <meshStandardMaterial color="#222222" roughness={0.9} />
        </mesh>
        {/* Left plates */}
        <mesh position={[0, -size.handle / 2 + 0.01, 0]}>
          <cylinderGeometry args={[size.plate, size.plate, 0.02, 16]} />
          <meshStandardMaterial color={plateColor} roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[0, -size.handle / 2 - 0.01, 0]}>
          <cylinderGeometry args={[size.plate * 0.85, size.plate * 0.85, 0.015, 16]} />
          <meshStandardMaterial color={plateColor} roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Right plates */}
        <mesh position={[0, size.handle / 2 - 0.01, 0]}>
          <cylinderGeometry args={[size.plate, size.plate, 0.02, 16]} />
          <meshStandardMaterial color={plateColor} roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[0, size.handle / 2 + 0.01, 0]}>
          <cylinderGeometry args={[size.plate * 0.85, size.plate * 0.85, 0.015, 16]} />
          <meshStandardMaterial color={plateColor} roughness={0.6} metalness={0.4} />
        </mesh>
      </group>
    );
  };

  return (
    <group scale={scale}>
      {/* Workout bench */}
      <group position={[0, 0, 0.1]}>
        {/* Bench pad - main piece casts shadow */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.25, 0.06, 0.5]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        {/* Bench frame - no shadow for small frame */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.45]} />
          <meshStandardMaterial color="#333333" metalness={0.7} />
        </mesh>
        {/* Legs - no shadows for small details */}
        {[[-0.08, 0.05, 0.18], [0.08, 0.05, 0.18], [-0.08, 0.05, -0.18], [0.08, 0.05, -0.18]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={[0.03, 0.1, 0.03]} />
            <meshStandardMaterial color="#333333" metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Dumbbell rack */}
      <group position={[-0.25, 0, -0.15]}>
        {/* Rack frame - main piece casts shadow */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.08, 0.3, 0.25]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.6} />
        </mesh>
        {/* Rack shelves - no shadows for small shelves */}
        {[0.08, 0.18, 0.28].map((y, i) => (
          <mesh key={i} position={[0.05, y, 0]}>
            <boxGeometry args={[0.1, 0.015, 0.22]} />
            <meshStandardMaterial color="#333333" metalness={0.7} />
          </mesh>
        ))}
        {/* Dumbbells on rack */}
        <Dumbbell position={[0.08, 0.1, 0.06]} rotation={[0, 0, Math.PI / 2]} weight="heavy" />
        <Dumbbell position={[0.08, 0.1, -0.06]} rotation={[0, 0, Math.PI / 2]} weight="heavy" />
        <Dumbbell position={[0.08, 0.2, 0.06]} rotation={[0, 0, Math.PI / 2]} weight="medium" />
        <Dumbbell position={[0.08, 0.2, -0.06]} rotation={[0, 0, Math.PI / 2]} weight="medium" />
        <Dumbbell position={[0.08, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} weight="light" />
      </group>

      {/* Protein shaker on floor - no shadows for small props */}
      <group ref={shakerRef} position={[0.2, 0.08, 0.25]}>
        {/* Shaker body */}
        <mesh>
          <cylinderGeometry args={[0.035, 0.03, 0.12, 16]} />
          <meshStandardMaterial color="#111111" roughness={0.4} />
        </mesh>
        {/* Lid */}
        <mesh position={[0, 0.065, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.02, 16]} />
          <meshStandardMaterial color="#e53935" roughness={0.5} />
        </mesh>
        {/* Flip cap */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.02, 12]} />
          <meshStandardMaterial color="#e53935" roughness={0.5} />
        </mesh>
        {/* Logo stripe */}
        <mesh position={[0, 0, 0.031]}>
          <planeGeometry args={[0.04, 0.06]} />
          <meshStandardMaterial color="#e53935" roughness={0.6} />
        </mesh>
      </group>

      {/* Gym towel draped on bench - no shadow for small prop */}
      <mesh position={[0.08, 0.27, 0.15]} rotation={[0.1, 0.2, 0.05]}>
        <boxGeometry args={[0.15, 0.01, 0.08]} />
        <meshStandardMaterial color="#1565c0" roughness={0.95} />
      </mesh>

      {/* Kettlebell - no shadows for small props */}
      <group position={[0.28, 0, -0.1]}>
        {/* Ball */}
        <mesh position={[0, 0.045, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Handle */}
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[0.025, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Flat bottom */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>

      {/* Yoga mat rolled up - no shadow for small prop */}
      <group position={[-0.15, 0.025, 0.3]} rotation={[0, 0.3, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.025, 0.025, 0.35, 16]} />
          <meshStandardMaterial color="#7b1fa2" roughness={0.9} />
        </mesh>
        {/* Mat strap */}
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[0.028, 0.003, 8, 16]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <torusGeometry args={[0.028, 0.003, 8, 16]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>

      {/* Water bottle - no shadows for small props */}
      <group position={[0.12, 0.06, -0.2]}>
        <mesh>
          <cylinderGeometry args={[0.025, 0.022, 0.1, 12]} />
          <meshStandardMaterial color="#0288d1" transparent opacity={0.7} roughness={0.2} />
        </mesh>
        {/* Cap */}
        <mesh position={[0, 0.055, 0]}>
          <cylinderGeometry args={[0.018, 0.02, 0.02, 12]} />
          <meshStandardMaterial color="#01579b" roughness={0.5} />
        </mesh>
      </group>

      {/* Resistance band - no shadow for small prop */}
      <mesh position={[-0.05, 0.26, 0.22]} rotation={[0.5, 0.2, 0]}>
        <torusGeometry args={[0.04, 0.006, 8, 24]} />
        <meshStandardMaterial color="#ff7043" roughness={0.8} />
      </mesh>

      {/* Energetic lighting */}
      <pointLight position={[0, 0.6, 0]} intensity={0.4} color="#ffffff" distance={2} />
      <pointLight position={[-0.2, 0.4, 0.2]} intensity={0.2} color="#e53935" distance={1.5} />
    </group>
  );
}

/**
 * Professional DJ Setup - Two CDJs + Mixer + Headphones
 * Full DJ booth like you'd see at a club
 */
function DJBooth({ scale = 1 }: { scale?: number }) {
  const vinyl1Ref = useRef<THREE.Group>(null);
  const vinyl2Ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (vinyl1Ref.current) {
      vinyl1Ref.current.rotation.y = clock.elapsedTime * 0.6;
    }
    if (vinyl2Ref.current) {
      vinyl2Ref.current.rotation.y = clock.elapsedTime * 0.65;
    }
  });

  // CDJ unit component - main body casts shadow, details don't
  const CDJ = ({ position, vinylRef }: { position: [number, number, number]; vinylRef: React.RefObject<THREE.Group | null> }) => (
    <group position={position}>
      {/* CDJ Body - main piece casts shadow */}
      <mesh castShadow>
        <boxGeometry args={[0.28, 0.08, 0.32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Jog wheel base - no shadow for detail */}
      <mesh position={[0, 0.045, 0.02]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Spinning platter */}
      <group ref={vinylRef} position={[0, 0.06, 0.02]}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.09, 0.015, 32]} />
          <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Center dot */}
        <mesh position={[0, 0.008, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.005, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        {/* Platter dots for visual rotation */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 0.07, 0.008, Math.sin(angle) * 0.07]}>
            <cylinderGeometry args={[0.005, 0.005, 0.003, 8]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
        ))}
      </group>

      {/* Screen */}
      <mesh position={[0, 0.041, -0.1]}>
        <boxGeometry args={[0.12, 0.002, 0.06]} />
        <meshStandardMaterial color="#001122" emissive="#0066ff" emissiveIntensity={0.3} />
      </mesh>

      {/* Buttons row - no shadows for tiny buttons */}
      {[-0.08, -0.04, 0, 0.04, 0.08].map((x, i) => (
        <mesh key={i} position={[x, 0.041, 0.12]}>
          <boxGeometry args={[0.02, 0.01, 0.02]} />
          <meshStandardMaterial color={i === 2 ? '#22cc44' : '#333333'} emissive={i === 2 ? '#22cc44' : '#000000'} emissiveIntensity={i === 2 ? 0.5 : 0} />
        </mesh>
      ))}

      {/* Pitch fader - no shadows for small controls */}
      <mesh position={[0.11, 0.041, 0]}>
        <boxGeometry args={[0.015, 0.01, 0.12]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.11, 0.046, 0.02]}>
        <boxGeometry args={[0.02, 0.01, 0.025]} />
        <meshStandardMaterial color="#666666" metalness={0.6} />
      </mesh>
    </group>
  );

  return (
    <group scale={scale}>
      {/* DJ Table/Booth */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.04, 0.5]} />
        <meshStandardMaterial color="#1a1512" roughness={0.8} />
      </mesh>

      {/* Table front panel - no shadow for thin panel */}
      <mesh position={[0, 0.14, 0.23]}>
        <boxGeometry args={[0.88, 0.28, 0.02]} />
        <meshStandardMaterial color="#151210" roughness={0.9} />
      </mesh>

      {/* Table legs - no shadows for small legs */}
      {[[-0.4, 0.14, -0.2], [0.4, 0.14, -0.2], [-0.4, 0.14, 0.2], [0.4, 0.14, 0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.04, 0.28, 0.04]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}

      {/* Left CDJ */}
      <CDJ position={[-0.28, 0.34, 0]} vinylRef={vinyl1Ref} />

      {/* Right CDJ */}
      <CDJ position={[0.28, 0.34, 0]} vinylRef={vinyl2Ref} />

      {/* Mixer in the center */}
      <group position={[0, 0.34, 0]}>
        {/* Mixer body - main piece casts shadow */}
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.06, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Channel faders */}
        {[-0.06, -0.02, 0.02, 0.06].map((x, i) => (
          <group key={i} position={[x, 0.031, 0.08]}>
            <mesh>
              <boxGeometry args={[0.015, 0.005, 0.08]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            <mesh position={[0, 0.005, -0.02 + i * 0.01]}>
              <boxGeometry args={[0.02, 0.01, 0.015]} />
              <meshStandardMaterial color="#888888" metalness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Crossfader */}
        <group position={[0, 0.031, 0.12]}>
          <mesh>
            <boxGeometry args={[0.1, 0.005, 0.02]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0.02, 0.005, 0]}>
            <boxGeometry args={[0.025, 0.01, 0.025]} />
            <meshStandardMaterial color="#888888" metalness={0.7} />
          </mesh>
        </group>

        {/* EQ knobs - colored, no shadows for tiny knobs */}
        {[-0.06, -0.02, 0.02, 0.06].map((x, i) => (
          <group key={i}>
            {[-0.08, -0.04, 0].map((z, j) => (
              <mesh key={j} position={[x, 0.035, z]}>
                <cylinderGeometry args={[0.012, 0.012, 0.015, 16]} />
                <meshStandardMaterial color={j === 0 ? '#cc4444' : j === 1 ? '#44cc44' : '#4444cc'} roughness={0.5} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Level meters */}
        <mesh position={[0, 0.031, -0.1]}>
          <boxGeometry args={[0.06, 0.01, 0.04]} />
          <meshStandardMaterial color="#001100" emissive="#00ff00" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Headphones on the side */}
      <group position={[0.42, 0.36, 0.1]} rotation={[0.3, 0.5, 0.1]}>
        <mesh>
          <torusGeometry args={[0.06, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
        <mesh position={[-0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.025, 16]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
        </mesh>
        <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.025, 16]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
        </mesh>
        <mesh position={[-0.06, 0, 0.015]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
          <meshStandardMaterial color="#333333" roughness={0.9} />
        </mesh>
        <mesh position={[0.06, 0, 0.015]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
          <meshStandardMaterial color="#333333" roughness={0.9} />
        </mesh>
      </group>

      {/* Laptop on stand behind CDJs - laptop screen casts shadow, base doesn't */}
      <group position={[0, 0.45, -0.18]}>
        <mesh position={[0, -0.03, 0]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.2, 0.005, 0.12]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.18, 0.008, 0.11]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.06, -0.04]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.17, 0.1, 0.005]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.06, -0.037]} rotation={[0.3, 0, 0]}>
          <planeGeometry args={[0.15, 0.085]} />
          <meshStandardMaterial color="#0a1520" emissive="#3366ff" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* USB drives - no shadows for tiny props */}
      <mesh position={[-0.28, 0.31, 0.17]}>
        <boxGeometry args={[0.015, 0.01, 0.03]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.28, 0.31, 0.17]}>
        <boxGeometry args={[0.015, 0.01, 0.03]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Warm DJ booth lighting */}
      <pointLight position={[0, 0.8, 0]} intensity={0.5} color="#ffaa55" distance={2.5} />
      <pointLight position={[-0.3, 0.5, 0.2]} intensity={0.2} color="#ff6644" distance={1.5} />
      <pointLight position={[0.3, 0.5, 0.2]} intensity={0.2} color="#ff6644" distance={1.5} />
    </group>
  );
}

/**
 * Inline Basketball Hoop component
 */
function BasketballHoop({ scale = 1 }: { scale?: number }) {
  const ballRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ballRef.current) {
      ballRef.current.rotation.y = clock.elapsedTime * 0.15;
    }
  });

  return (
    <group scale={scale}>
      {/* Pole - main structure casts shadow */}
      <mesh position={[0, 0.4, -0.08]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.8, 12]} />
        <meshStandardMaterial color="#333333" metalness={0.6} />
      </mesh>
      {/* Base - no shadow for small base */}
      <mesh position={[0, 0.03, -0.08]}>
        <boxGeometry args={[0.2, 0.06, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Backboard - main piece casts shadow */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.45, 0.3, 0.015]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Rim - no shadow for thin rim */}
      <mesh position={[0, 0.62, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.075, 0.008, 12, 24]} />
        <meshStandardMaterial color="#ff6b35" metalness={0.8} />
      </mesh>
      {/* Basketball - no shadow for small ball */}
      <mesh ref={ballRef} position={[0.15, 0.06, 0.2]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ff6b35" roughness={0.85} />
      </mesh>
    </group>
  );
}

/**
 * Inline Developer Desk component
 */
function DeveloperDesk({ scale = 1 }: { scale?: number }) {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group scale={scale}>
      {/* Desk - main piece casts shadow */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.6, 0.025, 0.35]} />
        <meshStandardMaterial color="#2d1f14" roughness={0.7} />
      </mesh>
      {/* Legs - no shadows for small legs */}
      {[[-0.27, 0.14, 0.15], [0.27, 0.14, 0.15], [-0.27, 0.14, -0.15], [0.27, 0.14, -0.15]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.025, 0.28, 0.025]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0, 0.295, -0.1]}>
        {/* Monitor stand - no shadow for small stand */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.02, 16]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.6} />
        </mesh>
        {/* Monitor screen - casts shadow */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.22, 0.14, 0.012]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh ref={screenRef} position={[0, 0.16, 0.007]}>
          <planeGeometry args={[0.2, 0.12]} />
          <meshStandardMaterial color="#0f0f1a" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Chair - seat casts shadow, back doesn't */}
      <group position={[0, 0, 0.35]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.15, 0.02, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.28, 0.06]}>
          <boxGeometry args={[0.14, 0.18, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Cool light */}
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color="#60a5fa" distance={1.5} />
    </group>
  );
}

/**
 * Investment Desk - For Lacoda Capital Holdings
 * Asset Management themed with multiple monitors, portfolio dashboard, roadmap board
 */
function InvestmentDesk({ scale = 1 }: { scale?: number }) {
  const screen1Ref = useRef<THREE.Mesh>(null);
  const screen2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (screen1Ref.current) {
      const material = screen1Ref.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.4 + Math.sin(clock.elapsedTime * 1.5) * 0.1;
    }
    if (screen2Ref.current) {
      const material = screen2Ref.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.35 + Math.sin(clock.elapsedTime * 1.2 + 1) * 0.1;
    }
  });

  return (
    <group scale={scale}>
      {/* Large executive desk */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.9, 0.03, 0.5]} />
        <meshStandardMaterial color="#1a1512" roughness={0.6} />
      </mesh>
      {/* Desk legs */}
      {[[-0.4, 0.12, 0.2], [0.4, 0.12, 0.2], [-0.4, 0.12, -0.2], [0.4, 0.12, -0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.04, 0.24, 0.04]} />
          <meshStandardMaterial color="#0d0a08" />
        </mesh>
      ))}

      {/* Primary monitor - Portfolio dashboard */}
      <group position={[-0.15, 0.27, -0.18]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.02, 16]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.015]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh ref={screen1Ref} position={[0, 0.16, 0.008]}>
          <planeGeometry args={[0.28, 0.18]} />
          <meshStandardMaterial color="#0a1520" emissive="#22c55e" emissiveIntensity={0.4} />
        </mesh>
        {/* Asset allocation pie chart representation */}
        <mesh position={[-0.08, 0.16, 0.009]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.4} />
        </mesh>
        {/* Portfolio value line */}
        {[-0.04, 0, 0.04, 0.08].map((x, i) => (
          <mesh key={i} position={[x + 0.04, 0.12 + Math.sin(i * 0.8) * 0.02, 0.009]}>
            <boxGeometry args={[0.03, 0.01, 0.001]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* Secondary monitor - Market data */}
      <group position={[0.2, 0.27, -0.18]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.02, 16]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.26, 0.18, 0.015]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh ref={screen2Ref} position={[0, 0.16, 0.008]}>
          <planeGeometry args={[0.24, 0.16]} />
          <meshStandardMaterial color="#0a1520" emissive="#f59e0b" emissiveIntensity={0.35} />
        </mesh>
        {/* Market ticker bars */}
        {[-0.06, -0.02, 0.02, 0.06].map((x, i) => (
          <mesh key={i} position={[x, 0.12 + (i % 2) * 0.015, 0.009]}>
            <boxGeometry args={[0.025, 0.05 + (i % 3) * 0.015, 0.001]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#22c55e" : "#ef4444"} emissive={i % 2 === 0 ? "#22c55e" : "#ef4444"} emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>

      {/* Roadmap board on wall behind */}
      <group position={[0, 0.5, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.3, 0.02]} />
          <meshStandardMaterial color="#f5f5f0" roughness={0.9} />
        </mesh>
        {/* Roadmap sticky notes */}
        {[[-0.15, 0.05], [0, 0.05], [0.15, 0.05], [-0.08, -0.05], [0.08, -0.05]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.011]}>
            <planeGeometry args={[0.08, 0.06]} />
            <meshStandardMaterial color={['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff'][i]} />
          </mesh>
        ))}
        {/* "ROADMAP" label */}
        <mesh position={[0, 0.12, 0.011]}>
          <planeGeometry args={[0.15, 0.03]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Documents/reports stack */}
      <mesh position={[-0.35, 0.28, 0.1]}>
        <boxGeometry args={[0.1, 0.025, 0.14]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.9} />
      </mesh>

      {/* Coffee mug */}
      <group position={[0.35, 0.27, 0.12]}>
        <mesh>
          <cylinderGeometry args={[0.025, 0.02, 0.05, 12]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Handle */}
        <mesh position={[0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.015, 0.005, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Executive chair */}
      <group position={[0, 0, 0.4]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.2, 0.05, 0.2]} />
          <meshStandardMaterial color="#1a3a1a" />
        </mesh>
        <mesh position={[0, 0.4, 0.08]}>
          <boxGeometry args={[0.19, 0.32, 0.04]} />
          <meshStandardMaterial color="#1a3a1a" />
        </mesh>
      </group>

      {/* Warm professional lighting */}
      <pointLight position={[0, 0.7, 0]} intensity={0.5} color="#ffd700" distance={2} />
    </group>
  );
}

/**
 * Rehab Station - For Hoparc
 * Physiotherapy and rehabilitation center themed
 * Treatment table, exercise equipment, medical display
 */
function RehabStation({ scale = 1 }: { scale?: number }) {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group scale={scale}>
      {/* Treatment/massage table */}
      <group position={[0, 0, 0]}>
        {/* Table top with padding */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.5, 0.06, 0.22]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.9} />
        </mesh>
        {/* Head rest */}
        <mesh position={[-0.22, 0.3, 0]} castShadow>
          <boxGeometry args={[0.1, 0.04, 0.15]} />
          <meshStandardMaterial color="#d4d4d4" roughness={0.9} />
        </mesh>
        {/* Table frame */}
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.45, 0.02, 0.18]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.5} />
        </mesh>
        {/* Legs */}
        {[[-0.18, 0.07, 0.06], [0.18, 0.07, 0.06], [-0.18, 0.07, -0.06], [0.18, 0.07, -0.06]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
            <meshStandardMaterial color="#333333" metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Exercise/therapy ball */}
      <mesh position={[0.35, 0.12, 0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.8} />
      </mesh>

      {/* Resistance bands hanging */}
      <group position={[-0.35, 0.3, 0]}>
        {['#ef4444', '#22c55e', '#3b82f6'].map((color, i) => (
          <mesh key={i} position={[0, -i * 0.06, 0]} rotation={[0, 0, 0.2]}>
            <torusGeometry args={[0.04, 0.008, 8, 16]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Small tablet/screen showing patient progress */}
      <group position={[0.3, 0.35, -0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.08, 0.01]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh ref={screenRef} position={[0, 0, 0.006]}>
          <planeGeometry args={[0.1, 0.06]} />
          <meshStandardMaterial color="#0a1520" emissive="#22c55e" emissiveIntensity={0.3} />
        </mesh>
        {/* Progress bar */}
        <mesh position={[-0.02, 0, 0.007]}>
          <planeGeometry args={[0.05, 0.015]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Foam roller */}
      <mesh position={[-0.2, 0.04, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Hand weights */}
      {[[0.15, 0.025, 0.2], [0.22, 0.025, 0.2]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
            <meshStandardMaterial color="#666666" metalness={0.7} />
          </mesh>
          <mesh position={[-0.035, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
            <meshStandardMaterial color="#333333" metalness={0.6} />
          </mesh>
          <mesh position={[0.035, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
            <meshStandardMaterial color="#333333" metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Clean medical lighting */}
      <pointLight position={[0, 0.6, 0]} intensity={0.5} color="#ffffff" distance={2} />
      <pointLight position={[0.3, 0.4, 0.1]} intensity={0.2} color="#22c55e" distance={1} />
    </group>
  );
}

/**
 * Mentorship Station - For Kevin T Lam Portfolio
 * Pair programming setup with two laptops side by side
 * Represents mentorship and collaborative development
 */
function MentorshipStation({ scale = 1 }: { scale?: number }) {
  const screen1Ref = useRef<THREE.Mesh>(null);
  const screen2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (screen1Ref.current) {
      const material = screen1Ref.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.1;
    }
    if (screen2Ref.current) {
      const material = screen2Ref.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.45 + Math.sin(clock.elapsedTime * 1.8 + 0.5) * 0.1;
    }
  });

  // Laptop component
  const Laptop = ({ position, screenRef, screenColor }: {
    position: [number, number, number];
    screenRef: React.RefObject<THREE.Mesh | null>;
    screenColor: string;
  }) => (
    <group position={position}>
      {/* Laptop base */}
      <mesh>
        <boxGeometry args={[0.2, 0.012, 0.14]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Keyboard area */}
      <mesh position={[0, 0.007, 0.01]}>
        <boxGeometry args={[0.16, 0.003, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Trackpad */}
      <mesh position={[0, 0.007, 0.05]}>
        <boxGeometry args={[0.06, 0.002, 0.04]} />
        <meshStandardMaterial color="#333333" roughness={0.6} />
      </mesh>
      {/* Screen (angled up) */}
      <group position={[0, 0.08, -0.065]} rotation={[-0.3, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.13, 0.008]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh ref={screenRef} position={[0, 0, 0.005]}>
          <planeGeometry args={[0.18, 0.11]} />
          <meshStandardMaterial color="#0f0f1a" emissive={screenColor} emissiveIntensity={0.5} />
        </mesh>
        {/* Code lines on screen */}
        {[-0.03, -0.01, 0.01, 0.03].map((y, i) => (
          <mesh key={i} position={[-0.04 + (i % 2) * 0.02, y, 0.006]}>
            <planeGeometry args={[0.08 + (i % 3) * 0.02, 0.008]} />
            <meshStandardMaterial color={screenColor} emissive={screenColor} emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );

  return (
    <group scale={scale}>
      {/* Long collaboration desk */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.7, 0.025, 0.4]} />
        <meshStandardMaterial color="#3d3530" roughness={0.7} />
      </mesh>
      {/* Desk legs */}
      {[[-0.3, 0.11, 0.15], [0.3, 0.11, 0.15], [-0.3, 0.11, -0.15], [0.3, 0.11, -0.15]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.03, 0.22, 0.03]} />
          <meshStandardMaterial color="#2a2520" />
        </mesh>
      ))}

      {/* Mentor's laptop (left) */}
      <Laptop
        position={[-0.18, 0.235, 0]}
        screenRef={screen1Ref}
        screenColor="#8b5cf6"
      />

      {/* Mentee's laptop (right) */}
      <Laptop
        position={[0.18, 0.235, 0]}
        screenRef={screen2Ref}
        screenColor="#3b82f6"
      />

      {/* Two chairs */}
      {/* Mentor chair */}
      <group position={[-0.18, 0, 0.32]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.14, 0.03, 0.14]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.28, 0.05]}>
          <boxGeometry args={[0.13, 0.16, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
      {/* Mentee chair */}
      <group position={[0.18, 0, 0.32]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.14, 0.03, 0.14]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.28, 0.05]}>
          <boxGeometry args={[0.13, 0.16, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Shared whiteboard behind */}
      <group position={[0, 0.45, -0.22]}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.25, 0.015]} />
          <meshStandardMaterial color="#f8f8f8" roughness={0.95} />
        </mesh>
        {/* Diagram/notes on whiteboard */}
        <mesh position={[-0.1, 0.02, 0.008]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        <mesh position={[0.1, 0.02, 0.008]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
        {/* Arrow between circles */}
        <mesh position={[0, 0.02, 0.008]}>
          <boxGeometry args={[0.08, 0.01, 0.001]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Notes */}
        {[-0.12, 0, 0.12].map((x, i) => (
          <mesh key={i} position={[x, -0.06, 0.008]}>
            <boxGeometry args={[0.06, 0.02, 0.001]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        ))}
      </group>

      {/* Coffee cups - pair programming fuel */}
      {[[-0.32, 0.24, 0.08], [0.32, 0.24, 0.08]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.018, 0.015, 0.035, 10]} />
            <meshStandardMaterial color={i === 0 ? "#1a1a1a" : "#f5f5f5"} />
          </mesh>
        </group>
      ))}

      {/* Collaborative warm lighting */}
      <pointLight position={[0, 0.6, 0]} intensity={0.5} color="#ffd4a3" distance={2} />
      <pointLight position={[-0.2, 0.4, 0.1]} intensity={0.2} color="#8b5cf6" distance={1} />
      <pointLight position={[0.2, 0.4, 0.1]} intensity={0.2} color="#3b82f6" distance={1} />
    </group>
  );
}

/**
 * Fixed isometric camera - no rotation allowed
 * Views the diorama from a fixed corner angle like the reference image
 */
function DioramaControls() {
  return (
    <OrbitControls
      enableRotate={false}
      enableZoom={false}
      enablePan={false}
      // Target center of room at floor level for proper isometric framing
      target={[0, ROOM_HEIGHT / 4, 0]}
    />
  );
}

/**
 * Scene lighting - bright and clear
 */
function SceneLighting() {
  return (
    <>
      {/* Strong ambient for visibility */}
      <ambientLight intensity={1.2} color="#ffffff" />

      {/* Main directional light */}
      <directionalLight
        position={[10, 18, 10]}
        intensity={2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      {/* Fill lights for even illumination */}
      <directionalLight
        position={[-10, 12, 10]}
        intensity={0.8}
        color="#ffeedd"
      />
      <directionalLight
        position={[0, 10, -10]}
        intensity={0.6}
        color="#eeeeff"
      />
    </>
  );
}

/**
 * All room content with interactive zones
 */
function RoomContent() {
  return (
    <group position={[0, 0, 0]}>
      {/* === ROOM STRUCTURE === */}
      <Room
        position={[0, 0, 0]}
        width={ROOM_WIDTH}
        depth={ROOM_DEPTH}
        height={ROOM_HEIGHT}
      />

      {/* === STRING LIGHTS - Stranger Things vibe === */}
      <RoomStringLights
        roomWidth={ROOM_WIDTH}
        roomDepth={ROOM_DEPTH}
        roomHeight={ROOM_HEIGHT}
      />

      {/* === FIREPLACE - Big cozy fireplace on back wall === */}
      <Fireplace
        position={[0, 0, -ROOM_DEPTH / 2 + 0.15]}
        scale={2.2}
      />

      {/* === SEATING - Couch facing fireplace === */}
      <Couch
        position={[0, 0, -1]}
        rotation={[0, Math.PI, 0]}
        scale={2.2}
        color="#3d4540"
      />
      <CoffeeTable position={[0, 0, -3]} scale={2} />

      {/* === INTERACTIVE PROJECT ZONES - spread around the room === */}

      {/* BACK LEFT: SculptQL - Developer Desk */}
      <InteractiveZone
        position={[-ROOM_WIDTH / 2 + 3.5, 0, -ROOM_DEPTH / 2 + 3]}
        size={[3, 2, 3]}
        label="SculptQL → Database CLI"
        href="/projects/sculptql"
        color="#60a5fa"
      >
        <group rotation={[0, Math.PI / 4, 0]}>
          <DeveloperDesk scale={2.8} />
        </group>
      </InteractiveZone>

      {/* BACK RIGHT: Basketball Hoop - Hoop Almanac */}
      <InteractiveZone
        position={[ROOM_WIDTH / 2 - 3, 0, -ROOM_DEPTH / 2 + 1]}
        size={[2.5, 3, 2]}
        label="Hoop Almanac → Sports Analytics"
        href="/projects/hoop-almanac"
        color="#ffc72c"
      >
        <BasketballHoop scale={2.5} />
      </InteractiveZone>

      {/* LEFT WALL MIDDLE: Kevin T Lam - Mentorship Station */}
      <InteractiveZone
        position={[-ROOM_WIDTH / 2 + 3, 0, 0]}
        size={[3.5, 2, 3.5]}
        label="Kevin T Lam → Mentorship"
        href="/projects/kevin-t-lam-portfolio"
        color="#8b5cf6"
      >
        <group rotation={[0, Math.PI / 2, 0]}>
          <MentorshipStation scale={2.5} />
        </group>
      </InteractiveZone>

      {/* RIGHT WALL MIDDLE: Hoparc - Rehab Station */}
      <InteractiveZone
        position={[ROOM_WIDTH / 2 - 3, 0, 0]}
        size={[3, 2.5, 3]}
        label="Hoparc → Physiotherapy"
        href="/projects/hoparc"
        color="#3b82f6"
      >
        <group rotation={[0, -Math.PI / 2, 0]}>
          <RehabStation scale={2.5} />
        </group>
      </InteractiveZone>

      {/* FRONT LEFT: Fitness - Bring the Shreds */}
      <InteractiveZone
        position={[-ROOM_WIDTH / 2 + 3.5, 0, ROOM_DEPTH / 2 - 3.5]}
        size={[3, 2, 3]}
        label="Bring the Shreds → Fitness CMS"
        href="/experience"
        color="#e53935"
      >
        <group rotation={[0, Math.PI / 4, 0]}>
          <FitnessCorner scale={2.8} />
        </group>
      </InteractiveZone>

      {/* FRONT CENTER: Lacoda Capital Holdings */}
      <InteractiveZone
        position={[0, 0, ROOM_DEPTH / 2 - 3]}
        size={[4, 2.5, 3.5]}
        label="Lacoda Capital → Asset Management"
        href="/projects/lacoda-capital-holdings"
        color="#22c55e"
      >
        <group rotation={[0, Math.PI, 0]}>
          <InvestmentDesk scale={2.5} />
        </group>
      </InteractiveZone>

      {/* FRONT RIGHT: DJ Booth */}
      <InteractiveZone
        position={[ROOM_WIDTH / 2 - 3.5, 0, ROOM_DEPTH / 2 - 3.5]}
        size={[3.5, 2, 3.5]}
        label="DJ Hobby → CDJs & Mixing"
        href="/#hobbies"
        color="#ff6b35"
      >
        <group rotation={[0, -Math.PI / 4, 0]}>
          <DJBooth scale={2.8} />
        </group>
      </InteractiveZone>
    </group>
  );
}

/**
 * Main StudioDiorama Component
 * Auto-rotating isometric diorama with drag controls
 */
export function StudioDiorama() {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: SCENE_BACKGROUND }}>
      <Canvas
        shadows="soft"
        dpr={1}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{
          position: CAMERA_CONFIG.position,
          fov: CAMERA_CONFIG.fov,
          near: CAMERA_CONFIG.near,
          far: CAMERA_CONFIG.far,
        }}
      >
        <color attach="background" args={[SCENE_BACKGROUND]} />
        <DioramaControls />
        <Suspense fallback={null}>
          <SceneLighting />
          <RoomContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
