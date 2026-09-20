// ============================================================
// Stellarix — Anime Types Definition
// ============================================================

export interface AnimeSearchResultItem {
  id: string;
  tmdbId?: string | number;
  title: string;
  nativeTitle?: string;
  image: string;
  banner?: string;
  releaseDate?: string;
  subOrDub?: 'sub' | 'dub' | 'both' | string;
  episode?: number;
  status?: string;
  type?: string;
  rating?: number;
  genres?: string[];
}

export interface AnimeSearchResponse {
  currentPage: number;
  hasNextPage: boolean;
  results: AnimeSearchResultItem[];
}

export interface AnimeCategoryResponse {
  category: string;
  currentPage: number;
  hasNextPage: boolean;
  results: AnimeSearchResultItem[];
}

export interface AnimeEpisode {
  id: string;
  number: number;
  seasonNumber?: number;
  title?: string;
  url?: string;
  image?: string;
  description?: string;
}

export interface AnimeSeason {
  id: string;
  seasonNumber: number;
  title: string;
  episodeCount: number;
}

export interface AnimeInfo {
  id: string;
  tmdbId?: string | number;
  title: string;
  image: string;
  cover?: string;
  description: string;
  releaseDate?: string;
  genres: string[];
  type: string; // 'movie' | 'tv' | 'TV Series' | string
  status: string;
  otherName?: string;
  totalEpisodes: number;
  subOrDub: 'sub' | 'dub' | 'both' | string;
  seasons?: AnimeSeason[];
  episodes: AnimeEpisode[];
}

export interface AnimeRecentEpisodeItem {
  id: string;
  tmdbId?: string | number;
  episodeId: string;
  episodeNumber: number;
  title: string;
  image: string;
  url: string;
}

export interface AnimeRecentEpisodesResponse {
  currentPage: number;
  hasNextPage: boolean;
  results: AnimeRecentEpisodeItem[];
}

export interface AnimeWatchSource {
  url: string;
  quality: string;
  isM3U8: boolean;
  isEmbed?: boolean;
}

export interface AnimeWatchResponse {
  headers?: Record<string, string>;
  sources: AnimeWatchSource[];
  download?: string;
}

export interface AnimeDiscoverySections {
  trending: AnimeSearchResultItem[];
  popular: AnimeSearchResultItem[];
  recent: AnimeSearchResultItem[];
}
