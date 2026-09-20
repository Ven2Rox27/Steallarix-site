// ============================================================
// Stellarix — Media Service Layer
// ============================================================
// All UI components consume data through this service.
// Currently backed by mock data; swap implementation for real API.

import type {
  MediaItem,
  MovieDetails,
  MediaType,
  Genre,
  Season,
  Episode,
  StreamSource,
  StreamResult,
  SearchFilters,
  SearchResult,
  WatchProgress,
} from './types';

import {
  allMedia,
  featuredMedia,
  movies,
  anime,
  tvShows,
  genres,
  getMediaById as _getById,
  getMediaByType as _getByType,
  getSeasonsForSeries,
  getEpisodesForSeason,
  continueWatchingData,
} from './mockData';

import { movieStreamProvider } from './providers/movieStreamProvider';
import { movieDetailsProvider } from './providers/movieDetailsProvider';
import { tvStreamProvider, getTvStreamUrl } from './providers/tvStreamProvider';
import { animeStreamProvider } from './providers/animeStreamProvider';
import { tmdbTvProvider, type FetchTVOptions, type PaginatedTVResult } from './providers/tmdbTv';

export { getTvStreamUrl };

// -----------------------------------------------------------
// Featured & Trending
// -----------------------------------------------------------

export async function getFeatured(): Promise<MediaItem[]> {
  return featuredMedia;
}

export async function getTrending(
  mediaType?: MediaType | 'all'
): Promise<MediaItem[]> {
  if (mediaType === 'anime') {
    if (typeof window !== 'undefined') {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 3500);
        const res = await fetch('/api/anime/discovery', { signal: controller.signal });
        clearTimeout(tid);
        if (res.ok) {
          const data = await res.json();
          const list = data.recent || data.trending || data.popular || [];
          if (list.length > 0) {
            return list.map((item: any) => ({
              id: item.id,
              title: item.title,
              posterUrl: item.image,
              backdropUrl: item.image,
              description: '',
              mediaType: 'anime' as const,
              year: item.releaseDate ? parseInt(item.releaseDate, 10) || 2024 : 2024,
              rating: item.rating ? Number(item.rating) : 8.5,
              genres: [],
              badges: ['HD', item.subOrDub ? item.subOrDub.toUpperCase() : 'SUB'],
            }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch trending anime via API on client:', err);
      }
    } else {
      try {
        const { getRecentlyAddedAnime } = await import('./anime/animeService');
        const recent = await getRecentlyAddedAnime(12);
        if (recent && recent.length > 0) {
          return recent.map((item) => ({
            id: item.id,
            title: item.title,
            posterUrl: item.image,
            backdropUrl: item.image,
            description: '',
            mediaType: 'anime',
            year: item.releaseDate ? parseInt(item.releaseDate, 10) || 2024 : 2024,
            rating: 8.5,
            genres: [],
            badges: ['HD', item.subOrDub ? item.subOrDub.toUpperCase() : 'SUB'],
          }));
        }
      } catch (err) {
        console.warn('Could not fetch trending anime:', err);
      }
    }
  }
  if (!mediaType || mediaType === 'all') {
    return [...allMedia].sort((a, b) => b.rating - a.rating).slice(0, 12);
  }
  return _getByType(mediaType)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12);
}

export async function getPopular(): Promise<MediaItem[]> {
  return [...allMedia]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
}

export async function getNewReleases(): Promise<MediaItem[]> {
  return [...allMedia]
    .filter((m) => m.year >= 2024)
    .sort((a, b) => b.year - a.year || b.rating - a.rating);
}

export async function getTopRated(): Promise<MediaItem[]> {
  return [...allMedia]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
}

export async function getByGenre(genreSlug: string): Promise<MediaItem[]> {
  return allMedia.filter((m) =>
    m.genres.some((g) => g.slug === genreSlug)
  );
}

import { tmdbProvider, type FetchMoviesOptions, type PaginatedMoviesResult } from './providers/tmdb';

// -----------------------------------------------------------
// Details
// -----------------------------------------------------------

/**
 * Fetches movie details dynamically from TMDB.
 */
export async function getMovieDetails(id: string): Promise<MovieDetails | null> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/movies/${encodeURIComponent(id)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`Failed to fetch /api/movies/${id} from client:`, err);
    }
  }
  return tmdbProvider.fetchMovieDetails(id);
}

