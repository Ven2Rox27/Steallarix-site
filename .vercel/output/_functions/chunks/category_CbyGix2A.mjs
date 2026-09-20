import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as getAnimeByCategory } from "./animeService_BLRbnvFE.mjs";
//#region src/pages/api/anime/category.ts
var category_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async ({ url }) => {
	const genreParam = (url.searchParams.get("genre") || url.searchParams.get("category") || url.searchParams.get("tag") || "All").trim();
	const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
	try {
		const data = await getAnimeByCategory(genreParam, page);
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=180, stale-while-revalidate=300"
			}
		});
	} catch (error) {
		console.error(`[API /api/anime/category] Error for "${genreParam}":`, error);
		return new Response(JSON.stringify({
			category: genreParam,
			currentPage: page,
			hasNextPage: false,
			results: [],
			error: error?.message || "Failed to fetch category anime."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/anime/category@_@ts
var page = () => category_exports;
//#endregion
export { page };
