// ============================================================
// Stellarix — Anime Service Layer
// AniList GraphQL Metadata & Catalog Integration
// ============================================================
// Uses AniList GraphQL API for all anime discovery, search, categories, and details.
// Playback is decoupled and uses the dedicated CineSRC provider.

import type {
  AnimeSearchResponse,
  AnimeInfo,
  AnimeDiscoverySections,
  AnimeSearchResultItem,
  AnimeCategoryResponse,
  AnimeEpisode,
  AnimeSeason,
} from './types';
import { fetchAniList } from '../anilist/client';
import { ANIME_PAGE_QUERY, ANIME_DETAILS_QUERY } from '../anilist/queries';
import type {
  AniListMedia,
  AniListPaginatedResponse,
} from '../anilist/types';
import { resolveAnimeTmdbId } from './providers/animeTmdbResolver';

/**
 * Maps an AniList media item to the universal AnimeSearchResultItem interface.
 */
export function mapAniListMediaToSearchResult(media: AniListMedia): AnimeSearchResultItem {
  const title =
    media.title?.english ||
    media.title?.romaji ||
    media.title?.userPreferred ||
    'Anime Title';

  const poster =
    media.coverImage?.extraLarge ||
    media.coverImage?.large ||
    media.coverImage?.medium ||
    '';

  const releaseYear = media.seasonYear
    ? String(media.seasonYear)
    : media.startDate?.year
    ? String(media.startDate.year)
    : undefined;

  const rawFormat = media.format ? String(media.format).toUpperCase() : 'TV';
  const formatLabel = rawFormat === 'MOVIE' ? 'Movie' : rawFormat === 'TV_SHORT' ? 'TV' : rawFormat;

  let statusLabel = 'Ongoing';
  if (media.status === 'FINISHED') statusLabel = 'Completed';
  else if (media.status === 'RELEASING') statusLabel = 'Airing';
  else if (media.status === 'NOT_YET_RELEASED') statusLabel = 'Upcoming';

  const ratingScore = media.averageScore
    ? Math.round((media.averageScore / 10) * 10) / 10
    : undefined;

  return {
    id: String(media.id),
    title,
    nativeTitle: media.title?.native || undefined,
    image: poster,
    banner: media.bannerImage || undefined,
    releaseDate: releaseYear,
    subOrDub: 'both',
    type: formatLabel,
    status: statusLabel,
    rating: ratingScore,
    genres: media.genres || [],
    episode: media.nextAiringEpisode?.episode
      ? media.nextAiringEpisode.episode - 1
      : media.episodes || undefined,
  };
}

/**
 * Helper to strip HTML tags from AniList synopsis descriptions.
 */
function cleanSynopsis(raw?: string | null): string {
  if (!raw) return 'No synopsis available.';
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<i>(.*?)<\/i>/gi, '$1')
    .replace(/<b>(.*?)<\/b>/gi, '$1')
    .replace(/<[^>]*>?/gm, '')
    .trim() || 'No synopsis available.';
}

/**
 * Searches the AniList catalog for Anime matching the user query.
 */
export async function searchAnime(
  query: string,
  page: number = 1,
  perPage: number = 24
): Promise<AnimeSearchResponse> {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) {
    return {
      currentPage: 1,
      hasNextPage: false,
      results: [],
    };
  }

  const pageNum = Math.max(1, Number(page) || 1);

  try {
    const data = await fetchAniList<{ Page: AniListPaginatedResponse }>(
      ANIME_PAGE_QUERY,
      {
        page: pageNum,
        perPage,
        search: cleanQuery,
        sort: ['SEARCH_MATCH'],
      }
    );

    const pageInfo = data?.Page?.pageInfo;
    const mediaList = Array.isArray(data?.Page?.media) ? data.Page.media : [];

    return {
      currentPage: pageInfo?.currentPage || pageNum,
      hasNextPage: Boolean(pageInfo?.hasNextPage),
      results: mediaList.map(mapAniListMediaToSearchResult),
    };
  } catch (err: any) {
    console.error(`[AniList Search] Failed to search for "${cleanQuery}":`, err.message);
    throw new Error(`Failed to search anime: ${err.message || 'AniList query error'}`);
  }
}