/**
 * Fetches TV show details dynamically from TMDB.
 */
export async function getTVDetails(id: string): Promise<MediaItem | null> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/tv/${encodeURIComponent(id)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`Failed to fetch /api/tv/${id} from client:`, err);
    }
  }
  return tmdbTvProvider.fetchTVShowDetails(id);
}

export async function getDetails(
  id: string,
  mediaType?: string
): Promise<MediaItem | null> {
  if (mediaType === 'movie') {
    return getMovieDetails(id);
  }
  if (mediaType === 'tv') {
    return getTVDetails(id);
  }
  const item = _getById(id);
  if (item?.mediaType === 'movie') {
    const details = await getMovieDetails(id);
    if (details) return details;
  }
  if (item?.mediaType === 'tv') {
    const details = await getTVDetails(id);
    if (details) return details;
  }
  if (!item) {
    // If not in static list, check if it's a dynamic TMDB movie ID
    const movie = await getMovieDetails(id);
    if (movie) return movie;
    // Check if it's a dynamic TMDB TV ID
    const tv = await getTVDetails(id);
    if (tv) return tv;
  }
  return item ?? null;
}

// -----------------------------------------------------------
// Seasons & Episodes
// -----------------------------------------------------------

export async function getSeasons(seriesId: string): Promise<Season[]> {
  if (typeof window !== 'undefined') {
    try {
      const details = await getTVDetails(seriesId);
      if (details?.seasons && details.seasons.length > 0) {
        return details.seasons;
      }
    } catch {
      // Fallback
    }
  } else {
    try {
      const seasons = await tmdbTvProvider.fetchTVSeasons(seriesId);
      if (seasons && seasons.length > 0) return seasons;
    } catch {
      // Fallback
    }
  }
  return getSeasonsForSeries(seriesId);
}

export async function getEpisodes(
  seriesId: string,
  seasonId: string | number
): Promise<Episode[]> {
  const seasonNum = parseInt(String(seasonId).replace(/\D/g, ''), 10) || 1;
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(
        `/api/tv/${encodeURIComponent(seriesId)}/season/${seasonNum}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.episodes && data.episodes.length > 0) {
          return data.episodes;
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch /api/tv/${seriesId}/season/${seasonNum}:`, err);
    }
  } else {
    try {
      const episodes = await tmdbTvProvider.fetchTVSeasonEpisodes(seriesId, seasonNum);
      if (episodes && episodes.length > 0) return episodes;
    } catch {
      // Fallback
    }
  }
  return getEpisodesForSeason(String(seasonId));
}

// -----------------------------------------------------------
// Streaming
// -----------------------------------------------------------

/**
 * Generates the movie embed URL using 2Embed given an IMDb ID.
 * Example: getMovieEmbedUrl("tt10676048") -> "https://www.2embed.cc/embed/tt10676048"
 */
export function getMovieEmbedUrl(imdbId: string): string {
  return movieStreamProvider.getMovieEmbedUrl(imdbId);
}

/**
 * Generates the movie stream source using TMDB ID or IMDb ID through the movie stream provider.
 */
export function getMovieStream(
  movieOrId: MediaItem | string | number,
  preferredProvider?: 'vidsrc' | '2embed'
): StreamResult {
  return movieStreamProvider.getMovieStream(movieOrId, preferredProvider);
}

/**
 * Requests TV series stream through the TV stream provider.
 * TODO: TV series streaming provider not configured yet.
 */
export function getTVStream(
  seriesId: string,
  seasonNumber = 1,
  episodeNumber = 1
): StreamResult {
  return tvStreamProvider.getTVStream(seriesId, seasonNumber, episodeNumber);
}

/**
 * Requests Anime stream through the anime stream provider.
 * TODO: Anime streaming provider not configured yet.
 */
