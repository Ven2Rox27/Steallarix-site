// ============================================================
// Stellarix — Server Endpoint: /api/movies/[id]
// ============================================================
// Fetches comprehensive movie details from TMDB server-side.

import type { APIRoute } from 'astro';
import { tmdbProvider } from '../../../lib/api/providers/tmdb';

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Movie ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const movie = await tmdbProvider.fetchMovieDetails(id);
    if (!movie) {
      return new Response(JSON.stringify({ error: 'Movie not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(movie), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to fetch movie details',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
