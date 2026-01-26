/**
 * useSoundCloud Hook
 * ==================
 *
 * OVERVIEW:
 * Custom React hook that manages SoundCloud audio playback through their Widget API.
 * Provides a clean interface for play/pause, track navigation, seeking, and progress tracking.
 *
 * WHY A CUSTOM HOOK?
 * - Encapsulates complex audio logic away from UI components
 * - Handles SoundCloud API quirks (unreliable events, loading states)
 * - Manages refs to avoid stale closure bugs in callbacks
 * - Single source of truth for all playback state
 *
 * SOUNDCLOUD API CHALLENGES SOLVED:
 * 1. Stale Closures: Event callbacks capture old state values
 *    → Solution: Use refs that stay current
 *
 * 2. Race Conditions: Rapid track changes cause duplicate loads
 *    → Solution: Debouncing + track index validation
 *
 * 3. Unreliable Events: PLAY_PROGRESS sometimes stops firing
 *    → Solution: Polling fallback with setInterval
 *
 * 4. Load Timeouts: Callback sometimes never fires
 *    → Solution: Timeout fallback that forces ready state
 *
 * ARCHITECTURE:
 * ```
 * ┌─────────────────────────────────────────────────────┐
 * │                  useSoundCloud                       │
 * │                                                      │
 * │  ┌──────────┐    ┌──────────┐    ┌──────────────┐  │
 * │  │  State   │    │   Refs   │    │   Effects    │  │
 * │  │ (React)  │◄──►│ (Current)│◄──►│ (Side fx)    │  │
 * │  └──────────┘    └──────────┘    └──────────────┘  │
 * │        │               │                │          │
 * │        └───────────────┼────────────────┘          │
 * │                        │                            │
 * │               ┌────────▼────────┐                   │
 * │               │ SoundCloud Widget │                 │
 * │               │     (iframe)      │                 │
 * │               └──────────────────┘                  │
 * └─────────────────────────────────────────────────────┘
 * ```
 *
 * @returns {UseSoundCloudReturn} Audio state and control functions
 *
 * @example
 * ```tsx
 * function Player() {
 *   const { isPlaying, togglePlay, currentTrack } = useSoundCloud();
 *   return (
 *     <button onClick={togglePlay}>
 *       {isPlaying ? 'Pause' : 'Play'} {currentTrack.title}
 *     </button>
 *   );
 * }
 * ```
 */

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { PLAYLIST, type Track } from './constants';

/* ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================ */

/**
 * SoundCloud Widget instance type.
 * These methods are provided by the SoundCloud Widget API.
 *
 * @see https://developers.soundcloud.com/docs/api/html5-widget
 */
interface SoundCloudWidget {
  /** Subscribe to widget events */
  bind: (event: string, callback: (data?: { currentPosition?: number }) => void) => void;
  /** Unsubscribe from widget events */
  unbind: (event: string) => void;
  /** Load a new track by URL */
  load: (url: string, options: Record<string, unknown>) => void;
  /** Start playback */
  play: () => void;
  /** Pause playback */
  pause: () => void;
  /** Toggle play/pause */
  toggle: () => void;
  /** Seek to position in milliseconds */
  seekTo: (milliseconds: number) => void;
  /** Get track duration (async) */
  getDuration: (callback: (duration: number) => void) => void;
  /** Get current playback position (async) */
  getPosition: (callback: (position: number) => void) => void;
  /** Get current volume (async) */
  getVolume: (callback: (volume: number) => void) => void;
  /** Set volume (0-100) */
  setVolume: (volume: number) => void;
}

/**
 * SoundCloud API global object.
 * Loaded dynamically from SoundCloud's CDN.
 */
interface SoundCloudAPI {
  Widget: {
    (iframe: HTMLIFrameElement): SoundCloudWidget;
    Events: {
      READY: string;
      PLAY: string;
      PAUSE: string;
      FINISH: string;
      PLAY_PROGRESS: string;
      LOAD_PROGRESS: string;
      SEEK: string;
      ERROR: string;
    };
  };
}

