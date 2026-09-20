// ============================================================
// Stellarix — Premium Modern Anime Landing & Discovery Hub
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
  Film,
  Play,
  Flame,
  Star,
  Clock,
  Sparkles,
  X,
  Compass,
  Trophy,
  Layers,
  CheckCircle2,
  Tv,
  Plus,
  Check,
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import type {
  AnimeSearchResultItem,
  AnimeSearchResponse,
  AnimeDiscoverySections,
  AnimeCategoryResponse,
} from '../../lib/api/anime/types';
import { isAnime, filterAnimeOnly, matchesAnimeGenre } from '../../lib/api/anime/animeFilter';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { cn } from '../../utils/cn';

const GENRE_CHIPS = [
  'All',
  'Action',
  'Adventure',
  'Fantasy',
  'Sci-Fi',
  'Shonen',
  'Romance',
  'Supernatural',
  'Comedy',
  'Mystery',
];

export default function AnimeSearchPage() {
  // Discovery sections state
  const [discovery, setDiscovery] = useState<AnimeDiscoverySections | null>(null);
  const [discoveryLoading, setDiscoveryLoading] = useState(true);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);

  // Search state
  const [searchInput, setSearchInput] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeSearchResultItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Category state
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [categoryResults, setCategoryResults] = useState<AnimeSearchResultItem[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryHasNextPage, setCategoryHasNextPage] = useState(false);
  const categoryReqCounter = useRef(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch homepage discovery sections from AniList
  const loadDiscoverySections = useCallback(async () => {
    setDiscoveryLoading(true);
    setDiscoveryError(null);

    try {
      const res = await fetch('/api/anime/discovery');
      if (!res.ok) {
        throw new Error(`Discovery API returned status ${res.status}`);
      }
      const data: AnimeDiscoverySections = await res.json();
      setDiscovery(data);
    } catch (err: any) {
      console.error('Failed to load anime discovery sections:', err);
      setDiscoveryError(err.message || 'Failed to load discovery sections.');
    } finally {
      setDiscoveryLoading(false);
    }
  }, []);

  // Fetch AniList category anime with pagination and race condition prevention
  const handleSelectGenre = useCallback(async (genre: string, page = 1) => {
    setSelectedGenre(genre);

    if (genre === 'All') {
      setCategoryResults([]);
      setCategoryLoading(false);
      setCategoryError(null);
      setCategoryPage(1);
      setCategoryHasNextPage(false);
      return;
    }

    const currentReqId = ++categoryReqCounter.current;
    setCategoryLoading(true);
    setCategoryError(null);
    if (page === 1) {
      setCategoryResults([]); // clear stale results while loading
      setCategoryPage(1);
    }

    try {
      const res = await fetch(`/api/anime/category?genre=${encodeURIComponent(genre)}&page=${page}`);
      if (!res.ok) {
        throw new Error(`Failed to load ${genre} anime (status ${res.status})`);
      }
      const data: AnimeCategoryResponse = await res.json();
      if (currentReqId === categoryReqCounter.current) {
        setCategoryResults(Array.isArray(data.results) ? data.results : []);
        setCategoryHasNextPage(Boolean(data.hasNextPage));
        setCategoryPage(page);
      }
    } catch (err: any) {
      if (currentReqId === categoryReqCounter.current) {
        console.error(`Error loading category ${genre}:`, err);
        setCategoryError(err.message || `Failed to load ${genre} anime.`);
        setCategoryResults([]);
      }
    } finally {
      if (currentReqId === categoryReqCounter.current) {
        setCategoryLoading(false);
      }
    }
  }, []);

  // Fetch search results from AniList
  const executeSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setActiveSearchQuery('');
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    setActiveSearchQuery(trimmed);

    try {
      const res = await fetch(`/api/anime/search?query=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        throw new Error(`Anime search API returned status ${res.status}`);
      }
      const data: AnimeSearchResponse = await res.json();
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    } catch (err: any) {
      console.error('Anime search error:', err);
      setSearchError(err.message || 'Failed to search anime.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiscoverySections();

    const handleNavigation = () => {
      loadDiscoverySections();
      if (selectedGenre !== 'All') {
        handleSelectGenre(selectedGenre, 1);
      }
    };

    document.addEventListener('astro:page-load', handleNavigation);
    window.addEventListener('pageshow', handleNavigation);
    return () => {
      document.removeEventListener('astro:page-load', handleNavigation);
      window.removeEventListener('pageshow', handleNavigation);
    };
  }, [loadDiscoverySections, handleSelectGenre, selectedGenre]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      executeSearch(searchInput.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearchQuery('');
    setSearchResults([]);
  };

  const isSearchActive = Boolean(activeSearchQuery);

  const hasTrending = Boolean(discovery?.trending && discovery.trending.length > 0);
  const hasPopular = Boolean(discovery?.popular && discovery.popular.length > 0);
  const hasRecent = Boolean(discovery?.recent && discovery.recent.length > 0);

  // Hero displays top featured AniList anime
  const featuredItem =
    discovery?.trending?.[0] ||
    discovery?.popular?.[0] ||
    discovery?.recent?.[0] ||
    null;

  return (
    <main className="min-h-screen pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* ============================================================ */}
      {/* 1. CINEMATIC HERO SECTION                                    */}
      {/* ============================================================ */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-surface/40 backdrop-blur-md mb-12 shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent-rose/10 rounded-full blur-3xl" />
        </div>

        {featuredItem?.image ? (
          <div className="absolute inset-0 -z-10">
            <img
              src={featuredItem.image}
              alt={featuredItem.title}
              className="w-full h-full object-cover object-top opacity-35 filter blur-xs"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-base via-base/60 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface/80 via-base to-base/90" />
        )}

        <div className="relative p-6 sm:p-10 lg:p-14 max-w-3xl">
          {/* Subtitle pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Anime Streaming Destination</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            {featuredItem?.title || 'Immerse in the World of Anime'}
          </h1>

          <p className="text-text-muted text-sm sm:text-base lg:text-lg mt-4 leading-relaxed line-clamp-3 max-w-2xl">
            Stream popular Japanese animation, explore trending series, and search the anime universe with crystal clear playback, subtitles, and dubs.
          </p>

          {/* Genre Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <Badge variant="sub" size="sm">
              SUB & DUB
            </Badge>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15 uppercase">
              1080p Full HD
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent/20 text-accent-light border border-accent/30 uppercase">
              TV Series & Movies
            </span>
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mt-8">
            {featuredItem ? (
              <a
                href={`/anime/${featuredItem.id}`}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold transition-all duration-300 shadow-xl shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Watch Now</span>
              </a>
            ) : (
              <a
                href="#catalog"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold transition-all duration-300 shadow-xl shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Compass className="h-4 w-4" />
                <span>Explore Catalog</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => setIsBookmarked((prev) => !prev)}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-300 backdrop-blur-md cursor-pointer',
                isBookmarked
                  ? 'bg-accent/20 border-accent/50 text-accent'
                  : 'bg-white/5 hover:bg-white/10 border-white/15 text-white/90'
              )}
            >
              {isBookmarked ? (
                <>
                  <Check className="h-4 w-4 text-accent" />
                  <span>Added to Watchlist</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SEARCH & DISCOVERY CONTROLS                               */}
      {/* ============================================================ */}
      <section id="catalog" className="mb-10 space-y-5">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search anime titles, genres, or keywords..."
              className="w-full h-11 pl-10 pr-9 bg-surface/70 backdrop-blur-md border border-border rounded-xl text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/40 transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white p-1"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="h-11 px-6 rounded-xl font-medium shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-accent/20"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </form>

        {/* Genre Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GENRE_CHIPS.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => handleSelectGenre(genre, 1)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer',
                selectedGenre === genre
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/25'
                  : 'bg-surface/60 hover:bg-surface border-border text-text-muted hover:text-white'
              )}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SEARCH RESULTS VIEW (Visible when user searches)           */}
      {/* ============================================================ */}
      {isSearchActive ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Search Results for</span>
                <span className="text-accent">"{activeSearchQuery}"</span>
              </h2>
              <span className="text-xs text-text-muted">
                {searchResults.length} {searchResults.length === 1 ? 'title' : 'titles'} found
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="border border-white/10 hover:border-white/20 text-xs px-3 py-1.5 rounded-xl cursor-pointer"
            >
              ✕ Clear Search
            </Button>
          </div>

          {searchLoading ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 py-8">
                <Loader2 className="h-6 w-6 text-accent animate-spin" />
                <p className="text-text-muted text-sm font-medium">Searching anime titles...</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : searchError ? (
            <div className="py-16 text-center bg-surface/40 border border-border/50 rounded-2xl p-8 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center text-accent-rose mb-3 mx-auto">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Search Error</h3>
              <p className="text-xs text-text-muted mb-4">{searchError}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => executeSearch(activeSearchQuery)}
                className="px-4 py-2 rounded-xl"
              >
                Retry Search
              </Button>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-16 text-center bg-surface/30 border border-border/40 rounded-2xl p-8 max-w-lg mx-auto">
              <Film className="h-10 w-10 text-text-muted opacity-50 mb-3 mx-auto" />
              <h3 className="text-base font-bold text-white mb-1">No Results Found</h3>
              <p className="text-xs text-text-muted mb-5">
                No anime found matching "{activeSearchQuery}". Try another keyword or browse our curated sections below.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="border border-white/10 px-4 py-2 rounded-xl"
              >
                View Anime Sections
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {searchResults.map((item, idx) => (
                <AnimeCard key={`${item.id}-${idx}`} item={item} />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* ============================================================ */
        /* 4. ANIME SECTIONS (Popular, Recent, Episodes, Releases, etc) */
        /* ============================================================ */
        <div className="space-y-16">
          {discoveryLoading ? (
            <div className="space-y-12">
              <div className="flex items-center justify-center gap-3 py-6">
                <Loader2 className="h-6 w-6 text-accent animate-spin" />
                <p className="text-text-muted text-sm font-medium">Loading anime catalog...</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : discoveryError ? (
            <div className="py-16 text-center bg-surface/40 border border-border/50 rounded-2xl p-8 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center text-accent-rose mb-3 mx-auto">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Unable to Load Discovery</h3>
              <p className="text-xs text-text-muted mb-4">{discoveryError}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={loadDiscoverySections}
                className="px-4 py-2 rounded-xl"
              >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Retry Loading
              </Button>
            </div>
          ) : selectedGenre !== 'All' ? (
            /* Genre-Filtered Anime View */
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      <span>{selectedGenre} Anime</span>
                    </h2>
                    {!categoryLoading && !categoryError && (
                      <span className="text-xs text-text-muted">
                        {categoryResults.length} {categoryResults.length === 1 ? 'title' : 'titles'} found
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectGenre('All')}
                  className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                >
                  ✕ Show All Genres
                </button>
              </div>

              {categoryLoading ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-3 py-8">
                    <Loader2 className="h-6 w-6 text-accent animate-spin" />
                    <p className="text-text-muted text-sm font-medium">Loading {selectedGenre} anime from AniList...</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <AnimeCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              ) : categoryError ? (
                <div className="py-16 text-center bg-surface/40 border border-border/50 rounded-2xl p-8 max-w-lg mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center text-accent-rose mb-3 mx-auto">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Failed to Load {selectedGenre}</h3>
                  <p className="text-xs text-text-muted mb-4">{categoryError}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSelectGenre(selectedGenre, categoryPage)}
                    className="px-4 py-2 rounded-xl"
                  >
                    Retry Category
                  </Button>
                </div>
              ) : categoryResults.length === 0 ? (
                <EmptySectionCard
                  title={`No ${selectedGenre} Anime Found`}
                  description={`No anime matching "${selectedGenre}" returned by AniList. Choose another genre or return to All.`}
                  icon={Layers}
                />
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {categoryResults.map((item, idx) => (
                      <AnimeCard key={`genre-${item.id}-${idx}`} item={item} />
                    ))}
                  </div>

                  {/* Pagination Controls for Category */}
                  <div className="flex items-center justify-center gap-3 pt-4">
                    {categoryPage > 1 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          handleSelectGenre(selectedGenre, categoryPage - 1);
                          window.scrollTo({ top: 350, behavior: 'smooth' });
                        }}
                        className="px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Previous Page
                      </Button>
                    )}
                    <span className="text-xs text-text-muted px-3">
                      Page {categoryPage}
                    </span>
                    {categoryHasNextPage && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          handleSelectGenre(selectedGenre, categoryPage + 1);
                          window.scrollTo({ top: 350, behavior: 'smooth' });
                        }}
                        className="px-4 py-2 rounded-xl cursor-pointer shadow-md shadow-accent/20"
                      >
                        Next Page
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </section>
          ) : (
            <>
              {/* 1. Popular Anime */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-accent-amber/15 border border-accent-amber/30 flex items-center justify-center text-accent-amber">
                      <Star className="h-4 w-4 fill-accent-amber" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">Popular Anime</h2>
                      <p className="text-xs text-text-muted">Fan-favorite series and top rated hits</p>
                    </div>
                  </div>
                  {hasPopular && (
                    <span className="text-xs font-semibold text-accent hover:underline cursor-pointer">
                      View All
                    </span>
                  )}
                </div>

                {hasPopular ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {discovery!.popular.map((item, idx) => (
                      <AnimeCard key={`popular-${item.id}-${idx}`} item={item} />
                    ))}
                  </div>
                ) : (
                  <EmptySectionCard
                    title="Popular Anime Catalog"
                    description="Popular anime rankings will appear here once connected."
                    icon={Star}
                  />
                )}
              </section>

              {/* 2. Recently Added Anime */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">Recently Added</h2>
                      <p className="text-xs text-text-muted">Fresh releases added to the platform</p>
                    </div>
                  </div>
                  {hasRecent && (
                    <span className="text-xs font-semibold text-accent hover:underline cursor-pointer">
                      View All
                    </span>
                  )}
                </div>

                {hasRecent ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {discovery!.recent.map((item, idx) => (
                      <AnimeCard key={`recent-${item.id}-${idx}`} item={item} />
                    ))}
                  </div>
                ) : (
                  <EmptySectionCard
                    title="Recently Added Releases"
                    description="Newly added anime and episodes will appear here."
                    icon={Clock}
                  />
                )}
              </section>

              {/* 3. Trending & Latest Episodes */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center text-accent-rose">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">Trending & Latest Episodes</h2>
                      <p className="text-xs text-text-muted">What the community is watching right now</p>
                    </div>
                  </div>
                  {hasTrending && (
                    <span className="text-xs font-semibold text-accent hover:underline cursor-pointer">
                      View All
                    </span>
                  )}
                </div>

                {hasTrending ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {discovery!.trending.map((item, idx) => (
                      <AnimeCard key={`trending-${item.id}-${idx}`} item={item} />
                    ))}
                  </div>
                ) : (
                  <EmptySectionCard
                    title="Latest Episodes"
                    description="Weekly and daily episode drops will be listed here."
                    icon={Flame}
                  />
                )}
              </section>

              {/* 4. New Releases & Completed Series */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* New Releases Box */}
                <div className="p-6 rounded-2xl bg-surface/40 border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">New Seasonal Releases</h3>
                      <p className="text-xs text-text-muted">Simulcasts & premieres</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed mt-3">
                    Discover new seasonal premieres broadcast straight from Japan. Check back as new anime seasons launch.
                  </p>
                </div>

                {/* Completed Anime Box */}
                <div className="p-6 rounded-2xl bg-surface/40 border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Completed Anime</h3>
                      <p className="text-xs text-text-muted">Ready to binge end-to-end</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed mt-3">
                    Catch up on finished series from episode one through the finale with uninterrupted binge-watching.
                  </p>
                </div>
              </div>

              {/* 5. Recommended Genres Showcase */}
              <section className="pt-4">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Explore by Genre</h2>
                    <p className="text-xs text-text-muted">Find anime tailored to your specific taste</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {GENRE_CHIPS.filter((g) => g !== 'All').map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => {
                        handleSelectGenre(genre, 1);
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      className="group p-4 rounded-xl bg-surface/50 hover:bg-surface/90 border border-border/60 hover:border-accent/50 transition-all duration-300 text-left flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-accent transition-colors">
                        {genre}
                      </span>
                      <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </main>
  );
}

// -----------------------------------------------------------
// Premium Anime Card Component
// -----------------------------------------------------------

function AnimeCard({ item }: { item: AnimeSearchResultItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={`/anime/${item.id}`}
      className="group block relative select-none cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-card border border-border-subtle group-hover:border-accent/50 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-accent/15">
        {/* Poster Image */}
        {!imgError && item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-surface text-text-muted">
            <Film className="h-8 w-8 mb-2 opacity-40 text-accent" />
            <span className="text-xs line-clamp-2 text-text-secondary font-medium">{item.title}</span>
          </div>
        )}

        {/* Hover Overlay with play action */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
          {/* Top badges */}
          <div className="flex items-center gap-1.5 self-start">
            <Badge variant="sub" size="sm">
              {item.subOrDub ? item.subOrDub.toUpperCase() : 'SUB'}
            </Badge>
            {item.type && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/70 text-white/90 border border-white/10 uppercase">
                {item.type}
              </span>
            )}
          </div>

          {/* Center Play Icon */}
          <div className="self-center w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-4 w-4 fill-white ml-0.5" />
          </div>

          {/* Bottom info */}
          <div>
            <p className="text-xs text-white/90 font-semibold line-clamp-1">
              {item.releaseDate ? `${item.releaseDate}` : 'Anime Series'}
            </p>
          </div>
        </div>

        {/* Static Sub/Dub pill in corner */}
        <div className="absolute top-2.5 right-2.5 group-hover:opacity-0 transition-opacity duration-200">
          <Badge variant="sub" size="sm">
            {item.subOrDub ? item.subOrDub.toUpperCase() : 'SUB'}
          </Badge>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="mt-2.5 px-0.5">
        <h3 className="text-xs sm:text-sm font-semibold text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted">
          {item.releaseDate && <span>{item.releaseDate}</span>}
          {item.releaseDate && item.type && <span>·</span>}
          {item.type && <span>{item.type}</span>}
          {item.episode && (
            <>
              <span>·</span>
              <span className="text-accent font-medium">Ep {item.episode}</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}

// -----------------------------------------------------------
// Card Loading Skeleton
// -----------------------------------------------------------

function AnimeCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col">
      <div className="aspect-[2/3] rounded-2xl bg-card border border-border/40" />
      <div className="mt-3 h-4 w-3/4 rounded-md bg-card" />
      <div className="mt-1.5 h-3 w-1/2 rounded-md bg-card" />
    </div>
  );
}

// -----------------------------------------------------------
// Polished Empty Section Card
// -----------------------------------------------------------

function EmptySectionCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <div className="py-12 px-6 rounded-2xl bg-surface/20 border border-white/5 backdrop-blur-sm text-center max-w-xl mx-auto">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted mx-auto mb-3">
        <Icon className="h-5 w-5 opacity-60" />
      </div>
      <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}
