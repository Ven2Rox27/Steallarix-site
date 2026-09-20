// ============================================================
// Stellarix — Centralized Anime Content Filter & Validator
// ============================================================
// Ensures that only genuine Japanese Animation (Anime) titles
// appear throughout the Anime section.
// Rejects Western animation, Japanese live-action, and generic mock titles.

/**
 * List of banned mock/placeholder titles from fallback data.
 */
const BANNED_TITLES = new Set([
  'void breaker',
  'blade sovereign',
  'phantom circuit',
  'sakura academy',
  'iron colossus',
  'death cipher',
  'spirit weaver',
  'celestial resonance',
  'crimson tide: bloodline',
]);

/**
 * Common anime genre name to TMDB genre ID mapping.
 */
export const ANIME_GENRE_ID_MAP: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  fantasy: 14,
  mystery: 9648,
  romance: 10749,
  'sci-fi': 878,
  supernatural: 14, // mapped to fantasy/supernatural
  shonen: 28,      // mapped to action/shonen
};

/**
 * Validates whether an item qualifies strictly as genuine Anime.
 *
 * Rules:
 * 1. Must NOT have a mock ID (ani-*) or banned placeholder title.
 * 2. Must be Animation (TMDB Genre ID 16 or 'Animation'/'Anime' in genres).
 * 3. Must have Japanese origin (original_language === 'ja' or origin_country includes 'JP').
 *    Western animation (Disney, Pixar, Dreamworks, etc. with original_language 'en') is strictly excluded.
 *    Japanese live-action (dramas, movies without genre 16) is strictly excluded.
 */
export function isAnime(item: any): boolean {
  if (!item || typeof item !== 'object') return false;

  // 1. Check ID for mock pattern
  const idStr = String(item.id || item.tmdbId || '').trim().toLowerCase();
  if (/^ani-?\d+/i.test(idStr)) {
    return false;
  }

  // 2. Check title against banned placeholder titles
  const title = (item.title || item.name || item.original_title || item.original_name || '').trim().toLowerCase();
  if (BANNED_TITLES.has(title)) {
    return false;
  }

  // 3. Extract genres
  const genreIds: number[] = Array.isArray(item.genre_ids) ? item.genre_ids : [];
  const genreNames: string[] = [];

  if (Array.isArray(item.genres)) {
    for (const g of item.genres) {
      if (typeof g === 'string') {
        genreNames.push(g.toLowerCase());
      } else if (g && typeof g === 'object') {
        if (typeof g.id === 'number') genreIds.push(g.id);
        if (typeof g.name === 'string') genreNames.push(g.name.toLowerCase());
      }
    }
  }

  // Check for Animation genre (TMDB 16)
  const hasAnimationGenre =
    genreIds.includes(16) ||
    genreNames.some((n) => n === 'animation' || n === 'anime');

  // Check for Japanese origin
  const origLang = (item.original_language || item.language || '').toLowerCase().trim();
  const originCountries: string[] = Array.isArray(item.origin_country)
    ? item.origin_country.map((c: any) => String(c).toUpperCase())
    : [];

  if (Array.isArray(item.production_countries)) {
    for (const pc of item.production_countries) {
      if (pc?.iso_3166_1) originCountries.push(String(pc.iso_3166_1).toUpperCase());
    }
  }

  const isJapaneseOrigin =
    origLang === 'ja' ||
    originCountries.includes('JP');

  // If raw TMDB fields are present (genre_ids or original_language), strictly require both
  if (genreIds.length > 0 || origLang || originCountries.length > 0) {
    // If it has original_language that is explicitly NOT Japanese and no JP origin, reject
    if (origLang && origLang !== 'ja' && !originCountries.includes('JP')) {
      return false;
    }
    // If it has genre_ids but NOT animation, reject (live-action)
    if (genreIds.length > 0 && !hasAnimationGenre) {
      return false;
    }
    return hasAnimationGenre && isJapaneseOrigin;
  }

  // For already-mapped anime objects (like AnimeSearchResultItem or AnimeInfo):
  // Must have an anime-compatible type and not be banned
  const mediaType = (item.type || item.mediaType || '').toLowerCase();
  if (mediaType === 'movie' || mediaType === 'tv' || mediaType === 'anime') {
    // If genres list is available on the mapped object, verify animation/anime
    if (genreNames.length > 0) {
      return hasAnimationGenre;
    }
    // As long as it's not banned and has a valid TMDB/numeric ID, it is valid anime
    return Boolean(item.id || item.tmdbId);
  }

  return false;
}

/**
 * Centralized filter to return only verified Anime items.
 */
export function filterAnimeOnly<T>(items: T[]): T[] {
  if (!Array.isArray(items)) return [];
  return items.filter(isAnime);
}

/**
 * Checks whether an anime item matches a specific genre filter.
 */
export function matchesAnimeGenre(item: any, genreName: string): boolean {
  if (!genreName || genreName.toLowerCase() === 'all') return true;

  const target = genreName.toLowerCase().trim();
  const targetId = ANIME_GENRE_ID_MAP[target];

  // Check genre_ids
  if (targetId && Array.isArray(item.genre_ids) && item.genre_ids.includes(targetId)) {
    return true;
  }

  // Check genre names
  if (Array.isArray(item.genres)) {
    for (const g of item.genres) {
      const name = typeof g === 'string' ? g : g?.name;
      if (typeof name === 'string' && name.toLowerCase().includes(target)) {
        return true;
      }
    }
  }

  // Check overview/title for shonen / supernatural / etc.
  if (target === 'shonen' || target === 'supernatural') {
    const text = `${item.title || ''} ${item.description || ''} ${item.overview || ''}`.toLowerCase();
    if (text.includes(target)) return true;
  }

  return false;
}
