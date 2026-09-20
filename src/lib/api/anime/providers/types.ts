// ============================================================
// Stellarix — Anime Playback Provider Abstraction Types
// ============================================================

export interface AnimeStreamSource {
  url: string;
  isM3U8?: boolean;
  isEmbed?: boolean;
  quality?: string;
  type?: 'embed' | 'hls' | 'mp4';
  label?: string;
}

export interface AnimePlaybackResult {
  available: boolean;
  sources: AnimeStreamSource[];
  download?: string;
  headers?: Record<string, string>;
  error?: string;
}

export interface IAnimePlaybackProvider {
  readonly name: string;
  getEpisodeStream(episodeId: string): Promise<AnimePlaybackResult>;
}
