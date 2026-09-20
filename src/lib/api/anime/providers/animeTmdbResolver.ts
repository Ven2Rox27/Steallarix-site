// ============================================================
// Stellarix — Anime TMDB Resolution Layer
// ============================================================
// Resolves a genuine TMDB ID for any anime title or identifier.
// Never invents or hardcodes fake TMDB IDs.

import { getTmdbApiKey } from '../../providers/tmdb';
import { isAnime } from '../animeFilter';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface ResolvedAnimeTmdb {
  tmdbId: string;
  type: 'movie' | 'tv';
  title: string;
}

/**
 * In-memory cache for resolved anime TMDB IDs to avoid redundant lookups.
 */
const resolvedCache = new Map<string, ResolvedAnimeTmdb | null>();

/**
 * Resilient fetch with User-Agent header for TMDB lookups.
 */
async function fetchTmdbAnime(endpoint: string): Promise<any | null> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) return null;

  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${apiKey}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (res.ok) {
        return await res.json();
      }
      if (res.status === 404) return null;
    } catch (err) {
      try {
        if (typeof process !== 'undefined' && process.versions?.node) {
          const https = await import('node:https');
          const fallbackData = await new Promise<any>((resolve) => {
            https.get(
              url,
              {
                headers: {
                  Accept: 'application/json',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                },
              },
              (res) => {
                if (res.statusCode === 404) return resolve(null);
                if (!res.statusCode || res.statusCode >= 400) return resolve(null);
                let raw = '';
                res.on('data', (chunk) => (raw += chunk));
                res.on('end', () => {
                  try {
                    resolve(JSON.parse(raw));
                  } catch {
                    resolve(null);
                  }
                });
              }
            ).on('error', () => resolve(null));
          });

          if (fallbackData) return fallbackData;
        }
      } catch {}

      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  }
  return null;
}

/**
 * Resolves a genuine TMDB ID and media type for an anime title or ID.
 *
 * @param idOrTitle Anime ID, slug, or title string
 * @param preferredType Optional hint ('movie' or 'tv')
 * @returns ResolvedAnimeTmdb with genuine TMDB ID, or null if unresolvable
 */
export async function resolveAnimeTmdbId(
  idOrTitle: string,
  preferredType?: 'movie' | 'tv'
): Promise<ResolvedAnimeTmdb | null> {
  const clean = (idOrTitle || '').trim();
  if (!clean) return null;

  // Check cache first
  const cacheKey = `${clean}:${preferredType || 'any'}`;
  if (resolvedCache.has(cacheKey)) {
    return resolvedCache.get(cacheKey) || null;
  }

  // 1. If clean is an integer string, check if it's an AniList ID first
  if (/^\d+$/.test(clean)) {
    try {
      const { fetchAniList } = await import('../../anilist/client');
      const anilistData = await fetchAniList<{ Media?: { id: number; format?: string; title?: { english?: string; romaji?: string } } }>(
        `query ($id: Int) { Media(id: $id, type: ANIME) { id format title { english romaji } } }`,
        { id: parseInt(clean, 10) }
      );
      const anilistTitle = anilistData?.Media?.title?.english || anilistData?.Media?.title?.romaji;
      const anilistType = anilistData?.Media?.format === 'MOVIE' ? 'movie' : 'tv';
      if (anilistTitle) {
        const resolvedFromTitle = await resolveAnimeTmdbId(anilistTitle, preferredType || anilistType);
        if (resolvedFromTitle) {
          resolvedCache.set(cacheKey, resolvedFromTitle);
          return resolvedFromTitle;
        }
      }
    } catch {}

    // Fallback: Check if clean is already a direct TMDB anime ID
    const [tvData, movieData] = await Promise.all([
      preferredType === 'movie' ? null : fetchTmdbAnime(`/tv/${clean}`),
      fetchTmdbAnime(`/movie/${clean}`),
    ]);

    const isTvAnime = isAnime(tvData);
    const isMovieAnime = isAnime(movieData);

    if (preferredType === 'movie' && isMovieAnime && movieData?.id) {
      const res: ResolvedAnimeTmdb = {
        tmdbId: String(movieData.id),
        type: 'movie',
        title: movieData.title || movieData.original_title || clean,
      };
      resolvedCache.set(cacheKey, res);
      return res;
    }

    if (isMovieAnime && !isTvAnime && movieData?.id) {
      const res: ResolvedAnimeTmdb = {
        tmdbId: String(movieData.id),
        type: 'movie',
        title: movieData.title || movieData.original_title || clean,
      };
      resolvedCache.set(cacheKey, res);
      return res;
    }

    if (isTvAnime && tvData?.id) {
      const res: ResolvedAnimeTmdb = {
        tmdbId: String(tvData.id),
        type: 'tv',
        title: tvData.name || tvData.original_name || clean,
      };
      resolvedCache.set(cacheKey, res);
      return res;
    }

    if (isMovieAnime && movieData?.id) {
      const res: ResolvedAnimeTmdb = {
        tmdbId: String(movieData.id),
        type: 'movie',
        title: movieData.title || movieData.original_title || clean,
      };
      resolvedCache.set(cacheKey, res);
      return res;
    }

    // Direct numeric ID fallback
    const directRes: ResolvedAnimeTmdb = {
      tmdbId: clean,
      type: preferredType === 'movie' ? 'movie' : 'tv',
      title: clean,
    };
    resolvedCache.set(cacheKey, directRes);
    return directRes;
  }

  // 2. If non-numeric (e.g. title or slug), search TMDB for the anime title
  const searchTitle = clean
    .replace(/^ani-?\d+/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  const queryToUse = searchTitle || clean;

  // Search TV Anime first
  if (preferredType !== 'movie') {
    const tvSearch = await fetchTmdbAnime(
      `/search/tv?query=${encodeURIComponent(queryToUse)}`
    );
    if (tvSearch && Array.isArray(tvSearch.results) && tvSearch.results.length > 0) {
      // Prioritize verified anime items
      const best = tvSearch.results.find((r: any) => isAnime(r));

      if (best && best.id) {
        const res: ResolvedAnimeTmdb = {
          tmdbId: String(best.id),
          type: 'tv',
          title: best.name || best.original_name,
        };
        resolvedCache.set(cacheKey, res);
        return res;
      }
    }
  }

  // Search Movie Anime
  const movieSearch = await fetchTmdbAnime(
    `/search/movie?query=${encodeURIComponent(queryToUse)}`
  );
  if (movieSearch && Array.isArray(movieSearch.results) && movieSearch.results.length > 0) {
    const best = movieSearch.results.find((r: any) => isAnime(r));

    if (best && best.id) {
      const res: ResolvedAnimeTmdb = {
        tmdbId: String(best.id),
        type: 'movie',
        title: best.title || best.original_title,
      };
      resolvedCache.set(cacheKey, res);
      return res;
    }
  }

  // Could not resolve
  resolvedCache.set(cacheKey, null);
  return null;
}
