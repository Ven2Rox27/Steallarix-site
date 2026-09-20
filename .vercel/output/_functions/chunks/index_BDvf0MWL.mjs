import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, u as renderTemplate, x as createAstro } from "./server_BnDeESLH.mjs";
import { t as createComponent } from "./compiler_D971p3oz.mjs";
import { t as $$Layout } from "./Layout_MLozyCk8.mjs";
import { i as getAnimeInfo } from "./animeService_BLRbnvFE.mjs";
import { t as AnimeWatchPage } from "./AnimeWatchPage_CQwGRpZP.mjs";
//#region src/pages/watch/index.astro
var watch_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const episodeId = Astro.url.searchParams.get("episodeId");
	const animeId = Astro.url.searchParams.get("animeId");
	const epNumStr = Astro.url.searchParams.get("epNum");
	const epNum = epNumStr ? parseInt(epNumStr, 10) : 1;
	if (!episodeId) return Astro.redirect("/browse");
	let anime = null;
	if (animeId) try {
		anime = await getAnimeInfo(animeId);
	} catch (err) {
		console.warn("Could not load anime info for watch query:", err);
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": anime ? `Watch ${anime.title} Episode ${epNum} — Stellarix` : `Watch Episode ${epNum} — Stellarix`,
		"data-astro-cid-o3qoa2r7": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AnimeWatchPage", AnimeWatchPage, {
		"client:load": true,
		"episodeId": episodeId,
		"anime": anime,
		"episodeNumber": epNum,
		"data-astro-cid-o3qoa2r7": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/Anime/AnimeWatchPage.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/watch/index.astro", void 0);
var $$file = "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/watch/index.astro";
var $$url = "/watch";
//#endregion
//#region \0virtual:astro:page:src/pages/watch/index@_@astro
var page = () => watch_exports;
//#endregion
export { page };
