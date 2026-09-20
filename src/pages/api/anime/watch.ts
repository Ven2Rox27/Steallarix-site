// ============================================================
// Stellarix — Anime Streaming API Route (/api/anime/watch)
// ============================================================

import type { APIRoute } from 'astro';
import animePlaybackService from '../../../lib/api/anime/providers/animePlaybackService';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const episodeId = (url.searchParams.get('episodeId') || url.searchParams.get('id') || '').trim();

  if (!episodeId) {
    return new Response(
      JSON.stringify({
        available: false,
        sources: [],
        error: 'Missing episodeId parameter.',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const data = await animePlaybackService.getEpisodeStream(episodeId);

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        available: false,
        sources: [],
        error: error?.message || 'Streaming service unavailable.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
