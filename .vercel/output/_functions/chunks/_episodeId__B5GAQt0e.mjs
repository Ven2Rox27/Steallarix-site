import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, u as renderTemplate, x as createAstro } from "./server_BnDeESLH.mjs";
import { t as createComponent } from "./compiler_D971p3oz.mjs";
import { t as $$Layout } from "./Layout_MLozyCk8.mjs";
import { i as getAnimeInfo } from "./animeService_BLRbnvFE.mjs";
import { t as AnimeWatchPage } from "./AnimeWatchPage_CQwGRpZP.mjs";
//#region src/pages/anime/watch/[episodeId].astro
var _episodeId__exports = /* @__PURE__ */ __exportAll({
	default: () => $$EpisodeId,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$EpisodeId = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EpisodeId;
	const { episodeId } = Astro.params;
	if (!episodeId) return Astro.redirect("/anime");
	const animeIdParam = Astro.url.searchParams.get("animeId");
	const epNumParam = Astro.url.searchParams.get("epNum");
	const seasonParam = Astro.url.searchParams.get("s") || Astro.url.searchParams.get("season");
	let epNum = epNumParam ? parseInt(epNumParam, 10) : 1;
	let seasonNum = seasonParam ? parseInt(seasonParam, 10) : 1;
	let targetAnimeId = animeIdParam;
	if (!targetAnimeId && episodeId) {
		const match = /^(.*?)-s(\d+)e(\d+)$/i.exec(episodeId);
		if (match) {
			targetAnimeId = match[1];
			if (!seasonParam) seasonNum = parseInt(match[2], 10) || 1;
			if (!epNumParam) epNum = parseInt(match[3], 10) || 1;
		} else targetAnimeId = episodeId;
	}
	let anime = null;
	if (targetAnimeId) try {
		anime = await getAnimeInfo(targetAnimeId, seasonNum);
	} catch (e) {
		console.warn("Could not pre-fetch anime info:", e);
	}
	const isMovie = anime?.type?.toLowerCase() === "movie";
	const pageTitle = anime ? isMovie ? `Watch ${anime.title} — Stellarix` : `Watch ${anime.title} S${seasonNum} Ep ${epNum} — Stellarix` : `Watch Anime Episode ${epNum} — Stellarix`;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AnimeWatchPage", AnimeWatchPage, {
		"client:load": true,
		"episodeId": episodeId,
		"anime": anime,
		"animeId": targetAnimeId || anime?.id,
		"episodeNumber": epNum,
		"seasonNumber": seasonNum,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/Anime/AnimeWatchPage.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/anime/watch/[episodeId].astro", void 0);
var $$file = "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/anime/watch/[episodeId].astro";
var $$url = "/anime/watch/[episodeId]";
//#endregion
//#region \0virtual:astro:page:src/pages/anime/watch/[episodeId]@_@astro
var page = () => _episodeId__exports;
//#endregion
export { page };
