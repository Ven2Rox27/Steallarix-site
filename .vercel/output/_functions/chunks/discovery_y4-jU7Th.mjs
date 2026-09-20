import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { r as getAnimeDiscoverySections } from "./animeService_BLRbnvFE.mjs";
//#region src/pages/api/anime/discovery.ts
var discovery_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	try {
		const data = await getAnimeDiscoverySections();
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=300, stale-while-revalidate=600"
			}
		});
	} catch (error) {
		console.error("API /api/anime/discovery error:", error);
		return new Response(JSON.stringify({
			trending: [],
			popular: [],
			recent: [],
			error: error?.message || "Failed to load discovery sections."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/anime/discovery@_@ts
var page = () => discovery_exports;
//#endregion
export { page };
