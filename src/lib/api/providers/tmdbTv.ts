// ============================================================
// Stellarix — TMDB TV Series Provider (Server-Side)
// ============================================================
// Interacts with The Movie Database (TMDB) API strictly server-side
// for TV show discovery, metadata, seasons, and episodes.

import type { MediaItem, Season, Episode, Genre, CastMember } from '../types';
import { getTmdbApiKey } from './tmdb';
import { tvShows as fallbackTVShows, genres as staticGenres } from '../mockData';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_POSTER = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMAGE_BASE_BACKDROP = 'https://image.tmdb.org/t/p/original';
const TMDB_IMAGE_BASE_PROFILE = 'https://image.tmdb.org/t/p/w200';
const TMDB_IMAGE_BASE_STILL = 'https://image.tmdb.org/t/p/w500';

/** Mapping between local genre slugs and TMDB TV numerical genre IDs */
export const TMDB_TV_GENRE_MAP: Record<string, number> = {
  'action-adventure': 10759,
  action: 10759,
  adventure: 10759,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  kids: 10762,
  mystery: 9648,
  news: 10763,
  reality: 10764,
  'sci-fi-fantasy': 10765,
  'sci-fi': 10765,
  fantasy: 10765,
  soap: 10766,
  talk: 10767,
  'war-politics': 10768,
  war: 10768,
  western: 37,
};

export interface FetchTVOptions {
  page?: number;
  query?: string;
  genre?: string;
  year?: number;
  minRating?: number;
  sortBy?: 'popular' | 'rating' | 'latest' | 'oldest' | 'alphabetical' | string;
}

export interface PaginatedTVResult {
  items: MediaItem[];
  page: number;
  totalPages: number;
  totalResults: number;
  source: 'tmdb' | 'catalog';
}

/**
 * Node.js HTTPS fallback to bypass Windows undici TLS connection reset bugs.
 */
async function fetchViaHttpsFallback(url: string): Promise<Response | null> {
  try {
    if (typeof process !== 'undefined' && process.versions?.node) {
      const https = await import('node:https');
      return await new Promise<Response | null>((resolve) => {
        const req = https.get(
          url,
          {
            headers: {
              Accept: 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
              const response = new Response(data, {
                status: res.statusCode || 200,
                headers: { 'Content-Type': 'application/json' },
              });
              resolve(response);
            });
          }
        );
        req.on('error', () => resolve(null));
      });
    }
  } catch {}
  return null;
}

/**
 * Resilient fetch with automatic retries and TLS fallback for TMDB TV API calls.
 */
async function fetchTmdbWithRetry(url: string, retries = 2): Promise<Response> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (res.ok || res.status === 404) {
        return res;
      }
    } catch (err) {
      lastError = err;
      // Try node:https fallback on Windows ECONNRESET
      const fallbackRes = await fetchViaHttpsFallback(url);
      if (fallbackRes && (fallbackRes.ok || fallbackRes.status === 404)) {
        return fallbackRes;
      }

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }
    }
  }

  // Final fallback attempt via node:https
  const finalFallback = await fetchViaHttpsFallback(url);
  if (finalFallback && (finalFallback.ok || finalFallback.status === 404)) {
    return finalFallback;
  }

  throw lastError || new Error(`Failed to fetch ${url}`);
}

/**
 * Maps raw TMDB TV response object to application MediaItem.
 */
