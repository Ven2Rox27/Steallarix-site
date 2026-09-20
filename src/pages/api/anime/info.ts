// ============================================================
// Stellarix — Anime Info API Route (/api/anime/info)
// ============================================================

import type { APIRoute } from 'astro';
import { getAnimeInfo } from '../../../lib/api/anime/animeService';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const id = (url.searchParams.get('id') || '').trim();
  const seasonParam = url.searchParams.get('season') || url.searchParams.get('s') || url.searchParams.get('episodePage');
  const season = seasonParam ? parseInt(seasonParam, 10) : 1;

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Missing anime ID parameter.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const data = await getAnimeInfo(id, season);

    if (!data || !data.id) {
      return new Response(
        JSON.stringify({ error: 'Anime not found.' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || 'Failed to fetch anime information.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