export function getAnimeStream(
  animeId: string,
  episodeNumber = 1
): StreamResult {
  return animeStreamProvider.getAnimeStream(animeId, episodeNumber);
}

/**
 * Centralized streaming source resolver for all media types.
 * For movies: dynamically delegates to movieStreamProvider supporting both VidSrc and 2Embed.
 * For TV: delegates to tvStreamProvider (placeholder / TODO).
 * For Anime: delegates to animeStreamProvider (placeholder / TODO).
 */
export async function getStreamSource(
  mediaOrId: MediaItem | string,
  _episodeId?: string,
  preferredProvider?: 'vidsrc' | '2embed'
): Promise<StreamSource[]> {
  let item: MediaItem | null = null;
  let id = '';

  if (typeof mediaOrId === 'object' && mediaOrId !== null) {
    item = mediaOrId;
    id = item.id;
  } else {
    id = String(mediaOrId);
    item = _getById(id) || null;
  }

  // Movie streaming via movieStreamProvider
  if (item?.mediaType === 'movie') {
    const result = movieStreamProvider.getStream(item, preferredProvider);
    return result.sources;
  }

  // TV streaming via tvStreamProvider
  if (item?.mediaType === 'tv') {
    let s = 1;
    let ep = 1;
    if (_episodeId) {
      const match = _episodeId.match(/s?(\d+)[e\-_](\d+)/i);
      if (match) {
        s = parseInt(match[1], 10);
        ep = parseInt(match[2], 10);
      } else {
        const num = parseInt(_episodeId, 10);
        if (!isNaN(num)) ep = num;
      }
    }
    const result = tvStreamProvider.getTVStream(item.tmdbId ? String(item.tmdbId) : id, s, ep);
    return result.sources;
  }

  // Anime streaming via animeStreamProvider (TODO)
  if (item?.mediaType === 'anime') {
    const result = animeStreamProvider.getAnimeStream(id);
    return result.sources;
  }

  // If raw mediaId or dynamic TMDB ID is passed
  if (id) {
    try {
      const movie = await getMovieDetails(id);
      if (movie) {
        const result = movieStreamProvider.getStream(movie, preferredProvider);
        if (result.available && result.sources.length > 0) {
          return result.sources;
        }
      }
    } catch {
      // Ignore
    }

    try {
      const tv = await getTVDetails(id);
      if (tv) {
        let s = 1;
        let ep = 1;
        if (_episodeId) {
          const match = _episodeId.match(/s?(\d+)[e\-_](\d+)/i);
          if (match) {
            s = parseInt(match[1], 10);
            ep = parseInt(match[2], 10);
          } else {
            const num = parseInt(_episodeId, 10);
            if (!isNaN(num)) ep = num;
          }
        }
        const result = tvStreamProvider.getTVStream(tv.tmdbId ? String(tv.tmdbId) : id, s, ep);
        if (result.available && result.sources.length > 0) {
          return result.sources;
        }
      }
    } catch {
      // Ignore
    }

    const result = movieStreamProvider.getMovieStream(id, preferredProvider);
    if (result.available && result.sources.length > 0) {
      return result.sources;
    }
  }

  return [];
}

// -----------------------------------------------------------
// Search
// -----------------------------------------------------------

