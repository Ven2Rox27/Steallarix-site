import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as tmdbProvider } from "./tmdb_CtPsKTJD.mjs";
//#region src/pages/api/movies/index.ts
var movies_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
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
		const result = await tmdbProvider.fetchMovies({
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
				"Cache-Control": "public, max-age=60, s-maxage=300"
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: error instanceof Error ? error.message : "Failed to fetch movies",
			items: [],
			page: 1,
			totalPages: 1,
			totalResults: 0
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/movies/index@_@ts
var page = () => movies_exports;
//#endregion
export { page };
