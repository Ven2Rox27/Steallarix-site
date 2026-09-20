import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, u as renderTemplate } from "./server_BnDeESLH.mjs";
import { t as createComponent } from "./compiler_D971p3oz.mjs";
import { t as $$Layout } from "./Layout_MLozyCk8.mjs";
import { n as Badge, r as cn, t as Button } from "./Button_Bg0pP7Dn.mjs";
import { t as AppShell } from "./AppShell_DRh1jUSc.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Bookmark, Check, CheckCircle2, ChevronRight, Clock, Compass, Film, Flame, Layers, Loader2, Play, RefreshCw, Search, Sparkles, Star, X } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/Anime/AnimeSearchPage.tsx
var GENRE_CHIPS = [
	"All",
	"Action",
	"Adventure",
	"Fantasy",
	"Sci-Fi",
	"Shonen",
	"Romance",
	"Supernatural",
	"Comedy",
	"Mystery"
];
function AnimeSearchPage() {
	const [discovery, setDiscovery] = useState(null);
	const [discoveryLoading, setDiscoveryLoading] = useState(true);
	const [discoveryError, setDiscoveryError] = useState(null);
	const [searchInput, setSearchInput] = useState("");
	const [activeSearchQuery, setActiveSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);
	const [selectedGenre, setSelectedGenre] = useState("All");
	const [categoryResults, setCategoryResults] = useState([]);
	const [categoryLoading, setCategoryLoading] = useState(false);
	const [categoryError, setCategoryError] = useState(null);
	const [categoryPage, setCategoryPage] = useState(1);
	const [categoryHasNextPage, setCategoryHasNextPage] = useState(false);
	const categoryReqCounter = useRef(0);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const loadDiscoverySections = useCallback(async () => {
		setDiscoveryLoading(true);
		setDiscoveryError(null);
		try {
			const res = await fetch("/api/anime/discovery");
			if (!res.ok) throw new Error(`Discovery API returned status ${res.status}`);
			const data = await res.json();
			setDiscovery(data);
		} catch (err) {
			console.error("Failed to load anime discovery sections:", err);
			setDiscoveryError(err.message || "Failed to load discovery sections.");
		} finally {
			setDiscoveryLoading(false);
		}
	}, []);
	const handleSelectGenre = useCallback(async (genre, page = 1) => {
		setSelectedGenre(genre);
		if (genre === "All") {
			setCategoryResults([]);
			setCategoryLoading(false);
			setCategoryError(null);
			setCategoryPage(1);
			setCategoryHasNextPage(false);
			return;
		}
		const currentReqId = ++categoryReqCounter.current;
		setCategoryLoading(true);
		setCategoryError(null);
		if (page === 1) {
			setCategoryResults([]);
			setCategoryPage(1);
		}
		try {
			const res = await fetch(`/api/anime/category?genre=${encodeURIComponent(genre)}&page=${page}`);
			if (!res.ok) throw new Error(`Failed to load ${genre} anime (status ${res.status})`);
			const data = await res.json();
			if (currentReqId === categoryReqCounter.current) {
				setCategoryResults(Array.isArray(data.results) ? data.results : []);
				setCategoryHasNextPage(Boolean(data.hasNextPage));
				setCategoryPage(page);
			}
		} catch (err) {
			if (currentReqId === categoryReqCounter.current) {
				console.error(`Error loading category ${genre}:`, err);
				setCategoryError(err.message || `Failed to load ${genre} anime.`);
				setCategoryResults([]);
			}
		} finally {
			if (currentReqId === categoryReqCounter.current) setCategoryLoading(false);
		}
	}, []);
	const executeSearch = useCallback(async (query) => {
		const trimmed = query.trim();
		if (!trimmed) {
			setActiveSearchQuery("");
			setSearchResults([]);
			return;
		}
		setSearchLoading(true);
		setSearchError(null);
		setActiveSearchQuery(trimmed);
		try {
			const res = await fetch(`/api/anime/search?query=${encodeURIComponent(trimmed)}`);
			if (!res.ok) throw new Error(`Anime search API returned status ${res.status}`);
			const data = await res.json();
			setSearchResults(Array.isArray(data.results) ? data.results : []);
		} catch (err) {
			console.error("Anime search error:", err);
			setSearchError(err.message || "Failed to search anime.");
			setSearchResults([]);
		} finally {
			setSearchLoading(false);
		}
	}, []);
	useEffect(() => {
		loadDiscoverySections();
		const handleNavigation = () => {
			loadDiscoverySections();
			if (selectedGenre !== "All") handleSelectGenre(selectedGenre, 1);
		};
		document.addEventListener("astro:page-load", handleNavigation);
		window.addEventListener("pageshow", handleNavigation);
		return () => {
			document.removeEventListener("astro:page-load", handleNavigation);
			window.removeEventListener("pageshow", handleNavigation);
		};
	}, [
		loadDiscoverySections,
		handleSelectGenre,
		selectedGenre
	]);
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		if (searchInput.trim()) executeSearch(searchInput.trim());
	};
	const handleClearSearch = () => {
		setSearchInput("");
		setActiveSearchQuery("");
		setSearchResults([]);
	};
	const isSearchActive = Boolean(activeSearchQuery);
	const hasTrending = Boolean(discovery?.trending && discovery.trending.length > 0);
	const hasPopular = Boolean(discovery?.popular && discovery.popular.length > 0);
	const hasRecent = Boolean(discovery?.recent && discovery.recent.length > 0);
	const featuredItem = discovery?.trending?.[0] || discovery?.popular?.[0] || discovery?.recent?.[0] || null;
	return /* @__PURE__ */ jsxs("main", {
		className: "min-h-screen pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "relative rounded-3xl overflow-hidden border border-white/10 bg-surface/40 backdrop-blur-md mb-12 shadow-2xl",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "absolute inset-0 -z-10 overflow-hidden pointer-events-none",
						children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl" }), /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-1/3 w-80 h-80 bg-accent-rose/10 rounded-full blur-3xl" })]
					}),
					featuredItem?.image ? /* @__PURE__ */ jsxs("div", {
						className: "absolute inset-0 -z-10",
						children: [
							/* @__PURE__ */ jsx("img", {
								src: featuredItem.image,
								alt: featuredItem.title,
								className: "w-full h-full object-cover object-top opacity-35 filter blur-xs"
							}),
							/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-base via-base/80 to-transparent" }),
							/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-base via-base/60 to-transparent" })
						]
					}) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-to-br from-surface/80 via-base to-base/90" }),
					/* @__PURE__ */ jsxs("div", {
						className: "relative p-6 sm:p-10 lg:p-14 max-w-3xl",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold tracking-wider uppercase mb-4",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Anime Streaming Destination" })]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]",
								children: featuredItem?.title || "Immerse in the World of Anime"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-text-muted text-sm sm:text-base lg:text-lg mt-4 leading-relaxed line-clamp-3 max-w-2xl",
								children: "Stream popular Japanese animation, explore trending series, and search the anime universe with crystal clear playback, subtitles, and dubs."
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-2 mt-5",
								children: [
									/* @__PURE__ */ jsx(Badge, {
										variant: "sub",
										size: "sm",
										children: "SUB & DUB"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15 uppercase",
										children: "1080p Full HD"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent/20 text-accent-light border border-accent/30 uppercase",
										children: "TV Series & Movies"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-3.5 mt-8",
								children: [featuredItem ? /* @__PURE__ */ jsxs("a", {
									href: `/anime/${featuredItem.id}`,
									className: "inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold transition-all duration-300 shadow-xl shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
									children: [/* @__PURE__ */ jsx(Play, { className: "h-4 w-4 fill-white" }), /* @__PURE__ */ jsx("span", { children: "Watch Now" })]
								}) : /* @__PURE__ */ jsxs("a", {
									href: "#catalog",
									className: "inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-bold transition-all duration-300 shadow-xl shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
									children: [/* @__PURE__ */ jsx(Compass, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Explore Catalog" })]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setIsBookmarked((prev) => !prev),
									className: cn("inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-300 backdrop-blur-md cursor-pointer", isBookmarked ? "bg-accent/20 border-accent/50 text-accent" : "bg-white/5 hover:bg-white/10 border-white/15 text-white/90"),
									children: isBookmarked ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Added to Watchlist" })] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Bookmark, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Add to Watchlist" })] })
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "catalog",
				className: "mb-10 space-y-5",
				children: [/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSearchSubmit,
					className: "flex flex-col sm:flex-row gap-3 max-w-3xl",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative flex-1",
						children: [
							/* @__PURE__ */ jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" }),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: searchInput,
								onChange: (e) => setSearchInput(e.target.value),
								placeholder: "Search anime titles, genres, or keywords...",
								className: "w-full h-11 pl-10 pr-9 bg-surface/70 backdrop-blur-md border border-border rounded-xl text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/40 transition-all"
							}),
							searchInput && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleClearSearch,
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white p-1",
								"aria-label": "Clear search",
								children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
							})
						]
					}), /* @__PURE__ */ jsxs(Button, {
						type: "submit",
						variant: "primary",
						size: "md",
						className: "h-11 px-6 rounded-xl font-medium shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-accent/20",
						children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Search" })]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none",
					children: GENRE_CHIPS.map((genre) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => handleSelectGenre(genre, 1),
						className: cn("px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer", selectedGenre === genre ? "bg-accent text-white border-accent shadow-md shadow-accent/25" : "bg-surface/60 hover:bg-surface border-border text-text-muted hover:text-white"),
						children: genre
					}, genre))
				})]
			}),
			isSearchActive ? /* @__PURE__ */ jsxs("section", {
				className: "space-y-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-border/50 pb-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-xl sm:text-2xl font-bold text-white flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", { children: "Search Results for" }), /* @__PURE__ */ jsxs("span", {
							className: "text-accent",
							children: [
								"\"",
								activeSearchQuery,
								"\""
							]
						})]
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-xs text-text-muted",
						children: [
							searchResults.length,
							" ",
							searchResults.length === 1 ? "title" : "titles",
							" found"
						]
					})] }), /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						onClick: handleClearSearch,
						className: "border border-white/10 hover:border-white/20 text-xs px-3 py-1.5 rounded-xl cursor-pointer",
						children: "✕ Clear Search"
					})]
				}), searchLoading ? /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-center gap-3 py-8",
						children: [/* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 text-accent animate-spin" }), /* @__PURE__ */ jsx("p", {
							className: "text-text-muted text-sm font-medium",
							children: "Searching anime titles..."
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6",
						children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsx(AnimeCardSkeleton, {}, i))
					})]
				}) : searchError ? /* @__PURE__ */ jsxs("div", {
					className: "py-16 text-center bg-surface/40 border border-border/50 rounded-2xl p-8 max-w-lg mx-auto",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-12 h-12 rounded-2xl bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center text-accent-rose mb-3 mx-auto",
							children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-white mb-1",
							children: "Search Error"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-text-muted mb-4",
							children: searchError
						}),
						/* @__PURE__ */ jsx(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => executeSearch(activeSearchQuery),
							className: "px-4 py-2 rounded-xl",
							children: "Retry Search"
						})
					]
				}) : searchResults.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "py-16 text-center bg-surface/30 border border-border/40 rounded-2xl p-8 max-w-lg mx-auto",
					children: [
						/* @__PURE__ */ jsx(Film, { className: "h-10 w-10 text-text-muted opacity-50 mb-3 mx-auto" }),
						/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-white mb-1",
							children: "No Results Found"
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-xs text-text-muted mb-5",
							children: [
								"No anime found matching \"",
								activeSearchQuery,
								"\". Try another keyword or browse our curated sections below."
							]
						}),
						/* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							onClick: handleClearSearch,
							className: "border border-white/10 px-4 py-2 rounded-xl",
							children: "View Anime Sections"
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6",
					children: searchResults.map((item, idx) => /* @__PURE__ */ jsx(AnimeCard, { item }, `${item.id}-${idx}`))
				})]
			}) : /* @__PURE__ */ jsx("div", {
				className: "space-y-16",
				children: discoveryLoading ? /* @__PURE__ */ jsxs("div", {
					className: "space-y-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-center gap-3 py-6",
						children: [/* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 text-accent animate-spin" }), /* @__PURE__ */ jsx("p", {
							className: "text-text-muted text-sm font-medium",
							children: "Loading anime catalog..."
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6",
						children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsx(AnimeCardSkeleton, {}, i))
					})]
				}) : discoveryError ? /* @__PURE__ */ jsxs("div", {
					className: "py-16 text-center bg-surface/40 border border-border/50 rounded-2xl p-8 max-w-lg mx-auto",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-12 h-12 rounded-2xl bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center text-accent-rose mb-3 mx-auto",
							children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-white mb-1",
							children: "Unable to Load Discovery"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-text-muted mb-4",
							children: discoveryError
						}),
						/* @__PURE__ */ jsxs(Button, {
							variant: "secondary",
							size: "sm",
							onClick: loadDiscoverySections,
							className: "px-4 py-2 rounded-xl",
							children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 mr-1.5" }), "Retry Loading"]
						})
					]
				}) : selectedGenre !== "All" ? /* @__PURE__ */ jsxs("section", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-border/50 pb-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent",
								children: /* @__PURE__ */ jsx(Layers, { className: "h-4 w-4" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-xl sm:text-2xl font-bold text-white flex items-center gap-2",
								children: /* @__PURE__ */ jsxs("span", { children: [selectedGenre, " Anime"] })
							}), !categoryLoading && !categoryError && /* @__PURE__ */ jsxs("span", {
								className: "text-xs text-text-muted",
								children: [
									categoryResults.length,
									" ",
									categoryResults.length === 1 ? "title" : "titles",
									" found"
								]
							})] })]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => handleSelectGenre("All"),
							className: "text-xs font-semibold text-accent hover:underline cursor-pointer",
							children: "✕ Show All Genres"
						})]
					}), categoryLoading ? /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-3 py-8",
							children: [/* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 text-accent animate-spin" }), /* @__PURE__ */ jsxs("p", {
								className: "text-text-muted text-sm font-medium",
								children: [
									"Loading ",
									selectedGenre,
									" anime from AniList..."
								]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6",
							children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsx(AnimeCardSkeleton, {}, i))
						})]
					}) : categoryError ? /* @__PURE__ */ jsxs("div", {
						className: "py-16 text-center bg-surface/40 border border-border/50 rounded-2xl p-8 max-w-lg mx-auto",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-12 h-12 rounded-2xl bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center text-accent-rose mb-3 mx-auto",
								children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ jsxs("h3", {
								className: "text-base font-bold text-white mb-1",
								children: ["Failed to Load ", selectedGenre]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-text-muted mb-4",
								children: categoryError
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "secondary",
								size: "sm",
								onClick: () => handleSelectGenre(selectedGenre, categoryPage),
								className: "px-4 py-2 rounded-xl",
								children: "Retry Category"
							})
						]
					}) : categoryResults.length === 0 ? /* @__PURE__ */ jsx(EmptySectionCard, {
						title: `No ${selectedGenre} Anime Found`,
						description: `No anime matching "${selectedGenre}" returned by AniList. Choose another genre or return to All.`,
						icon: Layers
					}) : /* @__PURE__ */ jsxs("div", {
						className: "space-y-8",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6",
							children: categoryResults.map((item, idx) => /* @__PURE__ */ jsx(AnimeCard, { item }, `genre-${item.id}-${idx}`))
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-3 pt-4",
							children: [
								categoryPage > 1 && /* @__PURE__ */ jsx(Button, {
									variant: "secondary",
									size: "sm",
									onClick: () => {
										handleSelectGenre(selectedGenre, categoryPage - 1);
										window.scrollTo({
											top: 350,
											behavior: "smooth"
										});
									},
									className: "px-4 py-2 rounded-xl cursor-pointer",
									children: "Previous Page"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-xs text-text-muted px-3",
									children: ["Page ", categoryPage]
								}),
								categoryHasNextPage && /* @__PURE__ */ jsx(Button, {
									variant: "primary",
									size: "sm",
									onClick: () => {
										handleSelectGenre(selectedGenre, categoryPage + 1);
										window.scrollTo({
											top: 350,
											behavior: "smooth"
										});
									},
									className: "px-4 py-2 rounded-xl cursor-pointer shadow-md shadow-accent/20",
									children: "Next Page"
								})
							]
						})]
					})]
				}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-accent-amber/15 border border-accent-amber/30 flex items-center justify-center text-accent-amber",
								children: /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 fill-accent-amber" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg sm:text-xl font-bold text-white",
								children: "Popular Anime"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-text-muted",
								children: "Fan-favorite series and top rated hits"
							})] })]
						}), hasPopular && /* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-accent hover:underline cursor-pointer",
							children: "View All"
						})]
					}), hasPopular ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6",
						children: discovery.popular.map((item, idx) => /* @__PURE__ */ jsx(AnimeCard, { item }, `popular-${item.id}-${idx}`))
					}) : /* @__PURE__ */ jsx(EmptySectionCard, {
						title: "Popular Anime Catalog",
						description: "Popular anime rankings will appear here once connected.",
						icon: Star
					})] }),
					/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent",
								children: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg sm:text-xl font-bold text-white",
								children: "Recently Added"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-text-muted",
								children: "Fresh releases added to the platform"
							})] })]
						}), hasRecent && /* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-accent hover:underline cursor-pointer",
							children: "View All"
						})]
					}), hasRecent ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6",
						children: discovery.recent.map((item, idx) => /* @__PURE__ */ jsx(AnimeCard, { item }, `recent-${item.id}-${idx}`))
					}) : /* @__PURE__ */ jsx(EmptySectionCard, {
						title: "Recently Added Releases",
						description: "Newly added anime and episodes will appear here.",
						icon: Clock
					})] }),
					/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center text-accent-rose",
								children: /* @__PURE__ */ jsx(Flame, { className: "h-4 w-4" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg sm:text-xl font-bold text-white",
								children: "Trending & Latest Episodes"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-text-muted",
								children: "What the community is watching right now"
							})] })]
						}), hasTrending && /* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-accent hover:underline cursor-pointer",
							children: "View All"
						})]
					}), hasTrending ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6",
						children: discovery.trending.map((item, idx) => /* @__PURE__ */ jsx(AnimeCard, { item }, `trending-${item.id}-${idx}`))
					}) : /* @__PURE__ */ jsx(EmptySectionCard, {
						title: "Latest Episodes",
						description: "Weekly and daily episode drops will be listed here.",
						icon: Flame
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-2xl bg-surface/40 border border-border/50 backdrop-blur-sm",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5 mb-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400",
									children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "text-base font-bold text-white",
									children: "New Seasonal Releases"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-text-muted",
									children: "Simulcasts & premieres"
								})] })]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-text-muted leading-relaxed mt-3",
								children: "Discover new seasonal premieres broadcast straight from Japan. Check back as new anime seasons launch."
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-2xl bg-surface/40 border border-border/50 backdrop-blur-sm",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5 mb-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400",
									children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "text-base font-bold text-white",
									children: "Completed Anime"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-text-muted",
									children: "Ready to binge end-to-end"
								})] })]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-text-muted leading-relaxed mt-3",
								children: "Catch up on finished series from episode one through the finale with uninterrupted binge-watching."
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "pt-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 mb-5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400",
								children: /* @__PURE__ */ jsx(Layers, { className: "h-4 w-4" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg sm:text-xl font-bold text-white",
								children: "Explore by Genre"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-text-muted",
								children: "Find anime tailored to your specific taste"
							})] })]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5",
							children: GENRE_CHIPS.filter((g) => g !== "All").map((genre) => /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => {
									handleSelectGenre(genre, 1);
									window.scrollTo({
										top: 350,
										behavior: "smooth"
									});
								},
								className: "group p-4 rounded-xl bg-surface/50 hover:bg-surface/90 border border-border/60 hover:border-accent/50 transition-all duration-300 text-left flex items-center justify-between cursor-pointer",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs sm:text-sm font-semibold text-white group-hover:text-accent transition-colors",
									children: genre
								}), /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" })]
							}, genre))
						})]
					})
				] })
			})
		]
	});
}
function AnimeCard({ item }) {
	const [imgError, setImgError] = useState(false);
	return /* @__PURE__ */ jsxs("a", {
		href: `/anime/${item.id}`,
		className: "group block relative select-none cursor-pointer",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative aspect-[2/3] rounded-2xl overflow-hidden bg-card border border-border-subtle group-hover:border-accent/50 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-accent/15",
			children: [
				!imgError && item.image ? /* @__PURE__ */ jsx("img", {
					src: item.image,
					alt: item.title,
					loading: "lazy",
					onError: () => setImgError(true),
					className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
				}) : /* @__PURE__ */ jsxs("div", {
					className: "w-full h-full flex flex-col items-center justify-center p-3 text-center bg-surface text-text-muted",
					children: [/* @__PURE__ */ jsx(Film, { className: "h-8 w-8 mb-2 opacity-40 text-accent" }), /* @__PURE__ */ jsx("span", {
						className: "text-xs line-clamp-2 text-text-secondary font-medium",
						children: item.title
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 self-start",
							children: [/* @__PURE__ */ jsx(Badge, {
								variant: "sub",
								size: "sm",
								children: item.subOrDub ? item.subOrDub.toUpperCase() : "SUB"
							}), item.type && /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/70 text-white/90 border border-white/10 uppercase",
								children: item.type
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "self-center w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/40 transform scale-75 group-hover:scale-100 transition-transform duration-300",
							children: /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 fill-white ml-0.5" })
						}),
						/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", {
							className: "text-xs text-white/90 font-semibold line-clamp-1",
							children: item.releaseDate ? `${item.releaseDate}` : "Anime Series"
						}) })
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute top-2.5 right-2.5 group-hover:opacity-0 transition-opacity duration-200",
					children: /* @__PURE__ */ jsx(Badge, {
						variant: "sub",
						size: "sm",
						children: item.subOrDub ? item.subOrDub.toUpperCase() : "SUB"
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-2.5 px-0.5",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-xs sm:text-sm font-semibold text-text-primary line-clamp-1 group-hover:text-accent transition-colors",
				children: item.title
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 mt-1 text-[11px] text-text-muted",
				children: [
					item.releaseDate && /* @__PURE__ */ jsx("span", { children: item.releaseDate }),
					item.releaseDate && item.type && /* @__PURE__ */ jsx("span", { children: "·" }),
					item.type && /* @__PURE__ */ jsx("span", { children: item.type }),
					item.episode && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", { children: "·" }), /* @__PURE__ */ jsxs("span", {
						className: "text-accent font-medium",
						children: ["Ep ", item.episode]
					})] })
				]
			})]
		})]
	});
}
function AnimeCardSkeleton() {
	return /* @__PURE__ */ jsxs("div", {
		className: "animate-pulse flex flex-col",
		children: [
			/* @__PURE__ */ jsx("div", { className: "aspect-[2/3] rounded-2xl bg-card border border-border/40" }),
			/* @__PURE__ */ jsx("div", { className: "mt-3 h-4 w-3/4 rounded-md bg-card" }),
			/* @__PURE__ */ jsx("div", { className: "mt-1.5 h-3 w-1/2 rounded-md bg-card" })
		]
	});
}
function EmptySectionCard({ title, description, icon: Icon }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "py-12 px-6 rounded-2xl bg-surface/20 border border-white/5 backdrop-blur-sm text-center max-w-xl mx-auto",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted mx-auto mb-3",
				children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 opacity-60" })
			}),
			/* @__PURE__ */ jsx("h4", {
				className: "text-sm font-bold text-white mb-1",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xs text-text-muted max-w-md mx-auto leading-relaxed",
				children: description
			})
		]
	});
}
//#endregion
//#region src/pages/anime.astro
var anime_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Anime,
	file: () => $$file,
	url: () => $$url
});
var $$Anime = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Anime — Stellarix",
		"description": "Watch and discover thousands of anime titles, movies, and episodes in high definition with Sub & Dub."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "AppShell", AppShell, {
		"client:load": true,
		"currentPath": "/anime",
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/AppShell.tsx",
		"client:component-export": "default"
	})}${renderComponent($$result, "AnimeSearchPage", AnimeSearchPage, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/components/Anime/AnimeSearchPage.tsx",
		"client:component-export": "default"
	})}` })}`;
}, "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/anime.astro", void 0);
var $$file = "C:/Users/vyenkatesh/OneDrive/Documents/StreamWebsite/src/pages/anime.astro";
var $$url = "/anime";
//#endregion
//#region \0virtual:astro:page:src/pages/anime@_@astro
var page = () => anime_exports;
//#endregion
export { page };
