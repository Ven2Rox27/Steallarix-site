import { n as Badge, r as cn } from "./Button_Bg0pP7Dn.mjs";
import { h as searchMedia } from "./mediaService_j-ke5bX4.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Clock, Film, LayoutGrid, Menu, Play, Search, Sparkles, Star, TrendingUp, Tv, User, X } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/Navbar/Navbar.tsx
var navLinks = [
	{
		href: "/",
		label: "Home",
		icon: Play
	},
	{
		href: "/movies",
		label: "Movies",
		icon: Film
	},
	{
		href: "/anime",
		label: "Anime",
		icon: Sparkles
	},
	{
		href: "/tv-shows",
		label: "TV Shows",
		icon: Tv
	},
	{
		href: "/browse",
		label: "Browse",
		icon: LayoutGrid
	}
];
function Navbar({ currentPath = "/", onSearchOpen }) {
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const handleScroll = useCallback(() => {
		setScrolled(window.scrollY > 20);
	}, []);
	useEffect(() => {
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) setMobileMenuOpen(false);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	useEffect(() => {
		document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileMenuOpen]);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("nav", {
		className: cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500", scrolled ? "glass-strong border-b border-border shadow-lg shadow-black/20" : "bg-gradient-to-b from-base/80 to-transparent"),
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex h-16 items-center justify-between gap-4",
				children: [
					/* @__PURE__ */ jsxs("a", {
						href: "/",
						className: "flex items-center gap-2.5 shrink-0",
						children: [/* @__PURE__ */ jsx("div", {
							className: "relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan via-accent to-accent-magenta",
							children: /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 text-white fill-white" })
						}), /* @__PURE__ */ jsx("span", {
							className: "text-lg font-bold tracking-tight text-text-primary hidden sm:block",
							children: "Stellarix"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "hidden lg:flex items-center gap-1",
						children: navLinks.map((link) => {
							const isActive = link.href === "/" ? currentPath === "/" : currentPath?.startsWith(link.href);
							return /* @__PURE__ */ jsxs("a", {
								href: link.href,
								className: cn("relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200", isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"),
								children: [link.label, isActive && /* @__PURE__ */ jsx(motion.div, {
									layoutId: "nav-indicator",
									className: "absolute inset-0 rounded-lg bg-white/[0.06]",
									transition: {
										type: "spring",
										bounce: .2,
										duration: .4
									}
								})]
							}, link.href);
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ jsx("button", {
								onClick: onSearchOpen,
								className: "flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors",
								"aria-label": "Search",
								children: /* @__PURE__ */ jsx(Search, { className: "h-[18px] w-[18px]" })
							}),
							/* @__PURE__ */ jsx("a", {
								href: "/watchlist",
								className: cn("flex h-9 w-9 items-center justify-center rounded-lg transition-colors", currentPath === "/watchlist" ? "text-accent bg-white/[0.06]" : "text-text-secondary hover:text-text-primary hover:bg-white/[0.06]"),
								"aria-label": "Watchlist",
								children: /* @__PURE__ */ jsx(Bookmark, { className: "h-[18px] w-[18px]" })
							}),
							/* @__PURE__ */ jsx("button", {
								className: "hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent-magenta/20 border border-border text-text-secondary hover:text-text-primary transition-colors",
								"aria-label": "User profile",
								children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => setMobileMenuOpen(!mobileMenuOpen),
								className: "flex lg:hidden h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors",
								"aria-label": mobileMenuOpen ? "Close menu" : "Open menu",
								children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
							})
						]
					})
				]
			})
		})
	}), /* @__PURE__ */ jsx(AnimatePresence, { children: mobileMenuOpen && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .2 },
		className: "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden",
		onClick: () => setMobileMenuOpen(false)
	}), /* @__PURE__ */ jsxs(motion.div, {
		initial: { x: "100%" },
		animate: { x: 0 },
		exit: { x: "100%" },
		transition: {
			type: "spring",
			damping: 30,
			stiffness: 300
		},
		className: "fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface border-l border-border lg:hidden overflow-y-auto",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between p-4 border-b border-border",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-lg font-bold tracking-tight text-text-primary",
				children: "Stellarix"
			}), /* @__PURE__ */ jsx("button", {
				onClick: () => setMobileMenuOpen(false),
				className: "flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors",
				"aria-label": "Close menu",
				children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
			})]
		}), /* @__PURE__ */ jsxs("nav", {
			className: "p-4 space-y-1",
			children: [navLinks.map((link) => {
				const isActive = link.href === "/" ? currentPath === "/" : currentPath?.startsWith(link.href);
				const Icon = link.icon;
				return /* @__PURE__ */ jsxs("a", {
					href: link.href,
					className: cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive ? "text-text-primary bg-white/[0.06]" : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"),
					children: [/* @__PURE__ */ jsx(Icon, { className: "h-4.5 w-4.5" }), link.label]
				}, link.href);
			}), /* @__PURE__ */ jsx("div", {
				className: "pt-3 mt-3 border-t border-border space-y-1",
				children: /* @__PURE__ */ jsxs("a", {
					href: "/watchlist",
					className: cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", currentPath === "/watchlist" ? "text-accent bg-white/[0.06]" : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"),
					children: [/* @__PURE__ */ jsx(Bookmark, { className: "h-4.5 w-4.5" }), "Watchlist"]
				})
			})]
		})]
	})] }) })] });
}
//#endregion
//#region src/components/Search/SearchOverlay.tsx
var RECENT_SEARCHES_KEY = "stellarix-recent-searches";
function getRecentSearches() {
	try {
		return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
	} catch {
		return [];
	}
}
function saveRecentSearch(query) {
	const searches = getRecentSearches().filter((s) => s !== query);
	searches.unshift(query);
	localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, 8)));
}
function SearchOverlay({ isOpen, onClose }) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [recentSearches, setRecentSearches] = useState([]);
	const inputRef = useRef(null);
	const debounceRef = useRef();
	useEffect(() => {
		if (isOpen) {
			setRecentSearches(getRecentSearches());
			setTimeout(() => inputRef.current?.focus(), 100);
		} else {
			setQuery("");
			setResults([]);
		}
	}, [isOpen]);
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && isOpen) onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);
	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);
	const doSearch = useCallback(async (q) => {
		if (q.trim().length < 2) {
			setResults([]);
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const result = await searchMedia({ query: q });
			setResults(result.items);
		} catch {
			setResults([]);
		} finally {
			setLoading(false);
		}
	}, []);
	const handleInputChange = (value) => {
		setQuery(value);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => doSearch(value), 300);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (query.trim()) {
			saveRecentSearch(query.trim());
			doSearch(query);
		}
	};
	const handleRecentClick = (q) => {
		setQuery(q);
		doSearch(q);
	};
	return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .2 },
		className: "fixed inset-0 z-[60] bg-base/95 backdrop-blur-xl",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl px-4 pt-20 sm:pt-24",
			children: [/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "relative",
				children: [
					/* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" }),
					/* @__PURE__ */ jsx("input", {
						ref: inputRef,
						type: "text",
						value: query,
						onChange: (e) => handleInputChange(e.target.value),
						placeholder: "Search movies, anime, TV shows...",
						className: "w-full h-14 pl-12 pr-12 bg-surface border border-border rounded-2xl text-text-primary text-lg placeholder:text-text-faint outline-none focus:border-accent/50 transition-colors",
						autoComplete: "off"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors",
						"aria-label": "Close search",
						children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-6 max-h-[60vh] overflow-y-auto",
				children: [
					loading && /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 py-8 justify-center",
						children: [/* @__PURE__ */ jsx("div", { className: "h-5 w-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" }), /* @__PURE__ */ jsx("span", {
							className: "text-text-muted text-sm",
							children: "Searching..."
						})]
					}),
					!loading && results.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-xs text-text-muted px-2 mb-3",
							children: [
								results.length,
								" result",
								results.length !== 1 ? "s" : "",
								" found"
							]
						}), results.map((item) => /* @__PURE__ */ jsxs("a", {
							href: item.mediaType === "movie" ? `/movie/${item.id}` : `/${item.mediaType}/${item.id}`,
							className: "flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-colors",
							onClick: () => {
								if (query.trim()) saveRecentSearch(query.trim());
								onClose();
							},
							children: [/* @__PURE__ */ jsx("img", {
								src: item.posterUrl,
								alt: item.title,
								className: "h-16 w-11 rounded-lg object-cover bg-card shrink-0",
								loading: "lazy"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ jsx("h4", {
										className: "text-sm font-medium text-text-primary truncate",
										children: item.title
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 mt-0.5",
										children: [
											/* @__PURE__ */ jsx(Badge, {
												variant: "type",
												className: "text-[9px]",
												children: item.mediaType
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-xs text-text-muted",
												children: item.year
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-0.5 text-xs text-accent-amber",
												children: [/* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-current" }), item.rating.toFixed(1)]
											})
										]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-text-muted mt-1 line-clamp-1",
										children: item.genres.map((g) => g.name).join(" · ")
									})
								]
							})]
						}, item.id))]
					}),
					!loading && query.trim().length >= 2 && results.length === 0 && /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center gap-3 py-12",
						children: [
							/* @__PURE__ */ jsx(Search, { className: "h-10 w-10 text-text-faint" }),
							/* @__PURE__ */ jsxs("p", {
								className: "text-text-muted text-sm",
								children: [
									"No results found for \"",
									query,
									"\""
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-text-faint text-xs",
								children: "Try a different search term"
							})
						]
					}),
					!loading && !query.trim() && recentSearches.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 px-2 mb-3",
						children: [/* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-text-muted" }), /* @__PURE__ */ jsx("span", {
							className: "text-xs font-medium text-text-muted uppercase tracking-wider",
							children: "Recent Searches"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-2",
						children: recentSearches.map((search) => /* @__PURE__ */ jsx("button", {
							onClick: () => handleRecentClick(search),
							className: "px-3 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.08] transition-colors",
							children: search
						}, search))
					})] }),
					!loading && !query.trim() && recentSearches.length === 0 && /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center gap-3 py-12",
						children: [/* @__PURE__ */ jsx(TrendingUp, { className: "h-10 w-10 text-text-faint" }), /* @__PURE__ */ jsx("p", {
							className: "text-text-muted text-sm",
							children: "Search for your favorite movies, anime, and TV shows"
						})]
					})
				]
			})]
		})
	}) });
}
//#endregion
//#region src/components/AppShell.tsx
function AppShell({ currentPath }) {
	const [searchOpen, setSearchOpen] = useState(false);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Navbar, {
		currentPath,
		onSearchOpen: () => setSearchOpen(true)
	}), /* @__PURE__ */ jsx(SearchOverlay, {
		isOpen: searchOpen,
		onClose: () => setSearchOpen(false)
	})] });
}
//#endregion
export { AppShell as t };
