// ============================================================
// Stellarix — AniList GraphQL Client
// ============================================================
// Executes public POST requests to https://graphql.anilist.co
// Features in-memory caching, error checking, and retry resilience.

import type { AniListGraphQLResponse } from './types';

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const anilistMemoryCache = new Map<string, CacheEntry<any>>();
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Creates a unique deterministic cache key for query + variables.
 */
function getCacheKey(query: string, variables?: Record<string, any>): string {
  const cleanQuery = query.replace(/\s+/g, ' ').trim();
  const sortedVars = variables ? JSON.stringify(variables, Object.keys(variables).sort()) : '';
  return `${cleanQuery}::${sortedVars}`;
}

/**
 * Sends a GraphQL POST request to AniList.
 * Always verifies response.errors to prevent false successes.
 *
 * @param query GraphQL query string
 * @param variables Optional variables dictionary
 * @param cacheTtlMs Optional cache TTL in milliseconds (defaults to 5 minutes)
 */
export async function fetchAniList<T = any>(
  query: string,
  variables?: Record<string, any>,
  cacheTtlMs: number = DEFAULT_CACHE_TTL_MS
): Promise<T> {
  const cacheKey = getCacheKey(query, variables);

  // 1. Check in-memory cache
  const cached = anilistMemoryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const payload = JSON.stringify({ query, variables });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(typeof window === 'undefined'
            ? { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
            : {}),
        },
        body: payload,
      });

      // Handle rate limit
      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('Retry-After') || '2', 10);
        console.warn(`[AniList] Rate limited (429). Retrying in ${retryAfter}s...`);
        await new Promise((r) => setTimeout(r, Math.min(retryAfter * 1000, 3000)));
        continue;
      }

      const json: AniListGraphQLResponse<T> = await res.json();

      // IMPORTANT: Always check json.errors
      if (json.errors && Array.isArray(json.errors) && json.errors.length > 0) {
        const message = json.errors.map((e) => e.message).join(' | ');
        throw new Error(`AniList GraphQL Error: ${message}`);
      }

      if (!res.ok) {
        throw new Error(`AniList HTTP Error ${res.status}: ${res.statusText}`);
      }

      if (json.data) {
        // Cache successful response
        anilistMemoryCache.set(cacheKey, {
          data: json.data,
          expiresAt: Date.now() + cacheTtlMs,
        });
        return json.data;
      }

      throw new Error('AniList returned empty data object.');
    } catch (err: any) {
      lastError = err;
      // If undici fetch experiences Windows TLS ECONNRESET, fallback to node https
      if (typeof process !== 'undefined' && process.versions?.node) {
        try {
          const https = await import('node:https');
          const fallbackData = await new Promise<T>((resolve, reject) => {
            const req = https.request(
              ANILIST_GRAPHQL_ENDPOINT,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                  'Content-Length': Buffer.byteLength(payload),
                },
              },
              (res) => {
                let raw = '';
                res.on('data', (chunk) => (raw += chunk));
                res.on('end', () => {
                  try {
                    const json: AniListGraphQLResponse<T> = JSON.parse(raw);
                    if (json.errors && json.errors.length > 0) {
                      return reject(new Error(`AniList Error: ${json.errors.map((e) => e.message).join(' | ')}`));
                    }
                    if (json.data) {
                      resolve(json.data);
                    } else {
                      reject(new Error('AniList returned empty data object.'));
                    }
                  } catch (e) {
                    reject(e);
                  }
                });
              }
            );
            req.on('error', reject);
            req.write(payload);
            req.end();
          });

          if (fallbackData) {
            anilistMemoryCache.set(cacheKey, {
              data: fallbackData,
              expiresAt: Date.now() + cacheTtlMs,
            });
            return fallbackData;
          }
        } catch (nodeErr: any) {
          lastError = nodeErr;
        }
      }

      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      }
    }
  }

  // Return stale cache if available when network is completely offline
  if (cached) {
    console.warn('[AniList] Serving stale cache due to network failure');
    return cached.data;
  }

  throw lastError || new Error('Failed to fetch data from AniList.');
}
