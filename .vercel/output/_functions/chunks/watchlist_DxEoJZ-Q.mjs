import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, u as renderTemplate } from "./server_BnDeESLH.mjs";
import { t as createComponent } from "./compiler_D971p3oz.mjs";
import { t as $$Layout } from "./Layout_MLozyCk8.mjs";
import { n as Badge, t as Button } from "./Button_Bg0pP7Dn.mjs";
import { t as AppShell } from "./AppShell_DRh1jUSc.mjs";
import { t as useWatchlistStore } from "./watchlistStore_D17gYysV.mjs";
import { Bookmark, Play, Star, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/Watchlist/WatchlistView.tsx
function WatchlistView() {
	const { items, removeItem } = useWatchlistStore();
	if (items.length === 0) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen pt-24 pb-20",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl sm:text-3xl font-bold tracking-tight mb-8",
				children: "My Watchlist"
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center gap-4 py-20",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "h-20 w-20 flex items-center justify-center rounded-full bg-white/[0.03] border border-border",
						children: /* @__PURE__ */ jsx(Bookmark, { className: "h-8 w-8 text-text-faint" })
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-text-muted text-lg font-medium",
						children: "Your watchlist is empty"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-text-faint text-sm text-center max-w-sm",
						children: "Browse movies, anime, and TV shows and add them to your watchlist to keep track of what you want to watch."
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "secondary",
						size: "md",
						href: "/browse",
						children: "Browse Content"
					})
				]
			})]
		})
	});
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen pt-24 pb-20",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-8",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl sm:text-3xl font-bold tracking-tight",
					children: "My Watchlist"
				}), /* @__PURE__ */ jsxs("span", {
					className: "text-sm text-text-muted",
					children: [
						items.length,
						" item",
						items.length !== 1 ? "s" : ""
					]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6",
				children: items.map((item) => {
					const detailUrl = item.mediaType === "movie" ? `/movie/${item.mediaId}` : `/${item.mediaType}/${item.mediaId}`;
					return /* @__PURE__ */ jsxs("div", {
						className: "group relative",
						children: [/* @__PURE__ */ jsx("a", {
							href: detailUrl,
							className: "block",
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative aspect-[2/3] rounded-xl overflow-hidden bg-card border border-border-subtle group-hover:border-border-strong transition-all duration-300 group-hover:scale-[1.03]",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: item.posterUrl,
										alt: item.title,
										loading: "lazy",
										className: "w-full h-full object-cover"
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
									item.rating && item.rating > 0 && /* @__PURE__ */ jsx("div", {
										className: "absolute top-2 left-2",
										children: /* @__PURE__ */ jsxs(Badge, {
											variant: "rating",
											children: [/* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-current" }), item.rating.toFixed(1)]
										})
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-2 right-2",
										children: /* @__PURE__ */ jsx(Badge, {
											variant: "type",
											className: "text-[9px]",
											children: item.mediaType
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300",
										children: [/* @__PURE__ */ jsx("button", {
											className: "flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors",
											"aria-label": `Play ${item.title}`,
											onClick: (e) => {
												e.preventDefault();
												window.location.href = item.mediaType === "movie" ? `/watch/${item.mediaId}` : detailUrl;
											},
											children: /* @__PURE__ */ jsx(Play, { className: "h-3.5 w-3.5 fill-current ml-0.5" })
										}), /* @__PURE__ */ jsx("button", {
											className: "flex h-8 w-8 items-center justify-center rounded-full bg-error/20 border border-error/30 text-error hover:bg-error/30 transition-colors",
											"aria-label": `Remove ${item.title} from watchlist`,
											onClick: (e) => {
												e.preventDefault();
												removeItem(item.mediaId);
											},
											children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
										})]
									})
								]
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-2 px-0.5",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-medium text-text-primary truncate",
								children: /* @__PURE__ */ jsx("a", {
									href: detailUrl,
									className: "hover:text-accent transition-colors",
									children: item.title
								})
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-text-muted mt-0.5",
								children: [
									item.year && item.year > 0 ? item.year : "",
									" ",
									item.genres && item.genres.length > 0 && /* @__PURE__ */ jsxs("span", { children: ["· ", item.genres.slice(0, 2).map((g) => g.name).join(", ")] })
								]
							})]
						})]
					}, item.mediaId);
				})
			})]
		})
	});
}
//#endregion
//#region src/pages/watchlist.astro
var watchlist_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Watchlist,
	file: () => $$file,
	url: () => $$url
});
var $$Watchlist = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Watchlist — Stellarix" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AppShell", AppShell, {
		"client:load": true,
		"currentPath": "/watchlist",
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/AppShell.tsx",
		"client:component-export": "default"
	})}${renderComponent($$result, "WatchlistView", WatchlistView, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/Watchlist/WatchlistView.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/watchlist.astro", void 0);
var $$file = "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/watchlist.astro";
var $$url = "/watchlist";
//#endregion
//#region \0virtual:astro:page:src/pages/watchlist@_@astro
var page = () => watchlist_exports;
//#endregion
export { page };
