import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as resolveAnimeTmdbId } from "./animeTmdbResolver_BHDpC3rB.mjs";
import { n as fetchAniList } from "./client_DmqOfHh-.mjs";
/**
* Paginated Anime Discovery / Filter / Search Query
*/
var ANIME_PAGE_QUERY = `
  query (
    $page: Int
    $perPage: Int
    $search: String
    $sort: [MediaSort]
    $genre: [String]
    $tag: [String]
    $status: MediaStatus
    $format: MediaFormat
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
        perPage
      }
      media(
        type: ANIME
        isAdult: false
        search: $search
        sort: $sort
        genre_in: $genre
        tag_in: $tag
        status: $status
        format: $format
      ) {
        
  id
  idMal
  title {
    romaji
    english
    native
    userPreferred
  }
  coverImage {
    large
    extraLarge
    medium
    color
  }
  bannerImage
  description
  genres
  tags {
    name
    rank
  }
  format
  status
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  season
  seasonYear
  episodes
  duration
  averageScore
  popularity
  nextAiringEpisode {
    episode
    airingAt
  }
  isAdult

      }
    }
  }
`;
/**
* Detailed Anime Metadata Query (Single Media by AniList ID)
*/
var ANIME_DETAILS_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      idMal
      title {
        romaji
        english
        native
        userPreferred
      }
      coverImage {
        large
        extraLarge
        medium
        color
      }
      bannerImage
      description
      genres
      tags {
        name
        rank
        isMediaSpoiler
      }
      format
      status
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      season
      seasonYear
      episodes
      duration
      averageScore
      popularity
      nextAiringEpisode {
        episode
        airingAt
      }
      isAdult
    }
  }
