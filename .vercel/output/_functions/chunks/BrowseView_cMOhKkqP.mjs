import { r as cn, t as Button } from "./Button_Bg0pP7Dn.mjs";
import { a as getGenres, c as getPaginatedMovies, h as searchMedia, l as getPaginatedTVShows } from "./mediaService_j-ke5bX4.mjs";
import { t as MediaCard } from "./MediaCard_6MMbAUS2.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/Browse/BrowseView.tsx
var sortOptions = [
	{
		value: "popular",
		label: "Popular"
	},
	{
		value: "rating",
		label: "Highest Rated"
	},
	{
		value: "latest",
		label: "Newest"
	},
	{
		value: "oldest",
		label: "Oldest"
	},
	{
		value: "alphabetical",
		label: "A-Z"
	}
];
var mediaTypes = [
	{
		value: "all",
		label: "All"
	},
	{
		value: "movie",
		label: "Movies"
	},
	{
		value: "anime",
		label: "Anime"
	},
	{
		value: "tv",
		label: "TV Shows"
	}
];
var yearOptions = [
	2025,
	2024,
	2023,
	2022,
	2021,
	2020,
	2019,
	2018,
	2015,
	2010,
	2e3
];
function BrowseView({ initialMediaType = "all" }) {
	const [genres, setGenres] = useState([]);
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalResults, setTotalResults] = useState(0);
	const [searchInput, setSearchInput] = useState("");
	const searchDebounceRef = useRef();
	const [filters, setFilters] = useState({
		mediaType: initialMediaType,
		sortBy: "popular"
	});
	useEffect(() => {
		getGenres().then(setGenres);
	}, []);
	useEffect(() => {
		setSearchInput("");
		setPage(1);
		setFilters({
			mediaType: initialMediaType,
			sortBy: "popular"
		});
	}, [initialMediaType]);
	useEffect(() => {
		const handleNavigation = () => {
			setSearchInput("");
			setPage(1);
			setFilters({
				mediaType: initialMediaType,
				sortBy: "popular"
			});
		};
		document.addEventListener("astro:page-load", handleNavigation);
		window.addEventListener("pageshow", handleNavigation);
		return () => {
			document.removeEventListener("astro:page-load", handleNavigation);
			window.removeEventListener("pageshow", handleNavigation);
		};
	}, [initialMediaType]);
	useEffect(() => {
		let isMounted = true;
		setLoading(true);
		setPage(1);
		const safetyTimer = setTimeout(() => {
			if (isMounted) setLoading(false);
		}, 3500);
		const isMovieOnly = filters.mediaType === "movie";
		const isTvOnly = filters.mediaType === "tv";
		if (isMovieOnly) getPaginatedMovies({
			page: 1,
			query: filters.query,
			genre: filters.genre,
			year: filters.year,
			minRating: filters.minRating,
			sortBy: filters.sortBy
		}).then((res) => {
			if (!isMounted) return;
			clearTimeout(safetyTimer);
			setItems(res.items);
			setTotalPages(res.totalPages);
			setTotalResults(res.totalResults);
			setLoading(false);
		}).catch((err) => {
			console.error("Failed to fetch movies from TMDB:", err);
			if (!isMounted) return;
			clearTimeout(safetyTimer);
			setItems([]);
			setLoading(false);
		});
		else if (isTvOnly) getPaginatedTVShows({
			page: 1,
			query: filters.query,
			genre: filters.genre,
			year: filters.year,
			minRating: filters.minRating,
			sortBy: filters.sortBy
		}).then((res) => {
			if (!isMounted) return;
			clearTimeout(safetyTimer);
			setItems(res.items || []);
			setTotalPages(res.totalPages || 1);
			setTotalResults(res.totalResults || 0);
			setLoading(false);
		}).catch((err) => {
			console.error("Failed to fetch TV shows from TMDB:", err);
			if (!isMounted) return;
			clearTimeout(safetyTimer);
			setItems([]);
			setLoading(false);
		});
		else searchMedia(filters).then((result) => {
			if (!isMounted) return;
			clearTimeout(safetyTimer);
			setItems(result.items);
			setTotalPages(Math.max(1, Math.ceil(result.total / (result.pageSize || 12))));
			setTotalResults(result.total);
			setLoading(false);
		}).catch((err) => {
			console.error("Failed to search media:", err);
			if (!isMounted) return;
			clearTimeout(safetyTimer);
			setItems([]);
			setLoading(false);
		});
		return () => {
			isMounted = false;
			clearTimeout(safetyTimer);
		};
	}, [filters]);
	const handleLoadMore = useCallback(async () => {
		if (loadingMore || page >= totalPages) return;
		setLoadingMore(true);
		const nextPage = page + 1;
		try {
			if (filters.mediaType === "movie") {
				const res = await getPaginatedMovies({
					page: nextPage,
					query: filters.query,
					genre: filters.genre,
					year: filters.year,
					minRating: filters.minRating,
					sortBy: filters.sortBy
				});
				setItems((prev) => {
					const seen = new Set(prev.map((item) => item.id));
					const newItems = res.items.filter((item) => !seen.has(item.id));
					return [...prev, ...newItems];
				});
				setPage(nextPage);
				setTotalPages(res.totalPages);
				setTotalResults(res.totalResults);
			} else if (filters.mediaType === "tv") {
				const res = await getPaginatedTVShows({
					page: nextPage,
					query: filters.query,
					genre: filters.genre,
					year: filters.year,
					minRating: filters.minRating,
					sortBy: filters.sortBy
				});
				if (res.items && res.items.length > 0) {
					setItems((prev) => {
						const seen = new Set(prev.map((item) => item.id));
						const newItems = res.items.filter((item) => !seen.has(item.id));
						return [...prev, ...newItems];
					});
					setPage(nextPage);
				}
				setTotalPages(res.totalPages || 1);
				setTotalResults(res.totalResults || 0);
			}
		} catch (err) {
			console.error("Failed to load next page:", err);
		} finally {
			setLoadingMore(false);
		}
	}, [
		loadingMore,
		page,
		totalPages,
		filters
	]);
	const sentinelRef = useRef(null);
	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || loading || loadingMore || page >= totalPages) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0]?.isIntersecting && !loading && !loadingMore) handleLoadMore();
		}, { rootMargin: "200px" });
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [
		loading,
		loadingMore,
		page,
		totalPages,
		handleLoadMore
	]);
	const updateFilter = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value
		}));
	};
	const handleSearchChange = (val) => {
		setSearchInput(val);
		if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
		searchDebounceRef.current = setTimeout(() => {
			updateFilter("query", val.trim() || void 0);
		}, 350);
	};
	const clearSearch = () => {
		setSearchInput("");
		updateFilter("query", void 0);
	};
	const clearFilters = () => {
		setSearchInput("");
		setFilters({
			mediaType: initialMediaType,
			sortBy: "popular"
		});
	};
	const hasActiveFilters = !!(filters.genre || filters.year || filters.minRating || filters.query || filters.sortBy && filters.sortBy !== "popular");
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen pt-24 pb-20",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl sm:text-3xl font-bold tracking-tight",
						children: initialMediaType === "movie" ? "Movies" : initialMediaType === "anime" ? "Anime" : initialMediaType === "tv" ? "TV Shows" : "Browse Catalog"
					}), (filters.mediaType === "movie" || filters.mediaType === "tv") && totalResults > 0 && !loading && /* @__PURE__ */ jsxs("p", {
						className: "text-xs text-text-muted mt-1",
						children: [
							"Showing ",
							items.length,
							" of ",
							totalResults.toLocaleString(),
							" titles from TMDB"
						]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2 sm:gap-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "relative flex-1 sm:w-64 max-w-xs",
								children: [
									/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" }),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										value: searchInput,
										onChange: (e) => handleSearchChange(e.target.value),
										placeholder: initialMediaType === "movie" ? "Search TMDB movies..." : initialMediaType === "tv" ? "Search TMDB TV shows..." : "Search titles...",
										className: "w-full h-9 pl-9 pr-8 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent/50 transition-colors"
									}),
									searchInput && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: clearSearch,
										className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5",
										"aria-label": "Clear search",
										children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
									})
								]
							}),
							/* @__PURE__ */ jsxs(Button, {
								variant: showFilters ? "secondary" : "ghost",
								size: "sm",
								onClick: () => setShowFilters(!showFilters),
								children: [
									/* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }),
									"Filters",
									hasActiveFilters && /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent" })
								]
							}),
							hasActiveFilters && /* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								size: "sm",
								onClick: clearFilters,
								children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), "Clear"]
							})
						]
					})]
				}),
				initialMediaType === "all" && /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-1 mb-6 overflow-x-auto scrollbar-hide pb-2",
					children: mediaTypes.map((type) => /* @__PURE__ */ jsx("button", {
						onClick: () => updateFilter("mediaType", type.value),
						className: cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors", filters.mediaType === type.value ? "bg-accent text-white" : "bg-white/[0.04] text-text-secondary hover:text-text-primary hover:bg-white/[0.08]"),
						children: type.label
					}, type.value))
				}),
				showFilters && /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 p-5 bg-surface rounded-2xl border border-border animate-fade-in shadow-xl shadow-black/20",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block",
							children: "Genre"
						}), /* @__PURE__ */ jsxs("select", {
							value: filters.genre || "",
							onChange: (e) => updateFilter("genre", e.target.value || void 0),
							className: "w-full h-9 bg-card border border-border rounded-lg px-3 text-sm text-text-primary outline-none focus:border-accent/50",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "All Genres"
							}), genres.map((g) => /* @__PURE__ */ jsx("option", {
								value: g.slug,
								children: g.name
							}, g.id))]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block",
							children: "Release Year"
						}), /* @__PURE__ */ jsxs("select", {
							value: filters.year || "",
							onChange: (e) => updateFilter("year", e.target.value ? Number(e.target.value) : void 0),
							className: "w-full h-9 bg-card border border-border rounded-lg px-3 text-sm text-text-primary outline-none focus:border-accent/50",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "Any Year"
							}), yearOptions.map((y) => /* @__PURE__ */ jsx("option", {
								value: y,
								children: y
							}, y))]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block",
							children: "Min Rating"
						}), /* @__PURE__ */ jsxs("select", {
							value: filters.minRating || "",
							onChange: (e) => updateFilter("minRating", e.target.value ? Number(e.target.value) : void 0),
							className: "w-full h-9 bg-card border border-border rounded-lg px-3 text-sm text-text-primary outline-none focus:border-accent/50",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: "Any Rating"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "9",
									children: "9+ (Masterpiece)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "8",
									children: "8+ (Great)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "7",
									children: "7+ (Good)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "6",
									children: "6+ (Above Average)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "5",
									children: "5+ (Average)"
								})
							]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block",
							children: "Sort By"
						}), /* @__PURE__ */ jsx("select", {
							value: filters.sortBy || "popular",
							onChange: (e) => updateFilter("sortBy", e.target.value),
							className: "w-full h-9 bg-card border border-border rounded-lg px-3 text-sm text-text-primary outline-none focus:border-accent/50",
							children: sortOptions.map((opt) => /* @__PURE__ */ jsx("option", {
								value: opt.value,
								children: opt.label
							}, opt.value))
						})] })
					]
				}),
				loading ? /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6",
					children: Array.from({ length: 20 }).map((_, i) => /* @__PURE__ */ jsxs("div", {
						className: "animate-pulse",
						children: [
							/* @__PURE__ */ jsx("div", { className: "aspect-[2/3] rounded-xl bg-card border border-border/50" }),
							/* @__PURE__ */ jsx("div", { className: "mt-2.5 h-4 w-3/4 rounded bg-card" }),
							/* @__PURE__ */ jsx("div", { className: "mt-1.5 h-3 w-1/2 rounded bg-card" })
						]
					}, i))
				}) : items.length > 0 ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6",
					children: items.map((item, i) => /* @__PURE__ */ jsx(MediaCard, {
						item,
						index: i,
						className: "w-full"
					}, `${item.id}-${i}`))
				}), (filters.mediaType === "movie" || filters.mediaType === "tv") && page < totalPages && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
					ref: sentinelRef,
					className: "h-10 w-full pointer-events-none"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center mt-6 gap-3",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "secondary",
						size: "lg",
						onClick: handleLoadMore,
						disabled: loadingMore,
						className: "px-8 py-3 rounded-xl border border-white/15 hover:border-accent/50 hover:bg-white/[0.08] transition-all group",
						children: loadingMore ? /* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("div", { className: "h-4 w-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" }), filters.mediaType === "tv" ? "Loading more TV shows..." : "Loading more movies..."]
						}) : /* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-2",
							children: [filters.mediaType === "tv" ? "Load More TV Shows" : "Load More Movies", /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-text-muted group-hover:translate-y-0.5 transition-transform" })]
						})
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-xs text-text-muted",
						children: [
							"Showing ",
							items.length,
							" of ",
							totalResults.toLocaleString(),
							" titles (Page ",
							page,
							" of ",
							totalPages.toLocaleString(),
							")"
						]
					})]
				})] })] }) : /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center gap-4 py-20",
					children: [
						/* @__PURE__ */ jsx(Filter, { className: "h-12 w-12 text-text-faint" }),
						/* @__PURE__ */ jsx("p", {
							className: "text-text-muted text-lg font-medium",
							children: filters.mediaType === "tv" ? "No TV shows found matching your criteria" : filters.mediaType === "movie" ? "No movies found matching your criteria" : "No titles found matching your criteria"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-text-faint text-sm",
							children: "Try adjusting your search term or clearing filters"
						}),
						/* @__PURE__ */ jsx(Button, {
							variant: "secondary",
							size: "sm",
							onClick: clearFilters,
							children: "Clear Filters"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { BrowseView as t };
