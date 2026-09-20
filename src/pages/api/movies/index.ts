// ============================================================
// Stellarix — Server Endpoint: /api/movies
// ============================================================
// Securely proxies TMDB movie queries without exposing the TMDB API key.

import type { APIRoute } from 'astro';
import { tmdbProvider } from '../../../lib/api/providers/tmdb';

export const GET: APIRoute = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const query = url.searchParams.get('query') || undefined;
  const genre = url.searchParams.get('genre') || undefined;
  const yearParam = url.searchParams.get('year');
  const year = yearParam ? parseInt(yearParam, 10) : undefined;
  const ratingParam = url.searchParams.get('minRating');
  const minRating = ratingParam ? parseFloat(ratingParam) : undefined;
  const sortBy = url.searchParams.get('sortBy') || undefined;

  try {
    const result = await tmdbProvider.fetchMovies({
      page,
      query,
      genre,
      year,
      minRating,
      sortBy,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to fetch movies',
        items: [],
        page: 1,
        totalPages: 1,
        totalResults: 0,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