/**
 * Extend Window type to include SoundCloud API.
 *
 * TypeScript Pattern: Module augmentation
 * Allows us to add types to global objects safely.
 */
declare global {
  interface Window {
    SC?: SoundCloudAPI;
  }
}

/**
 * Return type of the useSoundCloud hook.
 * Defines the public API available to consumers.
 */
export interface UseSoundCloudReturn {
  /** Ref to attach to the hidden SoundCloud iframe */
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Whether a track is currently loading */
  isLoading: boolean;
  /** Index of current track in playlist */
  currentTrackIndex: number;
  /** Current track metadata */
  currentTrack: Track;
  /** Current playback position in milliseconds */
  progress: number;
  /** Total track duration in milliseconds */
  duration: number;
  /** Whether the SoundCloud API is loaded and ready */
  isReady: boolean;
  /** Toggle between play and pause */
  togglePlay: () => void;
  /** Skip to next track */
  nextTrack: () => void;
  /** Go to previous track */
  prevTrack: () => void;
  /** Jump to specific track by index */
  goToTrack: (index: number) => void;
  /** Seek to position in milliseconds */
  seekTo: (position: number) => void;
}

/* ============================================================================
 * CONFIGURATION CONSTANTS
 * ============================================================================ */

/**
 * Timeout for track loading.
 * If the load callback doesn't fire within this time, we force the ready state.
 * This handles cases where SoundCloud's API fails silently.
 */
const LOAD_TIMEOUT_MS = 2000;

/**
 * Debounce time for rapid track changes.
 * Prevents race conditions when user clicks next/prev quickly.
 */
const TRACK_CHANGE_DEBOUNCE_MS = 300;

/**
 * Interval for progress polling.
 * Fallback for when PLAY_PROGRESS events stop firing.
 */
const PROGRESS_POLL_INTERVAL_MS = 250;

/* ============================================================================
 * HOOK IMPLEMENTATION
 * ============================================================================ */