`;
//#endregion
//#region src/lib/api/anime/animeService.ts
var animeService_exports = /* @__PURE__ */ __exportAll({
	getAnimeByCategory: () => getAnimeByCategory,
	getAnimeDiscoverySections: () => getAnimeDiscoverySections,
	getAnimeInfo: () => getAnimeInfo,
	getPopularAnime: () => getPopularAnime,
	getRecentlyAddedAnime: () => getRecentlyAddedAnime,
	getTrendingAnime: () => getTrendingAnime,
	mapAniListMediaToSearchResult: () => mapAniListMediaToSearchResult,
	searchAnime: () => searchAnime
});
/**
* Maps an AniList media item to the universal AnimeSearchResultItem interface.
*/
function mapAniListMediaToSearchResult(media) {
	const title = media.title?.english || media.title?.romaji || media.title?.userPreferred || "Anime Title";
	const poster = media.coverImage?.extraLarge || media.coverImage?.large || media.coverImage?.medium || "";
	const releaseYear = media.seasonYear ? String(media.seasonYear) : media.startDate?.year ? String(media.startDate.year) : void 0;
	const rawFormat = media.format ? String(media.format).toUpperCase() : "TV";
	const formatLabel = rawFormat === "MOVIE" ? "Movie" : rawFormat === "TV_SHORT" ? "TV" : rawFormat;
	let statusLabel = "Ongoing";
	if (media.status === "FINISHED") statusLabel = "Completed";
	else if (media.status === "RELEASING") statusLabel = "Airing";
	else if (media.status === "NOT_YET_RELEASED") statusLabel = "Upcoming";
	const ratingScore = media.averageScore ? Math.round(media.averageScore / 10 * 10) / 10 : void 0;
	return {
		id: String(media.id),
		title,
		nativeTitle: media.title?.native || void 0,
		image: poster,
		banner: media.bannerImage || void 0,
		releaseDate: releaseYear,
		subOrDub: "both",
		type: formatLabel,
		status: statusLabel,
		rating: ratingScore,
		genres: media.genres || [],
		episode: media.nextAiringEpisode?.episode ? media.nextAiringEpisode.episode - 1 : media.episodes || void 0
	};
}
/**
* Helper to strip HTML tags from AniList synopsis descriptions.
*/
function cleanSynopsis(raw) {
	if (!raw) return "No synopsis available.";
	return raw.replace(/<br\s*\/?>/gi, "\n").replace(/<i>(.*?)<\/i>/gi, "$1").replace(/<b>(.*?)<\/b>/gi, "$1").replace(/<[^>]*>?/gm, "").trim() || "No synopsis available.";
}
/**
* Searches the AniList catalog for Anime matching the user query.
*/
async function searchAnime(query, page = 1, perPage = 24) {
	const cleanQuery = (query || "").trim();
	if (!cleanQuery) return {
		currentPage: 1,
		hasNextPage: false,
		results: []
	};
	const pageNum = Math.max(1, Number(page) || 1);
	try {
		const data = await fetchAniList(ANIME_PAGE_QUERY, {
			page: pageNum,
			perPage,
			search: cleanQuery,
			sort: ["SEARCH_MATCH"]
		});
		const pageInfo = data?.Page?.pageInfo;
		const mediaList = Array.isArray(data?.Page?.media) ? data.Page.media : [];
		return {
			currentPage: pageInfo?.currentPage || pageNum,
			hasNextPage: Boolean(pageInfo?.hasNextPage),
			results: mediaList.map(mapAniListMediaToSearchResult)
		};
	} catch (err) {
		console.error(`[AniList Search] Failed to search for "${cleanQuery}":`, err.message);
		throw new Error(`Failed to search anime: ${err.message || "AniList query error"}`);
	}
}
/**
* Fetches Anime by Category / Genre with real AniList filters.
* Correctly maps 'Shonen' to AniList's tag system (`tag_in: ["Shounen"]`).
*/
async function getAnimeByCategory(category, page = 1, perPage = 18) {
	const pageNum = Math.max(1, Number(page) || 1);
	const cleanCat = (category || "All").trim();
	const lowerCat = cleanCat.toLowerCase();
	const variables = {
		page: pageNum,
		perPage,
		sort: ["POPULARITY_DESC"]
	};
	if (lowerCat === "shonen") variables.tag = ["Shounen"];
	else if (lowerCat !== "all") variables.genre = [cleanCat.charAt(0).toUpperCase() + cleanCat.slice(1)];
	try {
		const data = await fetchAniList(ANIME_PAGE_QUERY, variables);
		const pageInfo = data?.Page?.pageInfo;
		const mediaList = Array.isArray(data?.Page?.media) ? data.Page.media : [];
		return {
			category: cleanCat,
			currentPage: pageInfo?.currentPage || pageNum,
			hasNextPage: Boolean(pageInfo?.hasNextPage),
			results: mediaList.map(mapAniListMediaToSearchResult)
		};
	} catch (err) {
		console.error(`[AniList Category] Failed to fetch category "${cleanCat}":`, err.message);
		throw new Error(`Failed to fetch category ${cleanCat}: ${err.message || "AniList query error"}`);
	}
}
/**
* Retrieves detailed anime metadata by AniList ID.
* Resolves genuine TMDB ID for CineSRC playback integration.
*/
async function getAnimeInfo(id, seasonNumber = 1) {
	const clean = (id || "").trim();
	if (!clean) return null;
	const baseId = clean.replace(/-s\d+e\d+.*$/i, "").replace(/-s\d+.*$/i, "").trim() || clean;
	const targetSeason = Math.max(1, Number(seasonNumber) || 1);
	const numericId = parseInt(baseId, 10);
	try {
		let media = null;
		if (!isNaN(numericId) && numericId > 0) media = (await fetchAniList(ANIME_DETAILS_QUERY, { id: numericId }))?.Media || null;
		else media = (await fetchAniList(ANIME_PAGE_QUERY, {
			page: 1,
			perPage: 1,
			search: baseId,
			sort: ["SEARCH_MATCH"]
		}))?.Page?.media?.[0] || null;
		if (!media || !media.id) return null;
		const title = media.title?.english || media.title?.romaji || media.title?.userPreferred || "Anime Title";
		const poster = media.coverImage?.extraLarge || media.coverImage?.large || media.coverImage?.medium || "";
		const cover = media.bannerImage || media.coverImage?.extraLarge || media.coverImage?.large || poster;
		const isMovie = media.format === "MOVIE";
		const totalEpisodes = isMovie ? 1 : media.episodes || 12;
		const episodes = isMovie ? [{
			id: String(media.id),
			number: 1,
			title,
			image: cover,
			description: cleanSynopsis(media.description)
		}] : Array.from({ length: Math.min(totalEpisodes, 150) }, (_, i) => ({
			id: `${media.id}-s${targetSeason}e${i + 1}`,
			number: i + 1,
			seasonNumber: targetSeason,
			title: `Episode ${i + 1}`,
			image: cover
		}));
		const seasons = [{
			id: `s-${targetSeason}`,
			seasonNumber: targetSeason,
			title: `Season ${targetSeason}`,
			episodeCount: totalEpisodes
		}];
		const resolvedTmdb = await resolveAnimeTmdbId(title, isMovie ? "movie" : "tv");
		return {
			id: String(media.id),
			tmdbId: resolvedTmdb?.tmdbId ? String(resolvedTmdb.tmdbId) : void 0,
			title,
			otherName: media.title?.native || media.title?.romaji || void 0,
			image: poster,
			cover,
			description: cleanSynopsis(media.description),
			releaseDate: media.seasonYear ? String(media.seasonYear) : media.startDate?.year ? String(media.startDate.year) : void 0,
			genres: media.genres && media.genres.length > 0 ? media.genres : ["Anime"],
			type: isMovie ? "movie" : "tv",
			status: media.status === "FINISHED" ? "Completed" : "Ongoing",
			totalEpisodes,
			subOrDub: "both",
			seasons,
			episodes
		};
	} catch (err) {
		console.error(`[AniList Info] Failed to load anime ${clean}:`, err.message);
		throw new Error(`Failed to load anime info: ${err.message || "AniList query error"}`);
	}
}
/**
* Fetches real AniList Trending anime titles.
*/
async function getTrendingAnime(limit = 12) {
	try {
		return ((await fetchAniList(ANIME_PAGE_QUERY, {
			page: 1,
			perPage: limit,
			sort: ["TRENDING_DESC"]
		}))?.Page?.media || []).map(mapAniListMediaToSearchResult);
	} catch (err) {
		console.warn("[AniList] Failed to fetch trending anime:", err.message);
		return [];
	}
}
/**
* Fetches real AniList Popular anime titles.
*/
async function getPopularAnime(limit = 12) {
	try {
		return ((await fetchAniList(ANIME_PAGE_QUERY, {
			page: 1,
			perPage: limit,
			sort: ["POPULARITY_DESC"]
		}))?.Page?.media || []).map(mapAniListMediaToSearchResult);
	} catch (err) {
		console.warn("[AniList] Failed to fetch popular anime:", err.message);
		return [];
	}
}
/**
* Fetches real AniList Recently Added / Releasing anime titles.
*/
async function getRecentlyAddedAnime(limit = 12) {
	try {
		return ((await fetchAniList(ANIME_PAGE_QUERY, {
			page: 1,
			perPage: limit,
			status: "RELEASING",
			sort: ["POPULARITY_DESC"]
		}))?.Page?.media || []).map(mapAniListMediaToSearchResult);
	} catch (err) {
		console.warn("[AniList] Failed to fetch recent anime:", err.message);
		return [];
	}
}
/**
* Aggregates discovery sections for the Anime discovery hub.
* Loads live trending, popular, and recent anime items directly from AniList.
*/
async function getAnimeDiscoverySections() {
	const [trending, popular, recent] = await Promise.all([
		getTrendingAnime(12),
		getPopularAnime(12),
		getRecentlyAddedAnime(12)
	]);
	return {
		trending,
		popular,
		recent
	};
}
//#endregion
export { searchAnime as a, getAnimeInfo as i, getAnimeByCategory as n, getAnimeDiscoverySections as r, animeService_exports as t };
