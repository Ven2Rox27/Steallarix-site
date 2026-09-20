// ============================================================
// Stellarix — Cinematic Hero Section
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Info, ChevronLeft, ChevronRight, Star, Clock, Check } from 'lucide-react';
import type { MediaItem } from '../../lib/api/types';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useWatchlistStore } from '../../stores/watchlistStore';
import { cn } from '../../utils/cn';

interface HeroProps {
  items: MediaItem[];
  autoRotateInterval?: number;
}

export default function Hero({ items, autoRotateInterval = 6000 }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { isInWatchlist, toggleItem } = useWatchlistStore();

  const current = items[activeIndex];
  if (!current) return null;

  const inWatchlist = isInWatchlist(current.id);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + items.length) % items.length);
    },
    [items.length]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Auto-rotation
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const timer = setInterval(goNext, autoRotateInterval);
    return () => clearInterval(timer);
  }, [isPaused, goNext, autoRotateInterval, items.length]);

  return (
    <section
      className="relative w-full h-[85vh] min-h-[500px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Backdrop Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={current.backdropUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />

          {/* Ambient overlay layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-base via-base/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-base to-transparent" />

          {/* Accent glow */}
          <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-accent/[0.03] blur-[120px] rounded-full" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-20 sm:pb-24 lg:items-center lg:pb-0">
        <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-2xl"
            >
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="type">{current.mediaType}</Badge>
                {(current.badges || []).map((badge) => (
                  <Badge key={badge} variant="quality">
                    {badge}
                  </Badge>
                ))}
                {current.audioType && current.audioType !== 'both' && (
                  <Badge variant="accent">
                    {current.audioType === 'sub' ? 'SUB' : 'DUB'}
                  </Badge>
                )}
                {current.audioType === 'both' && (
                  <Badge variant="accent">SUB & DUB</Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
                {current.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-4">
                <span className="flex items-center gap-1 text-accent-amber">
                  <Star className="h-4 w-4 fill-current" />
                  {typeof current.rating === 'number' && !isNaN(current.rating) ? current.rating.toFixed(1) : '8.5'}
                </span>
                <span>{current.year}</span>
                {current.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {current.mediaType === 'movie'
                      ? `${Math.floor(current.duration / 60)}h ${current.duration % 60}m`
                      : `${current.duration} min/ep`}
                  </span>
                )}
                {(current.genres || []).filter(Boolean).slice(0, 3).map((genre, idx) => {
                  const gName = typeof genre === 'string' ? genre : genre?.name || '';
                  const gKey = typeof genre === 'object' && genre?.id ? genre.id : `${current.id}-g-${idx}`;
                  if (!gName) return null;
                  return (
                    <span
                      key={gKey}
                      className="hidden sm:inline text-text-muted"
                    >
                      {gName}
                    </span>
                  );
                })}
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6 line-clamp-3 max-w-xl">
                {current.description}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  href={
                    current.mediaType === 'movie'
                      ? `/watch/${current.id}`
                      : `/${current.mediaType}/${current.id}`
                  }
                >
                  <Play className="h-5 w-5 fill-current" />
                  {current.mediaType === 'movie' ? 'Watch Now' : 'Start Watching'}
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => toggleItem(current)}
                >
                  {inWatchlist ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  {inWatchlist ? 'In Watchlist' : 'Add to List'}
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  href={`/${current.mediaType}/${current.id}`}
                  className="hidden sm:inline-flex"
                >
                  <Info className="h-5 w-5" />
                  More Info
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-black/50 transition-all hidden lg:flex"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-black/50 transition-all hidden lg:flex"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'w-8 bg-accent'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
