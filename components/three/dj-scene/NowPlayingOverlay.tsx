/**
 * Now Playing Overlay
 * ===================
 * UI overlay for music controls and track info.
 */

'use client';

import { memo, useCallback } from 'react';
import type { Track } from './constants';

/**
 * Format milliseconds to mm:ss
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

interface NowPlayingOverlayProps {
  currentTrack: Track;
  isPlaying: boolean;
  isLoading: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (position: number) => void;
  trackIndex: number;
  totalTracks: number;
  progress: number;
  duration: number;
}

export const NowPlayingOverlay = memo(function NowPlayingOverlay({
  currentTrack,
  isPlaying,
  isLoading,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  trackIndex,
  totalTracks,
  progress,
  duration,
}: NowPlayingOverlayProps) {
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = clickX / rect.width;
      const seekPosition = percent * duration;
      onSeek(seekPosition);
    },
    [duration, onSeek]
  );

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
      <div className="flex flex-col items-center gap-2">
        {/* Track Info & Controls */}
        <div className="flex flex-col gap-2 bg-black/60 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
          <div className="flex items-center gap-3">
            {/* Previous */}
            <button
              onClick={onPrev}
              className="text-white/60 hover:text-white transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous track"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={onPlayPause}
              className="bg-amber hover:bg-amber/80 text-black rounded-full p-2 transition-colors disabled:opacity-50"
              aria-label={isLoading ? 'Loading' : isPlaying ? 'Pause' : 'Play'}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="animate-spin">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" />
                </svg>
              ) : isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              className="text-white/60 hover:text-white transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next track"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-white/20" />

            {/* Track Info */}
            <div className="flex flex-col min-w-0">
              <p className="text-white font-medium text-sm truncate max-w-[160px]">
                {currentTrack.title}
              </p>
              <p className="text-white/50 text-xs truncate max-w-[160px]">
                {currentTrack.artist} · {trackIndex + 1}/{totalTracks}
              </p>
            </div>
          </div>

          {/* Seek Bar */}
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-[10px] w-8 text-right">
              {formatTime(progress)}
            </span>
            <div
              className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer group relative"
              onClick={handleSeek}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={progress}
            >
              <div
                className="h-full bg-amber rounded-full relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
              </div>
            </div>
            <span className="text-white/40 text-[10px] w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
