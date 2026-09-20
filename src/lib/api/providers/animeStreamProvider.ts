// ============================================================
// Stellarix — Anime Streaming Provider
// ============================================================

import type { StreamResult, IAnimeStreamProvider, StreamSource } from '../types';
import animePlaybackService from '../anime/providers/animePlaybackService';
import { getAnimeTvStreamUrl } from '../anime/providers/cineSrc';

export class AnimeStreamProvider implements IAnimeStreamProvider {
  /**
   * Synchronous interface method satisfying IAnimeStreamProvider.
   * Generates CineSRC stream embed URL for anime.
   */
  getAnimeStream(
    animeId: string,
    episodeNumber = 1
  ): StreamResult {
    const url = getAnimeTvStreamUrl(animeId, 1, episodeNumber);
    return {
      available: Boolean(url),
      sources: url
        ? [
            {
              url,
              type: 'embed',
              quality: '1080p',
              label: `Episode ${episodeNumber}`,
              provider: 'cinesrc',
            },
          ]
        : [],
    };
  }

  /**
   * Resolves streaming sources for an episode via CineSRC.
   */
  async resolveEpisodeStream(episodeId: string): Promise<StreamSource[]> {
    const result = await animePlaybackService.getEpisodeStream(episodeId);
    if (!result.available || !result.sources) {
      return [];
    }

    return result.sources.map((s) => ({
      url: s.url,
      type: 'embed',
      quality: (s.quality || '1080p') as any,
      label: s.label || 'CineSRC',
      provider: 'cinesrc',
    }));
  }
}

export const animeStreamProvider = new AnimeStreamProvider();
export default animeStreamProvider;