/**
 * Fetches Anime by Category / Genre with real AniList filters.
 * Correctly maps 'Shonen' to AniList's tag system (`tag_in: ["Shounen"]`).
 */
export async function getAnimeByCategory(
  category: string,
  page: number = 1,
  perPage: number = 18
): Promise<AnimeCategoryResponse> {
  const pageNum = Math.max(1, Number(page) || 1);
  const cleanCat = (category || 'All').trim();
  const lowerCat = cleanCat.toLowerCase();

  const variables: Record<string, any> = {
    page: pageNum,
    perPage,
    sort: ['POPULARITY_DESC'],
  };

  if (lowerCat === 'shonen') {
    // AniList represents Shounen as a tag
    variables.tag = ['Shounen'];
  } else if (lowerCat !== 'all') {
    // Title case the genre name, e.g. "Action", "Fantasy", "Sci-Fi"
    const genreParam = cleanCat.charAt(0).toUpperCase() + cleanCat.slice(1);
    variables.genre = [genreParam];
  }

  try {
    const data = await fetchAniList<{ Page: AniListPaginatedResponse }>(
      ANIME_PAGE_QUERY,
      variables
    );

    const pageInfo = data?.Page?.pageInfo;
    const mediaList = Array.isArray(data?.Page?.media) ? data.Page.media : [];

    return {
      category: cleanCat,
      currentPage: pageInfo?.currentPage || pageNum,
      hasNextPage: Boolean(pageInfo?.hasNextPage),
      results: mediaList.map(mapAniListMediaToSearchResult),
    };
  } catch (err: any) {
    console.error(`[AniList Category] Failed to fetch category "${cleanCat}":`, err.message);
    throw new Error(`Failed to fetch category ${cleanCat}: ${err.message || 'AniList query error'}`);
  }
}

/**
 * Retrieves detailed anime metadata by AniList ID.
 * Resolves genuine TMDB ID for CineSRC playback integration.
 */
export async function getAnimeInfo(
  id: string,
  seasonNumber: number = 1
): Promise<AnimeInfo | null> {
  const clean = (id || '').trim();
  if (!clean) return null;

  // Extract base series ID if an episode identifier was passed (e.g. "16498-s1e1" -> "16498")
  const baseId = clean
    .replace(/-s\d+e\d+.*$/i, '')
    .replace(/-s\d+.*$/i, '')
    .trim() || clean;

  const targetSeason = Math.max(1, Number(seasonNumber) || 1);
  const numericId = parseInt(baseId, 10);

  try {
    let media: AniListMedia | null = null;

    if (!isNaN(numericId) && numericId > 0) {
      // Look up by AniList ID
      const data = await fetchAniList<{ Media: AniListMedia | null }>(
        ANIME_DETAILS_QUERY,
        { id: numericId }
      );
      media = data?.Media || null;
    } else {
      // Fallback: search by title query if a title slug was passed
      const searchData = await fetchAniList<{ Page: AniListPaginatedResponse }>(
        ANIME_PAGE_QUERY,
        { page: 1, perPage: 1, search: baseId, sort: ['SEARCH_MATCH'] }
      );
      media = searchData?.Page?.media?.[0] || null;
    }

    if (!media || !media.id) {
      return null;
    }

    const title =
      media.title?.english ||
      media.title?.romaji ||
      media.title?.userPreferred ||
      'Anime Title';

    const poster =
      media.coverImage?.extraLarge ||
      media.coverImage?.large ||
      media.coverImage?.medium ||
      '';

    const cover =
      media.bannerImage ||
      media.coverImage?.extraLarge ||
      media.coverImage?.large ||
      poster;

    const isMovie = media.format === 'MOVIE';
    const totalEpisodes = isMovie ? 1 : media.episodes || 12;

    const episodes: AnimeEpisode[] = isMovie
      ? [
          {
            id: String(media.id),
            number: 1,
            title: title,
            image: cover,
            description: cleanSynopsis(media.description),
          },
        ]
      : Array.from({ length: Math.min(totalEpisodes, 150) }, (_, i) => ({
          id: `${media.id}-s${targetSeason}e${i + 1}`,
          number: i + 1,
          seasonNumber: targetSeason,
          title: `Episode ${i + 1}`,
          image: cover,
        }));

    const seasons: AnimeSeason[] = [
      {
        id: `s-${targetSeason}`,
        seasonNumber: targetSeason,
        title: `Season ${targetSeason}`,
        episodeCount: totalEpisodes,
      },
    ];

    // Bridge AniList title to TMDB ID for CineSRC playback
    const resolvedTmdb = await resolveAnimeTmdbId(
      title,
      isMovie ? 'movie' : 'tv'
    );

    return {
      id: String(media.id),
      tmdbId: resolvedTmdb?.tmdbId ? String(resolvedTmdb.tmdbId) : undefined,
      title,
      otherName: media.title?.native || media.title?.romaji || undefined,
      image: poster,
      cover,
      description: cleanSynopsis(media.description),
      releaseDate: media.seasonYear
        ? String(media.seasonYear)
        : media.startDate?.year
        ? String(media.startDate.year)
        : undefined,
      genres: media.genres && media.genres.length > 0 ? media.genres : ['Anime'],
      type: isMovie ? 'movie' : 'tv',
      status: media.status === 'FINISHED' ? 'Completed' : 'Ongoing',
      totalEpisodes,
      subOrDub: 'both',
      seasons,
      episodes,
    };
  } catch (err: any) {
    console.error(`[AniList Info] Failed to load anime ${clean}:`, err.message);
    throw new Error(`Failed to load anime info: ${err.message || 'AniList query error'}`);
  }
}

