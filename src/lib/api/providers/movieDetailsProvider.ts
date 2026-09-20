// ============================================================
// Stellarix — Movie Details Provider (2embed Adapter)
// ============================================================
// Adapter for movie details provider planned around https://www.2embed.cc/
//
// NOTE: 2embed is primarily an embed player provider and does not provide
// an official, public structured JSON REST API for media catalog metadata
// (cast, overview, genres, backdrops, ratings).
//
// In accordance with architecture guidelines:
// - No undocumented endpoints are invented
// - No web scraping is performed
// - Unsupported details endpoints are clearly marked as TODO
// - An isolated adapter interface is implemented
// - Mock catalog data serves as the fallback so the UI remains fully functional

import type { MovieDetails, IMovieDetailsProvider } from '../types';
import { movies } from '../mockData';

export interface TwoEmbedConfig {
  baseUrl: string;
}

export const defaultTwoEmbedConfig: TwoEmbedConfig = {
  baseUrl: 'https://www.2embed.cc',
};

export class TwoEmbedMovieDetailsProvider implements IMovieDetailsProvider {
  private config: TwoEmbedConfig;

  constructor(config: TwoEmbedConfig = defaultTwoEmbedConfig) {
    this.config = config;
  }

  /**
   * Fetches detailed information for a movie.
   * 
   * TODO: 2embed does not offer an official public structured REST API for movie metadata.
   * When an official structured API or complementary metadata service is configured,
   * implement remote JSON fetching here using this.config.baseUrl.
   *
   * Currently, this adapter falls back to the internal movie catalog.
   */
  async getMovieDetails(id: string): Promise<MovieDetails | null> {
    // TODO: Connect to official structured movie details endpoint when available.
    // For now, isolate provider and return fallback data from repository.
    const found = movies.find(
      (m) => m.id === id || String(m.tmdbId) === String(id) || m.imdbId === id
    );
    if (!found || found.mediaType !== 'movie') {
      return null;
    }

    const details: MovieDetails = {
      ...found,
      mediaType: 'movie',
      duration: found.duration ?? 120,
      director: found.director ?? 'Unknown Director',
    };

    return details;
  }
}

export const movieDetailsProvider = new TwoEmbedMovieDetailsProvider();
export default movieDetailsProvider;