export async function searchMedia(
  filters: SearchFilters
): Promise<SearchResult> {
  // If explicitly searching movies
  if (filters.mediaType === 'movie') {
    const movieResult = await getPaginatedMovies({
      page: filters.page || 1,
      query: filters.query,
      genre: filters.genre,
      year: filters.year,
      minRating: filters.minRating,
      sortBy: filters.sortBy,
    });
    return {
      items: movieResult.items,
      total: movieResult.totalResults,
      page: movieResult.page,
      pageSize: 12,
    };
  }

  // If explicitly searching TV shows
  if (filters.mediaType === 'tv') {
    const tvResult = await getPaginatedTVShows({
      page: filters.page || 1,
      query: filters.query,
      genre: filters.genre,
      year: filters.year,
      minRating: filters.minRating,
      sortBy: filters.sortBy,
    });
    return {
      items: tvResult.items,
      total: tvResult.totalResults,
      page: tvResult.page,
      pageSize: 20,
    };
  }

  // If searching all media types with a text query, search TMDB movies dynamically!
  let movieItems: MediaItem[] = [];
  if (filters.query && (filters.mediaType === 'all' || !filters.mediaType)) {
    try {
      const tmdbRes = await getPaginatedMovies({
        query: filters.query,
        genre: filters.genre,
        year: filters.year,
        minRating: filters.minRating,
        page: 1,
      });
      movieItems = tmdbRes.items;
    } catch {
      // Fallback
    }
  } else if (!filters.mediaType || filters.mediaType === 'all') {
    movieItems = allMedia.filter((m) => m.mediaType === 'movie');
  }

  // Non-movie items
  let nonMovieMedia = allMedia.filter((m) => m.mediaType !== 'movie');
  if (filters.mediaType && filters.mediaType !== 'all') {
    nonMovieMedia = nonMovieMedia.filter((m) => m.mediaType === filters.mediaType);
  }

  if (filters.query) {
    const q = filters.query.toLowerCase();
    nonMovieMedia = nonMovieMedia.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.genres.some((g) => g.name.toLowerCase().includes(q))
    );
  }

  if (filters.genre) {
    nonMovieMedia = nonMovieMedia.filter((m) =>
      m.genres.some((g) => g.slug === filters.genre)
    );
  }

  if (filters.year) {
    nonMovieMedia = nonMovieMedia.filter((m) => m.year === filters.year);
  }

  if (filters.minRating) {
    nonMovieMedia = nonMovieMedia.filter((m) => m.rating >= filters.minRating!);
  }

  // Search anime dynamically if query provided
  let animeItems: MediaItem[] = [];
  if (filters.query && (filters.mediaType === 'all' || filters.mediaType === 'anime' || !filters.mediaType)) {
    try {
      let animeRes: any;
      if (typeof window !== 'undefined') {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 3500);
        try {
          const res = await fetch(`/api/anime/search?query=${encodeURIComponent(filters.query)}&page=${filters.page || 1}`, { signal: controller.signal });
          clearTimeout(tid);
          if (res.ok) {
            animeRes = await res.json();
          }
        } catch {
          clearTimeout(tid);
        }
      } else {
        const { searchAnime } = await import('./anime/animeService');
        animeRes = await searchAnime(filters.query, filters.page || 1);
      }

      if (animeRes && animeRes.results) {
        animeItems = (animeRes.results || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          posterUrl: item.image,
          backdropUrl: item.image,
          description: '',
          mediaType: 'anime' as const,
          year: item.releaseDate ? parseInt(item.releaseDate, 10) || 2024 : 2024,
          rating: item.rating ? Number(item.rating) : 8.5,
          genres: [],
          badges: ['HD', item.subOrDub ? item.subOrDub.toUpperCase() : 'SUB'],
        }));
        if (filters.mediaType === 'anime') {
          return {
            items: animeItems,
            total: animeItems.length,
            page: animeRes.currentPage || 1,
            pageSize: 12,
          };
        }
      }
    } catch {
      // Ignore
    }
  }

  // Combine items avoiding duplicates
  const seen = new Set<string>();
  const combined: MediaItem[] = [];

  for (const item of [...movieItems, ...animeItems, ...nonMovieMedia]) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      combined.push(item);
    }
  }

  // Sorting
  switch (filters.sortBy) {
    case 'rating':
      combined.sort((a, b) => b.rating - a.rating);
      break;
    case 'latest':
      combined.sort((a, b) => b.year - a.year);
      break;
    case 'oldest':
      combined.sort((a, b) => a.year - b.year);
      break;
    case 'alphabetical':
      combined.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'popular':
    default:
      combined.sort((a, b) => b.rating - a.rating);
      break;
  }

  return {
    items: combined,
    total: combined.length,
    page: 1,
    pageSize: combined.length,
  };
}

