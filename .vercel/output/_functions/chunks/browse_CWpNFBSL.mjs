import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, u as renderTemplate } from "./server_BnDeESLH.mjs";
import { t as createComponent } from "./compiler_D971p3oz.mjs";
import { t as $$Layout } from "./Layout_MLozyCk8.mjs";
import { t as AppShell } from "./AppShell_DRh1jUSc.mjs";
import { t as BrowseView } from "./BrowseView_cMOhKkqP.mjs";
//#region src/pages/browse.astro
var browse_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Browse,
	file: () => $$file,
	url: () => $$url
});
var $$Browse = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Browse — Stellarix" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AppShell", AppShell, {
		"client:load": true,
		"currentPath": "/browse",
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/AppShell.tsx",
		"client:component-export": "default"
	})}${renderComponent($$result, "BrowseView", BrowseView, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/Browse/BrowseView.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/browse.astro", void 0);
var $$file = "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/browse.astro";
var $$url = "/browse";
//#endregion
//#region \0virtual:astro:page:src/pages/browse@_@astro
var page = () => browse_exports;
//#endregion
export { page };
