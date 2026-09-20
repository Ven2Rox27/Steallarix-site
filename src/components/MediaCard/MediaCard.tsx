// ============================================================
// Stellarix — Media Card Component
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Heart, Info, Star, Check } from 'lucide-react';
import type { MediaItem, WatchProgress } from '../../lib/api/types';
import Badge from '../common/Badge';
import { useWatchlistStore } from '../../stores/watchlistStore';
import { cn } from '../../utils/cn';

interface MediaCardProps {
  item: MediaItem;
  progress?: WatchProgress;
  index?: number;
  className?: string;
}

export default function MediaCard({
  item,
  progress,
  index = 0,
  className,
}: MediaCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { isInWatchlist, toggleItem } = useWatchlistStore();

  const inWatchlist = isInWatchlist(item.id);
  const progressPercent = progress
    ? Math.round((progress.position / progress.duration) * 100)
    : 0;

  const detailUrl = item.mediaType === 'movie'
    ? `/movie/${item.id}`
    : `/${item.mediaType}/${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]',
        className
      )}
    >
      {/* Card */}
      <a href={detailUrl} className="block">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card border border-border-subtle group-hover:border-border-strong transition-all duration-300 group-hover:scale-[1.03] group-hover:card-shadow-lg">
          {/* Poster Image */}
          {!imgError ? (
            <img
              src={item.posterUrl}
              alt={item.title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-all duration-500',
                imgLoaded ? 'opacity-100' : 'opacity-0'
              )}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-card">
              <span className="text-text-muted text-xs text-center px-2">
                {item.title}
              </span>
            </div>
          )}

          {/* Loading skeleton */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 bg-card animate-pulse" />
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating badge (always visible) */}
          <div className="absolute top-2 left-2">
            <Badge variant="rating">
              <Star className="h-3 w-3 fill-current" />
              {typeof item.rating === 'number' && !isNaN(item.rating) ? item.rating.toFixed(1) : '8.0'}
            </Badge>
          </div>

          {/* Media type badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="type" className="text-[9px]">
              {item.mediaType}
            </Badge>
          </div>

          {/* Hover: Quick Actions */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {/* Genre tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {(item.genres || []).filter(Boolean).slice(0, 2).map((genre, idx) => {
                const gName = typeof genre === 'string' ? genre : genre?.name || '';
                const gKey = typeof genre === 'object' && genre?.id ? genre.id : `${item.id}-g-${idx}`;
                if (!gName) return null;
                return (
                  <span
                    key={gKey}
                    className="text-[10px] text-text-secondary bg-white/10 px-1.5 py-0.5 rounded"
                  >
                    {gName}
                  </span>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors"
                aria-label={`Play ${item.title}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href =
                    item.mediaType === 'movie'
                      ? `/watch/${item.id}`
                      : detailUrl;
                }}
              >
                <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
              </button>

              <button
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
                  inWatchlist
                    ? 'bg-accent/20 border-accent/40 text-accent'
                    : 'bg-black/30 border-white/20 text-white hover:border-white/40'
                )}
                aria-label={
                  inWatchlist
                    ? `Remove ${item.title} from watchlist`
                    : `Add ${item.title} to watchlist`
                }
                onClick={(e) => {
                  e.preventDefault();
                  toggleItem(item);
                }}
              >
                {inWatchlist ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
              </button>

              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 border border-white/20 text-white hover:border-white/40 transition-colors"
                aria-label={`Like ${item.title}`}
                onClick={(e) => e.preventDefault()}
              >
                <Heart className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Continue Watching Progress Bar */}
          {progress && progressPercent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div
                className="h-full bg-accent rounded-r-full transition-all"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          )}
        </div>
      </a>

      {/* Title & Info (below card) */}
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-text-primary truncate">
          <a href={detailUrl} className="hover:text-accent transition-colors">
            {item.title}
          </a>
        </h3>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
          <span>{item.year}</span>
          {item.duration && item.mediaType === 'movie' && (
            <span>
              {Math.floor(item.duration / 60)}h {item.duration % 60}m
            </span>
          )}
          {item.totalEpisodes && (
            <span>{item.totalEpisodes} eps</span>
          )}
        </div>

        {/* Continue Watching subtitle */}
        {progress && (
          <p className="text-[11px] text-text-muted mt-0.5 truncate">
            {progress.episodeTitle
              ? `S${progress.seasonNumber} E${progress.episodeNumber} · ${progress.episodeTitle}`
              : `${Math.round(progressPercent)}% watched`}
          </p>
        )}
      </div>
    </motion.div>
  );
}