export function useSoundCloud(): UseSoundCloudReturn {
  /* --------------------------------------------------------------------------
   * REFS
   * --------------------------------------------------------------------------
   * Refs are used for values that:
   * 1. Need to persist across renders without causing re-renders
   * 2. Need to be accessed in callbacks without stale closure issues
   *
   * STALE CLOSURE PROBLEM:
   * When you pass a callback to an external API (like SoundCloud events),
   * the callback captures the values at the time it was created.
   * If React state changes, the callback still sees old values.
   *
   * SOLUTION: Keep refs in sync with state, read from refs in callbacks.
   */
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);

  // Refs that mirror state (for use in callbacks)
  const currentTrackIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const isLoadingRef = useRef(false);

  // Timeout/interval refs for cleanup
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const trackChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State tracking refs
  const pendingSeekRef = useRef<number | null>(null);
  const shouldAutoPlayRef = useRef(false);
  const hasLoadedFirstTrackRef = useRef(false);
  const lastTrackChangeRef = useRef<number>(0);

  /* --------------------------------------------------------------------------
   * STATE
   * --------------------------------------------------------------------------
   * These values trigger re-renders when changed, updating the UI.
   */
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isWidgetBound, setIsWidgetBound] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  /* --------------------------------------------------------------------------
   * SYNC REFS WITH STATE
   * --------------------------------------------------------------------------
   * Keep refs updated whenever state changes.
   * This ensures callbacks always have access to current values.
   */
  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  /* --------------------------------------------------------------------------
   * HELPER FUNCTIONS
   * --------------------------------------------------------------------------
   * Small, focused functions that handle specific tasks.
   * Using useCallback to maintain referential equality across renders.
   */

  /**
   * Clears the loading timeout.
   * Called when loading completes successfully or on cleanup.
   */
  const clearLoadTimeout = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  /**
   * Starts polling for playback progress.
   *
   * WHY POLLING?
   * SoundCloud's PLAY_PROGRESS event is unreliable - it sometimes
   * stops firing mid-track. Polling ensures we always have accurate progress.
   */
  const startProgressPolling = useCallback(() => {
    if (progressIntervalRef.current) return; // Already polling

    progressIntervalRef.current = setInterval(() => {
      if (widgetRef.current && isPlayingRef.current) {
        widgetRef.current.getPosition((pos: number) => {
          setProgress(pos);
        });
      }
    }, PROGRESS_POLL_INTERVAL_MS);
  }, []);

  /**
   * Stops progress polling.
   * Called when pausing or unmounting.
   */
  const stopProgressPolling = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  /**
   * Marks loading as complete and handles pending operations.
   */
  const completeLoading = useCallback(() => {
    clearLoadTimeout();
    isLoadingRef.current = false;
    setIsLoading(false);

    // Handle any seek that was queued during loading
    if (pendingSeekRef.current !== null && widgetRef.current) {
      widgetRef.current.seekTo(pendingSeekRef.current);
      pendingSeekRef.current = null;
    }
  }, [clearLoadTimeout]);

  /* --------------------------------------------------------------------------
   * EFFECT: Load SoundCloud API Script
   * --------------------------------------------------------------------------
   * Dynamically loads the SoundCloud Widget API from their CDN.
   * Only runs once on mount.
   */
  useEffect(() => {
    // Check if already loaded (e.g., by another component)
    if (window.SC) {
      setIsReady(true);
      return;
    }

    // Create and inject script tag
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;

    script.onload = () => {
      setIsReady(true);
    };

    script.onerror = () => {
      console.error('Failed to load SoundCloud Widget API');
    };

    document.body.appendChild(script);

    // Cleanup: remove script on unmount
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  /* --------------------------------------------------------------------------
   * EFFECT: Initialize Widget
   * --------------------------------------------------------------------------
   * Binds to SoundCloud widget events once the API is ready.
   * Sets up all event handlers for playback state changes.
   */
  useEffect(() => {
    if (!isReady || !iframeRef.current || !window.SC || isWidgetBound) return;

    const widget = window.SC.Widget(iframeRef.current);
    widgetRef.current = widget;

    const Events = window.SC.Widget.Events;

    // READY event fires when widget is initialized
    widget.bind(Events.READY, () => {
      setIsWidgetBound(true);

      // PLAY event - audio started playing
      widget.bind(Events.PLAY, () => {
        isPlayingRef.current = true;
        setIsPlaying(true);
        completeLoading();
        startProgressPolling();
      });

      // PAUSE event - audio paused
      widget.bind(Events.PAUSE, () => {
        isPlayingRef.current = false;
        setIsPlaying(false);
        stopProgressPolling();
      });

      // FINISH event - track ended, auto-advance to next
      widget.bind(Events.FINISH, () => {
        const nextIndex = (currentTrackIndexRef.current + 1) % PLAYLIST.length;
        shouldAutoPlayRef.current = true;
        setCurrentTrackIndex(nextIndex);
      });

      // PLAY_PROGRESS event - progress update (backup to polling)
      widget.bind(Events.PLAY_PROGRESS, (data) => {
        if (data?.currentPosition !== undefined) {
          setProgress(data.currentPosition);
        }
      });

      // SEEK event - user seeked to new position
      widget.bind(Events.SEEK, (data) => {
        if (data?.currentPosition !== undefined) {
          setProgress(data.currentPosition);
        }
      });

      // ERROR event - something went wrong
      widget.bind(Events.ERROR, () => {
        console.error('SoundCloud widget error');
        completeLoading();
      });

      // Get initial duration for the first track
      widget.getDuration((d: number) => {
        setDuration(d);
      });
    });

    // Cleanup: unbind events and stop timers
    return () => {
      clearLoadTimeout();
      stopProgressPolling();
      if (widget && window.SC) {
        const Events = window.SC.Widget.Events;
        widget.unbind(Events.PLAY);
        widget.unbind(Events.PAUSE);
        widget.unbind(Events.FINISH);
        widget.unbind(Events.PLAY_PROGRESS);
        widget.unbind(Events.SEEK);
        widget.unbind(Events.ERROR);
      }
    };
  }, [isReady, isWidgetBound, completeLoading, clearLoadTimeout, startProgressPolling, stopProgressPolling]);

  /* --------------------------------------------------------------------------
   * EFFECT: Handle Track Changes
   * --------------------------------------------------------------------------
   * Loads new tracks when currentTrackIndex changes.
   * Includes debouncing to prevent race conditions.
   *
   * RACE CONDITION SCENARIO:
   * 1. User clicks "next" rapidly 3 times
   * 2. Without debouncing, 3 load() calls fire
   * 3. They complete out of order, leaving wrong track playing
   *
   * SOLUTION:
   * - Debounce rapid changes
   * - Validate track index in callbacks to ignore stale loads
   */
  useEffect(() => {
    if (!widgetRef.current || !isWidgetBound) return;

    // Skip initial mount - first track is loaded via iframe src
    if (!hasLoadedFirstTrackRef.current) {
      hasLoadedFirstTrackRef.current = true;
      widgetRef.current.getDuration((d: number) => {
        setDuration(d);
      });
      return;
    }

    // Calculate time since last track change for debouncing
    const now = Date.now();
    const timeSinceLastChange = now - lastTrackChangeRef.current;

    // Clear any pending debounced track change
    if (trackChangeTimeoutRef.current) {
      clearTimeout(trackChangeTimeoutRef.current);
      trackChangeTimeoutRef.current = null;
    }

    // Capture auto-play intention before async operations
    const shouldAutoPlay = shouldAutoPlayRef.current || isPlayingRef.current;
    shouldAutoPlayRef.current = false;

    // Reset state for new track
    clearLoadTimeout();
    stopProgressPolling();
    pendingSeekRef.current = null;
    isLoadingRef.current = true;
    setIsLoading(true);
    setProgress(0);
    setDuration(0);

    /**
     * Actually load the track.
     * Separated into a function for debouncing.
     */
    const loadTrack = () => {
      if (!widgetRef.current) return;

      lastTrackChangeRef.current = Date.now();
      const trackIndexToLoad = currentTrackIndex;
      const autoPlayOnLoad = shouldAutoPlay;

      // Timeout fallback if load callback never fires
      loadTimeoutRef.current = setTimeout(() => {
        // Validate we're still on the same track (prevents stale callback)
        if (currentTrackIndexRef.current !== trackIndexToLoad) return;

        console.warn('SoundCloud load timeout - forcing ready state');
        completeLoading();

        if (autoPlayOnLoad && widgetRef.current) {
          isPlayingRef.current = true;
          setIsPlaying(true);
          widgetRef.current.play();
          startProgressPolling();
        }
      }, LOAD_TIMEOUT_MS);

      // Load the new track
      widgetRef.current.load(PLAYLIST[trackIndexToLoad].url, {
        auto_play: autoPlayOnLoad,
        show_artwork: false,
        show_comments: false,
        show_playcount: false,
        show_user: false,
        hide_related: true,
        visual: false,
        single_active: false,
        callback: () => {
          // Validate track index to prevent race condition
          if (currentTrackIndexRef.current !== trackIndexToLoad) return;

          // Get duration for the loaded track
          widgetRef.current?.getDuration((d: number) => {
            if (currentTrackIndexRef.current === trackIndexToLoad) {
              setDuration(d);
            }
          });

          completeLoading();

          // Start playback if auto-play was requested
          if (autoPlayOnLoad && widgetRef.current) {
            isPlayingRef.current = true;
            setIsPlaying(true);
            widgetRef.current.play();
            startProgressPolling();
          }
        },
      });
    };

    // Debounce if changing tracks too quickly
    if (timeSinceLastChange < TRACK_CHANGE_DEBOUNCE_MS) {
      trackChangeTimeoutRef.current = setTimeout(
        loadTrack,
        TRACK_CHANGE_DEBOUNCE_MS - timeSinceLastChange
      );
    } else {
      loadTrack();
    }

    // Cleanup: cancel pending track change on unmount or re-run
    return () => {
      if (trackChangeTimeoutRef.current) {
        clearTimeout(trackChangeTimeoutRef.current);
        trackChangeTimeoutRef.current = null;
      }
    };
  }, [currentTrackIndex, isWidgetBound, completeLoading, clearLoadTimeout, startProgressPolling, stopProgressPolling]);

  /* --------------------------------------------------------------------------
   * CONTROL FUNCTIONS
   * --------------------------------------------------------------------------
   * Functions exposed to consumers for controlling playback.
   * All use useCallback to maintain referential equality.
   */

  /**
   * Toggle between play and pause.
   * Handles the loading state gracefully by queuing the action.
   */
  const togglePlay = useCallback(() => {
    if (!widgetRef.current) return;

    // If still loading, queue the play/pause for when load completes
    if (isLoadingRef.current) {
      shouldAutoPlayRef.current = !isPlayingRef.current;
      setIsPlaying(!isPlayingRef.current); // Update UI optimistically
      return;
    }

    // Toggle state
    const newPlayingState = !isPlayingRef.current;
    isPlayingRef.current = newPlayingState;
    setIsPlaying(newPlayingState);

    // Execute on widget
    if (newPlayingState) {
      widgetRef.current.play();
      startProgressPolling();
    } else {
      widgetRef.current.pause();
      stopProgressPolling();
    }
  }, [startProgressPolling, stopProgressPolling]);

  /**
   * Jump to a specific track by index.
   */
  const goToTrack = useCallback((index: number) => {
    if (index < 0 || index >= PLAYLIST.length) return;
    if (index === currentTrackIndexRef.current) return;

    shouldAutoPlayRef.current = isPlayingRef.current;
    setCurrentTrackIndex(index);
  }, []);

  /**
   * Skip to the next track.
   * Loops back to start when at end.
   */
  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndexRef.current + 1) % PLAYLIST.length;
    shouldAutoPlayRef.current = true; // Always auto-play on skip
    setCurrentTrackIndex(nextIndex);
  }, []);

  /**
   * Go to the previous track.
   * Loops to end when at start.
   */
  const prevTrack = useCallback(() => {
    const prevIndex = (currentTrackIndexRef.current - 1 + PLAYLIST.length) % PLAYLIST.length;
    shouldAutoPlayRef.current = true; // Always auto-play on skip
    setCurrentTrackIndex(prevIndex);
  }, []);

  /**
   * Seek to a position in the track.
   * Position is in milliseconds.
   */
  const seekTo = useCallback((position: number) => {
    if (!widgetRef.current) return;

    // Update UI immediately for responsiveness
    setProgress(position);

    // Queue seek if track is still loading
    if (isLoadingRef.current) {
      pendingSeekRef.current = position;
      return;
    }

    widgetRef.current.seekTo(position);
  }, []);

  /* --------------------------------------------------------------------------
   * RETURN VALUE
   * --------------------------------------------------------------------------
   * Public API of the hook.
   */
  return {
    iframeRef,
    isPlaying,
    isLoading,
    currentTrackIndex,
    currentTrack: PLAYLIST[currentTrackIndex],
    progress,
    duration,
    isReady,
    togglePlay,
    nextTrack,
    prevTrack,
    goToTrack,
    seekTo,
  };
}