/**
 * Fetches real AniList Trending anime titles.
 */
export async function getTrendingAnime(limit = 12): Promise<AnimeSearchResultItem[]> {
  try {
    const data = await fetchAniList<{ Page: AniListPaginatedResponse }>(
      ANIME_PAGE_QUERY,
      {
        page: 1,
        perPage: limit,
        sort: ['TRENDING_DESC'],
      }
    );
    const list = data?.Page?.media || [];
    return list.map(mapAniListMediaToSearchResult);
  } catch (err: any) {
    console.warn('[AniList] Failed to fetch trending anime:', err.message);
    return [];
  }
}

/**
 * Fetches real AniList Popular anime titles.
 */
export async function getPopularAnime(limit = 12): Promise<AnimeSearchResultItem[]> {
  try {
    const data = await fetchAniList<{ Page: AniListPaginatedResponse }>(
      ANIME_PAGE_QUERY,
      {
        page: 1,
        perPage: limit,
        sort: ['POPULARITY_DESC'],
      }
    );
    const list = data?.Page?.media || [];
    return list.map(mapAniListMediaToSearchResult);
  } catch (err: any) {
    console.warn('[AniList] Failed to fetch popular anime:', err.message);
    return [];
  }
}

/**
 * Fetches real AniList Recently Added / Releasing anime titles.
 */
export async function getRecentlyAddedAnime(limit = 12): Promise<AnimeSearchResultItem[]> {
  try {
    const data = await fetchAniList<{ Page: AniListPaginatedResponse }>(
      ANIME_PAGE_QUERY,
      {
        page: 1,
        perPage: limit,
        status: 'RELEASING',
        sort: ['POPULARITY_DESC'],
      }
    );
    const list = data?.Page?.media || [];
    return list.map(mapAniListMediaToSearchResult);
  } catch (err: any) {
    console.warn('[AniList] Failed to fetch recent anime:', err.message);
    return [];
  }
}

/**
 * Aggregates discovery sections for the Anime discovery hub.
 * Loads live trending, popular, and recent anime items directly from AniList.
 */
export async function getAnimeDiscoverySections(): Promise<AnimeDiscoverySections> {
  const [trending, popular, recent] = await Promise.all([
    getTrendingAnime(12),
    getPopularAnime(12),
    getRecentlyAddedAnime(12),
  ]);

  return {
    trending,
    popular,
    recent,
  };
}
