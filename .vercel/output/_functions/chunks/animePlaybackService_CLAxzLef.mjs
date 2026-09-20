import { t as cineSrcAnimePlaybackProvider } from "./cineSrc_BRB7n-GD.mjs";
//#region src/lib/api/anime/providers/animePlaybackService.ts
var AnimePlaybackService = class {
	activeProvider;
	constructor(provider = cineSrcAnimePlaybackProvider) {
		this.activeProvider = provider;
	}
	setProvider(provider) {
		this.activeProvider = provider;
	}
	getProviderName() {
		return this.activeProvider.name;
	}
	/**
	* Resolves playback stream sources for the selected episode ID.
	* UI components call this method rather than constructing provider URLs directly.
	*/
	async getEpisodeStream(episodeId) {
		return this.activeProvider.getEpisodeStream(episodeId);
	}
};
var animePlaybackService = new AnimePlaybackService();
//#endregion
export { animePlaybackService as t };
