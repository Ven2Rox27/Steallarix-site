// ============================================================
// Stellarix — Watch Page Wrapper
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import type { MediaItem, StreamSource, Episode, Season } from '../lib/api/types';
import {
  getStreamSource,
  getSeasons,
  getEpisodes,
  getTVStream,
  getTvStreamUrl,
} from '../lib/api/mediaService';

interface WatchPageProps {
  item: MediaItem;
}

export default function WatchPage({ item }: WatchPageProps) {
  const [sources, setSources] = useState<StreamSource[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);

  const isSeriesType = item.mediaType === 'anime' || item.mediaType === 'tv';

  // Helper to parse season and episode from URL query parameters
  const parseUrlParams = useCallback(() => {
    if (typeof window === 'undefined') return { season: 1, episode: 1 };
    const params = new URLSearchParams(window.location.search);
    const sParam = params.get('s');
    const epParam = params.get('ep');

    let season = 1;
    let episode = 1;

    if (sParam) {
      season = parseInt(sParam, 10) || 1;
    }
    if (epParam) {
      const match = epParam.match(/s?(\d+)[e\-_](\d+)/i);
      if (match) {
        season = parseInt(match[1], 10) || season;
        episode = parseInt(match[2], 10) || 1;
      } else {
        const num = parseInt(epParam, 10);
        if (!isNaN(num)) episode = num;
      }
    }
    return { season, episode };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      setLoading(true);

      if (item.mediaType === 'tv') {
        const { season: targetSeasonNum, episode: targetEpNum } = parseUrlParams();

        // 1. Fetch seasons
        const seasonsList = await getSeasons(item.id);
        if (!isMounted) return;
        setSeasons(seasonsList);

        // Find matching season or default to first
        const activeSeason =
          seasonsList.find((s) => s.seasonNumber === targetSeasonNum) ||
          seasonsList[0] || {
            id: 's-1',
            seriesId: item.id,
            seasonNumber: 1,
            title: 'Season 1',
            episodeCount: 1,
            year: 2024,
          };

        // 2. Fetch episodes for that season
        const seasonEpisodes = await getEpisodes(item.id, activeSeason.seasonNumber);
        if (!isMounted) return;
        setEpisodes(seasonEpisodes);

        // Find matching episode or default to first
        const activeEp =
          seasonEpisodes.find((e) => e.episodeNumber === targetEpNum) ||
          seasonEpisodes[0] || {
            id: `s${activeSeason.seasonNumber}e${targetEpNum}`,
            seriesId: item.id,
            seasonId: activeSeason.id,
            seasonNumber: activeSeason.seasonNumber,
            episodeNumber: targetEpNum,
            title: `Episode ${targetEpNum}`,
            description: '',
            thumbnailUrl: item.backdropUrl,
            duration: 45,
          };

        setCurrentEpisode(activeEp);

        // 3. Generate TV stream source dynamically
        const tvResult = getTVStream(
          item.tmdbId ? String(item.tmdbId) : item.id,
          activeEp.seasonNumber,
          activeEp.episodeNumber
        );
        setSources(tvResult.sources);
      } else if (item.mediaType === 'anime') {
        // Anime series handling
        const streamSources = await getStreamSource(item);
        if (!isMounted) return;
        setSources(streamSources);

        const seasonsList = await getSeasons(item.id);
        if (!isMounted) return;
        setSeasons(seasonsList);

        if (seasonsList.length > 0) {
          const firstSeasonEps = await getEpisodes(item.id, seasonsList[0].id);
          if (!isMounted) return;
          setEpisodes(firstSeasonEps);

          const params = new URLSearchParams(window.location.search);
          const epId = params.get('ep');
          if (epId) {
            const ep = firstSeasonEps.find((e) => e.id === epId);
            setCurrentEpisode(ep || firstSeasonEps[0] || null);
          } else {
            setCurrentEpisode(firstSeasonEps[0] || null);
          }
        }
      } else {
        // Movie streaming (untouched!)
        const streamSources = await getStreamSource(item);
        if (!isMounted) return;
        setSources(streamSources);
      }

      setLoading(false);
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [item.id, item.mediaType, parseUrlParams]);

  // Handle switching to a specific episode
  const selectEpisode = useCallback(
    (ep: Episode) => {
      setCurrentEpisode(ep);
      window.history.replaceState(null, '', `/watch/${item.id}?ep=${ep.id}`);

      if (item.mediaType === 'tv') {
        const tvResult = getTVStream(
          item.tmdbId ? String(item.tmdbId) : item.id,
          ep.seasonNumber,
          ep.episodeNumber
        );
        setSources(tvResult.sources);
      }
    },
    [item]
  );

  const handleNextEpisode = useCallback(async () => {
    if (!currentEpisode) return;

    const currentIdx = episodes.findIndex(
      (e) => e.episodeNumber === currentEpisode.episodeNumber
    );

    if (currentIdx !== -1 && currentIdx < episodes.length - 1) {
      // Next episode in current season
      const next = episodes[currentIdx + 1];
      selectEpisode(next);
    } else if (seasons.length > 0) {
      // Advance to next season episode 1
      const currentSeasonIdx = seasons.findIndex(
        (s) => s.seasonNumber === currentEpisode.seasonNumber
      );
      if (currentSeasonIdx !== -1 && currentSeasonIdx < seasons.length - 1) {
        const nextSeason = seasons[currentSeasonIdx + 1];
        const nextSeasonEps = await getEpisodes(item.id, nextSeason.seasonNumber);
        setEpisodes(nextSeasonEps);
        if (nextSeasonEps.length > 0) {
          selectEpisode(nextSeasonEps[0]);
        }
      }
    }
  }, [currentEpisode, episodes, seasons, item, selectEpisode]);

  const handlePrevEpisode = useCallback(async () => {
    if (!currentEpisode) return;

    const currentIdx = episodes.findIndex(
      (e) => e.episodeNumber === currentEpisode.episodeNumber
    );

    if (currentIdx > 0) {
      // Previous episode in current season
      const prev = episodes[currentIdx - 1];
      selectEpisode(prev);
    } else if (seasons.length > 0) {
      // Back to previous season last episode
      const currentSeasonIdx = seasons.findIndex(
        (s) => s.seasonNumber === currentEpisode.seasonNumber
      );
      if (currentSeasonIdx > 0) {
        const prevSeason = seasons[currentSeasonIdx - 1];
        const prevSeasonEps = await getEpisodes(item.id, prevSeason.seasonNumber);
        setEpisodes(prevSeasonEps);
        if (prevSeasonEps.length > 0) {
          selectEpisode(prevSeasonEps[prevSeasonEps.length - 1]);
        }
      }
    }
  }, [currentEpisode, episodes, seasons, item, selectEpisode]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading player...</p>
        </div>
      </div>
    );
  }

  const detailUrl =
    item.mediaType === 'movie'
      ? `/movie/${item.id}`
      : `/${item.mediaType}/${item.id}`;

  // Gracefully handle unavailable streams (e.g. Anime placeholders)
  if (sources.length === 0) {
    const isTV = item.mediaType === 'tv';
    const isAnime = item.mediaType === 'anime';

    return (
      <div className="relative h-screen w-screen bg-base overflow-hidden flex flex-col items-center justify-center select-none">
        {/* Blurred background backdrop */}
        {item.backdropUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={item.backdropUrl}
              alt=""
              className="w-full h-full object-cover opacity-20 filter blur-xl scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-base/60" />
          </div>
        )}

        {/* Top Bar with Back Link */}
        <div className="absolute top-0 left-0 right-0 z-10 p-6 flex items-center justify-between">
          <a
            href={detailUrl}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {item.title}
          </a>
        </div>

        {/* Center Alert Card */}
        <div className="relative z-10 max-w-md w-full mx-4 p-8 rounded-2xl bg-surface/90 border border-border backdrop-blur-2xl shadow-2xl text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-accent-amber/15 border border-accent-amber/30 flex items-center justify-center text-accent-amber mb-5 shadow-lg shadow-accent-amber/10">
            <AlertCircle className="h-8 w-8" />
          </div>

          <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-white/10 text-white/70 mb-3 border border-white/10">
            {isTV ? 'TV Series' : isAnime ? 'Anime' : 'Media'} Stream
          </span>

          <h2 className="text-2xl font-bold text-white mb-2">
            Streaming source not available yet
          </h2>

          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            {isTV
              ? 'A streaming provider for TV series has not been configured yet. The player architecture is ready for future provider integration.'
              : isAnime
                ? 'A streaming provider for Anime has not been configured yet. The player architecture is ready for future provider integration.'
                : 'A streaming source is not configured yet for this title. Please check back later.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <a
              href={detailUrl}
              className="flex-1 py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium text-sm transition-colors text-center shadow-lg shadow-accent/20"
            >
              Return to Details
            </a>
            <a
              href="/browse"
              className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 font-medium text-sm transition-colors text-center border border-white/10"
            >
              Browse Catalog
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <VideoPlayer
      key={currentEpisode ? `${item.id}-${currentEpisode.id}` : item.id}
      sources={sources}
      title={item.title}
      mediaId={item.id}
      episodeId={currentEpisode?.id}
      episodeTitle={currentEpisode?.title}
      seasonNumber={currentEpisode?.seasonNumber}
      episodeNumber={currentEpisode?.episodeNumber}
      posterUrl={item.posterUrl}
      mediaType={item.mediaType}
      introStart={currentEpisode?.introStart}
      introEnd={currentEpisode?.introEnd}
      outroStart={currentEpisode?.outroStart}
      outroEnd={currentEpisode?.outroEnd}
      episodes={episodes}
      onNextEpisode={isSeriesType ? handleNextEpisode : undefined}
      onPrevEpisode={isSeriesType ? handlePrevEpisode : undefined}
      backHref={detailUrl}
    />
  );
}
