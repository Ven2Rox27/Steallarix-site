import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, u as renderTemplate, x as createAstro } from "./server_BnDeESLH.mjs";
import { t as createComponent } from "./compiler_D971p3oz.mjs";
import { t as $$Layout } from "./Layout_MLozyCk8.mjs";
import { f as getTVDetails, n as getDetails, o as getMovieDetails } from "./mediaService_j-ke5bX4.mjs";
//#region src/pages/watch/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Id = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const { id } = Astro.params;
	if (!id) return Astro.redirect("/browse");
	const hasEpParam = Astro.url.searchParams.has("ep") || Astro.url.searchParams.has("s");
	let item = null;
	if (hasEpParam) item = await getTVDetails(id) || await getDetails(id, "tv") || await getMovieDetails(id) || await getDetails(id);
	else item = await getMovieDetails(id) || await getDetails(id) || await getTVDetails(id);
	if (!item) return Astro.redirect("/browse");
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `Watch ${item.title} — Stellarix`,
		"data-astro-cid-lqgx4fii": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "WatchPage", null, {
		"client:only": "react",
		"item": item,
		"data-astro-cid-lqgx4fii": true,
		"client:component-hydration": "only",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/WatchPage.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/watch/[id].astro", void 0);
var $$file = "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/watch/[id].astro";
var $$url = "/watch/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/watch/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
