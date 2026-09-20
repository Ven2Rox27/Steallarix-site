import { a as genres, d as tvShows, t as getTmdbApiKey } from "./tmdb_CtPsKTJD.mjs";
//#region src/lib/api/providers/tmdbTv.ts
var TMDB_BASE_URL = "https://api.themoviedb.org/3";
var TMDB_IMAGE_BASE_POSTER = "https://image.tmdb.org/t/p/w500";
var TMDB_IMAGE_BASE_BACKDROP = "https://image.tmdb.org/t/p/original";
var TMDB_IMAGE_BASE_PROFILE = "https://image.tmdb.org/t/p/w200";
var TMDB_IMAGE_BASE_STILL = "https://image.tmdb.org/t/p/w500";
/** Mapping between local genre slugs and TMDB TV numerical genre IDs */
var TMDB_TV_GENRE_MAP = {
	"action-adventure": 10759,
	action: 10759,
	adventure: 10759,
	animation: 16,
	comedy: 35,
	crime: 80,
	documentary: 99,
	drama: 18,
	family: 10751,
	kids: 10762,
	mystery: 9648,
	news: 10763,
	reality: 10764,
	"sci-fi-fantasy": 10765,
	"sci-fi": 10765,
	fantasy: 10765,
	soap: 10766,
	talk: 10767,
	"war-politics": 10768,
	war: 10768,
	western: 37
};
/**
* Node.js HTTPS fallback to bypass Windows undici TLS connection reset bugs.
*/
async function fetchViaHttpsFallback(url) {
	try {
		if (typeof process !== "undefined" && process.versions?.node) {
			const https = await import("node:https");
			return await new Promise((resolve) => {
				https.get(url, { headers: {
					Accept: "application/json",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
				} }, (res) => {
					let data = "";
					res.on("data", (chunk) => data += chunk);
					res.on("end", () => {
						resolve(new Response(data, {
							status: res.statusCode || 200,
							headers: { "Content-Type": "application/json" }
						}));
					});
				}).on("error", () => resolve(null));
			});
		}
	} catch {}
	return null;
}
/**
* Resilient fetch with automatic retries and TLS fallback for TMDB TV API calls.
*/
async function fetchTmdbWithRetry(url, retries = 2) {
	let lastError;
	for (let attempt = 0; attempt <= retries; attempt++) try {
		const res = await fetch(url, { headers: {
			"Accept": "application/json",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
		} });
		if (res.ok || res.status === 404) return res;
	} catch (err) {
		lastError = err;
		const fallbackRes = await fetchViaHttpsFallback(url);
		if (fallbackRes && (fallbackRes.ok || fallbackRes.status === 404)) return fallbackRes;
		if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
	}
	const finalFallback = await fetchViaHttpsFallback(url);
	if (finalFallback && (finalFallback.ok || finalFallback.status === 404)) return finalFallback;
	throw lastError || /* @__PURE__ */ new Error(`Failed to fetch ${url}`);
}
/**
* Maps raw TMDB TV response object to application MediaItem.
*/
function formatTmdbTVShow(raw, genreList = genres) {
	const tmdbId = Number(raw.id);
	const firstAirDate = raw.first_air_date || "";
	const year = firstAirDate ? parseInt(firstAirDate.slice(0, 4), 10) : 2024;
	const rating = raw.vote_average ? Math.round(raw.vote_average * 10) / 10 : 0;
	let itemGenres = [];
	if (Array.isArray(raw.genres)) itemGenres = raw.genres.map((g) => ({
		id: `g-${g.id}`,
		name: g.name,
		slug: g.name.toLowerCase().replace(/\s+/g, "-")
	}));
	else if (Array.isArray(raw.genre_ids)) itemGenres = raw.genre_ids.map((gid) => {
		const found = Object.entries(TMDB_TV_GENRE_MAP).find(([, id]) => id === gid);
		if (found) return genreList.find((g) => g.slug === found[0]) || {
			id: `g-${gid}`,
			name: found[0],
			slug: found[0]
		};
		return null;
	}).filter(Boolean);
	const posterUrl = raw.poster_path ? `${TMDB_IMAGE_BASE_POSTER}${raw.poster_path}` : raw.posterUrl || "https://picsum.photos/seed/placeholder-tv/400/600";
	const backdropUrl = raw.backdrop_path ? `${TMDB_IMAGE_BASE_BACKDROP}${raw.backdrop_path}` : raw.backdropUrl || posterUrl;
	const badges = ["HD"];
	if (rating >= 7.5) badges.push("4K");
	if (rating >= 8.2) badges.push("HDR");
	let creators = [];
	if (Array.isArray(raw.created_by)) creators = raw.created_by.map((c) => c.name);
	let cast = [];
	if (raw.credits && Array.isArray(raw.credits.cast)) cast = raw.credits.cast.slice(0, 8).map((c) => ({
		id: `c-${c.id}`,
		name: c.name,
		character: c.character || "Cast",
		image: c.profile_path ? `${TMDB_IMAGE_BASE_PROFILE}${c.profile_path}` : void 0
	}));
	let trailerUrl;
	if (raw.videos && Array.isArray(raw.videos.results)) {
		const trailer = raw.videos.results.find((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
		if (trailer?.key) trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
	}
	const imdbId = raw.external_ids?.imdb_id || raw.imdb_id || void 0;
	const totalSeasons = raw.number_of_seasons || (Array.isArray(raw.seasons) ? raw.seasons.filter((s) => s.season_number > 0).length : 1);
	const totalEpisodes = raw.number_of_episodes || void 0;
	const studio = raw.networks?.[0]?.name;
	return {
		id: String(tmdbId),
		tmdbId,
		imdbId,
		title: raw.name || raw.original_name || "Untitled Show",
		description: raw.overview || "No synopsis available.",
		posterUrl,
		backdropUrl,
		mediaType: "tv",
		year,
		rating,
		voteCount: raw.vote_count,
		releaseDate: firstAirDate,
		tagline: raw.tagline,
		duration: raw.episode_run_time?.[0] || 45,
		badges,
		genres: itemGenres.length > 0 ? itemGenres : [{
			id: "g-tv",
			name: "Drama",
			slug: "drama"
		}],
		director: creators[0] || (raw.networks?.[0]?.name ? `${raw.networks[0].name} Series` : "TV Series"),
		writers: creators.length > 0 ? creators : void 0,
		productionCompanies: raw.production_companies?.map((p) => p.name).slice(0, 3),
		studio,
		cast: cast.length > 0 ? cast : void 0,
		trailerUrl: trailerUrl || raw.trailerUrl,
		imdbRating: rating,
		totalSeasons,
		totalEpisodes,
		status: raw.status === "Ended" ? "completed" : "ongoing",
		featured: rating >= 8.2,
		originalTitle: raw.original_name,
		firstAirDate,
		lastAirDate: raw.last_air_date,
		networks: raw.networks?.map((n) => n.name) || (studio ? [studio] : void 0),
		creators: creators.length > 0 ? creators : void 0,
		countries: raw.origin_country || raw.production_countries?.map((c) => c.name),
		languages: raw.spoken_languages?.map((l) => l.english_name || l.name) || (raw.original_language ? [raw.original_language] : void 0),
		episodeRuntime: raw.episode_run_time?.[0],
		seasons: Array.isArray(raw.seasons) ? raw.seasons.filter((s) => s.season_number > 0).map((s) => ({
			id: `s-${s.season_number}`,
			seriesId: String(tmdbId),
			seasonNumber: s.season_number,
			title: s.name || `Season ${s.season_number}`,
			episodeCount: s.episode_count || 0,
			year: s.air_date ? parseInt(s.air_date.slice(0, 4), 10) : year
		})) : void 0
	};
}
/**
* Fetches dynamic TV shows with pagination, search, and filtering from TMDB.
*/
async function fetchTVShows(options = {}) {
	const { page = 1, query, genre, year, minRating, sortBy = "popular" } = options;
	const apiKey = getTmdbApiKey();
	try {
		let endpoint = "";
		const params = new URLSearchParams({
			api_key: apiKey,
			page: String(page),
			include_adult: "false"
		});
		if (query && query.trim()) endpoint = `${TMDB_BASE_URL}/search/tv?${params.toString()}&query=${encodeURIComponent(query.trim())}`;
		else {
			let tmdbSort = "popularity.desc";
			if (sortBy === "rating") {
				tmdbSort = "vote_average.desc";
				params.set("vote_count.gte", "50");
			} else if (sortBy === "latest") tmdbSort = "first_air_date.desc";
			else if (sortBy === "oldest") tmdbSort = "first_air_date.asc";
			else if (sortBy === "alphabetical") tmdbSort = "name.asc";
			params.set("sort_by", tmdbSort);
			if (genre) {
				const gid = TMDB_TV_GENRE_MAP[genre.toLowerCase()] || Number(genre);
				if (gid) params.set("with_genres", String(gid));
			}
			if (year) params.set("first_air_date_year", String(year));
			if (minRating) params.set("vote_average.gte", String(minRating));
			endpoint = `${TMDB_BASE_URL}/discover/tv?${params.toString()}`;
		}
		const res = await fetchTmdbWithRetry(endpoint, 3);
		if (res.ok) {
			const json = await res.json();
			const items = (json.results || []).map((m) => formatTmdbTVShow(m));
			return {
				items,
				page: json.page || page,
				totalPages: json.total_pages || 1,
				totalResults: json.total_results || items.length,
				source: "tmdb"
			};
		}
		throw new Error(`TMDB responded with status ${res.status}`);
	} catch (err) {
		console.error("TMDB TV fetch failed after retries:", err);
		throw err;
	}
}
/**
* Fetches comprehensive TV show details from TMDB with credits, videos, and seasons metadata.
*/
async function fetchTVShowDetails(id) {
	const apiKey = getTmdbApiKey();
	const idStr = String(id).trim();
	try {
		let tmdbId = idStr;
		if (idStr.startsWith("tt")) {
			const findRes = await fetchTmdbWithRetry(`${TMDB_BASE_URL}/find/${idStr}?api_key=${apiKey}&external_source=imdb_id`, 2);
			if (findRes.ok) {
				const firstShow = (await findRes.json()).tv_results?.[0];
				if (firstShow) tmdbId = String(firstShow.id);
			}
		}
		const res = await fetchTmdbWithRetry(`${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${apiKey}&append_to_response=credits,videos,external_ids`, 2);
		if (res.ok) return formatTmdbTVShow(await res.json());
	} catch (err) {
		console.warn("Failed to fetch TMDB TV details, falling back:", err);
	}
	return tvShows.find((m) => m.id === idStr || String(m.tmdbId) === idStr || m.imdbId === idStr) ?? null;
}
/**
* Fetches the seasons list for a TV show from TMDB.
*/
async function fetchTVSeasons(seriesId) {
	const apiKey = getTmdbApiKey();
	const idStr = String(seriesId).trim();
	try {
		const res = await fetchTmdbWithRetry(`${TMDB_BASE_URL}/tv/${idStr}?api_key=${apiKey}`, 2);
		if (res.ok) {
			const raw = await res.json();
			if (Array.isArray(raw.seasons)) {
				const validSeasons = raw.seasons.filter((s) => s.season_number > 0);
				return (validSeasons.length > 0 ? validSeasons : raw.seasons).map((s) => ({
					id: `s-${s.season_number}`,
					seriesId: idStr,
					seasonNumber: s.season_number,
					title: s.name || `Season ${s.season_number}`,
					episodeCount: s.episode_count || 0,
					year: s.air_date ? parseInt(s.air_date.slice(0, 4), 10) : 2024
				}));
			}
		}
	} catch (err) {
		console.warn(`Failed to fetch TMDB seasons for series ${seriesId}:`, err);
	}
	return [{
		id: "s-1",
		seriesId: idStr,
		seasonNumber: 1,
		title: "Season 1",
		episodeCount: 10,
		year: 2024
	}];
}
/**
* Fetches episodes for a specific TV season from TMDB.
*/
async function fetchTVSeasonEpisodes(seriesId, seasonNumber = 1) {
	const apiKey = getTmdbApiKey();
	const idStr = String(seriesId).trim();
	try {
		const res = await fetchTmdbWithRetry(`${TMDB_BASE_URL}/tv/${idStr}/season/${seasonNumber}?api_key=${apiKey}`, 2);
		if (res.ok) {
			const raw = await res.json();
			if (Array.isArray(raw.episodes)) return raw.episodes.map((ep) => ({
				id: `s${ep.season_number}e${ep.episode_number}`,
				seriesId: idStr,
				seasonId: `s-${ep.season_number}`,
				seasonNumber: ep.season_number,
				episodeNumber: ep.episode_number,
				title: ep.name || `Episode ${ep.episode_number}`,
				description: ep.overview || "No episode description available.",
				thumbnailUrl: ep.still_path ? `${TMDB_IMAGE_BASE_STILL}${ep.still_path}` : "https://picsum.photos/seed/placeholder-ep/640/360",
				duration: ep.runtime || 45,
				airDate: ep.air_date
			}));
		}
	} catch (err) {
		console.warn(`Failed to fetch TMDB season ${seasonNumber} episodes for ${seriesId}:`, err);
	}
	return [];
}
var tmdbTvProvider = {
	fetchTVShows,
	fetchTVShowDetails,
	fetchTVSeasons,
	fetchTVSeasonEpisodes
};
//#endregion
export { tmdbTvProvider as t };
