// ============================================================
// Stellarix — Anime CineSRC Streaming Provider
// ============================================================
// Generates CineSRC embed URLs strictly for Anime content.
// Handles both Anime Movies and Anime Series / Episodic Anime.

export interface AnimeStreamUrlOptions {
  tmdbId: string | number;
  type?: 'movie' | 'tv' | 'series' | 'anime' | string;
  season?: number;
  episode?: number;
}

/**
 * Builds the CineSRC embed URL for Anime movie streaming.
 * Format: https://cinesrc.st/embed/movie/{tmdb_id}
 *
 * @param tmdbId TMDB ID of the anime movie
 * @returns Complete embed URL for the anime movie
 */
export function getAnimeMovieStreamUrl(tmdbId: string | number): string {
  const cleanId = String(tmdbId).trim();
  if (!cleanId) return '';
  return `https://cinesrc.st/embed/movie/${cleanId}`;
}

/**
 * Builds the CineSRC embed URL for Anime TV series / episodic anime streaming.
 * Format: https://cinesrc.st/embed/tv/{tmdb_id}?s={season}&e={episode}
 *
 * @param tmdbId TMDB ID of the anime series
 * @param season Season number (1-based, defaults to 1)
 * @param episode Episode number (1-based, defaults to 1)
 * @returns Complete embed URL for the specified anime episode
 */
export function getAnimeTvStreamUrl(
  tmdbId: string | number,
  season: number = 1,
  episode: number = 1
): string {
  const cleanId = String(tmdbId).trim();
  if (!cleanId) return '';
  const s = Math.max(1, Number(season) || 1);
  const ep = Math.max(1, Number(episode) || 1);
  return `https://cinesrc.st/embed/tv/${cleanId}?s=${s}&e=${ep}`;
}

/**
 * Automatically selects and returns the correct CineSRC URL for any Anime title.
 *
 * If type is 'movie' (case-insensitive), returns:
 *   https://cinesrc.st/embed/movie/${tmdbId}
 *
 * If type is 'tv', 'series', or episodic anime, returns:
 *   https://cinesrc.st/embed/tv/${tmdbId}?s=${season}&e=${episode}
 */
export function getAnimeStreamUrl({
  tmdbId,
  type = 'tv',
  season = 1,
  episode = 1,
}: AnimeStreamUrlOptions): string {
  const cleanId = String(tmdbId || '').trim();
  if (!cleanId) return '';

  const normalizedType = String(type || '').toLowerCase();
  const isMovie = normalizedType === 'movie';

  if (isMovie) {
    return getAnimeMovieStreamUrl(cleanId);
  }

  return getAnimeTvStreamUrl(cleanId, season, episode);
}

import type { IAnimePlaybackProvider, AnimePlaybackResult } from './types';
import { resolveAnimeTmdbId } from './animeTmdbResolver';

/**
 * CineSRC Anime Playback Provider implementing IAnimePlaybackProvider.
 * Provides CineSRC streaming embeds for Anime Watch page and playback service.
 */
export class CineSrcAnimePlaybackProvider implements IAnimePlaybackProvider {
  readonly name = 'CineSRC';

  async getEpisodeStream(
    episodeId: string,
    fallbackSeason = 1,
    fallbackEpisode = 1
  ): Promise<AnimePlaybackResult> {
    if (!episodeId) {
      return {
        available: false,
        sources: [],
        error: 'Unable to load this episode.',
      };
    }

    // Check if episodeId encodes season and episode, e.g. "1396-s1e2" or "s1-e2"
    let parsedSeason = fallbackSeason;
    let parsedEpisode = fallbackEpisode;
    let idTarget = episodeId;

    const pattern = /^(.*?)-s(\d+)e(\d+)$/i.exec(episodeId);
    if (pattern) {
      idTarget = pattern[1];
      parsedSeason = parseInt(pattern[2], 10) || 1;
      parsedEpisode = parseInt(pattern[3], 10) || 1;
    }

    const resolved = await resolveAnimeTmdbId(idTarget);
    if (!resolved?.tmdbId) {
      return {
        available: false,
        sources: [],
        error: 'Unable to load this episode.',
      };
    }

    const url = getAnimeStreamUrl({
      tmdbId: resolved.tmdbId,
      type: resolved.type,
      season: parsedSeason,
      episode: parsedEpisode,
    });

    if (!url) {
      return {
        available: false,
        sources: [],
        error: 'Unable to load this episode.',
      };
    }

    return {
      available: true,
      sources: [
        {
          url,
          isEmbed: true,
          type: 'embed',
          quality: '1080p',
          label: 'CineSRC',
        },
      ],
    };
  }
}

export const cineSrcAnimePlaybackProvider = new CineSrcAnimePlaybackProvider();
export default cineSrcAnimePlaybackProvider;

