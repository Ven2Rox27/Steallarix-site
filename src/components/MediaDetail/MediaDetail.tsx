// ============================================================
// Stellarix — Media Detail Component
// ============================================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Plus,
  Check,
  Star,
  Clock,
  Calendar,
  Film,
  Users,
  Info,
} from 'lucide-react';
import type { MediaItem, Season, Episode } from '../../lib/api/types';
import {
  getSeasons,
  getEpisodes,
  getRecommendations,
} from '../../lib/api/mediaService';
import Badge from '../common/Badge';
import Button from '../common/Button';
import EpisodeGrid from '../EpisodeGrid/EpisodeGrid';
import MediaRail from '../MediaRail/MediaRail';
import { useWatchlistStore } from '../../stores/watchlistStore';
import { cn } from '../../utils/cn';

interface MediaDetailProps {
  item: MediaItem;
}

export default function MediaDetail({ item }: MediaDetailProps) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  const { isInWatchlist, toggleItem } = useWatchlistStore();
  const inWatchlist = isInWatchlist(item.id);

  const hasSeries = item.mediaType === 'anime' || item.mediaType === 'tv';

  // Load seasons
  useEffect(() => {
    if (hasSeries) {
      getSeasons(item.id).then((s) => {
        setSeasons(s);
        if (s.length > 0) setActiveSeason(s[0]);
      });
    }
    getRecommendations(item.id).then(setRecommendations);
  }, [item.id, hasSeries]);

  // Load episodes when season changes
  useEffect(() => {
    if (!activeSeason) return;
    setEpisodesLoading(true);
    getEpisodes(item.id, activeSeason.id).then((eps) => {
      setEpisodes(eps);
      setEpisodesLoading(false);
    });
  }, [activeSeason, item.id]);

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[60vh] min-h-[400px] max-h-[700px] overflow-hidden">
        <img
          src={item.backdropUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-base via-base/70 to-base/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-base to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6 lg:gap-10 items-end">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden sm:block shrink-0"
              >
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-40 lg:w-52 rounded-2xl shadow-2xl shadow-black/50 border border-border"
                />
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1 min-w-0"
              >
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="type">{item.mediaType}</Badge>
                  {item.badges.map((b) => (
                    <Badge key={b} variant="quality">{b}</Badge>
                  ))}
                  {item.audioType && (
                    <Badge variant="accent">
                      {item.audioType === 'both'
                        ? 'SUB & DUB'
                        : item.audioType.toUpperCase()}
                    </Badge>
                  )}
                  {item.status && (
                    <Badge variant={item.status === 'ongoing' ? 'accent' : 'default'}>
                      {item.status}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-2">
                  {item.title}
                </h1>
                {item.originalTitle && item.originalTitle.toLowerCase() !== item.title.toLowerCase() && (
                  <p className="text-sm text-text-muted mb-3 italic">
                    Original Name: {item.originalTitle}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-3">
                  {/* Rating & Votes */}
                  {item.imdbRating ? (
                    <span className="flex items-center gap-1.5 bg-accent-amber/10 px-2.5 py-0.5 rounded-md text-accent-amber font-semibold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      IMDb {item.imdbRating.toFixed(1)}
                      {item.voteCount ? (
                        <span className="text-xs font-normal text-text-muted">
                          ({item.voteCount.toLocaleString()} votes)
                        </span>
                      ) : null}
                    </span>
                  ) : item.malRating ? (
                    <span className="flex items-center gap-1 bg-accent-blue/10 px-2 py-0.5 rounded-md text-accent-blue font-semibold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      MAL {item.malRating.toFixed(1)}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-accent-amber">
                      <Star className="h-4 w-4 fill-current" />
                      {item.rating.toFixed(1)}
                      {item.voteCount ? (
                        <span className="text-xs text-text-muted">
                          ({item.voteCount.toLocaleString()} votes)
                        </span>
                      ) : null}
                    </span>
                  )}

                  {item.firstAirDate && item.mediaType === 'tv' ? (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.firstAirDate} {item.lastAirDate && item.lastAirDate !== item.firstAirDate ? `– ${item.lastAirDate}` : ''}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.releaseDate || item.year}
                    </span>
                  )}

                  {item.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {item.mediaType === 'movie'
                        ? `${Math.floor(item.duration / 60)}h ${item.duration % 60}m`
                        : `${item.duration}m / ep`}
                    </span>
                  )}

                  {item.totalEpisodes && (
                    <span className="flex items-center gap-1">
                      <Film className="h-3.5 w-3.5" />
                      {item.totalEpisodes} Episodes
                    </span>
                  )}

                  {item.totalSeasons && (
                    <span>{item.totalSeasons} Season{item.totalSeasons > 1 ? 's' : ''}</span>
                  )}

                  {item.director && (
                    <span className="text-text-secondary">
                      <span className="text-text-muted">Dir:</span> {item.director}
                    </span>
                  )}

                  {item.studio && (
                    <span className="text-text-muted">{item.studio}</span>
                  )}
                </div>

                {/* External Database IDs (IMDb / TMDB) */}
                {(item.imdbId || item.tmdbId) && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {item.imdbId && (
                      <a
                        href={`https://www.imdb.com/title/${item.imdbId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-[#f5c518]/15 hover:bg-[#f5c518]/25 text-[#f5c518] border border-[#f5c518]/30 px-2.5 py-0.5 rounded-md text-xs font-semibold transition-colors"
                        title="View on IMDb"
                      >
                        IMDb: {item.imdbId}
                      </a>
                    )}
                    {item.tmdbId && (
                      <a
                        href={item.mediaType === 'tv' ? `https://www.themoviedb.org/tv/${item.tmdbId}` : `https://www.themoviedb.org/movie/${item.tmdbId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-[#01b4e4]/15 hover:bg-[#01b4e4]/25 text-[#01b4e4] border border-[#01b4e4]/30 px-2.5 py-0.5 rounded-md text-xs font-semibold transition-colors"
                        title="View on TMDB"
                      >
                        TMDB: {item.tmdbId}
                      </a>
                    )}
                  </div>
                )}

                {/* Genre tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {item.genres.map((genre) => (
                    <a
                      key={genre.id}
                      href={`/browse?genre=${genre.slug}`}
                      className="text-xs bg-white/[0.06] hover:bg-white/[0.1] border border-border-subtle px-2.5 py-1 rounded-full text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {genre.name}
                    </a>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    href={item.mediaType === 'movie' ? `/watch/${item.id}` : undefined}
                    onClick={
                      item.mediaType !== 'movie' && episodes.length > 0
                        ? () => {
                            window.location.href = `/watch/${item.id}?ep=${episodes[0]?.id}`;
                          }
                        : undefined
                    }
                  >
                    <Play className="h-5 w-5 fill-current" />
                    {item.mediaType === 'movie' ? 'Watch Now' : 'Start Watching'}
                  </Button>

                  {item.trailerUrl && (
                    <Button
                      variant="secondary"
                      size="lg"
                      href={item.trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Film className="h-4 w-4" />
                      Trailer
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => toggleItem(item)}
                  >
                    {inWatchlist ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                    {inWatchlist ? 'In Watchlist' : 'Add to List'}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Below Backdrop */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pb-20">
        {/* Description & Production Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 max-w-3xl"
        >
          {item.tagline && (
            <p className="text-base sm:text-lg italic text-text-muted mb-3">
              "{item.tagline}"
            </p>
          )}
          <h2 className="text-lg font-semibold mb-3">Synopsis</h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            {item.description}
          </p>

          {/* Additional Metadata */}
          {(item.writers?.length || item.productionCompanies?.length || item.director || item.creators?.length || item.networks?.length || item.countries?.length || item.languages?.length) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface border border-border text-sm">
              {item.director && (
                <div>
                  <span className="text-text-muted block text-xs uppercase tracking-wider mb-0.5">Director</span>
                  <span className="text-text-primary font-medium">{item.director}</span>
                </div>
              )}
              {item.creators && item.creators.length > 0 && (
                <div>
                  <span className="text-text-muted block text-xs uppercase tracking-wider mb-0.5">Creators</span>
                  <span className="text-text-primary font-medium">{item.creators.join(', ')}</span>
                </div>
              )}
              {item.writers && item.writers.length > 0 && (
                <div>
                  <span className="text-text-muted block text-xs uppercase tracking-wider mb-0.5">Writers</span>
                  <span className="text-text-primary font-medium">{item.writers.join(', ')}</span>
                </div>
              )}
              {item.networks && item.networks.length > 0 && (
                <div>
                  <span className="text-text-muted block text-xs uppercase tracking-wider mb-0.5">Networks</span>
                  <span className="text-text-primary font-medium">{item.networks.join(', ')}</span>
                </div>
              )}
              {item.countries && item.countries.length > 0 && (
                <div>
                  <span className="text-text-muted block text-xs uppercase tracking-wider mb-0.5">Country</span>
                  <span className="text-text-secondary">{item.countries.join(', ')}</span>
                </div>
              )}
              {item.languages && item.languages.length > 0 && (
                <div>
                  <span className="text-text-muted block text-xs uppercase tracking-wider mb-0.5">Original Language</span>
                  <span className="text-text-secondary uppercase">{item.languages.join(', ')}</span>
                </div>
              )}
              {item.productionCompanies && item.productionCompanies.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-text-muted block text-xs uppercase tracking-wider mb-0.5">Production</span>
                  <span className="text-text-secondary">{item.productionCompanies.join(' · ')}</span>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Cast */}
        {item.cast && item.cast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-10"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-text-muted" />
              Cast
            </h2>
            <div className="flex flex-wrap gap-4">
              {item.cast.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 bg-surface border border-border rounded-xl p-3 min-w-[200px]"
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-10 w-10 rounded-full object-cover bg-card"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center text-text-muted text-sm font-medium">
                      {member.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {member.name}
                    </p>
                    <p className="text-xs text-text-muted">{member.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Episodes (for anime/TV) */}
        {hasSeries && seasons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-10"
          >
            <EpisodeGrid
              seasons={seasons}
              episodes={episodes}
              activeSeason={activeSeason}
              onSeasonChange={setActiveSeason}
              loading={episodesLoading}
              seriesId={item.id}
            />
          </motion.div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <MediaRail
              title="You Might Also Like"
              items={recommendations}
              className="!px-0 [&>div:first-child]:!px-0 [&>div:last-child>div]:!px-0"
            />
          </div>
        )}
      </div>
    </div>
  );
}
