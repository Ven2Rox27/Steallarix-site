import { n as Badge, r as cn } from "./Button_Bg0pP7Dn.mjs";
import { t as useWatchlistStore } from "./watchlistStore_D17gYysV.mjs";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Heart, Play, Plus, Star } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/MediaCard/MediaCard.tsx
function MediaCard({ item, progress, index = 0, className }) {
	const [imgLoaded, setImgLoaded] = useState(false);
	const [imgError, setImgError] = useState(false);
	const { isInWatchlist, toggleItem } = useWatchlistStore();
	const inWatchlist = isInWatchlist(item.id);
	const progressPercent = progress ? Math.round(progress.position / progress.duration * 100) : 0;
	const detailUrl = item.mediaType === "movie" ? `/movie/${item.id}` : `/${item.mediaType}/${item.id}`;
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .3,
			delay: index * .05
		},
		className: cn("group relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]", className),
		children: [/* @__PURE__ */ jsx("a", {
			href: detailUrl,
			className: "block",
			children: /* @__PURE__ */ jsxs("div", {
				className: "relative aspect-[2/3] rounded-xl overflow-hidden bg-card border border-border-subtle group-hover:border-border-strong transition-all duration-300 group-hover:scale-[1.03] group-hover:card-shadow-lg",
				children: [
					!imgError ? /* @__PURE__ */ jsx("img", {
						src: item.posterUrl,
						alt: item.title,
						loading: "lazy",
						onLoad: () => setImgLoaded(true),
						onError: () => setImgError(true),
						className: cn("absolute inset-0 w-full h-full object-cover transition-all duration-500", imgLoaded ? "opacity-100" : "opacity-0")
					}) : /* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 flex items-center justify-center bg-card",
						children: /* @__PURE__ */ jsx("span", {
							className: "text-text-muted text-xs text-center px-2",
							children: item.title
						})
					}),
					!imgLoaded && !imgError && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-card animate-pulse" }),
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
					/* @__PURE__ */ jsx("div", {
						className: "absolute top-2 left-2",
						children: /* @__PURE__ */ jsxs(Badge, {
							variant: "rating",
							children: [/* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-current" }), typeof item.rating === "number" && !isNaN(item.rating) ? item.rating.toFixed(1) : "8.0"]
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
						className: "absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-1 mb-2",
							children: (item.genres || []).filter(Boolean).slice(0, 2).map((genre, idx) => {
								const gName = typeof genre === "string" ? genre : genre?.name || "";
								const gKey = typeof genre === "object" && genre?.id ? genre.id : `${item.id}-g-${idx}`;
								if (!gName) return null;
								return /* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-text-secondary bg-white/10 px-1.5 py-0.5 rounded",
									children: gName
								}, gKey);
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ jsx("button", {
									className: "flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors",
									"aria-label": `Play ${item.title}`,
									onClick: (e) => {
										e.preventDefault();
										window.location.href = item.mediaType === "movie" ? `/watch/${item.id}` : detailUrl;
									},
									children: /* @__PURE__ */ jsx(Play, { className: "h-3.5 w-3.5 fill-current ml-0.5" })
								}),
								/* @__PURE__ */ jsx("button", {
									className: cn("flex h-8 w-8 items-center justify-center rounded-full border transition-colors", inWatchlist ? "bg-accent/20 border-accent/40 text-accent" : "bg-black/30 border-white/20 text-white hover:border-white/40"),
									"aria-label": inWatchlist ? `Remove ${item.title} from watchlist` : `Add ${item.title} to watchlist`,
									onClick: (e) => {
										e.preventDefault();
										toggleItem(item);
									},
									children: inWatchlist ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ jsx("button", {
									className: "flex h-8 w-8 items-center justify-center rounded-full bg-black/30 border border-white/20 text-white hover:border-white/40 transition-colors",
									"aria-label": `Like ${item.title}`,
									onClick: (e) => e.preventDefault(),
									children: /* @__PURE__ */ jsx(Heart, { className: "h-3.5 w-3.5" })
								})
							]
						})]
					}),
					progress && progressPercent > 0 && /* @__PURE__ */ jsx("div", {
						className: "absolute bottom-0 left-0 right-0 h-1 bg-white/10",
						children: /* @__PURE__ */ jsx("div", {
							className: "h-full bg-accent rounded-r-full transition-all",
							style: { width: `${Math.min(progressPercent, 100)}%` }
						})
					})
				]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-2 px-0.5",
			children: [
				/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-medium text-text-primary truncate",
					children: /* @__PURE__ */ jsx("a", {
						href: detailUrl,
						className: "hover:text-accent transition-colors",
						children: item.title
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 mt-0.5 text-xs text-text-muted",
					children: [
						/* @__PURE__ */ jsx("span", { children: item.year }),
						item.duration && item.mediaType === "movie" && /* @__PURE__ */ jsxs("span", { children: [
							Math.floor(item.duration / 60),
							"h ",
							item.duration % 60,
							"m"
						] }),
						item.totalEpisodes && /* @__PURE__ */ jsxs("span", { children: [item.totalEpisodes, " eps"] })
					]
				}),
				progress && /* @__PURE__ */ jsx("p", {
					className: "text-[11px] text-text-muted mt-0.5 truncate",
					children: progress.episodeTitle ? `S${progress.seasonNumber} E${progress.episodeNumber} · ${progress.episodeTitle}` : `${Math.round(progressPercent)}% watched`
				})
			]
		})]
	});
}
//#endregion
export { MediaCard as t };
