import { f as renderHead, p as addAttribute, s as renderSlot, u as renderTemplate, x as createAstro } from "./server_BnDeESLH.mjs";
import { t as createComponent } from "./compiler_D971p3oz.mjs";
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "Stellarix — Stream Movies, Anime & TV Shows", description = "Your premium destination for Movies, Anime, and TV Shows. Stream in 4K HDR with Sub & Dub support." } = Astro.props;
	return renderTemplate`<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="generator"${addAttribute(Astro.generator, "content")}><meta name="description"${addAttribute(description, "content")}><meta name="theme-color" content="#08080a"><title>${title}</title>${renderHead($$result)}</head><body class="bg-base text-text-primary min-h-screen antialiased">${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/layouts/Layout.astro", void 0);
//#endregion
export { $$Layout as t };
