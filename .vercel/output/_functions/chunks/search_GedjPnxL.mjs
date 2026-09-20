import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as searchAnime } from "./animeService_BLRbnvFE.mjs";
//#region src/pages/api/anime/search.ts
var search_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url }) => {
	const query = (url.searchParams.get("query") || url.searchParams.get("q") || "").trim();
	const page = parseInt(url.searchParams.get("page") || "1", 10) || 1;
	if (!query) return new Response(JSON.stringify({
		currentPage: page,
		hasNextPage: false,
		results: []
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const data = await searchAnime(query, page);
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-cache, no-store, must-revalidate"
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({
			currentPage: page,
			hasNextPage: false,
			results: [],
			error: error?.message || "Failed to search anime."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/anime/search@_@ts
var page = () => search_exports;
//#endregion
export { page };
