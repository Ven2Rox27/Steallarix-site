// ============================================================
// Stellarix — Anime Category API Route (/api/anime/category)
// ============================================================
// Fetches AniList anime by Genre or Tag with server-side pagination.

import type { APIRoute } from 'astro';
import { getAnimeByCategory } from '../../../lib/api/anime/animeService';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const genreParam = (
    url.searchParams.get('genre') ||
    url.searchParams.get('category') ||
    url.searchParams.get('tag') ||
    'All'
  ).trim();

  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);

  try {
    const data = await getAnimeByCategory(genreParam, page);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=180, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.error(`[API /api/anime/category] Error for "${genreParam}":`, error);
    return new Response(
      JSON.stringify({
        category: genreParam,
        currentPage: page,
        hasNextPage: false,
        results: [],
        error: error?.message || 'Failed to fetch category anime.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
