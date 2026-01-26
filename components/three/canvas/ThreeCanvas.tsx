/**
 * ThreeCanvas Component
 * =====================
 * Wrapper for React Three Fiber Canvas with performance optimizations
 * and graceful degradation for devices without WebGL support.
 */

'use client';

import * as React from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { cn } from '@/lib/utils';

interface ThreeCanvasProps {
  children: React.ReactNode;
  className?: string;
  /** Enable interactive mode (pointer events) */
  interactive?: boolean;
  /** Background color */
  background?: string;
  /** Camera settings */
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
  /** Disable WebGL context on visibility change (for performance) */
  frameloop?: 'always' | 'demand' | 'never';
  /** Fallback content when WebGL is unavailable or fails */
  fallback?: React.ReactNode;
}

/**
 * Check if WebGL is available
 */
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

/**
 * Default fallback component
 */
function DefaultFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
      <div className="absolute inset-0 opacity-30">
        {/* Animated gradient background as fallback */}
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background:
              'radial-gradient(circle at 30% 40%, rgba(29, 66, 138, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255, 199, 44, 0.2) 0%, transparent 50%)',
          }}
        />
      </div>
    </div>
  );
}

/**
 * Error boundary for Three.js canvas
 */
class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error but don't break the page
    console.warn('Three.js canvas error:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export function ThreeCanvas({
  children,
  className,
  interactive = false,
  background = 'transparent',
  camera = { position: [0, 0, 5], fov: 75 },
  frameloop = 'demand',
  fallback,
}: ThreeCanvasProps) {
  const [isSupported, setIsSupported] = React.useState<boolean | null>(null);

  // Check WebGL support on mount
  React.useEffect(() => {
    setIsSupported(checkWebGLSupport());
  }, []);

  // Show nothing while checking support (prevents flash)
  if (isSupported === null) {
    return (
      <div className={cn('three-canvas-container', className)}>
        {fallback || <DefaultFallback />}
      </div>
    );
  }

  // Show fallback if WebGL is not supported
  if (!isSupported) {
    return (
      <div className={cn('three-canvas-container', className)}>
        {fallback || <DefaultFallback />}
      </div>
    );
  }

  const fallbackContent = fallback || <DefaultFallback />;

  return (
    <div
      className={cn(
        'three-canvas-container',
        interactive && 'interactive',
        className
      )}
    >
      <ThreeErrorBoundary fallback={fallbackContent}>
        <Canvas
          camera={camera}
          gl={{
            antialias: true,
            alpha: background === 'transparent',
            powerPreference: 'high-performance',
            // Graceful failure options
            failIfMajorPerformanceCaveat: true,
          }}
          dpr={[1, 2]}
          frameloop={frameloop}
          style={{ background }}
          // Handle context loss gracefully
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (event) => {
              event.preventDefault();
              console.warn('WebGL context lost');
            });
          }}
        >
          {/* Performance optimizations */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          {/* Preload all assets */}
          <Preload all />

          {/* Scene content */}
          {children}
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}
