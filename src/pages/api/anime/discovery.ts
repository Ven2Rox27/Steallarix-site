// ============================================================
// Stellarix — Anime Discovery API Route (/api/anime/discovery)
// ============================================================

import type { APIRoute } from 'astro';
import { getAnimeDiscoverySections } from '../../../lib/api/anime/animeService';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const data = await getAnimeDiscoverySections();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('API /api/anime/discovery error:', error);
    return new Response(
      JSON.stringify({
        trending: [],
        popular: [],
        recent: [],
        error: error?.message || 'Failed to load discovery sections.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
