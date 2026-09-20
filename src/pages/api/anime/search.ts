// ============================================================
// Stellarix — Anime Search API Route (/api/anime/search)
// ============================================================

import type { APIRoute } from 'astro';
import { searchAnime } from '../../../lib/api/anime/animeService';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const query = (url.searchParams.get('query') || url.searchParams.get('q') || '').trim();
  const page = parseInt(url.searchParams.get('page') || '1', 10) || 1;

  if (!query) {
    return new Response(
      JSON.stringify({
        currentPage: page,
        hasNextPage: false,
        results: [],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const data = await searchAnime(query, page);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        currentPage: page,
        hasNextPage: false,
        results: [],
        error: error?.message || 'Failed to search anime.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
