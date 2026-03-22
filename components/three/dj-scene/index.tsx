/**
 * DJScene3D - Interactive DJ Booth with SoundCloud Integration
 * ============================================================
 *
 * OVERVIEW:
 * A 3D interactive DJ setup that plays real music from SoundCloud.
 * Users can control playback, skip tracks, and see visual feedback.
 *
 * ARCHITECTURE:
 * This component follows the Composition pattern, combining:
 * - Audio layer (SoundCloud widget via iframe)
 * - 3D visual layer (Three.js via React Three Fiber)
 * - UI control layer (React overlay)
 *
 * COMPONENT HIERARCHY:
 * ```
 * DJScene3D
 * ├── SoundCloud iframe (hidden, for audio)
 * ├── NowPlayingOverlay (UI controls)
 * └── Canvas (Three.js scene)
 *     ├── CameraRig (animated camera)
 *     ├── SceneContent (3D objects)
 *     └── EffectComposer (post-processing)
 * ```
 *
 * KEY TECHNOLOGIES:
 * - React Three Fiber: React renderer for Three.js
 * - @react-three/drei: Helper components for R3F
 * - @react-three/postprocessing: Visual effects (bloom)
 * - SoundCloud Widget API: Audio playback
 *
 * @example
 * ```tsx
 * <DJScene3D className="h-[600px]" />
 * ```
 */

'use client';

import { Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';

import { useSoundCloud } from './useSoundCloud';
import { NowPlayingOverlay } from './NowPlayingOverlay';
import { SceneContent, Loader } from './SceneContent';
import { CameraRig } from './CameraRig';
import { PLAYLIST } from './constants';

/* ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================ */

interface DJScene3DProps {
  /** Optional CSS class for the container */
  className?: string;
}

/* ============================================================================
 * CONFIGURATION
 * ============================================================================ */

/** Background color for the 3D scene (dark purple-gray) */
const SCENE_BACKGROUND_COLOR = '#1e1e2a';

/* ============================================================================
 * MAIN COMPONENT
 * ============================================================================ */

/**
 * Main DJ Scene component.
 *
 * REACT PATTERNS USED:
 * - memo: Prevents unnecessary re-renders when parent updates
 * - Suspense: Shows fallback while 3D assets load asynchronously
 * - Custom Hook (useSoundCloud): Encapsulates audio logic
 *
 * PERFORMANCE CONSIDERATIONS:
 * - dpr={[1, 2]}: Adapts pixel ratio to device (saves GPU on low-end devices)
 * - shadows="soft": Enables soft shadows (good balance of quality/performance)
 * - Suspense: Prevents render blocking while loading 3D content
 */
export const DJScene3D = memo(function DJScene3D({ className }: DJScene3DProps) {
  // Extract all audio state and controls from custom hook
  const {
    iframeRef,
    isPlaying,
    isLoading,
    currentTrackIndex,
    currentTrack,
    progress,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
  } = useSoundCloud();

  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative' }}
    >
      {/* ================================================================
       * SOUNDCLOUD IFRAME
       * ================================================================
       * Hidden iframe that hosts the SoundCloud widget.
       * Required because SoundCloud's API only works through their player.
       *
       * WHY IFRAME?
       * - SoundCloud requires their widget for playback (licensing)
       * - Widget API gives us programmatic control
       * - Audio actually plays from SoundCloud's servers
       */}
      <iframe
        ref={iframeRef}
        id="sc-widget"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(PLAYLIST[0].url)}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&single_active=false`}
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          border: 'none',
          opacity: 0,
          pointerEvents: 'none',
        }}
        allow="autoplay"
        title="SoundCloud Player"
      />

      {/* ================================================================
       * NOW PLAYING OVERLAY
       * ================================================================
       * UI layer showing track info and playback controls.
       * Sits on top of the 3D canvas using absolute positioning.
       */}
      <NowPlayingOverlay
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isLoading={isLoading}
        onPlayPause={togglePlay}
        onNext={nextTrack}
        onPrev={prevTrack}
        onSeek={seekTo}
        trackIndex={currentTrackIndex}
        totalTracks={PLAYLIST.length}
        progress={progress}
        duration={duration}
      />

      {/* ================================================================
       * THREE.JS CANVAS
       * ================================================================
       * The 3D rendering context. Everything inside <Canvas> is Three.js.
       *
       * PROPS EXPLAINED:
       * - dpr: Device Pixel Ratio - [min, max] range for adaptive quality
       * - shadows: Enable shadow rendering ("soft" uses PCF soft shadows)
       * - gl: WebGL context options (antialias smooths edges)
       */}
      <Canvas
        dpr={[1, 2]}
        shadows="soft"
        gl={{ antialias: true, alpha: false }}
      >
        {/* Animated camera with subtle breathing motion */}
        <CameraRig isPlaying={isPlaying} />

        {/* Set scene background color */}
        <color attach="background" args={[SCENE_BACKGROUND_COLOR]} />

        {/* Suspense boundary for async 3D content */}
        <Suspense fallback={<Loader />}>
          {/* All 3D objects (turntables, mixer, speakers, etc.) */}
          <SceneContent
            isPlaying={isPlaying}
            currentTrackIndex={currentTrackIndex}
            onTurntableClick={togglePlay}
          />

        </Suspense>
      </Canvas>
    </div>
  );
});

/* ============================================================================
 * RE-EXPORTS
 * ============================================================================
 * Export commonly used items for convenient imports elsewhere.
 * Allows: import { PLAYLIST, Track } from './dj-scene'
 */
export { useSoundCloud } from './useSoundCloud';
export { PLAYLIST } from './constants';
export type { Track } from './constants';
