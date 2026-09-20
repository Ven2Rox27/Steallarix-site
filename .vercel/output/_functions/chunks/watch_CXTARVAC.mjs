import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as animePlaybackService } from "./animePlaybackService_CLAxzLef.mjs";
//#region src/pages/api/anime/watch.ts
var watch_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url }) => {
	const episodeId = (url.searchParams.get("episodeId") || url.searchParams.get("id") || "").trim();
	if (!episodeId) return new Response(JSON.stringify({
		available: false,
		sources: [],
		error: "Missing episodeId parameter."
	}), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const data = await animePlaybackService.getEpisodeStream(episodeId);
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-cache, no-store, must-revalidate"
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({
			available: false,
			sources: [],
			error: error?.message || "Streaming service unavailable."
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/anime/watch@_@ts
var page = () => watch_exports;
//#endregion
export { page };
