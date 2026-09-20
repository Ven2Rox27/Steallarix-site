import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as getAnimeInfo } from "./animeService_BLRbnvFE.mjs";
//#region src/pages/api/anime/info.ts
var info_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url }) => {
	const id = (url.searchParams.get("id") || "").trim();
	const seasonParam = url.searchParams.get("season") || url.searchParams.get("s") || url.searchParams.get("episodePage");
	const season = seasonParam ? parseInt(seasonParam, 10) : 1;
	if (!id) return new Response(JSON.stringify({ error: "Missing anime ID parameter." }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const data = await getAnimeInfo(id, season);
		if (!data || !data.id) return new Response(JSON.stringify({ error: "Anime not found." }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-cache, no-store, must-revalidate"
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error?.message || "Failed to fetch anime information." }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/anime/info@_@ts
var page = () => info_exports;
//#endregion
export { page };
