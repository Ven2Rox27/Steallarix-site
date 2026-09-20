// ============================================================
// Stellarix — Server Endpoint: /api/tv/[id]
// ============================================================
// Fetches comprehensive TV show details from TMDB server-side.

import type { APIRoute } from 'astro';
import { tmdbTvProvider } from '../../../lib/api/providers/tmdbTv';

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'TV Show ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const show = await tmdbTvProvider.fetchTVShowDetails(id);
    if (!show) {
      return new Response(JSON.stringify({ error: 'TV Show not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(show), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to fetch TV show details',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
