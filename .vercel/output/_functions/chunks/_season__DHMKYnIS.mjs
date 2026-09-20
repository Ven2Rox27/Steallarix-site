import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as tmdbTvProvider } from "./tmdbTv_Dp8B1juT.mjs";
//#region src/pages/api/tv/[id]/season/[season].ts
var _season__exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ params }) => {
	const id = params.id;
	const seasonParam = params.season;
	if (!id || !seasonParam) return new Response(JSON.stringify({ error: "TV Show ID and Season number are required" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	const seasonNumber = parseInt(seasonParam, 10);
	if (isNaN(seasonNumber)) return new Response(JSON.stringify({ error: "Invalid season number" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const episodes = await tmdbTvProvider.fetchTVSeasonEpisodes(id, seasonNumber);
		return new Response(JSON.stringify({ episodes }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=300, s-maxage=600"
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: error instanceof Error ? error.message : "Failed to fetch episodes",
			episodes: []
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/tv/[id]/season/[season]@_@ts
var page = () => _season__exports;
//#endregion
export { page };
