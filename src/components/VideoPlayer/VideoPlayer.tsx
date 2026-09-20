// ============================================================
// Stellarix — Custom Cinema Video Player
// ============================================================

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Settings,
  ChevronLeft,
  FastForward,
  ListVideo,
  X,
} from 'lucide-react';
import type { StreamSource, Episode } from '../../lib/api/types';
import { useContinueWatchingStore } from '../../stores/continueWatchingStore';
import { usePreferencesStore } from '../../stores/preferencesStore';
import { cn } from '../../utils/cn';
import Hls from 'hls.js';

interface VideoPlayerProps {
  sources: StreamSource[];
  title: string;
  mediaId: string;
  episodeId?: string;
  episodeTitle?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  posterUrl: string;
  mediaType: 'movie' | 'tv' | 'anime';
  introStart?: number;
  introEnd?: number;
  outroStart?: number;
  outroEnd?: number;
  episodes?: Episode[];
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  backHref?: string;
}

export default function VideoPlayer({
  sources,
  title,
  mediaId,
  episodeId,
  episodeTitle,
  seasonNumber,
  episodeNumber,
  posterUrl,
  mediaType,
  introStart,
  introEnd,
  outroStart,
  outroEnd,
  episodes,
  onNextEpisode,
  onPrevEpisode,
  backHref = '/',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout>>();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipOutro, setShowSkipOutro] = useState(false);
  const [showNextCountdown, setShowNextCountdown] = useState(false);
  const [nextCountdown, setNextCountdown] = useState(10);

  const { updateProgress } = useContinueWatchingStore();
  const { autoplay, defaultPlaybackSpeed } = usePreferencesStore();

  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const source = sources[selectedSourceIndex] || sources[0];
  const videoUrl = source?.url || '';

  // Attach Hls or direct source
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl || source?.type === 'embed') return;

    let hls: Hls | null = null;
    const isHls = source?.type === 'hls' || videoUrl.includes('.m3u8');

    if (isHls && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          console.warn('HLS stream error:', data);
        }
      });
    } else if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
    } else {
      video.src = videoUrl;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoUrl, source?.type]);

  // Set initial playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = defaultPlaybackSpeed;
      setPlaybackRate(defaultPlaybackSpeed);
    }
  }, [defaultPlaybackSpeed]);

  // Show/hide controls on mouse movement
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    if (playing) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3000);
    }
  }, [playing]);

  useEffect(() => {
    resetControlsTimer();
  }, [playing, resetControlsTimer]);

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && duration > 0 && currentTime > 5) {
        updateProgress({
          mediaId,
          episodeId,
          position: Math.floor(currentTime),
          duration: Math.floor(duration),
          timestamp: Date.now(),
          title,
          posterUrl,
          mediaType,
          episodeTitle,
          seasonNumber,
          episodeNumber,
        });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [currentTime, duration, mediaId, episodeId, title, posterUrl, mediaType, episodeTitle, seasonNumber, episodeNumber, updateProgress]);

  // Skip Intro/Outro detection
  useEffect(() => {
    if (introStart !== undefined && introEnd !== undefined) {
      setShowSkipIntro(currentTime >= introStart && currentTime < introEnd);
    }
    if (outroStart !== undefined && outroEnd !== undefined) {
      setShowSkipOutro(currentTime >= outroStart && currentTime < outroEnd);
    }
  }, [currentTime, introStart, introEnd, outroStart, outroEnd]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const video = videoRef.current;
      if (!video) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowleft':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case 'arrowright':
          e.preventDefault();
          video.currentTime = Math.min(duration, video.currentTime + 10);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          setMuted(!muted);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [muted, duration]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlaying(true);
          })
          .catch((err) => {
            console.warn('Playback interrupted or blocked:', err);
            setPlaying(false);
          });
      }
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);

    // Buffered
    if (video.buffered.length > 0) {
      setBuffered(video.buffered.end(video.buffered.length - 1));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
    }
    setMuted(val === 0);
  };

  const skipIntro = () => {
    if (videoRef.current && introEnd) {
      videoRef.current.currentTime = introEnd;
    }
  };

  const skipOutro = () => {
    if (onNextEpisode) {
      onNextEpisode();
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  // Fallback if no sources provided
  if (!source) {
    return (
      <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center p-6 select-none">
        <div className="p-8 max-w-md w-full rounded-2xl bg-surface/90 border border-border text-center shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-2">Streaming Source Not Available</h2>
          <p className="text-sm text-text-secondary mb-6">
            A streaming provider for this media is not configured yet.
          </p>
          <a
            href={backHref}
            className="inline-block py-2.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors shadow-lg shadow-accent/20"
          >
            Go Back
          </a>
        </div>
      </div>
    );
  }

  // Render iframe embed when stream type is 'embed'
  if (source.type === 'embed') {
    return (
      <div className="relative w-full h-screen bg-black overflow-hidden select-none">
        {/* Loading Overlay - completely unmounted once iframe loads */}
        {!iframeLoaded && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-10 pointer-events-none">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <p className="text-white/50 text-sm">Loading player...</p>
            </div>
          </div>
        )}

        {/* Top-Right Floating Controls (Non-blocking: leaves top-left server selector completely free) */}
        <div className="absolute top-4 right-4 z-30 pointer-events-none flex items-center gap-2.5">
          {/* TV Episode Info & Next/Prev Controls */}
          {(seasonNumber || episodeNumber) && (
            <div className="flex items-center bg-black/80 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/15 pointer-events-auto shadow-2xl text-xs font-semibold text-white/90">
              <span>
                S{seasonNumber} E{episodeNumber}
              </span>
              {episodeTitle && (
                <span className="hidden md:inline font-normal text-white/60 ml-1.5 truncate max-w-[160px]">
                  · {episodeTitle}
                </span>
              )}
            </div>
          )}

          {onPrevEpisode && (
            <button
              type="button"
              onClick={onPrevEpisode}
              className="flex items-center gap-1 bg-black/80 hover:bg-black/95 text-white/90 hover:text-white text-xs font-medium px-3 py-2 rounded-xl border border-white/15 backdrop-blur-md transition-all shadow-2xl pointer-events-auto cursor-pointer"
              title="Previous Episode"
            >
              <SkipBack className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>
          )}

          {onNextEpisode && (
            <button
              type="button"
              onClick={onNextEpisode}
              className="flex items-center gap-1 bg-black/80 hover:bg-black/95 text-white/90 hover:text-white text-xs font-medium px-3 py-2 rounded-xl border border-white/15 backdrop-blur-md transition-all shadow-2xl pointer-events-auto cursor-pointer"
              title="Next Episode"
            >
              <span className="hidden sm:inline">Next</span>
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          )}

          {sources.length > 1 && (
            <div className="flex items-center bg-black/80 backdrop-blur-md rounded-xl p-1 border border-white/15 pointer-events-auto shadow-2xl">
              {sources.map((s, idx) => (
                <button
                  key={s.url}
                  type="button"
                  onClick={() => {
                    if (selectedSourceIndex !== idx) {
                      setIframeLoaded(false);
                      setSelectedSourceIndex(idx);
                    }
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
                    selectedSourceIndex === idx
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  {s.label || (s.provider === '2embed' ? '2Embed' : s.provider === 'cinesrc' ? 'CineSRC' : 'VidSrc')}
                </button>
              ))}
            </div>
          )}

          <a
            href={backHref}
            className="flex items-center gap-1.5 bg-black/80 hover:bg-black/95 text-white/90 hover:text-white text-xs font-medium px-3.5 py-2 rounded-xl border border-white/15 backdrop-blur-md transition-all shadow-2xl pointer-events-auto group cursor-pointer"
            aria-label="Back to details"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </a>
        </div>

        {/* Embedded Player Iframe */}
        <iframe
          key={source.url}
          src={source.url}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={() => setIframeLoaded(true)}
          className="w-full h-full border-0 block"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black select-none"
      onMouseMove={resetControlsTimer}
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'VIDEO') {
          togglePlay();
        }
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onEnded={() => {
          setPlaying(false);
          if (onNextEpisode && autoplay) {
            onNextEpisode();
          }
        }}
        muted={muted}
        playsInline
        preload="metadata"
        poster={posterUrl}
      />

      {/* Controls Overlay */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-between transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-4">
            <a
              href={backHref}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </a>
            <div>
              <h1 className="text-sm sm:text-base font-semibold text-white">
                {title}
              </h1>
              {episodeTitle && (
                <p className="text-xs text-white/60">
                  S{seasonNumber} E{episodeNumber} · {episodeTitle}
                </p>
              )}
            </div>
          </div>

          {/* Episode list toggle */}
          {episodes && episodes.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEpisodes(!showEpisodes);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
              aria-label="Episode list"
            >
              <ListVideo className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Center Play Button (when paused) */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={togglePlay}
              className="h-20 w-20 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors pointer-events-auto"
              aria-label="Play"
            >
              <Play className="h-8 w-8 fill-current ml-1" />
            </button>
          </div>
        )}

        {/* Skip Intro Button */}
        {showSkipIntro && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              skipIntro();
            }}
            className="absolute bottom-24 right-6 px-6 py-2.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-white/90 transition-colors shadow-lg"
          >
            Skip Intro
          </button>
        )}

        {/* Skip Outro / Next Episode Button */}
        {showSkipOutro && onNextEpisode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              skipOutro();
            }}
            className="absolute bottom-24 right-6 px-6 py-2.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-white/90 transition-colors shadow-lg flex items-center gap-2"
          >
            <SkipForward className="h-4 w-4" />
            Next Episode
          </button>
        )}

        {/* Bottom Controls */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-black/60 to-transparent">
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="group relative h-1 hover:h-2 bg-white/20 rounded-full cursor-pointer mb-4 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleSeek(e);
            }}
          >
            {/* Buffered */}
            <div
              className="absolute top-0 left-0 h-full bg-white/20 rounded-full"
              style={{ width: `${bufferedPercent}%` }}
            />
            {/* Progress */}
            <div
              className="absolute top-0 left-0 h-full bg-accent rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="h-10 w-10 flex items-center justify-center text-white hover:text-white/80 transition-colors"
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Skip Back */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current)
                    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                }}
                className="h-10 w-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Skip back 10 seconds"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              {/* Skip Forward */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current)
                    videoRef.current.currentTime = Math.min(
                      duration,
                      videoRef.current.currentTime + 10
                    );
                }}
                className="h-10 w-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMuted(!muted);
                  }}
                  className="h-10 w-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-20 accent-accent"
                  aria-label="Volume"
                />
              </div>

              {/* Time */}
              <span className="text-xs text-white/60 font-mono ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* Next Episode */}
              {onNextEpisode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNextEpisode();
                  }}
                  className="hidden sm:flex h-10 w-10 items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label="Next episode"
                >
                  <FastForward className="h-5 w-5" />
                </button>
              )}

              {/* Settings */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                  }}
                  className="h-10 w-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5" />
                </button>

                {showSettings && (
                  <div
                    className="absolute bottom-12 right-0 w-48 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 p-2 space-y-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-xs text-white/40 px-2 py-1 font-medium uppercase tracking-wider">
                      Speed
                    </p>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={cn(
                          'w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors',
                          playbackRate === rate
                            ? 'bg-accent text-white'
                            : 'text-white/80 hover:bg-white/10'
                        )}
                      >
                        {rate === 1 ? 'Normal' : `${rate}x`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="h-10 w-10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episode Sidebar */}
      {showEpisodes && episodes && (
        <div
          className="absolute top-0 right-0 bottom-0 w-80 bg-black/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white">Episodes</h3>
            <button
              onClick={() => setShowEpisodes(false)}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close episodes"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2">
            {episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => {
                  window.location.href = `/watch/${ep.seriesId}?ep=${ep.id}`;
                }}
                className={cn(
                  'w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors',
                  ep.id === episodeId
                    ? 'bg-accent/20 text-accent'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <span className="text-xs font-mono shrink-0 w-6 text-center">
                  {ep.episodeNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ep.title}</p>
                  <p className="text-xs text-white/40">{ep.duration}m</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
