import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, u as renderTemplate, x as createAstro } from "./server_BnDeESLH.mjs";
import { t as createComponent } from "./compiler_D971p3oz.mjs";
import { t as $$Layout } from "./Layout_MLozyCk8.mjs";
import { t as AppShell } from "./AppShell_DRh1jUSc.mjs";
import { n as getDetails } from "./mediaService_j-ke5bX4.mjs";
import { t as MediaDetail } from "./MediaDetail_CTxk_dD3.mjs";
//#region src/pages/tv/[id].astro
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
	if (!id) return Astro.redirect("/tv");
	const item = await getDetails(id, "tv");
	if (!item) return Astro.redirect("/tv");
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${item.title} — Stellarix`,
		"description": item.description
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AppShell", AppShell, {
		"client:load": true,
		"currentPath": `/tv/${item.id}`,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/AppShell.tsx",
		"client:component-export": "default"
	})}${renderComponent($$result, "MediaDetail", MediaDetail, {
		"client:load": true,
		"item": item,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/MediaDetail/MediaDetail.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/tv/[id].astro", void 0);
var $$file = "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/tv/[id].astro";
var $$url = "/tv/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/tv/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
