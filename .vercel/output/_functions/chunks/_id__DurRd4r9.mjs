import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, u as renderTemplate, x as createAstro } from "./server_BnDeESLH.mjs";
import { t as createComponent } from "./compiler_D971p3oz.mjs";
import { t as $$Layout } from "./Layout_MLozyCk8.mjs";
import { n as Badge, r as cn, t as Button } from "./Button_Bg0pP7Dn.mjs";
import { t as AppShell } from "./AppShell_DRh1jUSc.mjs";
import { i as getAnimeInfo } from "./animeService_BLRbnvFE.mjs";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Check, Film, Info, Loader2, Play, RefreshCw, Search, Share2, Tv } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/Anime/AnimeDetailPage.tsx
function AnimeDetailPage({ anime: initialAnime, animeId, loading = false, error = null }) {
	const [anime, setAnime] = useState(initialAnime || null);
	const [isLoading, setIsLoading] = useState(loading || !initialAnime && Boolean(animeId));
	const [fetchError, setFetchError] = useState(error);
	const [selectedRange, setSelectedRange] = useState(0);
	const [episodeSearch, setEpisodeSearch] = useState("");
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [copiedShare, setCopiedShare] = useState(false);
	const fetchDetails = useCallback(async (id) => {
		setIsLoading(true);
		setFetchError(null);
		try {
			const res = await fetch(`/api/anime/info?id=${encodeURIComponent(id)}`);
			if (!res.ok) throw new Error("This anime title is currently unavailable in the catalog.");
			const data = await res.json();
			if (data && data.id) {
				setAnime(data);
				setFetchError(null);
			} else setFetchError("This anime title is currently unavailable in the catalog.");
		} catch (err) {
			setFetchError(err?.message || "Failed to load anime info.");
		} finally {
			setIsLoading(false);
		}
	}, []);
	useEffect(() => {
		if (initialAnime) {
			setAnime(initialAnime);
			setIsLoading(false);
		} else if (animeId) fetchDetails(animeId);
		const handleNavigation = () => {
			const idToUse = animeId || (typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "");
			if (idToUse && idToUse !== "anime") fetchDetails(idToUse);
		};
		document.addEventListener("astro:page-load", handleNavigation);
		window.addEventListener("pageshow", handleNavigation);
		return () => {
			document.removeEventListener("astro:page-load", handleNavigation);
			window.removeEventListener("pageshow", handleNavigation);
		};
	}, [
		initialAnime,
		animeId,
		fetchDetails
	]);
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-base text-text-primary flex items-center justify-center",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center gap-4",
			children: [/* @__PURE__ */ jsx(Loader2, { className: "h-9 w-9 text-accent animate-spin" }), /* @__PURE__ */ jsx("p", {
				className: "text-text-muted text-sm font-medium",
				children: "Loading anime details..."
			})]
		})
	});
	if (!anime) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-base text-text-primary flex items-center justify-center p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md w-full p-8 bg-surface/80 backdrop-blur-md border border-border rounded-3xl text-center space-y-4 shadow-2xl",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted mx-auto",
					children: /* @__PURE__ */ jsx(Film, { className: "h-7 w-7 opacity-60 text-accent" })
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-bold text-white",
					children: "Anime Title Unavailable"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-xs text-text-muted leading-relaxed",
					children: fetchError || "This anime title is currently unavailable in the catalog or is scheduled for a future release."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-center gap-3 pt-3",
					children: [/* @__PURE__ */ jsx("a", {
						href: "/anime",
						children: /* @__PURE__ */ jsx(Button, {
							variant: "secondary",
							size: "sm",
							className: "px-5 py-2.5 rounded-xl text-xs font-medium cursor-pointer",
							children: "Back to Anime Hub"
						})
					}), /* @__PURE__ */ jsxs(Button, {
						variant: "primary",
						size: "sm",
						onClick: () => animeId && fetchDetails(animeId),
						className: "px-5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-md shadow-accent/20",
						children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Retry" })]
					})]
				})
			]
		})
	});
	const episodes = anime.episodes || [];
	const pageSize = 50;
	const rangeCount = Math.ceil(episodes.length / pageSize);
	const filteredEpisodes = episodeSearch.trim() ? episodes.filter((ep) => {
		const query = episodeSearch.trim().toLowerCase();
		return String(ep.number).includes(query) || ep.title && ep.title.toLowerCase().includes(query);
	}) : episodes;
	const displayedEpisodes = episodeSearch.trim() ? filteredEpisodes : episodes.length > pageSize ? episodes.slice(selectedRange * pageSize, (selectedRange + 1) * pageSize) : episodes;
	const isMovie = anime.type?.toLowerCase() === "movie";
	const firstEpisode = episodes[0];
	const watchUrl = isMovie ? `/anime/watch/${encodeURIComponent(anime.id)}?animeId=${encodeURIComponent(anime.id)}` : firstEpisode ? `/anime/watch/${encodeURIComponent(firstEpisode.id)}?animeId=${encodeURIComponent(anime.id)}&epNum=${firstEpisode.number}&s=${firstEpisode.seasonNumber || 1}` : `/anime/watch/${encodeURIComponent(anime.id)}?animeId=${encodeURIComponent(anime.id)}&epNum=1&s=1`;
	const handleShare = () => {
		if (typeof navigator !== "undefined" && navigator.clipboard) {
			navigator.clipboard.writeText(window.location.href);
			setCopiedShare(true);
			setTimeout(() => setCopiedShare(false), 2e3);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-base text-text-primary pb-24 select-none",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative w-full h-[360px] sm:h-[460px] md:h-[540px] overflow-hidden",
			children: [
				anime.cover || anime.image ? /* @__PURE__ */ jsx("img", {
					src: anime.cover || anime.image,
					alt: anime.title,
					className: "w-full h-full object-cover object-top filter blur-xs opacity-35 scale-105"
				}) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-b from-surface/80 via-base to-base" }),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-base via-base/75 to-transparent" }),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-base via-base/50 to-transparent" }),
				/* @__PURE__ */ jsx("div", {
					className: "absolute top-20 left-4 sm:left-8 z-20",
					children: /* @__PURE__ */ jsxs("a", {
						href: "/anime",
						className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/70 hover:bg-surface border border-white/10 text-xs font-semibold text-white/90 hover:text-white backdrop-blur-md transition-all shadow-lg cursor-pointer",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Anime Hub" })]
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-52 sm:-mt-64 relative z-10",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col md:flex-row gap-8 lg:gap-12 items-start",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-48 sm:w-60 md:w-72 shrink-0 mx-auto md:mx-0",
					children: /* @__PURE__ */ jsxs("div", {
						className: "aspect-[2/3] rounded-3xl overflow-hidden bg-card border-2 border-white/15 shadow-2xl shadow-black/80 relative group",
						children: [anime.image ? /* @__PURE__ */ jsx("img", {
							src: anime.image,
							alt: anime.title,
							className: "w-full h-full object-cover"
						}) : /* @__PURE__ */ jsxs("div", {
							className: "w-full h-full flex flex-col items-center justify-center p-4 text-center bg-card text-text-muted",
							children: [/* @__PURE__ */ jsx(Film, { className: "h-10 w-10 mb-2 opacity-50" }), /* @__PURE__ */ jsx("span", {
								className: "text-xs",
								children: anime.title
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "absolute top-3 right-3",
							children: /* @__PURE__ */ jsx(Badge, {
								variant: "sub",
								size: "sm",
								children: anime.subOrDub ? anime.subOrDub.toUpperCase() : "SUB"
							})
						})]
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex-1 space-y-5 text-center md:text-left",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2.5",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent uppercase tracking-wider",
										children: anime.type || "TV Series"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10 uppercase",
										children: anime.status || "Finished Airing"
									}),
									anime.totalEpisodes > 0 && /* @__PURE__ */ jsxs("span", {
										className: "text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-surface/80 border border-border text-text-muted",
										children: [
											anime.totalEpisodes,
											" ",
											anime.totalEpisodes === 1 ? "Episode" : "Episodes"
										]
									})
								]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight",
								children: anime.title
							}),
							anime.otherName && /* @__PURE__ */ jsxs("p", {
								className: "text-xs sm:text-sm text-text-muted mt-1 font-medium italic",
								children: ["Also known as: ", anime.otherName]
							})
						] }),
						anime.genres && anime.genres.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap items-center justify-center md:justify-start gap-1.5",
							children: anime.genres.map((g) => /* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold px-3 py-1 rounded-full bg-surface/70 border border-border/80 text-text-secondary",
								children: g
							}, g))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-2",
							children: [
								/* @__PURE__ */ jsxs("a", {
									href: watchUrl,
									className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold transition-all shadow-xl shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
									children: [/* @__PURE__ */ jsx(Play, { className: "h-4 w-4 fill-white" }), /* @__PURE__ */ jsx("span", { children: firstEpisode ? `Watch Episode ${firstEpisode.number}` : "Watch Now" })]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setIsBookmarked((prev) => !prev),
									className: cn("inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-300 backdrop-blur-md cursor-pointer", isBookmarked ? "bg-accent/20 border-accent/50 text-accent" : "bg-surface/80 hover:bg-surface border-border text-white/90"),
									children: isBookmarked ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: "In Watchlist" })] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Bookmark, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Add to List" })] })
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleShare,
									className: "inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-border bg-surface/80 hover:bg-surface text-white/90 transition-all cursor-pointer",
									title: "Share this title",
									children: copiedShare ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
										className: "text-emerald-400 text-xs font-semibold",
										children: "Link Copied!"
									})] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
										className: "text-xs",
										children: "Share"
									})] })
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "pt-2 text-left",
							children: [/* @__PURE__ */ jsxs("h2", {
								className: "text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(Info, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Synopsis" })]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs sm:text-sm text-text-muted leading-relaxed max-w-3xl",
								children: anime.description || "No detailed description is currently available for this anime series."
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/40 text-left",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-text-muted uppercase tracking-wider block",
									children: "Released"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-white",
									children: anime.releaseDate || "N/A"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-text-muted uppercase tracking-wider block",
									children: "Format"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-white",
									children: anime.type || "TV"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-text-muted uppercase tracking-wider block",
									children: "Audio"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-white",
									children: anime.subOrDub?.toUpperCase() || "SUB"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-text-muted uppercase tracking-wider block",
									children: "Status"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-white",
									children: anime.status || "Finished"
								})] })
							]
						})
					]
				})]
			}), episodes.length > 0 && /* @__PURE__ */ jsxs("section", {
				className: "mt-16 pt-10 border-t border-border/50",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
						children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("h2", {
							className: "text-xl sm:text-2xl font-bold text-white flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx(Tv, { className: "h-5 w-5 text-accent" }),
								/* @__PURE__ */ jsx("span", { children: "Episodes" }),
								/* @__PURE__ */ jsxs("span", {
									className: "text-xs text-text-muted font-normal",
									children: [
										"(",
										episodes.length,
										" total)"
									]
								})
							]
						}) }), /* @__PURE__ */ jsxs("div", {
							className: "relative w-full sm:w-64",
							children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" }), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: episodeSearch,
								onChange: (e) => setEpisodeSearch(e.target.value),
								placeholder: "Search ep (e.g. 1, 12)...",
								className: "w-full h-9 pl-8 pr-3 bg-surface/70 border border-border rounded-xl text-xs text-text-primary placeholder:text-text-faint outline-none focus:border-accent/60 transition-all"
							})]
						})]
					}),
					!episodeSearch.trim() && rangeCount > 1 && /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none",
						children: Array.from({ length: rangeCount }).map((_, idx) => {
							const start = idx * pageSize + 1;
							const end = Math.min((idx + 1) * pageSize, episodes.length);
							return /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setSelectedRange(idx),
								className: cn("px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer", selectedRange === idx ? "bg-accent text-white border-accent shadow-md shadow-accent/25" : "bg-surface/60 hover:bg-surface border-border text-text-muted hover:text-white"),
								children: [
									start,
									" - ",
									end
								]
							}, idx);
						})
					}),
					displayedEpisodes.length === 0 ? /* @__PURE__ */ jsx("div", {
						className: "py-12 text-center bg-surface/20 border border-border/40 rounded-2xl p-6",
						children: /* @__PURE__ */ jsxs("p", {
							className: "text-xs text-text-muted",
							children: [
								"No episodes found matching \"",
								episodeSearch,
								"\"."
							]
						})
					}) : /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4",
						children: displayedEpisodes.map((ep) => {
							const epWatchUrl = `/anime/watch/${encodeURIComponent(ep.id)}?animeId=${encodeURIComponent(anime.id)}&epNum=${ep.number}&s=${ep.seasonNumber || 1}`;
							return /* @__PURE__ */ jsxs("a", {
								href: epWatchUrl,
								className: "group block p-3 rounded-2xl bg-surface/40 hover:bg-surface/90 border border-border/60 hover:border-accent/50 transition-all duration-200 cursor-pointer",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative aspect-video rounded-xl overflow-hidden bg-card mb-2.5 border border-border/40",
									children: [
										ep.image || anime.image ? /* @__PURE__ */ jsx("img", {
											src: ep.image || anime.image,
											alt: ep.title || `Episode ${ep.number}`,
											loading: "lazy",
											className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
										}) : /* @__PURE__ */ jsx("div", {
											className: "w-full h-full flex items-center justify-center bg-card",
											children: /* @__PURE__ */ jsx(Film, { className: "h-6 w-6 text-text-muted opacity-40" })
										}),
										/* @__PURE__ */ jsx("div", {
											className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
											children: /* @__PURE__ */ jsx("div", {
												className: "w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-lg",
												children: /* @__PURE__ */ jsx(Play, { className: "h-3.5 w-3.5 fill-white ml-0.5" })
											})
										}),
										/* @__PURE__ */ jsx("div", {
											className: "absolute top-1.5 left-1.5",
											children: /* @__PURE__ */ jsxs("span", {
												className: "text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/75 text-white border border-white/10",
												children: ["EP ", ep.number]
											})
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "px-0.5",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold text-white group-hover:text-accent transition-colors line-clamp-1",
										children: ep.title || `Episode ${ep.number}`
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-text-muted block mt-0.5",
										children: "Subbed · HD"
									})]
								})]
							}, ep.id);
						})
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/pages/anime/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Id = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const { id } = Astro.params;
	if (!id) return Astro.redirect("/anime");
	let anime = null;
	let error = null;
	try {
		anime = await getAnimeInfo(id);
	} catch (err) {
		error = err?.message || "Failed to load anime info.";
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": anime ? `${anime.title} — Stellarix Anime` : "Anime Details — Stellarix",
		"description": anime?.description || "Watch anime series in HD with Sub & Dub."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AppShell", AppShell, {
		"client:load": true,
		"currentPath": `/anime/${id}`,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/AppShell.tsx",
		"client:component-export": "default"
	})}${renderComponent($$result, "AnimeDetailPage", AnimeDetailPage, {
		"client:load": true,
		"anime": anime,
		"animeId": id,
		"error": error,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/Anime/AnimeDetailPage.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/anime/[id].astro", void 0);
var $$file = "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/anime/[id].astro";
var $$url = "/anime/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/anime/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
