import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as tmdbProvider } from "./tmdb_CtPsKTJD.mjs";
//#region src/pages/api/movies/[id].ts
var _id__exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ params }) => {
	const id = params.id;
	if (!id) return new Response(JSON.stringify({ error: "Movie ID is required" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const movie = await tmdbProvider.fetchMovieDetails(id);
		if (!movie) return new Response(JSON.stringify({ error: "Movie not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify(movie), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=300, s-maxage=600"
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Failed to fetch movie details" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/movies/[id]@_@ts
var page = () => _id__exports;
//#endregion
export { page };
