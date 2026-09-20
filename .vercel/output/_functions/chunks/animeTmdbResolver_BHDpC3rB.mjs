import { t as getTmdbApiKey } from "./tmdb_CtPsKTJD.mjs";
//#region src/lib/api/anime/animeFilter.ts
/**
* List of banned mock/placeholder titles from fallback data.
*/
var BANNED_TITLES = /* @__PURE__ */ new Set([
	"void breaker",
	"blade sovereign",
	"phantom circuit",
	"sakura academy",
	"iron colossus",
	"death cipher",
	"spirit weaver",
	"celestial resonance",
	"crimson tide: bloodline"
]);
/**
* Validates whether an item qualifies strictly as genuine Anime.
*
* Rules:
* 1. Must NOT have a mock ID (ani-*) or banned placeholder title.
* 2. Must be Animation (TMDB Genre ID 16 or 'Animation'/'Anime' in genres).
* 3. Must have Japanese origin (original_language === 'ja' or origin_country includes 'JP').
*    Western animation (Disney, Pixar, Dreamworks, etc. with original_language 'en') is strictly excluded.
*    Japanese live-action (dramas, movies without genre 16) is strictly excluded.
*/
function isAnime(item) {
	if (!item || typeof item !== "object") return false;
	const idStr = String(item.id || item.tmdbId || "").trim().toLowerCase();
	if (/^ani-?\d+/i.test(idStr)) return false;
	const title = (item.title || item.name || item.original_title || item.original_name || "").trim().toLowerCase();
	if (BANNED_TITLES.has(title)) return false;
	const genreIds = Array.isArray(item.genre_ids) ? item.genre_ids : [];
	const genreNames = [];
	if (Array.isArray(item.genres)) {
		for (const g of item.genres) if (typeof g === "string") genreNames.push(g.toLowerCase());
		else if (g && typeof g === "object") {
			if (typeof g.id === "number") genreIds.push(g.id);
			if (typeof g.name === "string") genreNames.push(g.name.toLowerCase());
		}
	}
	const hasAnimationGenre = genreIds.includes(16) || genreNames.some((n) => n === "animation" || n === "anime");
	const origLang = (item.original_language || item.language || "").toLowerCase().trim();
	const originCountries = Array.isArray(item.origin_country) ? item.origin_country.map((c) => String(c).toUpperCase()) : [];
	if (Array.isArray(item.production_countries)) {
		for (const pc of item.production_countries) if (pc?.iso_3166_1) originCountries.push(String(pc.iso_3166_1).toUpperCase());
	}
	const isJapaneseOrigin = origLang === "ja" || originCountries.includes("JP");
	if (genreIds.length > 0 || origLang || originCountries.length > 0) {
		if (origLang && origLang !== "ja" && !originCountries.includes("JP")) return false;
		if (genreIds.length > 0 && !hasAnimationGenre) return false;
		return hasAnimationGenre && isJapaneseOrigin;
	}
	const mediaType = (item.type || item.mediaType || "").toLowerCase();
	if (mediaType === "movie" || mediaType === "tv" || mediaType === "anime") {
		if (genreNames.length > 0) return hasAnimationGenre;
		return Boolean(item.id || item.tmdbId);
	}
	return false;
}
//#endregion
//#region src/lib/api/anime/providers/animeTmdbResolver.ts
var TMDB_BASE_URL = "https://api.themoviedb.org/3";
/**
* In-memory cache for resolved anime TMDB IDs to avoid redundant lookups.
*/
var resolvedCache = /* @__PURE__ */ new Map();
/**
* Resilient fetch with User-Agent header for TMDB lookups.
*/
async function fetchTmdbAnime(endpoint) {
	const apiKey = getTmdbApiKey();
	if (!apiKey) return null;
	const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${apiKey}`;
	for (let attempt = 0; attempt < 2; attempt++) try {
		const res = await fetch(url, { headers: {
			Accept: "application/json",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
		} });
		if (res.ok) return await res.json();
		if (res.status === 404) return null;
	} catch (err) {
		try {
			if (typeof process !== "undefined" && process.versions?.node) {
				const https = await import("node:https");
				const fallbackData = await new Promise((resolve) => {
					https.get(url, { headers: {
						Accept: "application/json",
						"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
					} }, (res) => {
						if (res.statusCode === 404) return resolve(null);
						if (!res.statusCode || res.statusCode >= 400) return resolve(null);
						let raw = "";
						res.on("data", (chunk) => raw += chunk);
						res.on("end", () => {
							try {
								resolve(JSON.parse(raw));
							} catch {
								resolve(null);
							}
						});
					}).on("error", () => resolve(null));
				});
				if (fallbackData) return fallbackData;
			}
		} catch {}
		if (attempt === 0) await new Promise((r) => setTimeout(r, 200));
	}
	return null;
}
/**
* Resolves a genuine TMDB ID and media type for an anime title or ID.
*
* @param idOrTitle Anime ID, slug, or title string
* @param preferredType Optional hint ('movie' or 'tv')
* @returns ResolvedAnimeTmdb with genuine TMDB ID, or null if unresolvable
*/
async function resolveAnimeTmdbId(idOrTitle, preferredType) {
	const clean = (idOrTitle || "").trim();
	if (!clean) return null;
	const cacheKey = `${clean}:${preferredType || "any"}`;
	if (resolvedCache.has(cacheKey)) return resolvedCache.get(cacheKey) || null;
	if (/^\d+$/.test(clean)) {
		try {
			const { fetchAniList } = await import("./client_DmqOfHh-.mjs").then((n) => n.t);
			const anilistData = await fetchAniList(`query ($id: Int) { Media(id: $id, type: ANIME) { id format title { english romaji } } }`, { id: parseInt(clean, 10) });
			const anilistTitle = anilistData?.Media?.title?.english || anilistData?.Media?.title?.romaji;
			const anilistType = anilistData?.Media?.format === "MOVIE" ? "movie" : "tv";
			if (anilistTitle) {
				const resolvedFromTitle = await resolveAnimeTmdbId(anilistTitle, preferredType || anilistType);
				if (resolvedFromTitle) {
					resolvedCache.set(cacheKey, resolvedFromTitle);
					return resolvedFromTitle;
				}
			}
		} catch {}
		const [tvData, movieData] = await Promise.all([preferredType === "movie" ? null : fetchTmdbAnime(`/tv/${clean}`), fetchTmdbAnime(`/movie/${clean}`)]);
		const isTvAnime = isAnime(tvData);
		const isMovieAnime = isAnime(movieData);
		if (preferredType === "movie" && isMovieAnime && movieData?.id) {
			const res = {
				tmdbId: String(movieData.id),
				type: "movie",
				title: movieData.title || movieData.original_title || clean
			};
			resolvedCache.set(cacheKey, res);
			return res;
		}
		if (isMovieAnime && !isTvAnime && movieData?.id) {
			const res = {
				tmdbId: String(movieData.id),
				type: "movie",
				title: movieData.title || movieData.original_title || clean
			};
			resolvedCache.set(cacheKey, res);
			return res;
		}
		if (isTvAnime && tvData?.id) {
			const res = {
				tmdbId: String(tvData.id),
				type: "tv",
				title: tvData.name || tvData.original_name || clean
			};
			resolvedCache.set(cacheKey, res);
			return res;
		}
		if (isMovieAnime && movieData?.id) {
			const res = {
				tmdbId: String(movieData.id),
				type: "movie",
				title: movieData.title || movieData.original_title || clean
			};
			resolvedCache.set(cacheKey, res);
			return res;
		}
		const directRes = {
			tmdbId: clean,
			type: preferredType === "movie" ? "movie" : "tv",
			title: clean
		};
		resolvedCache.set(cacheKey, directRes);
		return directRes;
	}
	const queryToUse = clean.replace(/^ani-?\d+/i, "").replace(/[-_]+/g, " ").trim() || clean;
	if (preferredType !== "movie") {
		const tvSearch = await fetchTmdbAnime(`/search/tv?query=${encodeURIComponent(queryToUse)}`);
		if (tvSearch && Array.isArray(tvSearch.results) && tvSearch.results.length > 0) {
			const best = tvSearch.results.find((r) => isAnime(r));
			if (best && best.id) {
				const res = {
					tmdbId: String(best.id),
					type: "tv",
					title: best.name || best.original_name
				};
				resolvedCache.set(cacheKey, res);
				return res;
			}
		}
	}
	const movieSearch = await fetchTmdbAnime(`/search/movie?query=${encodeURIComponent(queryToUse)}`);
	if (movieSearch && Array.isArray(movieSearch.results) && movieSearch.results.length > 0) {
		const best = movieSearch.results.find((r) => isAnime(r));
		if (best && best.id) {
			const res = {
				tmdbId: String(best.id),
				type: "movie",
				title: best.title || best.original_title
			};
			resolvedCache.set(cacheKey, res);
			return res;
		}
	}
	resolvedCache.set(cacheKey, null);
	return null;
}
//#endregion
export { resolveAnimeTmdbId as t };
