import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, u as renderTemplate } from "./server_BnDeESLH.mjs";
import { t as createComponent } from "./compiler_D971p3oz.mjs";
import { t as $$Layout } from "./Layout_MLozyCk8.mjs";
import { n as Badge, r as cn, t as Button } from "./Button_Bg0pP7Dn.mjs";
import { t as AppShell } from "./AppShell_DRh1jUSc.mjs";
import { i as featuredMedia } from "./tmdb_CtPsKTJD.mjs";
import { i as getFeatured, m as getTrending, p as getTopRated, s as getNewReleases, t as getByGenre } from "./mediaService_j-ke5bX4.mjs";
import { t as useWatchlistStore } from "./watchlistStore_D17gYysV.mjs";
import { t as MediaRail } from "./MediaRail_DrbBZXQ7.mjs";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Clock, Info, Play, Plus, Star } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { create } from "zustand";
import { persist } from "zustand/middleware";
//#region src/components/Hero/Hero.tsx
function Hero({ items, autoRotateInterval = 6e3 }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const { isInWatchlist, toggleItem } = useWatchlistStore();
	const current = items[activeIndex];
	if (!current) return null;
	const inWatchlist = isInWatchlist(current.id);
	const goTo = useCallback((index) => {
		setActiveIndex((index + items.length) % items.length);
	}, [items.length]);
	const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
	const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
	useEffect(() => {
		if (isPaused || items.length <= 1) return;
		const timer = setInterval(goNext, autoRotateInterval);
		return () => clearInterval(timer);
	}, [
		isPaused,
		goNext,
		autoRotateInterval,
		items.length
	]);
	return /* @__PURE__ */ jsxs("section", {
		className: "relative w-full h-[85vh] min-h-[500px] max-h-[900px] overflow-hidden",
		onMouseEnter: () => setIsPaused(true),
		onMouseLeave: () => setIsPaused(false),
		children: [
			/* @__PURE__ */ jsx(AnimatePresence, {
				mode: "wait",
				children: /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						scale: 1.05
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					exit: { opacity: 0 },
					transition: {
						duration: .8,
						ease: "easeOut"
					},
					className: "absolute inset-0",
					children: [
						/* @__PURE__ */ jsx("img", {
							src: current.backdropUrl,
							alt: "",
							className: "absolute inset-0 w-full h-full object-cover",
							loading: "eager"
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-base via-base/70 to-transparent" }),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-base via-base/30 to-transparent" }),
						/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-base to-transparent" }),
						/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-accent/[0.03] blur-[120px] rounded-full" })
					]
				}, current.id)
			}),
			/* @__PURE__ */ jsx("div", {
				className: "relative z-10 h-full flex items-end pb-20 sm:pb-24 lg:items-center lg:pb-0",
				children: /* @__PURE__ */ jsx("div", {
					className: "mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ jsx(AnimatePresence, {
						mode: "wait",
						children: /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: {
								opacity: 0,
								y: -10
							},
							transition: {
								duration: .5,
								ease: "easeOut"
							},
							className: "max-w-2xl",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-2 mb-4",
									children: [
										/* @__PURE__ */ jsx(Badge, {
											variant: "type",
											children: current.mediaType
										}),
										(current.badges || []).map((badge) => /* @__PURE__ */ jsx(Badge, {
											variant: "quality",
											children: badge
										}, badge)),
										current.audioType && current.audioType !== "both" && /* @__PURE__ */ jsx(Badge, {
											variant: "accent",
											children: current.audioType === "sub" ? "SUB" : "DUB"
										}),
										current.audioType === "both" && /* @__PURE__ */ jsx(Badge, {
											variant: "accent",
											children: "SUB & DUB"
										})
									]
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1] mb-4",
									children: current.title
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-4",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1 text-accent-amber",
											children: [/* @__PURE__ */ jsx(Star, { className: "h-4 w-4 fill-current" }), typeof current.rating === "number" && !isNaN(current.rating) ? current.rating.toFixed(1) : "8.5"]
										}),
										/* @__PURE__ */ jsx("span", { children: current.year }),
										current.duration && /* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5" }), current.mediaType === "movie" ? `${Math.floor(current.duration / 60)}h ${current.duration % 60}m` : `${current.duration} min/ep`]
										}),
										(current.genres || []).filter(Boolean).slice(0, 3).map((genre, idx) => {
											const gName = typeof genre === "string" ? genre : genre?.name || "";
											const gKey = typeof genre === "object" && genre?.id ? genre.id : `${current.id}-g-${idx}`;
											if (!gName) return null;
											return /* @__PURE__ */ jsx("span", {
												className: "hidden sm:inline text-text-muted",
												children: gName
											}, gKey);
										})
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm sm:text-base text-text-secondary leading-relaxed mb-6 line-clamp-3 max-w-xl",
									children: current.description
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-3",
									children: [
										/* @__PURE__ */ jsxs(Button, {
											size: "lg",
											href: current.mediaType === "movie" ? `/watch/${current.id}` : `/${current.mediaType}/${current.id}`,
											children: [/* @__PURE__ */ jsx(Play, { className: "h-5 w-5 fill-current" }), current.mediaType === "movie" ? "Watch Now" : "Start Watching"]
										}),
										/* @__PURE__ */ jsxs(Button, {
											variant: "secondary",
											size: "lg",
											onClick: () => toggleItem(current),
											children: [inWatchlist ? /* @__PURE__ */ jsx(Check, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Plus, { className: "h-5 w-5" }), inWatchlist ? "In Watchlist" : "Add to List"]
										}),
										/* @__PURE__ */ jsxs(Button, {
											variant: "ghost",
											size: "lg",
											href: `/${current.mediaType}/${current.id}`,
											className: "hidden sm:inline-flex",
											children: [/* @__PURE__ */ jsx(Info, { className: "h-5 w-5" }), "More Info"]
										})
									]
								})
							]
						}, current.id)
					})
				})
			}),
			items.length > 1 && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
				onClick: goPrev,
				className: "absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-black/50 transition-all hidden lg:flex",
				"aria-label": "Previous",
				children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-5 w-5" })
			}), /* @__PURE__ */ jsx("button", {
				onClick: goNext,
				className: "absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-black/50 transition-all hidden lg:flex",
				"aria-label": "Next",
				children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5" })
			})] }),
			items.length > 1 && /* @__PURE__ */ jsx("div", {
				className: "absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2",
				children: items.map((_, i) => /* @__PURE__ */ jsx("button", {
					onClick: () => goTo(i),
					className: cn("h-1.5 rounded-full transition-all duration-300", i === activeIndex ? "w-8 bg-accent" : "w-1.5 bg-white/30 hover:bg-white/50"),
					"aria-label": `Go to slide ${i + 1}`
				}, i))
			})
		]
	});
}
//#endregion
//#region src/stores/continueWatchingStore.ts
var useContinueWatchingStore = create()(persist((set, get) => ({
	items: [],
	updateProgress: (progress) => {
		set((state) => {
			const key = progress.episodeId ? `${progress.mediaId}-${progress.episodeId}` : progress.mediaId;
			const existing = state.items.findIndex((i) => {
				return (i.episodeId ? `${i.mediaId}-${i.episodeId}` : i.mediaId) === key;
			});
			const newItems = [...state.items];
			if (existing >= 0) newItems[existing] = {
				...progress,
				timestamp: Date.now()
			};
			else newItems.unshift({
				...progress,
				timestamp: Date.now()
			});
			return { items: newItems.slice(0, 20) };
		});
	},
	removeItem: (mediaId, episodeId) => {
		set((state) => ({ items: state.items.filter((i) => {
			if (episodeId) return !(i.mediaId === mediaId && i.episodeId === episodeId);
			return i.mediaId !== mediaId;
		}) }));
	},
	getProgress: (mediaId, episodeId) => {
		const items = get().items;
		if (episodeId) return items.find((i) => i.mediaId === mediaId && i.episodeId === episodeId) ?? null;
		return items.find((i) => i.mediaId === mediaId) ?? null;
	},
	clear: () => set({ items: [] })
}), { name: "stellarix-continue-watching" }));
//#endregion
//#region src/components/HomePage.tsx
function HomePage() {
	const [featured, setFeatured] = useState(() => featuredMedia || []);
	const [continueWatching, setContinueWatching] = useState([]);
	const [trendingAll, setTrendingAll] = useState([]);
	const [recentAnime, setRecentAnime] = useState([]);
	const [trendingMovies, setTrendingMovies] = useState([]);
	const [trendingTV, setTrendingTV] = useState([]);
	const [newReleases, setNewReleases] = useState([]);
	const [topRated, setTopRated] = useState([]);
	const [actionItems, setActionItems] = useState([]);
	const [sciFiItems, setSciFiItems] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const loadData = useCallback(async () => {
		if (typeof window !== "undefined") try {
			const rawStoreItems = useContinueWatchingStore.getState().items || [];
			const sanitized = rawStoreItems.filter((item) => {
				return !(!item.mediaId || item.mediaId.startsWith("ani-") || item.mediaId.startsWith("tv-") || item.title?.toLowerCase().includes("void breaker") || item.title?.toLowerCase().includes("the architect"));
			});
			if (sanitized.length !== rawStoreItems.length) useContinueWatchingStore.setState({ items: sanitized });
			setContinueWatching(sanitized);
		} catch (e) {
			console.warn("Failed to parse continue watching:", e);
		}
		try {
			const [featuredRes, trendingAllRes, trendingMoviesRes, trendingTVRes, newReleasesRes, topRatedRes, actionRes, sciFiRes, recentAnimeRes] = await Promise.allSettled([
				getFeatured(),
				getTrending("all"),
				getTrending("movie"),
				getTrending("tv"),
				getNewReleases(),
				getTopRated(),
				getByGenre("action"),
				getByGenre("sci-fi"),
				getTrending("anime")
			]);
			if (featuredRes.status === "fulfilled" && featuredRes.value.length > 0) setFeatured(featuredRes.value);
			if (trendingAllRes.status === "fulfilled") setTrendingAll(trendingAllRes.value);
			if (trendingMoviesRes.status === "fulfilled") setTrendingMovies(trendingMoviesRes.value);
			if (trendingTVRes.status === "fulfilled") setTrendingTV(trendingTVRes.value);
			if (newReleasesRes.status === "fulfilled") setNewReleases(newReleasesRes.value);
			if (topRatedRes.status === "fulfilled") setTopRated(topRatedRes.value);
			if (actionRes.status === "fulfilled") setActionItems(actionRes.value);
			if (sciFiRes.status === "fulfilled") setSciFiItems(sciFiRes.value);
			if (recentAnimeRes.status === "fulfilled") setRecentAnime(recentAnimeRes.value);
			setLoadError(false);
		} catch (err) {
			console.warn("Error loading homepage rails:", err);
			setLoadError(true);
		} finally {
			setLoaded(true);
		}
	}, []);
	useEffect(() => {
		let isMounted = true;
		const safetyTimer = setTimeout(() => {
			if (isMounted) setLoaded(true);
		}, 2500);
		const handleNavigation = () => {
			if (!isMounted) return;
			loadData();
		};
		handleNavigation();
		document.addEventListener("astro:page-load", handleNavigation);
		window.addEventListener("pageshow", handleNavigation);
		return () => {
			isMounted = false;
			clearTimeout(safetyTimer);
			document.removeEventListener("astro:page-load", handleNavigation);
			window.removeEventListener("pageshow", handleNavigation);
		};
	}, [loadData]);
	const progressMap = {};
	(continueWatching || []).forEach((p) => {
		if (p && p.mediaId) progressMap[p.mediaId] = p;
	});
	const cwMediaItems = (continueWatching || []).filter((p) => p && p.mediaId).map((p) => ({
		id: p.mediaId,
		title: p.title || "Untitled",
		posterUrl: p.posterUrl || "",
		backdropUrl: p.posterUrl || "",
		description: "",
		mediaType: p.mediaType || "movie",
		year: 0,
		rating: 0,
		genres: [],
		badges: []
	}));
	if (!loaded && featured.length === 0 && trendingAll.length === 0) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center gap-4",
			children: [/* @__PURE__ */ jsx("div", { className: "h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" }), /* @__PURE__ */ jsx("p", {
				className: "text-text-muted text-sm",
				children: "Loading content..."
			})]
		})
	});
	const hasAnyRail = cwMediaItems.length > 0 || recentAnime.length > 0 || trendingAll.length > 0 || trendingMovies.length > 0 || newReleases.length > 0 || trendingTV.length > 0 || topRated.length > 0 || actionItems.length > 0 || sciFiItems.length > 0;
	return /* @__PURE__ */ jsxs("main", { children: [featured.length > 0 && /* @__PURE__ */ jsx(Hero, { items: featured }), /* @__PURE__ */ jsxs("div", {
		className: "relative z-10 -mt-16 space-y-10 pb-20",
		children: [
			cwMediaItems.length > 0 && /* @__PURE__ */ jsx(MediaRail, {
				title: "Continue Watching",
				items: cwMediaItems,
				progressMap
			}),
			recentAnime.length > 0 && /* @__PURE__ */ jsx(MediaRail, {
				title: "Recently Added Anime",
				items: recentAnime,
				seeAllHref: "/anime"
			}),
			trendingAll.length > 0 && /* @__PURE__ */ jsx(MediaRail, {
				title: "Trending Now",
				items: trendingAll,
				seeAllHref: "/browse"
			}),
			trendingMovies.length > 0 && /* @__PURE__ */ jsx(MediaRail, {
				title: "Trending Movies",
				items: trendingMovies,
				seeAllHref: "/movies"
			}),
			newReleases.length > 0 && /* @__PURE__ */ jsx(MediaRail, {
				title: "New Releases",
				items: newReleases,
				seeAllHref: "/browse"
			}),
			trendingTV.length > 0 && /* @__PURE__ */ jsx(MediaRail, {
				title: "Trending TV Shows",
				items: trendingTV,
				seeAllHref: "/tv-shows"
			}),
			topRated.length > 0 && /* @__PURE__ */ jsx(MediaRail, {
				title: "Top Rated",
				items: topRated,
				seeAllHref: "/browse"
			}),
			actionItems.length > 0 && /* @__PURE__ */ jsx(MediaRail, {
				title: "Action & Adventure",
				items: actionItems
			}),
			sciFiItems.length > 0 && /* @__PURE__ */ jsx(MediaRail, {
				title: "Sci-Fi",
				items: sciFiItems
			}),
			loaded && !hasAnyRail && /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center justify-center py-20 gap-4",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-text-muted text-base font-medium",
					children: loadError ? "Unable to load content right now." : "No content available."
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => {
						setLoaded(false);
						loadData();
					},
					className: "px-5 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/80 transition-colors",
					children: "Retry"
				})]
			})
		]
	})] });
}
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Stellarix — Stream Movies, Anime & TV Shows" }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AppShell", AppShell, {
		"client:load": true,
		"currentPath": "/",
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/AppShell.tsx",
		"client:component-export": "default"
	})}${renderComponent($$result, "HomePage", HomePage, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/HomePage.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/index.astro", void 0);
var $$file = "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
