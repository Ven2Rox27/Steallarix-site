// ============================================================
// Stellarix — Premium Modern Anime Detail Page
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Calendar,
  Film,
  Layers,
  ChevronRight,
  Tag,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Loader2,
  Bookmark,
  Share2,
  Check,
  Search,
  Tv,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import type { AnimeInfo, AnimeEpisode } from '../../lib/api/anime/types';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { cn } from '../../utils/cn';

interface AnimeDetailPageProps {
  anime?: AnimeInfo | null;
  animeId?: string;
  loading?: boolean;
  error?: string | null;
}

export default function AnimeDetailPage({
  anime: initialAnime,
  animeId,
  loading = false,
  error = null,
}: AnimeDetailPageProps) {
  const [anime, setAnime] = useState<AnimeInfo | null>(initialAnime || null);
  const [isLoading, setIsLoading] = useState(loading || (!initialAnime && Boolean(animeId)));
  const [fetchError, setFetchError] = useState<string | null>(error);

  const [selectedRange, setSelectedRange] = useState(0);
  const [episodeSearch, setEpisodeSearch] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Client-side fetch fallback to recover anime info if not supplied or during navigation
  const fetchDetails = useCallback(async (id: string) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/anime/info?id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('This anime title is currently unavailable in the catalog.');
      const data = await res.json();
      if (data && data.id) {
        setAnime(data);
        setFetchError(null);
      } else {
        setFetchError('This anime title is currently unavailable in the catalog.');
      }
    } catch (err: any) {
      setFetchError(err?.message || 'Failed to load anime info.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialAnime) {
      setAnime(initialAnime);
      setIsLoading(false);
    } else if (animeId) {
      fetchDetails(animeId);
    }

    const handleNavigation = () => {
      const idToUse = animeId || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '');
      if (idToUse && idToUse !== 'anime') {
        fetchDetails(idToUse);
      }
    };

    document.addEventListener('astro:page-load', handleNavigation);
    window.addEventListener('pageshow', handleNavigation);
    return () => {
      document.removeEventListener('astro:page-load', handleNavigation);
      window.removeEventListener('pageshow', handleNavigation);
    };
  }, [initialAnime, animeId, fetchDetails]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base text-text-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-9 w-9 text-accent animate-spin" />
          <p className="text-text-muted text-sm font-medium">Loading anime details...</p>
        </div>
      </div>
    );
  }

  // Not found or unavailable state (professional design)
  if (!anime) {
    return (
      <div className="min-h-screen bg-base text-text-primary flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-surface/80 backdrop-blur-md border border-border rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted mx-auto">
            <Film className="h-7 w-7 opacity-60 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-white">Anime Title Unavailable</h1>
          <p className="text-xs text-text-muted leading-relaxed">
            {fetchError || 'This anime title is currently unavailable in the catalog or is scheduled for a future release.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-3">
            <a href="/anime">
              <Button variant="secondary" size="sm" className="px-5 py-2.5 rounded-xl text-xs font-medium cursor-pointer">
                Back to Anime Hub
              </Button>
            </a>
            <Button
              variant="primary"
              size="sm"
              onClick={() => animeId && fetchDetails(animeId)}
              className="px-5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-md shadow-accent/20"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const episodes = anime.episodes || [];
  const pageSize = 50;
  const rangeCount = Math.ceil(episodes.length / pageSize);

  // Filter episodes by search keyword
  const filteredEpisodes = episodeSearch.trim()
    ? episodes.filter((ep) => {
        const query = episodeSearch.trim().toLowerCase();
        return (
          String(ep.number).includes(query) ||
          (ep.title && ep.title.toLowerCase().includes(query))
        );
      })
    : episodes;

  const displayedEpisodes = episodeSearch.trim()
    ? filteredEpisodes
    : episodes.length > pageSize
    ? episodes.slice(selectedRange * pageSize, (selectedRange + 1) * pageSize)
    : episodes;

  const isMovie = anime.type?.toLowerCase() === 'movie';
  const firstEpisode = episodes[0];
  const watchUrl = isMovie
    ? `/anime/watch/${encodeURIComponent(anime.id)}?animeId=${encodeURIComponent(anime.id)}`
    : firstEpisode
    ? `/anime/watch/${encodeURIComponent(firstEpisode.id)}?animeId=${encodeURIComponent(anime.id)}&epNum=${firstEpisode.number}&s=${firstEpisode.seasonNumber || 1}`
    : `/anime/watch/${encodeURIComponent(anime.id)}?animeId=${encodeURIComponent(anime.id)}&epNum=1&s=1`;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-base text-text-primary pb-24 select-none">
      {/* ============================================================ */}
      {/* 1. CINEMATIC BACKDROP BANNER                                 */}
      {/* ============================================================ */}
      <div className="relative w-full h-[360px] sm:h-[460px] md:h-[540px] overflow-hidden">
        {anime.cover || anime.image ? (
          <img
            src={anime.cover || anime.image}
            alt={anime.title}
            className="w-full h-full object-cover object-top filter blur-xs opacity-35 scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-surface/80 via-base to-base" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-base via-base/50 to-transparent" />

        {/* Back Navigation Link */}
        <div className="absolute top-20 left-4 sm:left-8 z-20">
          <a
            href="/anime"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/70 hover:bg-surface border border-white/10 text-xs font-semibold text-white/90 hover:text-white backdrop-blur-md transition-all shadow-lg cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Anime Hub</span>
          </a>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. ANIME HEADER & METADATA SECTION                          */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-52 sm:-mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Poster Card */}
          <div className="w-48 sm:w-60 md:w-72 shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-3xl overflow-hidden bg-card border-2 border-white/15 shadow-2xl shadow-black/80 relative group">
              {anime.image ? (
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-card text-text-muted">
                  <Film className="h-10 w-10 mb-2 opacity-50" />
                  <span className="text-xs">{anime.title}</span>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <Badge variant="sub" size="sm">
                  {anime.subOrDub ? anime.subOrDub.toUpperCase() : 'SUB'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            <div>
              {/* Type and status badge pill */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2.5">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent uppercase tracking-wider">
                  {anime.type || 'TV Series'}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10 uppercase">
                  {anime.status || 'Finished Airing'}
                </span>
                {anime.totalEpisodes > 0 && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-surface/80 border border-border text-text-muted">
                    {anime.totalEpisodes} {anime.totalEpisodes === 1 ? 'Episode' : 'Episodes'}
                  </span>
                )}
              </div>

              {/* Title & Japanese Alternative Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {anime.title}
              </h1>
              {anime.otherName && (
                <p className="text-xs sm:text-sm text-text-muted mt-1 font-medium italic">
                  Also known as: {anime.otherName}
                </p>
              )}
            </div>

            {/* Genre tags */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                {anime.genres.map((g) => (
                  <span
                    key={g}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-surface/70 border border-border/80 text-text-secondary"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-2">
              <a
                href={watchUrl}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold transition-all shadow-xl shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>{firstEpisode ? `Watch Episode ${firstEpisode.number}` : 'Watch Now'}</span>
              </a>

              <button
                type="button"
                onClick={() => setIsBookmarked((prev) => !prev)}
                className={cn(
                  'inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-300 backdrop-blur-md cursor-pointer',
                  isBookmarked
                    ? 'bg-accent/20 border-accent/50 text-accent'
                    : 'bg-surface/80 hover:bg-surface border-border text-white/90'
                )}
              >
                {isBookmarked ? (
                  <>
                    <Check className="h-4 w-4 text-accent" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    <span>Add to List</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-border bg-surface/80 hover:bg-surface text-white/90 transition-all cursor-pointer"
                title="Share this title"
              >
                {copiedShare ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-semibold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">Share</span>
                  </>
                )}
              </button>
            </div>

            {/* Synopsis / Description */}
            <div className="pt-2 text-left">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-accent" />
                <span>Synopsis</span>
              </h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-3xl">
                {anime.description || 'No detailed description is currently available for this anime series.'}
              </p>
            </div>

            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/40 text-left">
              <div>
                <span className="text-[11px] text-text-muted uppercase tracking-wider block">Released</span>
                <span className="text-xs font-semibold text-white">{anime.releaseDate || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[11px] text-text-muted uppercase tracking-wider block">Format</span>
                <span className="text-xs font-semibold text-white">{anime.type || 'TV'}</span>
              </div>
              <div>
                <span className="text-[11px] text-text-muted uppercase tracking-wider block">Audio</span>
                <span className="text-xs font-semibold text-white">{anime.subOrDub?.toUpperCase() || 'SUB'}</span>
              </div>
              <div>
                <span className="text-[11px] text-text-muted uppercase tracking-wider block">Status</span>
                <span className="text-xs font-semibold text-white">{anime.status || 'Finished'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. EPISODE BROWSER SECTION                                   */}
        {/* ============================================================ */}
        {episodes.length > 0 && (
          <section className="mt-16 pt-10 border-t border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Tv className="h-5 w-5 text-accent" />
                  <span>Episodes</span>
                  <span className="text-xs text-text-muted font-normal">
                    ({episodes.length} total)
                  </span>
                </h2>
              </div>

              {/* Episode Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" />
                <input
                  type="text"
                  value={episodeSearch}
                  onChange={(e) => setEpisodeSearch(e.target.value)}
                  placeholder="Search ep (e.g. 1, 12)..."
                  className="w-full h-9 pl-8 pr-3 bg-surface/70 border border-border rounded-xl text-xs text-text-primary placeholder:text-text-faint outline-none focus:border-accent/60 transition-all"
                />
              </div>
            </div>

            {/* Episode Range Selector (if more than 50 episodes) */}
            {!episodeSearch.trim() && rangeCount > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
                {Array.from({ length: rangeCount }).map((_, idx) => {
                  const start = idx * pageSize + 1;
                  const end = Math.min((idx + 1) * pageSize, episodes.length);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedRange(idx)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer',
                        selectedRange === idx
                          ? 'bg-accent text-white border-accent shadow-md shadow-accent/25'
                          : 'bg-surface/60 hover:bg-surface border-border text-text-muted hover:text-white'
                      )}
                    >
                      {start} - {end}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Episode Grid */}
            {displayedEpisodes.length === 0 ? (
              <div className="py-12 text-center bg-surface/20 border border-border/40 rounded-2xl p-6">
                <p className="text-xs text-text-muted">
                  No episodes found matching "{episodeSearch}".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {displayedEpisodes.map((ep) => {
                  const epWatchUrl = `/anime/watch/${encodeURIComponent(ep.id)}?animeId=${encodeURIComponent(anime.id)}&epNum=${ep.number}&s=${ep.seasonNumber || 1}`;
                  return (
                    <a
                      key={ep.id}
                      href={epWatchUrl}
                      className="group block p-3 rounded-2xl bg-surface/40 hover:bg-surface/90 border border-border/60 hover:border-accent/50 transition-all duration-200 cursor-pointer"
                    >
                      {/* Thumbnail or placeholder */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-card mb-2.5 border border-border/40">
                        {ep.image || anime.image ? (
                          <img
                            src={ep.image || anime.image}
                            alt={ep.title || `Episode ${ep.number}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-card">
                            <Film className="h-6 w-6 text-text-muted opacity-40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-lg">
                            <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-1.5 left-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/75 text-white border border-white/10">
                            EP {ep.number}
                          </span>
                        </div>
                      </div>

                      {/* Episode Title */}
                      <div className="px-0.5">
                        <span className="text-xs font-semibold text-white group-hover:text-accent transition-colors line-clamp-1">
                          {ep.title || `Episode ${ep.number}`}
                        </span>
                        <span className="text-[11px] text-text-muted block mt-0.5">
                          Subbed · HD
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
