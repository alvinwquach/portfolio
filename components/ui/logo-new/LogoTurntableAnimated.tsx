'use client';

/**
 * Animated Turntable Logo
 * =======================
 * Interactive turntable with spinning vinyl and play/pause control.
 */

import { useState } from 'react';
import type { LogoProps } from './types';
import { WARRIORS, NINERS, NEUTRAL } from './colors';

interface LogoTurntableAnimatedProps extends LogoProps {
  /** Start spinning automatically (initial state) */
  autoPlay?: boolean;
  /** External control for playing state (overrides internal state) */
  playing?: boolean;
  /** Show play/pause button */
  showControls?: boolean;
}

export function LogoTurntableAnimated({
  className,
  size = 64,
  autoPlay = false,
  playing,
  showControls = true,
}: LogoTurntableAnimatedProps) {
  const [internalPlaying, setInternalPlaying] = useState(autoPlay);
  // Use external control if provided, otherwise use internal state
  const isPlaying = playing !== undefined ? playing : internalPlaying;
  const setIsPlaying = setInternalPlaying;

  const width = size;
  const height = size * 0.75;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 96 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Alvin Quach turntable logo"
    >
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .vinyl-spin {
            transform-origin: 36px 38px;
            animation: spin 2s linear infinite;
            animation-play-state: ${isPlaying ? 'running' : 'paused'};
          }
        `}
      </style>

      {/* Main deck body */}
      <rect
        x="4"
        y="4"
        width="88"
        height="64"
        rx="6"
        fill={NEUTRAL.dark}
        stroke={NEUTRAL.border}
        strokeWidth="2"
      />

      {/* Split color accent line at top */}
      <rect x="4" y="4" width="44" height="4" rx="2" fill={WARRIORS.blue} opacity="0.7" />
      <rect x="48" y="4" width="44" height="4" rx="2" fill={NINERS.red} opacity="0.7" />

      {/* Platter ring */}
      <circle cx="36" cy="38" r="26" fill="#222" stroke="#333" strokeWidth="2" />

      {/* Spinning vinyl group */}
      <g className="vinyl-spin">
        {/* Vinyl/Basketball surface */}
        <circle cx="36" cy="38" r="22" fill={WARRIORS.gold} />

        {/* Vinyl grooves */}
        <circle cx="36" cy="38" r="18" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
        <circle cx="36" cy="38" r="14" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
        <circle cx="36" cy="38" r="10" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />

        {/* Basketball seams */}
        <line x1="36" y1="16" x2="36" y2="60" stroke="#000" strokeWidth="1.5" opacity="0.3" />
        <line x1="14" y1="38" x2="58" y2="38" stroke="#000" strokeWidth="1.5" opacity="0.3" />
        <path d="M24 22 Q36 30 24 54" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.3" />
        <path d="M48 22 Q36 30 48 54" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.3" />

        {/* Football center label */}
        <ellipse cx="36" cy="38" rx="6" ry="4" fill={NINERS.red} stroke={NINERS.gold} strokeWidth="0.5" />
        <line x1="36" y1="35" x2="36" y2="41" stroke={NINERS.gold} strokeWidth="1" />
        <line x1="34" y1="36.5" x2="38" y2="36.5" stroke={NINERS.gold} strokeWidth="0.75" />
        <line x1="34" y1="38" x2="38" y2="38" stroke={NINERS.gold} strokeWidth="0.75" />
        <line x1="34" y1="39.5" x2="38" y2="39.5" stroke={NINERS.gold} strokeWidth="0.75" />
      </g>

      {/* Spindle hole (doesn't spin) */}
      <circle cx="36" cy="38" r="1" fill="#111" />

      {/* Tonearm base */}
      <circle cx="72" cy="20" r="6" fill="#333" stroke={WARRIORS.gold} strokeWidth="1" />

      {/* Tonearm - on record when playing, off to the right when paused */}
      <g style={{
        transform: isPlaying ? 'rotate(-15deg)' : 'rotate(45deg)',
        transformOrigin: '72px 20px',
        transition: 'transform 0.5s ease-out'
      }}>
        <path
          d="M72 20 L66 38 L58 38"
          stroke={WARRIORS.gold}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M62 34 L56 38 L62 42"
          stroke={WARRIORS.gold}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="56" cy="38" r="1.5" fill={NINERS.red} />
      </g>

      {/* Pitch slider - shortened to make room for play button */}
      <rect x="76" y="30" width="8" height="18" rx="2" fill="#222" stroke="#333" strokeWidth="1" />
      <rect x="78" y="34" width="4" height="6" rx="1" fill={WARRIORS.gold} />

      {/* Play/Pause button - below pitch slider */}
      {showControls && (
        <g
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ cursor: 'pointer' }}
        >
          <circle cx="80" cy="58" r="7" fill="#222" stroke={isPlaying ? NINERS.red : WARRIORS.gold} strokeWidth="1.5" />
          {isPlaying ? (
            // Pause icon
            <>
              <rect x="76" y="54" width="3" height="8" fill={NINERS.red} />
              <rect x="81" y="54" width="3" height="8" fill={NINERS.red} />
            </>
          ) : (
            // Play icon - white for contrast against gold outline
            <polygon points="77,53 77,63 87,58" fill="#ffffff" />
          )}
        </g>
      )}

      {/* Brand text */}
      <text x="80" y="16" textAnchor="middle" fill={WARRIORS.gold} fontSize="6" fontWeight="bold" fontFamily="monospace">AQ</text>
    </svg>
  );
}
