"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface MuxVideoPlayerProps {
  playbackId: string;
}

export default function MuxVideoPlayer({ playbackId }: MuxVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const videoSrc = `https://stream.mux.com/${playbackId}.m3u8`;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari supports HLS natively
      video.src = videoSrc;
    } else if (Hls.isSupported()) {
      // Other browsers use hls.js
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      return () => {
        hls.destroy();
      };
    }
  }, [playbackId]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full rounded-lg shadow-lg"
      playsInline
    />
  );
}
