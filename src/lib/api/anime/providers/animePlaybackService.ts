// ============================================================
// Stellarix — Centralized Anime Playback Service
// ============================================================

import type { IAnimePlaybackProvider, AnimePlaybackResult } from './types';
import { cineSrcAnimePlaybackProvider } from './cineSrc';

export class AnimePlaybackService {
  private activeProvider: IAnimePlaybackProvider;

  constructor(provider: IAnimePlaybackProvider = cineSrcAnimePlaybackProvider) {
    this.activeProvider = provider;
  }

  setProvider(provider: IAnimePlaybackProvider): void {
    this.activeProvider = provider;
  }

  getProviderName(): string {
    return this.activeProvider.name;
  }

  /**
   * Resolves playback stream sources for the selected episode ID.
   * UI components call this method rather than constructing provider URLs directly.
   */
  async getEpisodeStream(episodeId: string): Promise<AnimePlaybackResult> {
    return this.activeProvider.getEpisodeStream(episodeId);
  }
}

export const animePlaybackService = new AnimePlaybackService();
export default animePlaybackService;
