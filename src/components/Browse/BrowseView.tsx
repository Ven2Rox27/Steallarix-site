// ============================================================
// Stellarix — Dynamic Browse & Movie Catalog View
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { Filter, X, Search, ChevronDown } from 'lucide-react';
import type { MediaItem, MediaType, SearchFilters, Genre } from '../../lib/api/types';
import { getGenres, searchMedia, getPaginatedMovies, getPaginatedTVShows } from '../../lib/api/mediaService';
import MediaCard from '../MediaCard/MediaCard';
import Button from '../common/Button';
import { cn } from '../../utils/cn';

const sortOptions = [
  { value: 'popular', label: 'Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'latest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'alphabetical', label: 'A-Z' },
] as const;

const mediaTypes = [
  { value: 'all', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'anime', label: 'Anime' },
  { value: 'tv', label: 'TV Shows' },
] as const;

const yearOptions = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2015, 2010, 2000];

interface BrowseViewProps {
  initialMediaType?: MediaType | 'all';
}

export default function BrowseView({ initialMediaType = 'all' }: BrowseViewProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states for dynamic catalog
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [searchInput, setSearchInput] = useState('');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  const [filters, setFilters] = useState<SearchFilters>({
    mediaType: initialMediaType,
    sortBy: 'popular',
  });

  // Load available genres
  useEffect(() => {
    getGenres().then(setGenres);
  }, []);

  // Sync filters whenever initialMediaType prop changes
  useEffect(() => {
    setSearchInput('');
    setPage(1);
    setFilters({
      mediaType: initialMediaType,
      sortBy: 'popular',
    });
  }, [initialMediaType]);

  // Support Astro client-side navigation (astro:page-load) and bfcache (pageshow)
  useEffect(() => {
    const handleNavigation = () => {
      setSearchInput('');
      setPage(1);
      setFilters({
        mediaType: initialMediaType,
        sortBy: 'popular',
      });
    };

    document.addEventListener('astro:page-load', handleNavigation);
    window.addEventListener('pageshow', handleNavigation);

    return () => {
      document.removeEventListener('astro:page-load', handleNavigation);
      window.removeEventListener('pageshow', handleNavigation);
    };
  }, [initialMediaType]);

  // Fetch initial page or refetch whenever filters or search query changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setPage(1);

    // Guaranteed safety timeout to prevent infinite spinner
    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3500);

    const isMovieOnly = filters.mediaType === 'movie';
    const isTvOnly = filters.mediaType === 'tv';

    if (isMovieOnly) {
      getPaginatedMovies({
        page: 1,
        query: filters.query,
        genre: filters.genre,
        year: filters.year,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
      })
        .then((res) => {
          if (!isMounted) return;
          clearTimeout(safetyTimer);
          setItems(res.items);
          setTotalPages(res.totalPages);
          setTotalResults(res.totalResults);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch movies from TMDB:', err);
          if (!isMounted) return;
          clearTimeout(safetyTimer);
          setItems([]);
          setLoading(false);
        });
    } else if (isTvOnly) {
      getPaginatedTVShows({
        page: 1,
        query: filters.query,
        genre: filters.genre,
        year: filters.year,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
      })
        .then((res) => {
          if (!isMounted) return;
          clearTimeout(safetyTimer);
          setItems(res.items || []);
          setTotalPages(res.totalPages || 1);
          setTotalResults(res.totalResults || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch TV shows from TMDB:', err);
          if (!isMounted) return;
          clearTimeout(safetyTimer);
          setItems([]);
          setLoading(false);
        });
    } else {
      searchMedia(filters)
        .then((result) => {
          if (!isMounted) return;
          clearTimeout(safetyTimer);
          setItems(result.items);
          setTotalPages(Math.max(1, Math.ceil(result.total / (result.pageSize || 12))));
          setTotalResults(result.total);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to search media:', err);
          if (!isMounted) return;
          clearTimeout(safetyTimer);
          setItems([]);
          setLoading(false);
        });
    }

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [filters]);

  // Load next page of dynamic catalog
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);

    const nextPage = page + 1;

    try {
      if (filters.mediaType === 'movie') {
        const res = await getPaginatedMovies({
          page: nextPage,
          query: filters.query,
          genre: filters.genre,
          year: filters.year,
          minRating: filters.minRating,
          sortBy: filters.sortBy,
        });

        setItems((prev) => {
          const seen = new Set(prev.map((item) => item.id));
          const newItems = res.items.filter((item) => !seen.has(item.id));
          return [...prev, ...newItems];
        });
        setPage(nextPage);
        setTotalPages(res.totalPages);
        setTotalResults(res.totalResults);
      } else if (filters.mediaType === 'tv') {
        const res = await getPaginatedTVShows({
          page: nextPage,
          query: filters.query,
          genre: filters.genre,
          year: filters.year,
          minRating: filters.minRating,
          sortBy: filters.sortBy,
        });

        if (res.items && res.items.length > 0) {
          setItems((prev) => {
            const seen = new Set(prev.map((item) => item.id));
            const newItems = res.items.filter((item) => !seen.has(item.id));
            return [...prev, ...newItems];
          });
          setPage(nextPage);
        }
        setTotalPages(res.totalPages || 1);
        setTotalResults(res.totalResults || 0);
      }
    } catch (err) {
      console.error('Failed to load next page:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page, totalPages, filters]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll: automatically load next page when user scrolls near bottom
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || loading || loadingMore || page >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && !loadingMore) {
          handleLoadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, loadingMore, page, totalPages, handleLoadMore]);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      updateFilter('query', val.trim() || undefined);
    }, 350);
  };

  const clearSearch = () => {
    setSearchInput('');
    updateFilter('query', undefined);
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      mediaType: initialMediaType,
      sortBy: 'popular',
    });
  };

  const hasActiveFilters = !!(
    filters.genre ||
    filters.year ||
    filters.minRating ||
    filters.query ||
    (filters.sortBy && filters.sortBy !== 'popular')
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {initialMediaType === 'movie'
                ? 'Movies'
                : initialMediaType === 'anime'
                ? 'Anime'
                : initialMediaType === 'tv'
                ? 'TV Shows'
                : 'Browse Catalog'}
            </h1>
            {(filters.mediaType === 'movie' || filters.mediaType === 'tv') && totalResults > 0 && !loading && (
              <p className="text-xs text-text-muted mt-1">
                Showing {items.length} of {totalResults.toLocaleString()} titles from TMDB
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Quick Search Input */}
            <div className="relative flex-1 sm:w-64 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={
                  initialMediaType === 'movie'
                    ? 'Search TMDB movies...'
                    : initialMediaType === 'tv'
                    ? 'Search TMDB TV shows...'
                    : 'Search titles...'
                }
                className="w-full h-9 pl-9 pr-8 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent/50 transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filters Toggle Button */}
            <Button
              variant={showFilters ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Media Type Tabs (only on generic browse page) */}
        {initialMediaType === 'all' && (
          <div className="flex items-center gap-1 mb-6 overflow-x-auto scrollbar-hide pb-2">
            {mediaTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => updateFilter('mediaType', type.value as MediaType | 'all')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  filters.mediaType === type.value
                    ? 'bg-accent text-white'
                    : 'bg-white/[0.04] text-text-secondary hover:text-text-primary hover:bg-white/[0.08]'
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 p-5 bg-surface rounded-2xl border border-border animate-fade-in shadow-xl shadow-black/20">
            {/* Genre */}
            <div>
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">
                Genre
              </label>
              <select
                value={filters.genre || ''}
                onChange={(e) =>
                  updateFilter('genre', e.target.value || undefined)
                }
                className="w-full h-9 bg-card border border-border rounded-lg px-3 text-sm text-text-primary outline-none focus:border-accent/50"
              >
                <option value="">All Genres</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.slug}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Year */}
            <div>
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">
                Release Year
              </label>
              <select
                value={filters.year || ''}
                onChange={(e) =>
                  updateFilter(
                    'year',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full h-9 bg-card border border-border rounded-lg px-3 text-sm text-text-primary outline-none focus:border-accent/50"
              >
                <option value="">Any Year</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">
                Min Rating
              </label>
              <select
                value={filters.minRating || ''}
                onChange={(e) =>
                  updateFilter(
                    'minRating',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full h-9 bg-card border border-border rounded-lg px-3 text-sm text-text-primary outline-none focus:border-accent/50"
              >
                <option value="">Any Rating</option>
                <option value="9">9+ (Masterpiece)</option>
                <option value="8">8+ (Great)</option>
                <option value="7">7+ (Good)</option>
                <option value="6">6+ (Above Average)</option>
                <option value="5">5+ (Average)</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'popular'}
                onChange={(e) =>
                  updateFilter(
                    'sortBy',
                    e.target.value as SearchFilters['sortBy']
                  )
                }
                className="w-full h-9 bg-card border border-border rounded-lg px-3 text-sm text-text-primary outline-none focus:border-accent/50"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Dynamic Results Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] rounded-xl bg-card border border-border/50" />
                <div className="mt-2.5 h-4 w-3/4 rounded bg-card" />
                <div className="mt-1.5 h-3 w-1/2 rounded bg-card" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {items.map((item, i) => (
                <MediaCard
                  key={`${item.id}-${i}`}
                  item={item}
                  index={i}
                  className="w-full"
                />
              ))}
            </div>

            {/* Dynamic Catalog Infinite Scroll Sentinel & Load More */}
            {(filters.mediaType === 'movie' || filters.mediaType === 'tv') && page < totalPages && (
              <>
                <div ref={sentinelRef} className="h-10 w-full pointer-events-none" />
                <div className="flex flex-col items-center justify-center mt-6 gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 rounded-xl border border-white/15 hover:border-accent/50 hover:bg-white/[0.08] transition-all group"
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                        {filters.mediaType === 'tv' ? 'Loading more TV shows...' : 'Loading more movies...'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {filters.mediaType === 'tv' ? 'Load More TV Shows' : 'Load More Movies'}
                        <ChevronDown className="h-4 w-4 text-text-muted group-hover:translate-y-0.5 transition-transform" />
                      </span>
                    )}
                  </Button>
                  <span className="text-xs text-text-muted">
                    Showing {items.length} of {totalResults.toLocaleString()} titles (Page {page} of {totalPages.toLocaleString()})
                  </span>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-20">
            <Filter className="h-12 w-12 text-text-faint" />
            <p className="text-text-muted text-lg font-medium">
              {filters.mediaType === 'tv'
                ? 'No TV shows found matching your criteria'
                : filters.mediaType === 'movie'
                ? 'No movies found matching your criteria'
                : 'No titles found matching your criteria'}
            </p>
            <p className="text-text-faint text-sm">
              Try adjusting your search term or clearing filters
            </p>
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
