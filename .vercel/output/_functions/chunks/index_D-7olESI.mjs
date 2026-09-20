import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as tmdbTvProvider } from "./tmdbTv_Dp8B1juT.mjs";
//#region src/pages/api/tv/index.ts
var tv_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ url }) => {
	const page = parseInt(url.searchParams.get("page") || "1", 10);
	const query = url.searchParams.get("query") || void 0;
	const genre = url.searchParams.get("genre") || void 0;
	const yearParam = url.searchParams.get("year");
	const year = yearParam ? parseInt(yearParam, 10) : void 0;
	const ratingParam = url.searchParams.get("minRating");
	const minRating = ratingParam ? parseFloat(ratingParam) : void 0;
	const sortBy = url.searchParams.get("sortBy") || void 0;
	try {
		const result = await tmdbTvProvider.fetchTVShows({
			page,
			query,
			genre,
			year,
			minRating,
			sortBy
		});
		return new Response(JSON.stringify(result), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-cache, no-store, must-revalidate",
				"Pragma": "no-cache",
				"Expires": "0"
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: error instanceof Error ? error.message : "Failed to fetch TV shows",
			items: [],
			page: 1,
			totalPages: 1,
			totalResults: 0
		}), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-cache, no-store, must-revalidate"
			}
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/tv/index@_@ts
var page = () => tv_exports;
//#endregion
export { page };
