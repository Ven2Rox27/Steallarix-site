// ============================================================
// Stellarix — Premium Modern Anime Watch Page & Player UI
// CineSRC Streaming Provider Integration & Cinematic Layout
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play,
  SkipBack,
  SkipForward,
  ArrowLeft,
  ChevronLeft,
  List,
  Loader2,
  RefreshCw,
  Film,
  Tv,
  Search,
  Layers,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import type { AnimeInfo, AnimeEpisode, AnimeSeason } from '../../lib/api/anime/types';
import {
  getAnimeMovieStreamUrl,
  getAnimeTvStreamUrl,
} from '../../lib/api/anime/providers/cineSrc';
import { resolveAnimeTmdbId } from '../../lib/api/anime/providers/animeTmdbResolver';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { cn } from '../../utils/cn';

interface AnimeWatchPageProps {
  episodeId: string;
  anime: AnimeInfo | null;
  animeId?: string;
  episodeNumber?: number;
  seasonNumber?: number;
}

export default function AnimeWatchPage({
  episodeId,
  anime: initialAnime,
  animeId: initialAnimeId,
  episodeNumber = 1,
  seasonNumber = 1,
}: AnimeWatchPageProps) {
  const [anime, setAnime] = useState<AnimeInfo | null>(initialAnime || null);
  const [currentSeason, setCurrentSeason] = useState(seasonNumber);
  const [currentEpNumber, setCurrentEpNumber] = useState(episodeNumber);
  const [currentEpisodeId, setCurrentEpisodeId] = useState(episodeId);
  const [episodesList, setEpisodesList] = useState<AnimeEpisode[]>(initialAnime?.episodes || []);
  const [tmdbId, setTmdbId] = useState<string | number | null>(initialAnime?.tmdbId || null);

  const [loading, setLoading] = useState(true);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [episodeSearch, setEpisodeSearch] = useState('');

  const episodesSectionRef = useRef<HTMLDivElement | null>(null);
  const playerTopRef = useRef<HTMLDivElement | null>(null);

  const isMovie = anime?.type?.toLowerCase() === 'movie';
  const effectiveAnimeId = initialAnimeId || anime?.id || (episodeId ? episodeId.replace(/-s\d+e\d+.*$/i, '') : '');

  // Fetch / recover anime metadata if not provided by SSR
  const loadAnimeInfo = useCallback(async (id: string, sNum = 1) => {
    try {
      const res = await fetch(`/api/anime/info?id=${encodeURIComponent(id)}&season=${sNum}`);
      if (res.ok) {
        const data: AnimeInfo = await res.json();
        if (data && data.id) {
          setAnime(data);
          if (data.tmdbId) setTmdbId(data.tmdbId);
          if (Array.isArray(data.episodes) && data.episodes.length > 0) {
            setEpisodesList(data.episodes);
          }
          return data;
        }
      }
    } catch (e) {
      console.warn('Could not recover anime metadata:', e);
    }
    return null;
  }, []);

  // Resolve genuine TMDB ID
  const resolveId = useCallback(async (currentAnimeData?: AnimeInfo | null) => {
    setLoading(true);
    setError(null);

    const activeAnime = currentAnimeData !== undefined ? currentAnimeData : anime;

    try {
      if (activeAnime?.tmdbId) {
        setTmdbId(activeAnime.tmdbId);
        setLoading(false);
        return;
      }

      const lookupKey = effectiveAnimeId || activeAnime?.id || activeAnime?.title || episodeId;
      const resolved = await resolveAnimeTmdbId(lookupKey, isMovie ? 'movie' : 'tv');

      if (resolved?.tmdbId) {
        setTmdbId(resolved.tmdbId);
        setError(null);
      } else {
        setTmdbId(null);
        setError('Unable to load this episode.');
      }
    } catch (err) {
      console.error('Failed to resolve anime TMDB ID:', err);
      setTmdbId(null);
      setError('Unable to load this episode.');
    } finally {
      setLoading(false);
    }
  }, [anime, effectiveAnimeId, episodeId, isMovie]);

  // Initial mount & Astro client-side navigation support
  useEffect(() => {
    if (initialAnime) {
      setAnime(initialAnime);
      if (initialAnime.tmdbId) setTmdbId(initialAnime.tmdbId);
      if (initialAnime.episodes) setEpisodesList(initialAnime.episodes);
      resolveId(initialAnime);
    } else if (effectiveAnimeId) {
      loadAnimeInfo(effectiveAnimeId, currentSeason).then((loaded) => {
        resolveId(loaded);
      });
    } else {
      resolveId();
    }

    const handleNavigation = () => {
      if (!anime && effectiveAnimeId) {
        loadAnimeInfo(effectiveAnimeId, currentSeason).then((loaded) => {
          resolveId(loaded);
        });
      }
    };

    document.addEventListener('astro:page-load', handleNavigation);
    window.addEventListener('pageshow', handleNavigation);
    return () => {
      document.removeEventListener('astro:page-load', handleNavigation);
      window.removeEventListener('pageshow', handleNavigation);
    };
  }, [initialAnime, effectiveAnimeId, currentSeason, loadAnimeInfo, resolveId]);

  // Seasons list
  const seasons: AnimeSeason[] = anime?.seasons || [];

  // Current episode details
  const currentEpisode = episodesList.find(
    (e) => e.number === currentEpNumber || e.id === currentEpisodeId
  ) || {
    id: currentEpisodeId,
    number: currentEpNumber,
    seasonNumber: currentSeason,
    title: isMovie ? anime?.title || 'Full Movie' : `Episode ${currentEpNumber}`,
    description: anime?.description || '',
  };

  // Find previous and next episodes
  const currentIndex = episodesList.findIndex(
    (e) => e.number === currentEpNumber || e.id === currentEpisodeId
  );
  const prevEpisode = currentIndex > 0 ? episodesList[currentIndex - 1] : null;
  const nextEpisode =
    currentIndex >= 0 && currentIndex < episodesList.length - 1
      ? episodesList[currentIndex + 1]
      : null;

  // Handle episode selection
  const handleSelectEpisode = (ep: AnimeEpisode) => {
    setCurrentEpisodeId(ep.id);
    setCurrentEpNumber(ep.number);
    if (ep.seasonNumber) {
      setCurrentSeason(ep.seasonNumber);
    }
    // Smoothly scroll back to player if viewing down in episode grid
    if (playerTopRef.current) {
      playerTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle dynamic season selection without full page reload
  const handleSelectSeason = async (newSeason: number) => {
    if (newSeason === currentSeason) return;
    setCurrentSeason(newSeason);
    setCurrentEpNumber(1);
    setSeasonLoading(true);

    const targetId = effectiveAnimeId || anime?.id;
    if (targetId) {
      try {
        const res = await fetch(
          `/api/anime/info?id=${encodeURIComponent(targetId)}&season=${newSeason}`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.episodes) && data.episodes.length > 0) {
            setEpisodesList(data.episodes);
            setCurrentEpisodeId(data.episodes[0].id);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch season episodes:', err);
      } finally {
        setSeasonLoading(false);
      }
    } else {
      setSeasonLoading(false);
    }
  };

  // Build the dynamic CineSRC streaming embed URL
  const animeStreamUrl = tmdbId
    ? isMovie
      ? getAnimeMovieStreamUrl(tmdbId)
      : getAnimeTvStreamUrl(tmdbId, currentSeason, currentEpNumber)
    : '';

  // Filter episodes by keyword
  const filteredEpisodes = episodeSearch.trim()
    ? episodesList.filter(
        (e) =>
          String(e.number).includes(episodeSearch.trim()) ||
          (e.title && e.title.toLowerCase().includes(episodeSearch.trim().toLowerCase()))
      )
    : episodesList;

  const backUrl = anime?.id ? `/anime/${anime.id}` : effectiveAnimeId ? `/anime/${effectiveAnimeId}` : '/anime';

  const scrollToEpisodes = () => {
    if (episodesSectionRef.current) {
      episodesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-base text-text-primary pb-28 select-none">
      {/* Scroll anchor at the top of the player */}
      <div ref={playerTopRef} className="h-px w-full" />

      {/* ============================================================ */}
      {/* 1. TOP WATCH HEADER                                          */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-surface/90 border-b border-border/60 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Back Button & Title Info */}
          <div className="flex items-center gap-3.5 min-w-0">
            <a
              href={backUrl}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white transition-all cursor-pointer shrink-0"
              title="Back to Anime Details"
              aria-label="Back to Anime Details"
            >
              <ArrowLeft className="h-4 w-4" />
            </a>

            <div className="min-w-0">
              <a
                href={backUrl}
                className="text-xs sm:text-sm font-bold text-white hover:text-accent transition-colors truncate block"
                title={anime?.title || 'Anime Series'}
              >
                {anime?.title || 'Anime Series'}
              </a>
              <p className="text-[11px] text-accent font-medium truncate">
                {isMovie
                  ? 'Anime Movie • Full Feature'
                  : `Season ${currentSeason} • Episode ${currentEpNumber}${currentEpisode.title ? ` • ${currentEpisode.title}` : ''}`}
              </p>
            </div>
          </div>

          {/* Right: Quick Episodes Scroll Action (Series Only) */}
          {!isMovie && episodesList.length > 0 && (
            <button
              type="button"
              onClick={scrollToEpisodes}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
            >
              <List className="h-3.5 w-3.5 text-accent" />
              <span>Episodes</span>
            </button>
          )}
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN CINEMATIC PLAYER CONTAINER                           */}
      {/* ============================================================ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Large 16:9 Responsive Player Box */}
        <div className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 flex items-center justify-center">
          {/* Subtle Ambient Border Glow */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] z-20" />

          {loading ? (
            /* Loading State with Skeleton */
            <div className="flex flex-col items-center gap-3.5 text-center p-6 z-10">
              <Loader2 className="h-10 w-10 text-accent animate-spin" />
              <div>
                <p className="text-sm font-semibold text-white">Loading episode...</p>
                <p className="text-xs text-text-muted mt-0.5">Connecting CineSRC streaming server</p>
              </div>
            </div>
          ) : error || !animeStreamUrl ? (
            /* Professional Error State inside Player Area */
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center max-w-md z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted">
                <Film className="h-7 w-7 opacity-60 text-accent" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Unable to load this episode</h2>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Please try again or choose another episode from the catalog.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <a href={backUrl}>
                  <Button variant="secondary" size="sm" className="px-4 py-2 rounded-xl text-xs cursor-pointer">
                    Anime Details
                  </Button>
                </a>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => resolveId()}
                  className="px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-accent/20"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry</span>
                </Button>
              </div>
            </div>
          ) : (
            /* CineSRC Iframe Player (100% interactive, fills container, no pointer-events blocking) */
            <iframe
              key={animeStreamUrl}
              src={animeStreamUrl}
              title={anime?.title || 'Anime Stream'}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              className="w-full h-full border-0 relative z-10"
            />
          )}
        </div>

        {/* ============================================================ */}
        {/* 3. EPISODE INFORMATION & QUICK NAVIGATION                     */}
        {/* ============================================================ */}
        <section className="mt-6 pt-2 pb-6 border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            {/* Episode Title & Description */}
            <div className="space-y-2 max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent uppercase tracking-wider">
                  {isMovie ? 'Movie' : `S${currentSeason} • EP ${currentEpNumber}`}
                </span>
                <Badge variant="sub" size="sm">
                  SUB
                </Badge>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10">
                  1080p Full HD
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface text-text-muted border border-border">
                  CineSRC
                </span>
              </div>

              {/* Title Header */}
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isMovie
                  ? anime?.title || 'Anime Movie'
                  : currentEpisode.title || `Episode ${currentEpNumber}`}
              </h1>

              {/* Synopsis / Episode Description */}
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed pt-1">
                {currentEpisode.description ||
                  anime?.description ||
                  'No detailed description available for this episode.'}
              </p>
            </div>

            {/* Quick Prev / Next Episode Controls (Series Only) */}
            {!isMovie && (
              <div className="flex items-center gap-2.5 shrink-0 self-start">
                <button
                  type="button"
                  disabled={!prevEpisode && currentEpNumber <= 1}
                  onClick={() => {
                    if (prevEpisode) {
                      handleSelectEpisode(prevEpisode);
                    } else if (currentEpNumber > 1) {
                      setCurrentEpNumber((p) => p - 1);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface/80 hover:bg-surface border border-border text-xs font-semibold text-white/90 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm hover:border-accent/40"
                  title="Previous Episode"
                >
                  <SkipBack className="h-3.5 w-3.5 text-accent" />
                  <span>Previous Episode</span>
                </button>

                <button
                  type="button"
                  disabled={!nextEpisode}
                  onClick={() => {
                    if (nextEpisode) {
                      handleSelectEpisode(nextEpisode);
                    } else {
                      setCurrentEpNumber((p) => p + 1);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-accent/20"
                  title="Next Episode"
                >
                  <span>Next Episode</span>
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. SCROLLABLE EPISODES BROWSER SECTION (Series Only)          */}
        {/* ============================================================ */}
        {!isMovie && (
          <section ref={episodesSectionRef} className="mt-10 pt-4">
            {/* Section Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Tv className="h-5 w-5 text-accent" />
                  <span>Episodes</span>
                  <span className="text-xs text-text-muted font-normal">
                    ({episodesList.length} total)
                  </span>
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Select an episode below to watch instantly
                </p>
              </div>

              {/* Episode Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" />
                <input
                  type="text"
                  value={episodeSearch}
                  onChange={(e) => setEpisodeSearch(e.target.value)}
                  placeholder="Filter episode (e.g. 1, 12)..."
                  className="w-full h-10 pl-9 pr-3.5 bg-surface/70 border border-border rounded-xl text-xs text-text-primary placeholder:text-text-faint outline-none focus:border-accent/60 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Season Selector Tabs */}
            {seasons.length > 1 && (
              <div className="mb-6 pb-2">
                <div className="flex items-center gap-2 mb-2.5">
                  <Layers className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Season
                  </span>
                  {seasonLoading && (
                    <Loader2 className="h-3 w-3 text-accent animate-spin ml-1" />
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {seasons.map((s) => {
                    const isSelected = s.seasonNumber === currentSeason;
                    return (
                      <button
                        key={s.id || s.seasonNumber}
                        type="button"
                        onClick={() => handleSelectSeason(s.seasonNumber)}
                        className={cn(
                          'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer',
                          isSelected
                            ? 'bg-accent text-white border-accent shadow-md shadow-accent/25'
                            : 'bg-surface/70 hover:bg-surface border-border text-text-muted hover:text-white'
                        )}
                      >
                        {s.title || `Season ${s.seasonNumber}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Episode Grid Cards */}
            {filteredEpisodes.length === 0 ? (
              <div className="py-14 text-center bg-surface/20 border border-border/40 rounded-3xl p-8">
                <Film className="h-8 w-8 text-text-muted opacity-40 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">No episodes found</p>
                <p className="text-xs text-text-muted mt-1">
                  Try searching for another episode number or clear the filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {filteredEpisodes.map((ep) => {
                  const isCurrent = ep.number === currentEpNumber;

                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => handleSelectEpisode(ep)}
                      className={cn(
                        'group text-left block p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer relative',
                        isCurrent
                          ? 'bg-accent/15 border-accent shadow-lg shadow-accent/20 ring-1 ring-accent/50'
                          : 'bg-surface/50 hover:bg-surface/90 border-border/60 hover:border-accent/40 hover:scale-[1.02]'
                      )}
                    >
                      {/* Thumbnail with overlay */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-card mb-2 border border-border/40">
                        {ep.image || anime?.image ? (
                          <img
                            src={ep.image || anime?.image}
                            alt={ep.title || `Episode ${ep.number}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-card">
                            <Film className="h-6 w-6 text-text-muted opacity-40" />
                          </div>
                        )}

                        {/* Play overlay / Active Badge */}
                        <div
                          className={cn(
                            'absolute inset-0 transition-opacity flex items-center justify-center',
                            isCurrent
                              ? 'bg-accent/40 opacity-100'
                              : 'bg-black/40 opacity-0 group-hover:opacity-100'
                          )}
                        >
                          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/40">
                            <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                          </div>
                        </div>

                        {/* Corner EP Pill */}
                        <div className="absolute top-1.5 left-1.5">
                          <span
                            className={cn(
                              'text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md',
                              isCurrent
                                ? 'bg-accent text-white shadow-sm'
                                : 'bg-black/75 text-white/90 border border-white/10'
                            )}
                          >
                            EP {ep.number}
                          </span>
                        </div>
                      </div>

                      {/* Title & Metadata */}
                      <div className="px-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={cn(
                              'text-xs font-semibold line-clamp-1 transition-colors',
                              isCurrent ? 'text-accent font-bold' : 'text-white group-hover:text-accent'
                            )}
                          >
                            {ep.title || `Episode ${ep.number}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-text-muted">
                          {isCurrent ? (
                            <span className="text-accent font-semibold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Now Playing</span>
                            </span>
                          ) : (
                            <span>Subbed • HD</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
