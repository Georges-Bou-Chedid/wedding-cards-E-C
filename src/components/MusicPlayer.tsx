import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

/* YouTube IFrame Player API types (minimal) */
declare global {
  interface Window {
    YT: {
      Player: new (
        el: string | HTMLElement,
        opts: {
          height?: string | number;
          width?: string | number;
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
  interface YTPlayer {
    mute(): void;
    unMute(): void;
    playVideo(): void;
    pauseVideo(): void;
    setVolume(sec: number): void;
    seekTo(sec: number, allowSeek?: boolean): void;
    getPlayerState(): number;
    destroy(): void;
  }
}

const VIDEO_ID = "lY5V4hSLWY8";
const START_SECONDS = 47;

interface MusicPlayerProps {
  /** Call this ref's trigger() after the envelope opens to start playback */
  startRef?: React.MutableRefObject<(() => void) | null>;
}

const MusicPlayer = ({ startRef }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const pendingPlayRef = useRef(false);

  const startPlay = useCallback(() => {
  if (playerRef.current) {
    playerRef.current.playVideo(); // Direct call
    setIsPlaying(true);
  } else {
    pendingPlayRef.current = true;
  }
}, []);

  /* Expose startPlay via ref so Index.tsx can call it */
  useEffect(() => {
    if (startRef) startRef.current = startPlay;
  }, [startRef, startPlay]);

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "0",
        width: "0",
        videoId: VIDEO_ID,
        playerVars: {
          start: START_SECONDS,
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: VIDEO_ID,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
          widget_referrer: window.location.href,
        },
        events: {
          onReady: (e) => {
            readyRef.current = true;
            e.target.seekTo(START_SECONDS, true);
            if (pendingPlayRef.current) {
              e.target.playVideo();
              setIsPlaying(true);
              pendingPlayRef.current = false;
            }
          },
          onStateChange: (e) => {
            /* Loop back to START_SECONDS when ended */
            if (e.data === window.YT.PlayerState.ENDED) {
              playerRef.current?.seekTo(START_SECONDS, true);
              playerRef.current?.playVideo();
            }
            if (e.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (e.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  const toggle = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.seekTo(START_SECONDS, true);
      playerRef.current.playVideo();
    }
  };

  return (
    <>
      {/* Hidden YouTube player container */}
      <div ref={containerRef} 
           style={{ 
            position: 'absolute', 
            width: '1px', 
            height: '1px', 
            top: '-1000px', 
            left: '-1000px', 
            opacity: 0, 
            pointerEvents: 'none' 
          }}
      />

      {/* Floating music toggle */}
      <motion.button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300"
        style={{
          background: "hsl(var(--ivory))",
          border: "1px solid hsl(var(--dusty-blue-pale))",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        title={isPlaying ? "Pause music" : "Play music"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? (
          /* Animated bars */
          <div className="flex items-end gap-0.5" style={{ height: 18 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-0.5 rounded-full music-bar${i > 0 ? ` music-bar-${i + 1}` : ""}`}
                style={{
                  height: [10, 16, 12, 8][i],
                  background: "hsl(var(--dusty-blue))",
                  transformOrigin: "bottom",
                }}
              />
            ))}
          </div>
        ) : (
          /* Music note icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18V5l12-2v13" stroke="hsl(var(--dusty-blue))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="18" r="3" stroke="hsl(var(--dusty-blue))" strokeWidth="1.6" />
            <circle cx="18" cy="16" r="3" stroke="hsl(var(--dusty-blue))" strokeWidth="1.6" />
          </svg>
        )}
      </motion.button>
    </>
  );
};

export default MusicPlayer;
