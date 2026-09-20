// ============================================================
// Stellarix — Media Streaming Platform API Types
// ============================================================

/** The three primary content categories */
export type MediaType = 'movie' | 'tv' | 'anime';

/** Video quality levels */
export type QualityLevel = '4K' | '1080p' | '720p' | '480p';

/** Audio/subtitle language options */
export type AudioType = 'sub' | 'dub' | 'both';

// -----------------------------------------------------------
// Core Entities
// -----------------------------------------------------------

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  image?: string;
}

export interface MediaItem {
  id: string;
  tmdbId?: number | string;
  imdbId?: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  mediaType: MediaType;
  year: number;
  rating: number;         // 0-10 scale
  voteCount?: number;
  releaseDate?: string;
  tagline?: string;
  genres: Genre[];
  duration?: number;       // minutes (for movies) or avg episode length
  badges: string[];        // e.g. ['4K', 'HDR', 'Dolby Atmos']
  audioType?: AudioType;
  totalSeasons?: number;
  totalEpisodes?: number;
  status?: 'ongoing' | 'completed' | 'upcoming';
  studio?: string;
  director?: string;
  writers?: string[];
  productionCompanies?: string[];
  cast?: CastMember[];
  trailerUrl?: string;
  malRating?: number;      // MyAnimeList-style rating (anime only)
  imdbRating?: number;     // IMDb-style rating
  featured?: boolean;
  // TV specific metadata
  originalTitle?: string;
  firstAirDate?: string;
  lastAirDate?: string;
  networks?: string[];
  creators?: string[];
  countries?: string[];
  languages?: string[];
  episodeRuntime?: number;
  seasons?: Season[];
}

// -----------------------------------------------------------
// Detailed Views
// -----------------------------------------------------------

export interface MovieDetails extends MediaItem {
  mediaType: 'movie';
  duration: number;
  director: string;
  writers?: string[];
  productionCompanies?: string[];
}

export interface TVDetails extends MediaItem {
  mediaType: 'tv';
  totalSeasons: number;
  totalEpisodes: number;
  seasons: Season[];
}

export interface AnimeDetails extends MediaItem {
  mediaType: 'anime';
  totalSeasons: number;
  totalEpisodes: number;
  seasons: Season[];
  malRating: number;
  studio: string;
  audioType: AudioType;
}

// -----------------------------------------------------------
// Seasons & Episodes
// -----------------------------------------------------------

export interface Season {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string;
  episodeCount: number;
  year: number;
}

export interface Episode {
  id: string;
  seriesId: string;
  seasonId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;          // minutes
  airDate?: string;
  isFiller?: boolean;
  isWatched?: boolean;
  audioType?: AudioType;
  introStart?: number;       // seconds
  introEnd?: number;
  outroStart?: number;
  outroEnd?: number;
}

// -----------------------------------------------------------
// Streaming
// -----------------------------------------------------------

export type StreamType = 'hls' | 'mp4' | 'dash' | 'embed';

export interface Subtitle {
  language: string;
  label: string;
  url: string;
}

export interface StreamSource {
  url: string;
  type: StreamType;
  quality?: QualityLevel;
  language?: string;
  subtitles?: Subtitle[];
  isEmbed?: boolean;
  label?: string;
  provider?: 'vidsrc' | '2embed' | 'cinesrc' | 'custom';
}

// -----------------------------------------------------------
// Search & Filtering
// -----------------------------------------------------------

export interface SearchFilters {
  query?: string;
  mediaType?: MediaType | 'all';
  genre?: string;
  year?: number;
  minRating?: number;
  audioType?: AudioType;
  quality?: QualityLevel;
  sortBy?: 'popular' | 'rating' | 'latest' | 'oldest' | 'alphabetical';
}

export interface SearchResult {
  items: MediaItem[];
  total: number;
  page: number;
  pageSize: number;
}

// -----------------------------------------------------------
// User State
// -----------------------------------------------------------

export interface WatchProgress {
  mediaId: string;
  episodeId?: string;
  position: number;          // seconds
  duration: number;          // seconds
  timestamp: number;         // Date.now()
  title: string;
  posterUrl: string;
  thumbnailUrl?: string;
  mediaType: MediaType;
  episodeTitle?: string;
  seasonNumber?: number;
  episodeNumber?: number;
}

export interface WatchlistItem {
  mediaId: string;
  title: string;
  posterUrl: string;
  mediaType: MediaType;
  addedAt: number;           // Date.now()
  rating?: number;
  year?: number;
  genres?: Genre[];
}

export interface UserPreferences {
  autoplay: boolean;
  defaultPlaybackSpeed: number;
  preferredSubtitleLanguage: string;
  preferredAudioLanguage: string;
  preferredQuality: QualityLevel;
}

// -----------------------------------------------------------
// API Response Wrapper
// -----------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// -----------------------------------------------------------
// Provider Interfaces & Stream Results
// -----------------------------------------------------------

export interface StreamResult {
  available: boolean;
  sources: StreamSource[];
  error?: string;
}

export interface IMovieStreamProvider {
  getMovieStream(tmdbId: string | number): StreamResult;
  getMovieEmbedUrl(imdbId: string): string;
  getStream(movie: MediaItem, preferredProvider?: 'vidsrc' | '2embed'): StreamResult;
}

export interface IMovieDetailsProvider {
  getMovieDetails(id: string): Promise<MovieDetails | null>;
}

export interface ITVStreamProvider {
  getTVStream(seriesId: string, seasonNumber?: number, episodeNumber?: number): StreamResult;
}

export interface IAnimeStreamProvider {
  getAnimeStream(animeId: string, episodeNumber?: number): StreamResult;
}

