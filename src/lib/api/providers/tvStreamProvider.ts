// ============================================================
// Stellarix — TV Series Streaming Provider (CineSRC)
// ============================================================

import type { StreamResult, ITVStreamProvider } from '../types';

/**
 * Builds the CineSRC embed URL for TV show episode streaming dynamically.
 * Format: https://cinesrc.st/embed/tv/{TMDB_ID}?s={SEASON}&e={EPISODE}
 *
 * @param tmdbId TMDB ID of the TV show
 * @param seasonNumber Season number (1-based, defaults to 1)
 * @param episodeNumber Episode number (1-based, defaults to 1)
 * @returns Complete embed URL for the specified TV episode
 */
export function getTvStreamUrl(
  tmdbId: string | number,
  seasonNumber: number = 1,
  episodeNumber: number = 1
): string {
  const cleanId = String(tmdbId).trim();
  const s = Math.max(1, Number(seasonNumber) || 1);
  const ep = Math.max(1, Number(episodeNumber) || 1);
  return `https://cinesrc.st/embed/tv/${cleanId}?s=${s}&e=${ep}`;
}

export class TVStreamProvider implements ITVStreamProvider {
  /**
   * Generates stream sources for a TV show episode via CineSRC.
   *
   * @param seriesId TMDB ID of the TV series
   * @param seasonNumber Season number (defaults to 1)
   * @param episodeNumber Episode number (defaults to 1)
   * @returns StreamResult containing the CineSRC embed source
   */
  getTVStream(
    seriesId: string,
    seasonNumber = 1,
    episodeNumber = 1
  ): StreamResult {
    if (!seriesId) {
      return {
        available: false,
        sources: [],
        error: 'Missing TV series ID.',
      };
    }

    const s = Math.max(1, Number(seasonNumber) || 1);
    const ep = Math.max(1, Number(episodeNumber) || 1);
    const url = getTvStreamUrl(seriesId, s, ep);

    return {
      available: true,
      sources: [
        {
          url,
          quality: 'auto',
          type: 'embed',
          isEmbed: true,
          label: 'CineSRC (Fast HD)',
          provider: 'cinesrc',
        },
      ],
    };
  }
}

export const tvStreamProvider = new TVStreamProvider();
export default tvStreamProvider;

