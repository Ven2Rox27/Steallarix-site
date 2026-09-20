// ============================================================
// Stellarix — Movie Streaming Provider
// ============================================================
// Generates dynamic embed stream URLs for movie playback:
// 1. VidSrc:  https://vidsrc.sbs/embed/movie/{tmdb_id}
// 2. 2Embed:  https://www.2embed.cc/embed/{imdb_id}

import type { MediaItem, StreamResult, StreamSource, IMovieStreamProvider } from '../types';

/** Base embed endpoints */
const VIDSRC_MOVIE_EMBED_BASE = 'https://vidsrc.sbs/embed/movie';
const TWOEMBED_MOVIE_EMBED_BASE = 'https://www.2embed.cc/embed';

/**
 * Builds the dynamic embed URL for a movie using VidSrc given its TMDB ID.
 * Example: buildVidSrcUrl(533535) -> https://vidsrc.sbs/embed/movie/533535
 */
export function buildVidSrcUrl(tmdbId: string | number): string {
  const sanitizedId = String(tmdbId).trim();
  if (!sanitizedId) {
    throw new Error('Valid TMDB ID is required for VidSrc embed URL.');
  }
  return `${VIDSRC_MOVIE_EMBED_BASE}/${sanitizedId}`;
}

/**
 * Builds the dynamic embed URL for a movie using 2Embed given its IMDb ID.
 * Example: getMovieEmbedUrl("tt10676048") -> https://www.2embed.cc/embed/tt10676048
 */
export function getMovieEmbedUrl(imdbId: string): string {
  const sanitized = String(imdbId).trim();
  if (!sanitized) {
    throw new Error('Valid IMDb ID is required for 2Embed embed URL.');
  }
  return `${TWOEMBED_MOVIE_EMBED_BASE}/${sanitized}`;
}

/**
 * Resolves stream sources for a movie item.
 * Supports both VidSrc (TMDB ID) and 2Embed (IMDb ID).
 *
 * @param movie MediaItem entity
 * @param preferredProvider Optional preferred provider ('vidsrc' or '2embed')
 */
export function getStream(
  movie: MediaItem,
  preferredProvider?: 'vidsrc' | '2embed'
): StreamResult {
  const sources: StreamSource[] = [];

  // VidSrc source (via TMDB ID)
  if (movie.tmdbId) {
    try {
      sources.push({
        url: buildVidSrcUrl(movie.tmdbId),
        type: 'embed',
        isEmbed: true,
        quality: '1080p',
        language: 'English',
        label: 'VidSrc (Server 1)',
        provider: 'vidsrc',
      });
    } catch {
      // Ignore if TMDB ID was invalid
    }
  }

  // 2Embed source (via IMDb ID)
  if (movie.imdbId) {
    try {
      sources.push({
        url: getMovieEmbedUrl(movie.imdbId),
        type: 'embed',
        isEmbed: true,
        quality: '1080p',
        language: 'English',
        label: '2Embed (Server 2)',
        provider: '2embed',
      });
    } catch {
      // Ignore if IMDb ID was invalid
    }
  }

  // If preferred provider requested and present, prioritize it
  if (preferredProvider && sources.length > 1) {
    const idx = sources.findIndex((s) => s.provider === preferredProvider);
    if (idx > 0) {
      const [fav] = sources.splice(idx, 1);
      sources.unshift(fav);
    }
  }

  if (sources.length === 0) {
    return {
      available: false,
      sources: [],
      error: 'No valid streaming identifier (TMDB ID or IMDb ID) found for this movie.',
    };
  }

  return {
    available: true,
    sources,
  };
}

/**
 * Legacy & overloaded convenience method to request movie streams.
 * Can take a TMDB ID, IMDb ID, or full MediaItem.
 */
export function getMovieStream(
  movieOrId: MediaItem | string | number,
  preferredProvider?: 'vidsrc' | '2embed'
): StreamResult {
  if (typeof movieOrId === 'object' && movieOrId !== null) {
    return getStream(movieOrId, preferredProvider);
  }

  const idStr = String(movieOrId).trim();

  // If it's an IMDb ID (starts with "tt")
  if (idStr.startsWith('tt')) {
    const embedUrl = getMovieEmbedUrl(idStr);
    return {
      available: true,
      sources: [
        {
          url: embedUrl,
          type: 'embed',
          isEmbed: true,
          quality: '1080p',
          label: '2Embed',
          provider: '2embed',
        },
      ],
    };
  }

  // Otherwise assume TMDB ID
  try {
    const embedUrl = buildVidSrcUrl(idStr);
    return {
      available: true,
      sources: [
        {
          url: embedUrl,
          type: 'embed',
          isEmbed: true,
          quality: '1080p',
          label: 'VidSrc',
          provider: 'vidsrc',
        },
      ],
    };
  } catch (err) {
    return {
      available: false,
      sources: [],
      error: err instanceof Error ? err.message : 'Failed to generate movie stream',
    };
  }
}

export const movieStreamProvider: IMovieStreamProvider = {
  getMovieStream,
  getMovieEmbedUrl,
  getStream,
};

export default movieStreamProvider;
