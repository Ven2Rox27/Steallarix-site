import { t as resolveAnimeTmdbId } from "./animeTmdbResolver_BHDpC3rB.mjs";
//#region src/lib/api/anime/providers/cineSrc.ts
/**
* Builds the CineSRC embed URL for Anime movie streaming.
* Format: https://cinesrc.st/embed/movie/{tmdb_id}
*
* @param tmdbId TMDB ID of the anime movie
* @returns Complete embed URL for the anime movie
*/
function getAnimeMovieStreamUrl(tmdbId) {
	const cleanId = String(tmdbId).trim();
	if (!cleanId) return "";
	return `https://cinesrc.st/embed/movie/${cleanId}`;
}
/**
* Builds the CineSRC embed URL for Anime TV series / episodic anime streaming.
* Format: https://cinesrc.st/embed/tv/{tmdb_id}?s={season}&e={episode}
*
* @param tmdbId TMDB ID of the anime series
* @param season Season number (1-based, defaults to 1)
* @param episode Episode number (1-based, defaults to 1)
* @returns Complete embed URL for the specified anime episode
*/
function getAnimeTvStreamUrl(tmdbId, season = 1, episode = 1) {
	const cleanId = String(tmdbId).trim();
	if (!cleanId) return "";
	return `https://cinesrc.st/embed/tv/${cleanId}?s=${Math.max(1, Number(season) || 1)}&e=${Math.max(1, Number(episode) || 1)}`;
}
/**
* Automatically selects and returns the correct CineSRC URL for any Anime title.
*
* If type is 'movie' (case-insensitive), returns:
*   https://cinesrc.st/embed/movie/${tmdbId}
*
* If type is 'tv', 'series', or episodic anime, returns:
*   https://cinesrc.st/embed/tv/${tmdbId}?s=${season}&e=${episode}
*/
function getAnimeStreamUrl({ tmdbId, type = "tv", season = 1, episode = 1 }) {
	const cleanId = String(tmdbId || "").trim();
	if (!cleanId) return "";
	if (String(type || "").toLowerCase() === "movie") return getAnimeMovieStreamUrl(cleanId);
	return getAnimeTvStreamUrl(cleanId, season, episode);
}
/**
* CineSRC Anime Playback Provider implementing IAnimePlaybackProvider.
* Provides CineSRC streaming embeds for Anime Watch page and playback service.
*/
var CineSrcAnimePlaybackProvider = class {
	name = "CineSRC";
	async getEpisodeStream(episodeId, fallbackSeason = 1, fallbackEpisode = 1) {
		if (!episodeId) return {
			available: false,
			sources: [],
			error: "Unable to load this episode."
		};
		let parsedSeason = fallbackSeason;
		let parsedEpisode = fallbackEpisode;
		let idTarget = episodeId;
		const pattern = /^(.*?)-s(\d+)e(\d+)$/i.exec(episodeId);
		if (pattern) {
			idTarget = pattern[1];
			parsedSeason = parseInt(pattern[2], 10) || 1;
			parsedEpisode = parseInt(pattern[3], 10) || 1;
		}
		const resolved = await resolveAnimeTmdbId(idTarget);
		if (!resolved?.tmdbId) return {
			available: false,
			sources: [],
			error: "Unable to load this episode."
		};
		const url = getAnimeStreamUrl({
			tmdbId: resolved.tmdbId,
			type: resolved.type,
			season: parsedSeason,
			episode: parsedEpisode
		});
		if (!url) return {
			available: false,
			sources: [],
			error: "Unable to load this episode."
		};
		return {
			available: true,
			sources: [{
				url,
				isEmbed: true,
				type: "embed",
				quality: "1080p",
				label: "CineSRC"
			}]
		};
	}
};
var cineSrcAnimePlaybackProvider = new CineSrcAnimePlaybackProvider();
//#endregion
export { getAnimeMovieStreamUrl as n, getAnimeTvStreamUrl as r, cineSrcAnimePlaybackProvider as t };
