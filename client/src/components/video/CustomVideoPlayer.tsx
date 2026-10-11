import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  FastForward,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { cn, formatTime } from '../../lib/utils';
import { api } from '../../lib/api';

export interface Chapter {
  title: string;
  timeSec: number;
}

interface CustomVideoPlayerProps {
  src: string;
  conceptId?: string;
  chapters?: Chapter[];
  initialPositionSec?: number;
  onPositionUpdate?: (seconds: number) => void;
  className?: string;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  src,
  conceptId,
  chapters = [],
  initialPositionSec = 0,
  onPositionUpdate,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(initialPositionSec > 5);

  // Debounced progress saver
  const savePosition = useCallback(
    (seconds: number) => {
      if (conceptId) {
        api.patch(`/concepts/${conceptId}/position`, {
          videoPositionSec: Math.floor(seconds),
        }).catch(() => {});
      }
      if (onPositionUpdate) {
        onPositionUpdate(seconds);
      }
    },
    [conceptId, onPositionUpdate]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && isPlaying) {
        savePosition(videoRef.current.currentTime);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, savePosition]);

  // Keyboard Shortcuts: Space (Play/Pause), Left/Right (-5s/+5s), F (Fullscreen), M (Mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft' && videoRef.current) {
        e.preventDefault();
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
      } else if (e.code === 'ArrowRight' && videoRef.current) {
        e.preventDefault();
        videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      setShowResumePrompt(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const resumeFromSaved = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = initialPositionSec;
      videoRef.current.play();
      setIsPlaying(true);
      setShowResumePrompt(false);
    }
  };

  const jumpToChapter = (timeSec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeSec;
      setCurrentTime(timeSec);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative rounded-2xl overflow-hidden glass-panel border border-surface-border bg-black group select-none',
        className
      )}
    >
      {/* Resume Prompt Toast Overlay */}
      {showResumePrompt && (
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 p-3 rounded-xl bg-bg-1/95 border border-purple-500/40 text-xs shadow-2xl backdrop-blur-md">
          <Bookmark className="w-4 h-4 text-purple-400" />
          <span className="text-[#A9B1D6]">
            Resume from <strong className="text-white">{formatTime(initialPositionSec)}</strong>?
          </span>
          <button
            onClick={resumeFromSaved}
            className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-semibold text-[11px] cursor-pointer hover:bg-purple-500 transition-colors ml-1"
          >
            Resume
          </button>
          <button
            onClick={() => setShowResumePrompt(false)}
            className="text-[11px] text-[#6B7399] hover:text-white px-1.5 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer aspect-video"
      />

      {/* Big Center Play Button when paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-purple-600/40 hover:scale-105 transition-transform">
            <Play className="w-7 h-7 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Floating Controls Bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
        {/* Scrubber with Chapter Markers */}
        <div className="relative flex items-center w-full">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />

          {/* Chapter Markers Dots on Scrubber */}
          {chapters.map((ch, idx) => {
            const pct = duration > 0 ? (ch.timeSec / duration) * 100 : 0;
            return (
              <div
                key={idx}
                title={ch.title}
                onClick={() => jumpToChapter(ch.timeSec)}
                style={{ left: `${pct}%` }}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 hover:scale-150 transition-transform cursor-pointer"
              />
            );
          })}
        </div>

        {/* Lower Row Controls */}
        <div className="flex items-center justify-between text-xs text-white pt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="font-mono text-[11px] text-[#A9B1D6]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 font-mono text-[11px]">
              {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    playbackSpeed === s ? 'bg-purple-600 text-white font-bold' : 'text-[#6B7399] hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Chapters Strip */}
        {chapters.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/10 text-[11px] font-mono">
            <span className="text-[#6B7399]">Chapters:</span>
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => jumpToChapter(ch.timeSec)}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#A9B1D6] hover:text-white whitespace-nowrap cursor-pointer transition-colors"
              >
                {formatTime(ch.timeSec)} &bull; {ch.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
