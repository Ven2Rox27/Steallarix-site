import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as tmdbTvProvider } from "./tmdbTv_Dp8B1juT.mjs";
//#region src/pages/api/tv/[id].ts
var _id__exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ params }) => {
	const id = params.id;
	if (!id) return new Response(JSON.stringify({ error: "TV Show ID is required" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const show = await tmdbTvProvider.fetchTVShowDetails(id);
		if (!show) return new Response(JSON.stringify({ error: "TV Show not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify(show), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=300, s-maxage=600"
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Failed to fetch TV show details" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/tv/[id]@_@ts
var page = () => _id__exports;
//#endregion
export { page };
