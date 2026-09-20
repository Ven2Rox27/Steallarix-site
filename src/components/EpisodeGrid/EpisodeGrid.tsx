// ============================================================
// Stellarix — Episode Grid Component
// ============================================================

import { Play, Clock, AlertTriangle, Check, Languages } from 'lucide-react';
import type { Season, Episode } from '../../lib/api/types';
import Badge from '../common/Badge';
import { cn } from '../../utils/cn';

interface EpisodeGridProps {
  seasons: Season[];
  episodes: Episode[];
  activeSeason: Season | null;
  onSeasonChange: (season: Season) => void;
  loading: boolean;
  seriesId: string;
}

export default function EpisodeGrid({
  seasons,
  episodes,
  activeSeason,
  onSeasonChange,
  loading,
  seriesId,
}: EpisodeGridProps) {
  return (
    <div>
      {/* Header with season selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold">Episodes</h2>

        {/* Season Tabs */}
        {seasons.length > 1 && (
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => onSeasonChange(season)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  activeSeason?.id === season.id
                    ? 'bg-accent text-white'
                    : 'bg-white/[0.04] text-text-secondary hover:text-text-primary hover:bg-white/[0.08]'
                )}
              >
                Season {season.seasonNumber}
              </button>
            ))}
          </div>
        )}

        {seasons.length === 1 && activeSeason && (
          <span className="text-sm text-text-muted">
            Season {activeSeason.seasonNumber} · {activeSeason.title}
          </span>
        )}
      </div>

      {/* Episodes List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-40 sm:w-52 aspect-video rounded-xl bg-card shrink-0" />
              <div className="flex-1 py-1">
                <div className="h-4 w-2/3 rounded bg-card mb-2" />
                <div className="h-3 w-full rounded bg-card mb-1" />
                <div className="h-3 w-3/4 rounded bg-card" />
              </div>
            </div>
          ))}
        </div>
      ) : episodes.length > 0 ? (
        <div className="space-y-2">
          {episodes.map((ep) => (
            <a
              key={ep.id}
              href={`/watch/${seriesId}?ep=${ep.id}`}
              className={cn(
                'group flex gap-4 p-3 rounded-xl transition-colors hover:bg-white/[0.03] border border-transparent hover:border-border-subtle',
                ep.isFiller && 'opacity-75'
              )}
            >
              {/* Thumbnail */}
              <div className="relative w-36 sm:w-48 aspect-video rounded-lg overflow-hidden bg-card shrink-0">
                <img
                  src={ep.thumbnailUrl}
                  alt={ep.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/90">
                    <Play className="h-4 w-4 text-black fill-black ml-0.5" />
                  </div>
                </div>
                {/* Duration */}
                <span className="absolute bottom-1.5 right-1.5 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded font-medium">
                  {ep.duration}m
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-xs text-text-muted font-mono shrink-0">
                    E{ep.episodeNumber.toString().padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-medium text-text-primary truncate">
                    {ep.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-text-muted mb-1.5">
                  {ep.airDate && <span>{ep.airDate}</span>}
                  {ep.airDate && ep.duration ? <span>·</span> : null}
                  {ep.duration ? <span>{ep.duration} min</span> : null}
                </div>

                <p className="text-xs text-text-muted line-clamp-2 mb-2 hidden sm:block">
                  {ep.description}
                </p>

                {/* Badges */}
                <div className="flex items-center gap-2">
                  {ep.isFiller && (
                    <Badge variant="filler">
                      <AlertTriangle className="h-3 w-3" />
                      Filler
                    </Badge>
                  )}
                  {ep.isWatched && (
                    <Badge variant="default">
                      <Check className="h-3 w-3" />
                      Watched
                    </Badge>
                  )}
                  {ep.audioType && ep.audioType !== 'both' && (
                    <Badge variant="accent" className="text-[9px]">
                      {ep.audioType === 'sub' ? 'SUB' : 'DUB'}
                    </Badge>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-12">
          <Play className="h-10 w-10 text-text-faint" />
          <p className="text-text-muted text-sm">No episodes available</p>
        </div>
      )}
    </div>
  );
}
