import { a as genres, c as getMediaByType, i as featuredMedia, l as getSeasonsForSeries, n as tmdbProvider, o as getEpisodesForSeason, r as allMedia, s as getMediaById, u as movies } from "./tmdb_CtPsKTJD.mjs";
import { r as getAnimeTvStreamUrl } from "./cineSrc_BRB7n-GD.mjs";
import { t as animePlaybackService } from "./animePlaybackService_CLAxzLef.mjs";
import { t as tmdbTvProvider } from "./tmdbTv_Dp8B1juT.mjs";
//#region src/lib/api/providers/movieDetailsProvider.ts
var defaultTwoEmbedConfig = { baseUrl: "https://www.2embed.cc" };
var TwoEmbedMovieDetailsProvider = class {
	config;
	constructor(config = defaultTwoEmbedConfig) {
		this.config = config;
	}
	/**
	* Fetches detailed information for a movie.
	* 
	* TODO: 2embed does not offer an official public structured REST API for movie metadata.
	* When an official structured API or complementary metadata service is configured,
	* implement remote JSON fetching here using this.config.baseUrl.
	*
	* Currently, this adapter falls back to the internal movie catalog.
	*/
	async getMovieDetails(id) {
		const found = movies.find((m) => m.id === id || String(m.tmdbId) === String(id) || m.imdbId === id);
		if (!found || found.mediaType !== "movie") return null;
		return {
			...found,
			mediaType: "movie",
			duration: found.duration ?? 120,
			director: found.director ?? "Unknown Director"
		};
	}
};
new TwoEmbedMovieDetailsProvider();
//#endregion
//#region src/lib/api/providers/tvStreamProvider.ts
/**
* Builds the CineSRC embed URL for TV show episode streaming dynamically.
* Format: https://cinesrc.st/embed/tv/{TMDB_ID}?s={SEASON}&e={EPISODE}
*
* @param tmdbId TMDB ID of the TV show
* @param seasonNumber Season number (1-based, defaults to 1)
* @param episodeNumber Episode number (1-based, defaults to 1)
* @returns Complete embed URL for the specified TV episode
*/
function getTvStreamUrl(tmdbId, seasonNumber = 1, episodeNumber = 1) {
	return `https://cinesrc.st/embed/tv/${String(tmdbId).trim()}?s=${Math.max(1, Number(seasonNumber) || 1)}&e=${Math.max(1, Number(episodeNumber) || 1)}`;
}
var TVStreamProvider = class {
	/**
	* Generates stream sources for a TV show episode via CineSRC.
	*
	* @param seriesId TMDB ID of the TV series
	* @param seasonNumber Season number (defaults to 1)
	* @param episodeNumber Episode number (defaults to 1)
	* @returns StreamResult containing the CineSRC embed source
	*/
	getTVStream(seriesId, seasonNumber = 1, episodeNumber = 1) {
		if (!seriesId) return {
			available: false,
			sources: [],
			error: "Missing TV series ID."
		};
		return {
			available: true,
			sources: [{
				url: getTvStreamUrl(seriesId, Math.max(1, Number(seasonNumber) || 1), Math.max(1, Number(episodeNumber) || 1)),
				quality: "auto",
				type: "embed",
				isEmbed: true,
				label: "CineSRC (Fast HD)",
				provider: "cinesrc"
			}]
		};
	}
};
new TVStreamProvider();
//#endregion
//#region src/lib/api/providers/animeStreamProvider.ts
var AnimeStreamProvider = class {
	/**
	* Synchronous interface method satisfying IAnimeStreamProvider.
	* Generates CineSRC stream embed URL for anime.
	*/
	getAnimeStream(animeId, episodeNumber = 1) {
		const url = getAnimeTvStreamUrl(animeId, 1, episodeNumber);
		return {
			available: Boolean(url),
			sources: url ? [{
				url,
				type: "embed",
				quality: "1080p",
				label: `Episode ${episodeNumber}`,
				provider: "cinesrc"
			}] : []
		};
	}
	/**
	* Resolves streaming sources for an episode via CineSRC.
	*/
	async resolveEpisodeStream(episodeId) {
		const result = await animePlaybackService.getEpisodeStream(episodeId);
		if (!result.available || !result.sources) return [];
		return result.sources.map((s) => ({
			url: s.url,
			type: "embed",
			quality: s.quality || "1080p",
			label: s.label || "CineSRC",
			provider: "cinesrc"
		}));
	}
};
new AnimeStreamProvider();
//#endregion
//#region src/lib/api/mediaService.ts
async function getFeatured() {
	return featuredMedia;
}
async function getTrending(mediaType) {
	if (mediaType === "anime") {
		if (typeof window !== "undefined") try {
			const controller = new AbortController();
			const tid = setTimeout(() => controller.abort(), 3500);
			const res = await fetch("/api/anime/discovery", { signal: controller.signal });
			clearTimeout(tid);
			if (res.ok) {
				const data = await res.json();
				const list = data.recent || data.trending || data.popular || [];
				if (list.length > 0) return list.map((item) => ({
					id: item.id,
					title: item.title,
					posterUrl: item.image,
					backdropUrl: item.image,
					description: "",
					mediaType: "anime",
					year: item.releaseDate ? parseInt(item.releaseDate, 10) || 2024 : 2024,
					rating: item.rating ? Number(item.rating) : 8.5,
					genres: [],
					badges: ["HD", item.subOrDub ? item.subOrDub.toUpperCase() : "SUB"]
				}));
			}
		} catch (err) {
			console.warn("Could not fetch trending anime via API on client:", err);
		}
		else try {
			const { getRecentlyAddedAnime } = await import("./animeService_BLRbnvFE.mjs").then((n) => n.t);
			const recent = await getRecentlyAddedAnime(12);
			if (recent && recent.length > 0) return recent.map((item) => ({
				id: item.id,
				title: item.title,
				posterUrl: item.image,
				backdropUrl: item.image,
				description: "",
				mediaType: "anime",
				year: item.releaseDate ? parseInt(item.releaseDate, 10) || 2024 : 2024,
				rating: 8.5,
				genres: [],
				badges: ["HD", item.subOrDub ? item.subOrDub.toUpperCase() : "SUB"]
			}));
		} catch (err) {
			console.warn("Could not fetch trending anime:", err);
		}
	}
	if (!mediaType || mediaType === "all") return [...allMedia].sort((a, b) => b.rating - a.rating).slice(0, 12);
	return getMediaByType(mediaType).sort((a, b) => b.rating - a.rating).slice(0, 12);
}
async function getNewReleases() {
	return [...allMedia].filter((m) => m.year >= 2024).sort((a, b) => b.year - a.year || b.rating - a.rating);
}
async function getTopRated() {
	return [...allMedia].sort((a, b) => b.rating - a.rating).slice(0, 10);
}
async function getByGenre(genreSlug) {
	return allMedia.filter((m) => m.genres.some((g) => g.slug === genreSlug));
}
/**
* Fetches movie details dynamically from TMDB.
*/
async function getMovieDetails(id) {
	if (typeof window !== "undefined") try {
		const res = await fetch(`/api/movies/${encodeURIComponent(id)}`);
		if (res.ok) return await res.json();
	} catch (err) {
		console.warn(`Failed to fetch /api/movies/${id} from client:`, err);
	}
	return tmdbProvider.fetchMovieDetails(id);
}
/**
* Fetches TV show details dynamically from TMDB.
*/
async function getTVDetails(id) {
	if (typeof window !== "undefined") try {
		const res = await fetch(`/api/tv/${encodeURIComponent(id)}`);
		if (res.ok) return await res.json();
	} catch (err) {
		console.warn(`Failed to fetch /api/tv/${id} from client:`, err);
	}
	return tmdbTvProvider.fetchTVShowDetails(id);
}
async function getDetails(id, mediaType) {
	if (mediaType === "movie") return getMovieDetails(id);
	if (mediaType === "tv") return getTVDetails(id);
	const item = getMediaById(id);
	if (item?.mediaType === "movie") {
		const details = await getMovieDetails(id);
		if (details) return details;
	}
	if (item?.mediaType === "tv") {
		const details = await getTVDetails(id);
		if (details) return details;
	}
	if (!item) {
		const movie = await getMovieDetails(id);
		if (movie) return movie;
		const tv = await getTVDetails(id);
		if (tv) return tv;
	}
	return item ?? null;
}
async function getSeasons(seriesId) {
	if (typeof window !== "undefined") try {
		const details = await getTVDetails(seriesId);
		if (details?.seasons && details.seasons.length > 0) return details.seasons;
	} catch {}
	else try {
		const seasons = await tmdbTvProvider.fetchTVSeasons(seriesId);
		if (seasons && seasons.length > 0) return seasons;
	} catch {}
	return getSeasonsForSeries(seriesId);
}
async function getEpisodes(seriesId, seasonId) {
	const seasonNum = parseInt(String(seasonId).replace(/\D/g, ""), 10) || 1;
	if (typeof window !== "undefined") try {
		const res = await fetch(`/api/tv/${encodeURIComponent(seriesId)}/season/${seasonNum}`);
		if (res.ok) {
			const data = await res.json();
			if (data.episodes && data.episodes.length > 0) return data.episodes;
		}
	} catch (err) {
		console.warn(`Failed to fetch /api/tv/${seriesId}/season/${seasonNum}:`, err);
	}
	else try {
		const episodes = await tmdbTvProvider.fetchTVSeasonEpisodes(seriesId, seasonNum);
		if (episodes && episodes.length > 0) return episodes;
	} catch {}
	return getEpisodesForSeason(String(seasonId));
}
async function searchMedia(filters) {
	if (filters.mediaType === "movie") {
		const movieResult = await getPaginatedMovies({
			page: filters.page || 1,
			query: filters.query,
			genre: filters.genre,
			year: filters.year,
			minRating: filters.minRating,
			sortBy: filters.sortBy
		});
		return {
			items: movieResult.items,
			total: movieResult.totalResults,
			page: movieResult.page,
			pageSize: 12
		};
	}
	if (filters.mediaType === "tv") {
		const tvResult = await getPaginatedTVShows({
			page: filters.page || 1,
			query: filters.query,
			genre: filters.genre,
			year: filters.year,
			minRating: filters.minRating,
			sortBy: filters.sortBy
		});
		return {
			items: tvResult.items,
			total: tvResult.totalResults,
			page: tvResult.page,
			pageSize: 20
		};
	}
	let movieItems = [];
	if (filters.query && (filters.mediaType === "all" || !filters.mediaType)) try {
		movieItems = (await getPaginatedMovies({
			query: filters.query,
			genre: filters.genre,
			year: filters.year,
			minRating: filters.minRating,
			page: 1
		})).items;
	} catch {}
	else if (!filters.mediaType || filters.mediaType === "all") movieItems = allMedia.filter((m) => m.mediaType === "movie");
	let nonMovieMedia = allMedia.filter((m) => m.mediaType !== "movie");
	if (filters.mediaType && filters.mediaType !== "all") nonMovieMedia = nonMovieMedia.filter((m) => m.mediaType === filters.mediaType);
	if (filters.query) {
		const q = filters.query.toLowerCase();
		nonMovieMedia = nonMovieMedia.filter((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.genres.some((g) => g.name.toLowerCase().includes(q)));
	}
	if (filters.genre) nonMovieMedia = nonMovieMedia.filter((m) => m.genres.some((g) => g.slug === filters.genre));
	if (filters.year) nonMovieMedia = nonMovieMedia.filter((m) => m.year === filters.year);
	if (filters.minRating) nonMovieMedia = nonMovieMedia.filter((m) => m.rating >= filters.minRating);
	let animeItems = [];
	if (filters.query && (filters.mediaType === "all" || filters.mediaType === "anime" || !filters.mediaType)) try {
		let animeRes;
		if (typeof window !== "undefined") {
			const controller = new AbortController();
			const tid = setTimeout(() => controller.abort(), 3500);
			try {
				const res = await fetch(`/api/anime/search?query=${encodeURIComponent(filters.query)}&page=${filters.page || 1}`, { signal: controller.signal });
				clearTimeout(tid);
				if (res.ok) animeRes = await res.json();
			} catch {
				clearTimeout(tid);
			}
		} else {
			const { searchAnime } = await import("./animeService_BLRbnvFE.mjs").then((n) => n.t);
			animeRes = await searchAnime(filters.query, filters.page || 1);
		}
		if (animeRes && animeRes.results) {
			animeItems = (animeRes.results || []).map((item) => ({
				id: item.id,
				title: item.title,
				posterUrl: item.image,
				backdropUrl: item.image,
				description: "",
				mediaType: "anime",
				year: item.releaseDate ? parseInt(item.releaseDate, 10) || 2024 : 2024,
				rating: item.rating ? Number(item.rating) : 8.5,
				genres: [],
				badges: ["HD", item.subOrDub ? item.subOrDub.toUpperCase() : "SUB"]
			}));
			if (filters.mediaType === "anime") return {
				items: animeItems,
				total: animeItems.length,
				page: animeRes.currentPage || 1,
				pageSize: 12
			};
		}
	} catch {}
	const seen = /* @__PURE__ */ new Set();
	const combined = [];
	for (const item of [
		...movieItems,
		...animeItems,
		...nonMovieMedia
	]) if (!seen.has(item.id)) {
		seen.add(item.id);
		combined.push(item);
	}
	switch (filters.sortBy) {
		case "rating":
			combined.sort((a, b) => b.rating - a.rating);
			break;
		case "latest":
			combined.sort((a, b) => b.year - a.year);
			break;
		case "oldest":
			combined.sort((a, b) => a.year - b.year);
			break;
		case "alphabetical":
			combined.sort((a, b) => a.title.localeCompare(b.title));
			break;
		default: combined.sort((a, b) => b.rating - a.rating);
	}
	return {
		items: combined,
		total: combined.length,
		page: 1,
		pageSize: combined.length
	};
}
async function getRecommendations(mediaId) {
	const item = getMediaById(mediaId);
	if (!item) return [];
	const genreSlugs = new Set(item.genres.map((g) => g.slug));
	return allMedia.filter((m) => m.id !== mediaId).map((m) => ({
		item: m,
		score: m.genres.filter((g) => genreSlugs.has(g.slug)).length
	})).sort((a, b) => b.score - a.score).slice(0, 8).map((x) => x.item);
}
async function getGenres() {
	return genres;
}
async function getPaginatedMovies(options = {}) {
	if (typeof window !== "undefined") {
		const params = new URLSearchParams();
		if (options.page) params.set("page", String(options.page));
		if (options.query) params.set("query", options.query);
		if (options.genre) params.set("genre", options.genre);
		if (options.year) params.set("year", String(options.year));
		if (options.minRating) params.set("minRating", String(options.minRating));
		if (options.sortBy) params.set("sortBy", options.sortBy);
		try {
			const res = await fetch(`/api/movies?${params.toString()}`);
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("Failed to fetch /api/movies from client:", err);
		}
	}
	return tmdbProvider.fetchMovies(options);
}
async function getPaginatedTVShows(options = {}) {
	if (typeof window !== "undefined") {
		const params = new URLSearchParams();
		if (options.page) params.set("page", String(options.page));
		if (options.query) params.set("query", options.query);
		if (options.genre) params.set("genre", options.genre);
		if (options.year) params.set("year", String(options.year));
		if (options.minRating) params.set("minRating", String(options.minRating));
		if (options.sortBy) params.set("sortBy", options.sortBy);
		try {
			const res = await fetch(`/api/tv?${params.toString()}`);
			if (res.ok) return await res.json();
		} catch (err) {
			console.warn("Failed to fetch /api/tv from client:", err);
		}
	}
	return tmdbTvProvider.fetchTVShows(options);
}
//#endregion
export { getGenres as a, getPaginatedMovies as c, getSeasons as d, getTVDetails as f, searchMedia as h, getFeatured as i, getPaginatedTVShows as l, getTrending as m, getDetails as n, getMovieDetails as o, getTopRated as p, getEpisodes as r, getNewReleases as s, getByGenre as t, getRecommendations as u };