// -----------------------------------------------------------
// Recommendations
// -----------------------------------------------------------

export async function getRecommendations(
  mediaId: string
): Promise<MediaItem[]> {
  const item = _getById(mediaId);
  if (!item) return [];

  const genreSlugs = new Set(item.genres.map((g) => g.slug));

  return allMedia
    .filter((m) => m.id !== mediaId)
    .map((m) => ({
      item: m,
      score: m.genres.filter((g) => genreSlugs.has(g.slug)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.item);
}

// -----------------------------------------------------------
// Genres
// -----------------------------------------------------------

export async function getGenres(): Promise<Genre[]> {
  return genres;
}

// -----------------------------------------------------------
// Continue Watching (initial demo data)
// -----------------------------------------------------------

export async function getContinueWatching(): Promise<WatchProgress[]> {
  return continueWatchingData;
}

// -----------------------------------------------------------
// Category Collections
// -----------------------------------------------------------

export type { FetchMoviesOptions, PaginatedMoviesResult } from './providers/tmdb';

export async function getPaginatedMovies(
  options: FetchMoviesOptions = {}
): Promise<PaginatedMoviesResult> {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams();
    if (options.page) params.set('page', String(options.page));
    if (options.query) params.set('query', options.query);
    if (options.genre) params.set('genre', options.genre);
    if (options.year) params.set('year', String(options.year));
    if (options.minRating) params.set('minRating', String(options.minRating));
    if (options.sortBy) params.set('sortBy', options.sortBy);

    try {
      const res = await fetch(`/api/movies?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Failed to fetch /api/movies from client:', err);
    }
  }

  return tmdbProvider.fetchMovies(options);
}

export async function getMovies(options?: FetchMoviesOptions): Promise<MediaItem[]> {
  const result = await getPaginatedMovies(options);
  return result.items;
}

export async function getAnime(): Promise<MediaItem[]> {
  try {
    let recent: any[] = [];
    if (typeof window !== 'undefined') {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 3500);
      try {
        const res = await fetch('/api/anime/discovery', { signal: controller.signal });
        clearTimeout(tid);
        if (res.ok) {
          const data = await res.json();
          recent = data.recent || data.trending || data.popular || [];
        }
      } catch {
        clearTimeout(tid);
      }
    } else {
      const { getRecentlyAddedAnime } = await import('./anime/animeService');
      recent = await getRecentlyAddedAnime(24);
    }

    if (recent && recent.length > 0) {
      return recent.map((item: any) => ({
        id: item.id,
        title: item.title,
        posterUrl: item.image,
        backdropUrl: item.image,
        description: '',
        mediaType: 'anime' as const,
        year: item.releaseDate ? parseInt(item.releaseDate, 10) || 2024 : 2024,
        rating: item.rating ? Number(item.rating) : 8.5,
        genres: [],
        badges: ['HD', item.subOrDub ? item.subOrDub.toUpperCase() : 'SUB'],
      }));
    }
  } catch (err) {
    console.warn('Could not fetch anime:', err);
  }
  return anime;
}

export type { FetchTVOptions, PaginatedTVResult } from './providers/tmdbTv';

export async function getPaginatedTVShows(
  options: FetchTVOptions = {}
): Promise<PaginatedTVResult> {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams();
    if (options.page) params.set('page', String(options.page));
    if (options.query) params.set('query', options.query);
    if (options.genre) params.set('genre', options.genre);
    if (options.year) params.set('year', String(options.year));
    if (options.minRating) params.set('minRating', String(options.minRating));
    if (options.sortBy) params.set('sortBy', options.sortBy);

    try {
      const res = await fetch(`/api/tv?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Failed to fetch /api/tv from client:', err);
    }
  }

  return tmdbTvProvider.fetchTVShows(options);
}

export async function getTVShows(options?: FetchTVOptions): Promise<MediaItem[]> {
  const result = await getPaginatedTVShows(options);
  return result.items;
}

export async function getAllMedia(): Promise<MediaItem[]> {
  return allMedia;
}


