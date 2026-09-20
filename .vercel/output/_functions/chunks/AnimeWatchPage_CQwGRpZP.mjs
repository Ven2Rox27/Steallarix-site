import { n as Badge, r as cn, t as Button } from "./Button_Bg0pP7Dn.mjs";
import { t as resolveAnimeTmdbId } from "./animeTmdbResolver_BHDpC3rB.mjs";
import { n as getAnimeMovieStreamUrl, r as getAnimeTvStreamUrl } from "./cineSrc_BRB7n-GD.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Film, Layers, List, Loader2, Play, RefreshCw, Search, SkipBack, SkipForward, Tv } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/Anime/AnimeWatchPage.tsx
function AnimeWatchPage({ episodeId, anime: initialAnime, animeId: initialAnimeId, episodeNumber = 1, seasonNumber = 1 }) {
	const [anime, setAnime] = useState(initialAnime || null);
	const [currentSeason, setCurrentSeason] = useState(seasonNumber);
	const [currentEpNumber, setCurrentEpNumber] = useState(episodeNumber);
	const [currentEpisodeId, setCurrentEpisodeId] = useState(episodeId);
	const [episodesList, setEpisodesList] = useState(initialAnime?.episodes || []);
	const [tmdbId, setTmdbId] = useState(initialAnime?.tmdbId || null);
	const [loading, setLoading] = useState(true);
	const [seasonLoading, setSeasonLoading] = useState(false);
	const [error, setError] = useState(null);
	const [episodeSearch, setEpisodeSearch] = useState("");
	const episodesSectionRef = useRef(null);
	const playerTopRef = useRef(null);
	const isMovie = anime?.type?.toLowerCase() === "movie";
	const effectiveAnimeId = initialAnimeId || anime?.id || (episodeId ? episodeId.replace(/-s\d+e\d+.*$/i, "") : "");
	const loadAnimeInfo = useCallback(async (id, sNum = 1) => {
		try {
			const res = await fetch(`/api/anime/info?id=${encodeURIComponent(id)}&season=${sNum}`);
			if (res.ok) {
				const data = await res.json();
				if (data && data.id) {
					setAnime(data);
					if (data.tmdbId) setTmdbId(data.tmdbId);
					if (Array.isArray(data.episodes) && data.episodes.length > 0) setEpisodesList(data.episodes);
					return data;
				}
			}
		} catch (e) {
			console.warn("Could not recover anime metadata:", e);
		}
		return null;
	}, []);
	const resolveId = useCallback(async (currentAnimeData) => {
		setLoading(true);
		setError(null);
		const activeAnime = currentAnimeData !== void 0 ? currentAnimeData : anime;
		try {
			if (activeAnime?.tmdbId) {
				setTmdbId(activeAnime.tmdbId);
				setLoading(false);
				return;
			}
			const lookupKey = effectiveAnimeId || activeAnime?.id || activeAnime?.title || episodeId;
			const resolved = await resolveAnimeTmdbId(lookupKey, isMovie ? "movie" : "tv");
			if (resolved?.tmdbId) {
				setTmdbId(resolved.tmdbId);
				setError(null);
			} else {
				setTmdbId(null);
				setError("Unable to load this episode.");
			}
		} catch (err) {
			console.error("Failed to resolve anime TMDB ID:", err);
			setTmdbId(null);
			setError("Unable to load this episode.");
		} finally {
			setLoading(false);
		}
	}, [
		anime,
		effectiveAnimeId,
		episodeId,
		isMovie
	]);
	useEffect(() => {
		if (initialAnime) {
			setAnime(initialAnime);
			if (initialAnime.tmdbId) setTmdbId(initialAnime.tmdbId);
			if (initialAnime.episodes) setEpisodesList(initialAnime.episodes);
			resolveId(initialAnime);
		} else if (effectiveAnimeId) loadAnimeInfo(effectiveAnimeId, currentSeason).then((loaded) => {
			resolveId(loaded);
		});
		else resolveId();
		const handleNavigation = () => {
			if (!anime && effectiveAnimeId) loadAnimeInfo(effectiveAnimeId, currentSeason).then((loaded) => {
				resolveId(loaded);
			});
		};
		document.addEventListener("astro:page-load", handleNavigation);
		window.addEventListener("pageshow", handleNavigation);
		return () => {
			document.removeEventListener("astro:page-load", handleNavigation);
			window.removeEventListener("pageshow", handleNavigation);
		};
	}, [
		initialAnime,
		effectiveAnimeId,
		currentSeason,
		loadAnimeInfo,
		resolveId
	]);
	const seasons = anime?.seasons || [];
	const currentEpisode = episodesList.find((e) => e.number === currentEpNumber || e.id === currentEpisodeId) || {
		id: currentEpisodeId,
		number: currentEpNumber,
		seasonNumber: currentSeason,
		title: isMovie ? anime?.title || "Full Movie" : `Episode ${currentEpNumber}`,
		description: anime?.description || ""
	};
	const currentIndex = episodesList.findIndex((e) => e.number === currentEpNumber || e.id === currentEpisodeId);
	const prevEpisode = currentIndex > 0 ? episodesList[currentIndex - 1] : null;
	const nextEpisode = currentIndex >= 0 && currentIndex < episodesList.length - 1 ? episodesList[currentIndex + 1] : null;
	const handleSelectEpisode = (ep) => {
		setCurrentEpisodeId(ep.id);
		setCurrentEpNumber(ep.number);
		if (ep.seasonNumber) setCurrentSeason(ep.seasonNumber);
		if (playerTopRef.current) playerTopRef.current.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	};
	const handleSelectSeason = async (newSeason) => {
		if (newSeason === currentSeason) return;
		setCurrentSeason(newSeason);
		setCurrentEpNumber(1);
		setSeasonLoading(true);
		const targetId = effectiveAnimeId || anime?.id;
		if (targetId) try {
			const res = await fetch(`/api/anime/info?id=${encodeURIComponent(targetId)}&season=${newSeason}`);
			if (res.ok) {
				const data = await res.json();
				if (Array.isArray(data.episodes) && data.episodes.length > 0) {
					setEpisodesList(data.episodes);
					setCurrentEpisodeId(data.episodes[0].id);
				}
			}
		} catch (err) {
			console.warn("Failed to fetch season episodes:", err);
		} finally {
			setSeasonLoading(false);
		}
		else setSeasonLoading(false);
	};
	const animeStreamUrl = tmdbId ? isMovie ? getAnimeMovieStreamUrl(tmdbId) : getAnimeTvStreamUrl(tmdbId, currentSeason, currentEpNumber) : "";
	const filteredEpisodes = episodeSearch.trim() ? episodesList.filter((e) => String(e.number).includes(episodeSearch.trim()) || e.title && e.title.toLowerCase().includes(episodeSearch.trim().toLowerCase())) : episodesList;
	const backUrl = anime?.id ? `/anime/${anime.id}` : effectiveAnimeId ? `/anime/${effectiveAnimeId}` : "/anime";
	const scrollToEpisodes = () => {
		if (episodesSectionRef.current) episodesSectionRef.current.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-base text-text-primary pb-28 select-none",
		children: [
			/* @__PURE__ */ jsx("div", {
				ref: playerTopRef,
				className: "h-px w-full"
			}),
			/* @__PURE__ */ jsx("header", {
				className: "sticky top-0 z-40 bg-surface/90 border-b border-border/60 backdrop-blur-md transition-all",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3.5 min-w-0",
						children: [/* @__PURE__ */ jsx("a", {
							href: backUrl,
							className: "p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white transition-all cursor-pointer shrink-0",
							title: "Back to Anime Details",
							"aria-label": "Back to Anime Details",
							children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" })
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("a", {
								href: backUrl,
								className: "text-xs sm:text-sm font-bold text-white hover:text-accent transition-colors truncate block",
								title: anime?.title || "Anime Series",
								children: anime?.title || "Anime Series"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-accent font-medium truncate",
								children: isMovie ? "Anime Movie • Full Feature" : `Season ${currentSeason} • Episode ${currentEpNumber}${currentEpisode.title ? ` • ${currentEpisode.title}` : ""}`
							})]
						})]
					}), !isMovie && episodesList.length > 0 && /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: scrollToEpisodes,
						className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white text-xs font-semibold transition-all cursor-pointer shrink-0",
						children: [/* @__PURE__ */ jsx(List, { className: "h-3.5 w-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Episodes" })]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 flex items-center justify-center",
						children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] z-20" }), loading ? /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center gap-3.5 text-center p-6 z-10",
							children: [/* @__PURE__ */ jsx(Loader2, { className: "h-10 w-10 text-accent animate-spin" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold text-white",
								children: "Loading episode..."
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-text-muted mt-0.5",
								children: "Connecting CineSRC streaming server"
							})] })]
						}) : error || !animeStreamUrl ? /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center justify-center p-6 sm:p-10 text-center max-w-md z-10 space-y-4",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted",
									children: /* @__PURE__ */ jsx(Film, { className: "h-7 w-7 opacity-60 text-accent" })
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
									className: "text-base sm:text-lg font-bold text-white",
									children: "Unable to load this episode"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-text-muted mt-1 leading-relaxed",
									children: "Please try again or choose another episode from the catalog."
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 pt-2",
									children: [/* @__PURE__ */ jsx("a", {
										href: backUrl,
										children: /* @__PURE__ */ jsx(Button, {
											variant: "secondary",
											size: "sm",
											className: "px-4 py-2 rounded-xl text-xs cursor-pointer",
											children: "Anime Details"
										})
									}), /* @__PURE__ */ jsxs(Button, {
										variant: "primary",
										size: "sm",
										onClick: () => resolveId(),
										className: "px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-accent/20",
										children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Retry" })]
									})]
								})
							]
						}) : /* @__PURE__ */ jsx("iframe", {
							src: animeStreamUrl,
							title: anime?.title || "Anime Stream",
							width: "100%",
							height: "100%",
							frameBorder: "0",
							allowFullScreen: true,
							allow: "autoplay; fullscreen; picture-in-picture",
							className: "w-full h-full border-0 relative z-10"
						}, animeStreamUrl)]
					}),
					/* @__PURE__ */ jsx("section", {
						className: "mt-6 pt-2 pb-6 border-b border-border/50",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col md:flex-row md:items-start justify-between gap-5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-2 max-w-3xl",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent uppercase tracking-wider",
												children: isMovie ? "Movie" : `S${currentSeason} • EP ${currentEpNumber}`
											}),
											/* @__PURE__ */ jsx(Badge, {
												variant: "sub",
												size: "sm",
												children: "SUB"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10",
												children: "1080p Full HD"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface text-text-muted border border-border",
												children: "CineSRC"
											})
										]
									}),
									/* @__PURE__ */ jsx("h1", {
										className: "text-xl sm:text-2xl font-black text-white tracking-tight",
										children: isMovie ? anime?.title || "Anime Movie" : currentEpisode.title || `Episode ${currentEpNumber}`
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs sm:text-sm text-text-muted leading-relaxed pt-1",
										children: currentEpisode.description || anime?.description || "No detailed description available for this episode."
									})
								]
							}), !isMovie && /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5 shrink-0 self-start",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									disabled: !prevEpisode && currentEpNumber <= 1,
									onClick: () => {
										if (prevEpisode) handleSelectEpisode(prevEpisode);
										else if (currentEpNumber > 1) setCurrentEpNumber((p) => p - 1);
									},
									className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface/80 hover:bg-surface border border-border text-xs font-semibold text-white/90 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm hover:border-accent/40",
									title: "Previous Episode",
									children: [/* @__PURE__ */ jsx(SkipBack, { className: "h-3.5 w-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Previous Episode" })]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									disabled: !nextEpisode,
									onClick: () => {
										if (nextEpisode) handleSelectEpisode(nextEpisode);
										else setCurrentEpNumber((p) => p + 1);
									},
									className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-accent/20",
									title: "Next Episode",
									children: [/* @__PURE__ */ jsx("span", { children: "Next Episode" }), /* @__PURE__ */ jsx(SkipForward, { className: "h-3.5 w-3.5" })]
								})]
							})]
						})
					}),
					!isMovie && /* @__PURE__ */ jsxs("section", {
						ref: episodesSectionRef,
						className: "mt-10 pt-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
									className: "text-xl sm:text-2xl font-bold text-white flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsx(Tv, { className: "h-5 w-5 text-accent" }),
										/* @__PURE__ */ jsx("span", { children: "Episodes" }),
										/* @__PURE__ */ jsxs("span", {
											className: "text-xs text-text-muted font-normal",
											children: [
												"(",
												episodesList.length,
												" total)"
											]
										})
									]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-text-muted mt-0.5",
									children: "Select an episode below to watch instantly"
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "relative w-full sm:w-72",
									children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted pointer-events-none" }), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: episodeSearch,
										onChange: (e) => setEpisodeSearch(e.target.value),
										placeholder: "Filter episode (e.g. 1, 12)...",
										className: "w-full h-10 pl-9 pr-3.5 bg-surface/70 border border-border rounded-xl text-xs text-text-primary placeholder:text-text-faint outline-none focus:border-accent/60 transition-all shadow-sm"
									})]
								})]
							}),
							seasons.length > 1 && /* @__PURE__ */ jsxs("div", {
								className: "mb-6 pb-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-2.5",
									children: [
										/* @__PURE__ */ jsx(Layers, { className: "h-3.5 w-3.5 text-accent" }),
										/* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-white uppercase tracking-wider",
											children: "Season"
										}),
										seasonLoading && /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 text-accent animate-spin ml-1" })
									]
								}), /* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none",
									children: seasons.map((s) => {
										const isSelected = s.seasonNumber === currentSeason;
										return /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => handleSelectSeason(s.seasonNumber),
											className: cn("px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer", isSelected ? "bg-accent text-white border-accent shadow-md shadow-accent/25" : "bg-surface/70 hover:bg-surface border-border text-text-muted hover:text-white"),
											children: s.title || `Season ${s.seasonNumber}`
										}, s.id || s.seasonNumber);
									})
								})]
							}),
							filteredEpisodes.length === 0 ? /* @__PURE__ */ jsxs("div", {
								className: "py-14 text-center bg-surface/20 border border-border/40 rounded-3xl p-8",
								children: [
									/* @__PURE__ */ jsx(Film, { className: "h-8 w-8 text-text-muted opacity-40 mx-auto mb-2" }),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm font-semibold text-white",
										children: "No episodes found"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-text-muted mt-1",
										children: "Try searching for another episode number or clear the filter."
									})
								]
							}) : /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4",
								children: filteredEpisodes.map((ep) => {
									const isCurrent = ep.number === currentEpNumber;
									return /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => handleSelectEpisode(ep),
										className: cn("group text-left block p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer relative", isCurrent ? "bg-accent/15 border-accent shadow-lg shadow-accent/20 ring-1 ring-accent/50" : "bg-surface/50 hover:bg-surface/90 border-border/60 hover:border-accent/40 hover:scale-[1.02]"),
										children: [/* @__PURE__ */ jsxs("div", {
											className: "relative aspect-video rounded-xl overflow-hidden bg-card mb-2 border border-border/40",
											children: [
												ep.image || anime?.image ? /* @__PURE__ */ jsx("img", {
													src: ep.image || anime?.image,
													alt: ep.title || `Episode ${ep.number}`,
													loading: "lazy",
													className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
												}) : /* @__PURE__ */ jsx("div", {
													className: "w-full h-full flex items-center justify-center bg-card",
													children: /* @__PURE__ */ jsx(Film, { className: "h-6 w-6 text-text-muted opacity-40" })
												}),
												/* @__PURE__ */ jsx("div", {
													className: cn("absolute inset-0 transition-opacity flex items-center justify-center", isCurrent ? "bg-accent/40 opacity-100" : "bg-black/40 opacity-0 group-hover:opacity-100"),
													children: /* @__PURE__ */ jsx("div", {
														className: "w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/40",
														children: /* @__PURE__ */ jsx(Play, { className: "h-3.5 w-3.5 fill-white ml-0.5" })
													})
												}),
												/* @__PURE__ */ jsx("div", {
													className: "absolute top-1.5 left-1.5",
													children: /* @__PURE__ */ jsxs("span", {
														className: cn("text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md", isCurrent ? "bg-accent text-white shadow-sm" : "bg-black/75 text-white/90 border border-white/10"),
														children: ["EP ", ep.number]
													})
												})
											]
										}), /* @__PURE__ */ jsxs("div", {
											className: "px-0.5",
											children: [/* @__PURE__ */ jsx("div", {
												className: "flex items-center justify-between gap-1",
												children: /* @__PURE__ */ jsx("span", {
													className: cn("text-xs font-semibold line-clamp-1 transition-colors", isCurrent ? "text-accent font-bold" : "text-white group-hover:text-accent"),
													children: ep.title || `Episode ${ep.number}`
												})
											}), /* @__PURE__ */ jsx("div", {
												className: "flex items-center gap-1.5 mt-0.5 text-[11px] text-text-muted",
												children: isCurrent ? /* @__PURE__ */ jsxs("span", {
													className: "text-accent font-semibold flex items-center gap-1",
													children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }), /* @__PURE__ */ jsx("span", { children: "Now Playing" })]
												}) : /* @__PURE__ */ jsx("span", { children: "Subbed • HD" })
											})]
										})]
									}, ep.id);
								})
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { AnimeWatchPage as t };