export function formatTmdbTVShow(raw: any, genreList: Genre[] = staticGenres): MediaItem {
  const tmdbId = Number(raw.id);
  const firstAirDate = raw.first_air_date || '';
  const year = firstAirDate ? parseInt(firstAirDate.slice(0, 4), 10) : 2024;
  const rating = raw.vote_average ? Math.round(raw.vote_average * 10) / 10 : 0;

  // Resolve genres
  let itemGenres: Genre[] = [];
  if (Array.isArray(raw.genres)) {
    itemGenres = raw.genres.map((g: any) => ({
      id: `g-${g.id}`,
      name: g.name,
      slug: g.name.toLowerCase().replace(/\s+/g, '-'),
    }));
  } else if (Array.isArray(raw.genre_ids)) {
    itemGenres = raw.genre_ids
      .map((gid: number) => {
        const found = Object.entries(TMDB_TV_GENRE_MAP).find(([, id]) => id === gid);
        if (found) {
          const matched = genreList.find((g) => g.slug === found[0]);
          return matched || { id: `g-${gid}`, name: found[0], slug: found[0] };
        }
        return null;
      })
      .filter(Boolean) as Genre[];
  }

  const posterUrl = raw.poster_path
    ? `${TMDB_IMAGE_BASE_POSTER}${raw.poster_path}`
    : raw.posterUrl || 'https://picsum.photos/seed/placeholder-tv/400/600';

  const backdropUrl = raw.backdrop_path
    ? `${TMDB_IMAGE_BASE_BACKDROP}${raw.backdrop_path}`
    : raw.backdropUrl || posterUrl;

  const badges = ['HD'];
  if (rating >= 7.5) badges.push('4K');
  if (rating >= 8.2) badges.push('HDR');

  // Extract creator & cast from credits if present
  let creators: string[] = [];
  if (Array.isArray(raw.created_by)) {
    creators = raw.created_by.map((c: any) => c.name);
  }

  let cast: CastMember[] = [];
  if (raw.credits && Array.isArray(raw.credits.cast)) {
    cast = raw.credits.cast.slice(0, 8).map((c: any) => ({
      id: `c-${c.id}`,
      name: c.name,
      character: c.character || 'Cast',
      image: c.profile_path ? `${TMDB_IMAGE_BASE_PROFILE}${c.profile_path}` : undefined,
    }));
  }

  // Find trailer video
  let trailerUrl: string | undefined;
  if (raw.videos && Array.isArray(raw.videos.results)) {
    const trailer = raw.videos.results.find(
      (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );
    if (trailer?.key) {
      trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
    }
  }

  const imdbId = raw.external_ids?.imdb_id || raw.imdb_id || undefined;
  const totalSeasons = raw.number_of_seasons || (Array.isArray(raw.seasons) ? raw.seasons.filter((s: any) => s.season_number > 0).length : 1);
  const totalEpisodes = raw.number_of_episodes || undefined;
  const studio = raw.networks?.[0]?.name;

  return {
    id: String(tmdbId),
    tmdbId,
    imdbId,
    title: raw.name || raw.original_name || 'Untitled Show',
    description: raw.overview || 'No synopsis available.',
    posterUrl,
    backdropUrl,
    mediaType: 'tv',
    year,
    rating,
    voteCount: raw.vote_count,
    releaseDate: firstAirDate,
    tagline: raw.tagline,
    duration: raw.episode_run_time?.[0] || 45,
    badges,
    genres: itemGenres.length > 0 ? itemGenres : [{ id: 'g-tv', name: 'Drama', slug: 'drama' }],
    director: creators[0] || (raw.networks?.[0]?.name ? `${raw.networks[0].name} Series` : 'TV Series'),
    writers: creators.length > 0 ? creators : undefined,
    productionCompanies: raw.production_companies?.map((p: any) => p.name).slice(0, 3),
    studio,
    cast: cast.length > 0 ? cast : undefined,
    trailerUrl: trailerUrl || raw.trailerUrl,
    imdbRating: rating,
    totalSeasons,
    totalEpisodes,
    status: raw.status === 'Ended' ? 'completed' : 'ongoing',
    featured: rating >= 8.2,
    originalTitle: raw.original_name,
    firstAirDate,
    lastAirDate: raw.last_air_date,
    networks: raw.networks?.map((n: any) => n.name) || (studio ? [studio] : undefined),
    creators: creators.length > 0 ? creators : undefined,
    countries: raw.origin_country || (raw.production_countries?.map((c: any) => c.name)),
    languages: raw.spoken_languages?.map((l: any) => l.english_name || l.name) || (raw.original_language ? [raw.original_language] : undefined),
    episodeRuntime: raw.episode_run_time?.[0],
    seasons: Array.isArray(raw.seasons)
      ? raw.seasons
          .filter((s: any) => s.season_number > 0)
          .map((s: any) => ({
            id: `s-${s.season_number}`,
            seriesId: String(tmdbId),
            seasonNumber: s.season_number,
            title: s.name || `Season ${s.season_number}`,
            episodeCount: s.episode_count || 0,
            year: s.air_date ? parseInt(s.air_date.slice(0, 4), 10) : year,
          }))
      : undefined,
  };
}

/**
 * Fetches dynamic TV shows with pagination, search, and filtering from TMDB.
 */
export async function fetchTVShows(
  options: FetchTVOptions = {}
): Promise<PaginatedTVResult> {
  const {
    page = 1,
    query,
    genre,
    year,
    minRating,
    sortBy = 'popular',
  } = options;

  const apiKey = getTmdbApiKey();

  try {
    let endpoint = '';
    const params = new URLSearchParams({
      api_key: apiKey,
      page: String(page),
      include_adult: 'false',
    });

    if (query && query.trim()) {
      endpoint = `${TMDB_BASE_URL}/search/tv?${params.toString()}&query=${encodeURIComponent(query.trim())}`;
    } else {
      // Map sortBy for TV
      let tmdbSort = 'popularity.desc';
      if (sortBy === 'rating') {
        tmdbSort = 'vote_average.desc';
        params.set('vote_count.gte', '50');
      } else if (sortBy === 'latest') {
        tmdbSort = 'first_air_date.desc';
      } else if (sortBy === 'oldest') {
        tmdbSort = 'first_air_date.asc';
      } else if (sortBy === 'alphabetical') {
        tmdbSort = 'name.asc';
      }
      params.set('sort_by', tmdbSort);

      // Filter by genre
      if (genre) {
        const gid = TMDB_TV_GENRE_MAP[genre.toLowerCase()] || Number(genre);
        if (gid) {
          params.set('with_genres', String(gid));
        }
      }

      // Filter by first air year
      if (year) {
        params.set('first_air_date_year', String(year));
      }

      // Filter by minimum rating
      if (minRating) {
        params.set('vote_average.gte', String(minRating));
      }

      endpoint = `${TMDB_BASE_URL}/discover/tv?${params.toString()}`;
    }

    const res = await fetchTmdbWithRetry(endpoint, 3);

    if (res.ok) {
      const json = await res.json();
      const items = (json.results || []).map((m: any) => formatTmdbTVShow(m));
      return {
        items,
        page: json.page || page,
        totalPages: json.total_pages || 1,
        totalResults: json.total_results || items.length,
        source: 'tmdb',
      };
    }
    throw new Error(`TMDB responded with status ${res.status}`);
  } catch (err) {
    console.error('TMDB TV fetch failed after retries:', err);
    throw err;
  }
}

/**
 * Fetches comprehensive TV show details from TMDB with credits, videos, and seasons metadata.
 */
export async function fetchTVShowDetails(id: string | number): Promise<MediaItem | null> {
  const apiKey = getTmdbApiKey();
  const idStr = String(id).trim();

  try {
    let tmdbId = idStr;

    // Handle IMDb ID if passed
    if (idStr.startsWith('tt')) {
      const findUrl = `${TMDB_BASE_URL}/find/${idStr}?api_key=${apiKey}&external_source=imdb_id`;
      const findRes = await fetchTmdbWithRetry(findUrl, 2);
      if (findRes.ok) {
        const findJson = await findRes.json();
        const firstShow = findJson.tv_results?.[0];
        if (firstShow) {
          tmdbId = String(firstShow.id);
        }
      }
    }

    const detailUrl = `${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${apiKey}&append_to_response=credits,videos,external_ids`;
    const res = await fetchTmdbWithRetry(detailUrl, 2);
    if (res.ok) {
      const raw = await res.json();
      return formatTmdbTVShow(raw);
    }
  } catch (err) {
    console.warn('Failed to fetch TMDB TV details, falling back:', err);
  }

  // Fallback to local catalog
  const found = fallbackTVShows.find(
    (m) => m.id === idStr || String(m.tmdbId) === idStr || m.imdbId === idStr
  );
  return found ?? null;
}

/**
 * Fetches the seasons list for a TV show from TMDB.
 */
export async function fetchTVSeasons(seriesId: string | number): Promise<Season[]> {
  const apiKey = getTmdbApiKey();
  const idStr = String(seriesId).trim();

  try {
    const detailUrl = `${TMDB_BASE_URL}/tv/${idStr}?api_key=${apiKey}`;
    const res = await fetchTmdbWithRetry(detailUrl, 2);
    if (res.ok) {
      const raw = await res.json();
      if (Array.isArray(raw.seasons)) {
        // Exclude Season 0 (Specials) unless it's the only season
        const validSeasons = raw.seasons.filter((s: any) => s.season_number > 0);
        const sourceSeasons = validSeasons.length > 0 ? validSeasons : raw.seasons;

        return sourceSeasons.map((s: any) => ({
          id: `s-${s.season_number}`,
          seriesId: idStr,
          seasonNumber: s.season_number,
          title: s.name || `Season ${s.season_number}`,
          episodeCount: s.episode_count || 0,
          year: s.air_date ? parseInt(s.air_date.slice(0, 4), 10) : 2024,
        }));
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch TMDB seasons for series ${seriesId}:`, err);
  }

  // Fallback to 1 default season
  return [
    {
      id: 's-1',
      seriesId: idStr,
      seasonNumber: 1,
      title: 'Season 1',
      episodeCount: 10,
      year: 2024,
    },
  ];
}

/**
 * Fetches episodes for a specific TV season from TMDB.
 */
export async function fetchTVSeasonEpisodes(
  seriesId: string | number,
  seasonNumber: number = 1
): Promise<Episode[]> {
  const apiKey = getTmdbApiKey();
  const idStr = String(seriesId).trim();

  try {
    const seasonUrl = `${TMDB_BASE_URL}/tv/${idStr}/season/${seasonNumber}?api_key=${apiKey}`;
    const res = await fetchTmdbWithRetry(seasonUrl, 2);
    if (res.ok) {
      const raw = await res.json();
      if (Array.isArray(raw.episodes)) {
        return raw.episodes.map((ep: any) => ({
          id: `s${ep.season_number}e${ep.episode_number}`,
          seriesId: idStr,
          seasonId: `s-${ep.season_number}`,
          seasonNumber: ep.season_number,
          episodeNumber: ep.episode_number,
          title: ep.name || `Episode ${ep.episode_number}`,
          description: ep.overview || 'No episode description available.',
          thumbnailUrl: ep.still_path
            ? `${TMDB_IMAGE_BASE_STILL}${ep.still_path}`
            : 'https://picsum.photos/seed/placeholder-ep/640/360',
          duration: ep.runtime || 45,
          airDate: ep.air_date,
        }));
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch TMDB season ${seasonNumber} episodes for ${seriesId}:`, err);
  }

  return [];
}

export const tmdbTvProvider = {
  fetchTVShows,
  fetchTVShowDetails,
  fetchTVSeasons,
  fetchTVSeasonEpisodes,
};

export default tmdbTvProvider;
