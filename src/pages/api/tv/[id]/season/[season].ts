// ============================================================
// Stellarix — Server Endpoint: /api/tv/[id]/season/[season]
// ============================================================
// Fetches episodes for a specific TV show season from TMDB server-side.

import type { APIRoute } from 'astro';
import { tmdbTvProvider } from '../../../../../lib/api/providers/tmdbTv';

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  const seasonParam = params.season;

  if (!id || !seasonParam) {
    return new Response(
      JSON.stringify({ error: 'TV Show ID and Season number are required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const seasonNumber = parseInt(seasonParam, 10);
  if (isNaN(seasonNumber)) {
    return new Response(
      JSON.stringify({ error: 'Invalid season number' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const episodes = await tmdbTvProvider.fetchTVSeasonEpisodes(id, seasonNumber);

    return new Response(JSON.stringify({ episodes }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to fetch episodes',
        episodes: [],
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
