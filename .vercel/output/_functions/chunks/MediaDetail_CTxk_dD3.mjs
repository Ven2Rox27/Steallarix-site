import { n as Badge, r as cn, t as Button } from "./Button_Bg0pP7Dn.mjs";
import { d as getSeasons, r as getEpisodes, u as getRecommendations } from "./mediaService_j-ke5bX4.mjs";
import { t as useWatchlistStore } from "./watchlistStore_D17gYysV.mjs";
import { t as MediaRail } from "./MediaRail_DrbBZXQ7.mjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Calendar, Check, Clock, Film, Play, Plus, Star, Users } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/EpisodeGrid/EpisodeGrid.tsx
function EpisodeGrid({ seasons, episodes, activeSeason, onSeasonChange, loading, seriesId }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
		className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-lg font-semibold",
				children: "Episodes"
			}),
			seasons.length > 1 && /* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1",
				children: seasons.map((season) => /* @__PURE__ */ jsxs("button", {
					onClick: () => onSeasonChange(season),
					className: cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors", activeSeason?.id === season.id ? "bg-accent text-white" : "bg-white/[0.04] text-text-secondary hover:text-text-primary hover:bg-white/[0.08]"),
					children: ["Season ", season.seasonNumber]
				}, season.id))
			}),
			seasons.length === 1 && activeSeason && /* @__PURE__ */ jsxs("span", {
				className: "text-sm text-text-muted",
				children: [
					"Season ",
					activeSeason.seasonNumber,
					" · ",
					activeSeason.title
				]
			})
		]
	}), loading ? /* @__PURE__ */ jsx("div", {
		className: "space-y-3",
		children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxs("div", {
			className: "flex gap-4 animate-pulse",
			children: [/* @__PURE__ */ jsx("div", { className: "w-40 sm:w-52 aspect-video rounded-xl bg-card shrink-0" }), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 py-1",
				children: [
					/* @__PURE__ */ jsx("div", { className: "h-4 w-2/3 rounded bg-card mb-2" }),
					/* @__PURE__ */ jsx("div", { className: "h-3 w-full rounded bg-card mb-1" }),
					/* @__PURE__ */ jsx("div", { className: "h-3 w-3/4 rounded bg-card" })
				]
			})]
		}, i))
	}) : episodes.length > 0 ? /* @__PURE__ */ jsx("div", {
		className: "space-y-2",
		children: episodes.map((ep) => /* @__PURE__ */ jsxs("a", {
			href: `/watch/${seriesId}?ep=${ep.id}`,
			className: cn("group flex gap-4 p-3 rounded-xl transition-colors hover:bg-white/[0.03] border border-transparent hover:border-border-subtle", ep.isFiller && "opacity-75"),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "relative w-36 sm:w-48 aspect-video rounded-lg overflow-hidden bg-card shrink-0",
				children: [
					/* @__PURE__ */ jsx("img", {
						src: ep.thumbnailUrl,
						alt: ep.title,
						className: "w-full h-full object-cover",
						loading: "lazy"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity",
						children: /* @__PURE__ */ jsx("div", {
							className: "h-10 w-10 flex items-center justify-center rounded-full bg-white/90",
							children: /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 text-black fill-black ml-0.5" })
						})
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "absolute bottom-1.5 right-1.5 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded font-medium",
						children: [ep.duration, "m"]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 min-w-0 py-0.5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-2 mb-1",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-xs text-text-muted font-mono shrink-0",
							children: ["E", ep.episodeNumber.toString().padStart(2, "0")]
						}), /* @__PURE__ */ jsx("h3", {
							className: "text-sm font-medium text-text-primary truncate",
							children: ep.title
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 text-[11px] text-text-muted mb-1.5",
						children: [
							ep.airDate && /* @__PURE__ */ jsx("span", { children: ep.airDate }),
							ep.airDate && ep.duration ? /* @__PURE__ */ jsx("span", { children: "·" }) : null,
							ep.duration ? /* @__PURE__ */ jsxs("span", { children: [ep.duration, " min"] }) : null
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-text-muted line-clamp-2 mb-2 hidden sm:block",
						children: ep.description
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							ep.isFiller && /* @__PURE__ */ jsxs(Badge, {
								variant: "filler",
								children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-3 w-3" }), "Filler"]
							}),
							ep.isWatched && /* @__PURE__ */ jsxs(Badge, {
								variant: "default",
								children: [/* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }), "Watched"]
							}),
							ep.audioType && ep.audioType !== "both" && /* @__PURE__ */ jsx(Badge, {
								variant: "accent",
								className: "text-[9px]",
								children: ep.audioType === "sub" ? "SUB" : "DUB"
							})
						]
					})
				]
			})]
		}, ep.id))
	}) : /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center gap-3 py-12",
		children: [/* @__PURE__ */ jsx(Play, { className: "h-10 w-10 text-text-faint" }), /* @__PURE__ */ jsx("p", {
			className: "text-text-muted text-sm",
			children: "No episodes available"
		})]
	})] });
}
//#endregion
//#region src/components/MediaDetail/MediaDetail.tsx
function MediaDetail({ item }) {
	const [seasons, setSeasons] = useState([]);
	const [activeSeason, setActiveSeason] = useState(null);
	const [episodes, setEpisodes] = useState([]);
	const [recommendations, setRecommendations] = useState([]);
	const [episodesLoading, setEpisodesLoading] = useState(false);
	const { isInWatchlist, toggleItem } = useWatchlistStore();
	const inWatchlist = isInWatchlist(item.id);
	const hasSeries = item.mediaType === "anime" || item.mediaType === "tv";
	useEffect(() => {
		if (hasSeries) getSeasons(item.id).then((s) => {
			setSeasons(s);
			if (s.length > 0) setActiveSeason(s[0]);
		});
		getRecommendations(item.id).then(setRecommendations);
	}, [item.id, hasSeries]);
	useEffect(() => {
		if (!activeSeason) return;
		setEpisodesLoading(true);
		getEpisodes(item.id, activeSeason.id).then((eps) => {
			setEpisodes(eps);
			setEpisodesLoading(false);
		});
	}, [activeSeason, item.id]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative h-[60vh] min-h-[400px] max-h-[700px] overflow-hidden",
			children: [
				/* @__PURE__ */ jsx("img", {
					src: item.backdropUrl,
					alt: "",
					className: "absolute inset-0 w-full h-full object-cover"
				}),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-base via-base/70 to-base/30" }),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-base via-base/40 to-transparent" }),
				/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-base to-transparent" }),
				/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 flex items-end pb-12",
					children: /* @__PURE__ */ jsx("div", {
						className: "mx-auto max-w-[1440px] w-full px-4 sm:px-6 lg:px-8",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex gap-6 lg:gap-10 items-end",
							children: [/* @__PURE__ */ jsx(motion.div, {
								initial: {
									opacity: 0,
									y: 20
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: { duration: .5 },
								className: "hidden sm:block shrink-0",
								children: /* @__PURE__ */ jsx("img", {
									src: item.posterUrl,
									alt: item.title,
									className: "w-40 lg:w-52 rounded-2xl shadow-2xl shadow-black/50 border border-border"
								})
							}), /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									y: 20
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: .5,
									delay: .1
								},
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-2 mb-3",
										children: [
											/* @__PURE__ */ jsx(Badge, {
												variant: "type",
												children: item.mediaType
											}),
											item.badges.map((b) => /* @__PURE__ */ jsx(Badge, {
												variant: "quality",
												children: b
											}, b)),
											item.audioType && /* @__PURE__ */ jsx(Badge, {
												variant: "accent",
												children: item.audioType === "both" ? "SUB & DUB" : item.audioType.toUpperCase()
											}),
											item.status && /* @__PURE__ */ jsx(Badge, {
												variant: item.status === "ongoing" ? "accent" : "default",
												children: item.status
											})
										]
									}),
									/* @__PURE__ */ jsx("h1", {
										className: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-2",
										children: item.title
									}),
									item.originalTitle && item.originalTitle.toLowerCase() !== item.title.toLowerCase() && /* @__PURE__ */ jsxs("p", {
										className: "text-sm text-text-muted mb-3 italic",
										children: ["Original Name: ", item.originalTitle]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-3",
										children: [
											item.imdbRating ? /* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1.5 bg-accent-amber/10 px-2.5 py-0.5 rounded-md text-accent-amber font-semibold",
												children: [
													/* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5 fill-current" }),
													"IMDb ",
													item.imdbRating.toFixed(1),
													item.voteCount ? /* @__PURE__ */ jsxs("span", {
														className: "text-xs font-normal text-text-muted",
														children: [
															"(",
															item.voteCount.toLocaleString(),
															" votes)"
														]
													}) : null
												]
											}) : item.malRating ? /* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1 bg-accent-blue/10 px-2 py-0.5 rounded-md text-accent-blue font-semibold",
												children: [
													/* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5 fill-current" }),
													"MAL ",
													item.malRating.toFixed(1)
												]
											}) : /* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1.5 text-accent-amber",
												children: [
													/* @__PURE__ */ jsx(Star, { className: "h-4 w-4 fill-current" }),
													item.rating.toFixed(1),
													item.voteCount ? /* @__PURE__ */ jsxs("span", {
														className: "text-xs text-text-muted",
														children: [
															"(",
															item.voteCount.toLocaleString(),
															" votes)"
														]
													}) : null
												]
											}),
											item.firstAirDate && item.mediaType === "tv" ? /* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5" }),
													item.firstAirDate,
													" ",
													item.lastAirDate && item.lastAirDate !== item.firstAirDate ? `– ${item.lastAirDate}` : ""
												]
											}) : /* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5" }), item.releaseDate || item.year]
											}),
											item.duration && /* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5" }), item.mediaType === "movie" ? `${Math.floor(item.duration / 60)}h ${item.duration % 60}m` : `${item.duration}m / ep`]
											}),
											item.totalEpisodes && /* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ jsx(Film, { className: "h-3.5 w-3.5" }),
													item.totalEpisodes,
													" Episodes"
												]
											}),
											item.totalSeasons && /* @__PURE__ */ jsxs("span", { children: [
												item.totalSeasons,
												" Season",
												item.totalSeasons > 1 ? "s" : ""
											] }),
											item.director && /* @__PURE__ */ jsxs("span", {
												className: "text-text-secondary",
												children: [
													/* @__PURE__ */ jsx("span", {
														className: "text-text-muted",
														children: "Dir:"
													}),
													" ",
													item.director
												]
											}),
											item.studio && /* @__PURE__ */ jsx("span", {
												className: "text-text-muted",
												children: item.studio
											})
										]
									}),
									(item.imdbId || item.tmdbId) && /* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-2 mb-4",
										children: [item.imdbId && /* @__PURE__ */ jsxs("a", {
											href: `https://www.imdb.com/title/${item.imdbId}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "inline-flex items-center gap-1 bg-[#f5c518]/15 hover:bg-[#f5c518]/25 text-[#f5c518] border border-[#f5c518]/30 px-2.5 py-0.5 rounded-md text-xs font-semibold transition-colors",
											title: "View on IMDb",
											children: ["IMDb: ", item.imdbId]
										}), item.tmdbId && /* @__PURE__ */ jsxs("a", {
											href: item.mediaType === "tv" ? `https://www.themoviedb.org/tv/${item.tmdbId}` : `https://www.themoviedb.org/movie/${item.tmdbId}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "inline-flex items-center gap-1 bg-[#01b4e4]/15 hover:bg-[#01b4e4]/25 text-[#01b4e4] border border-[#01b4e4]/30 px-2.5 py-0.5 rounded-md text-xs font-semibold transition-colors",
											title: "View on TMDB",
											children: ["TMDB: ", item.tmdbId]
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-2 mb-5",
										children: item.genres.map((genre) => /* @__PURE__ */ jsx("a", {
											href: `/browse?genre=${genre.slug}`,
											className: "text-xs bg-white/[0.06] hover:bg-white/[0.1] border border-border-subtle px-2.5 py-1 rounded-full text-text-secondary hover:text-text-primary transition-colors",
											children: genre.name
										}, genre.id))
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-3",
										children: [
											/* @__PURE__ */ jsxs(Button, {
												size: "lg",
												href: item.mediaType === "movie" ? `/watch/${item.id}` : void 0,
												onClick: item.mediaType !== "movie" && episodes.length > 0 ? () => {
													window.location.href = `/watch/${item.id}?ep=${episodes[0]?.id}`;
												} : void 0,
												children: [/* @__PURE__ */ jsx(Play, { className: "h-5 w-5 fill-current" }), item.mediaType === "movie" ? "Watch Now" : "Start Watching"]
											}),
											item.trailerUrl && /* @__PURE__ */ jsxs(Button, {
												variant: "secondary",
												size: "lg",
												href: item.trailerUrl,
												target: "_blank",
												rel: "noopener noreferrer",
												children: [/* @__PURE__ */ jsx(Film, { className: "h-4 w-4" }), "Trailer"]
											}),
											/* @__PURE__ */ jsxs(Button, {
												variant: "secondary",
												size: "lg",
												onClick: () => toggleItem(item),
												children: [inWatchlist ? /* @__PURE__ */ jsx(Check, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Plus, { className: "h-5 w-5" }), inWatchlist ? "In Watchlist" : "Add to List"]
											})
										]
									})
								]
							})]
						})
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pb-20",
			children: [
				/* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .4,
						delay: .2
					},
					className: "mt-8 max-w-3xl",
					children: [
						item.tagline && /* @__PURE__ */ jsxs("p", {
							className: "text-base sm:text-lg italic text-text-muted mb-3",
							children: [
								"\"",
								item.tagline,
								"\""
							]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-semibold mb-3",
							children: "Synopsis"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-text-secondary leading-relaxed mb-6",
							children: item.description
						}),
						(item.writers?.length || item.productionCompanies?.length || item.director || item.creators?.length || item.networks?.length || item.countries?.length || item.languages?.length) && /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface border border-border text-sm",
							children: [
								item.director && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-text-muted block text-xs uppercase tracking-wider mb-0.5",
									children: "Director"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-text-primary font-medium",
									children: item.director
								})] }),
								item.creators && item.creators.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-text-muted block text-xs uppercase tracking-wider mb-0.5",
									children: "Creators"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-text-primary font-medium",
									children: item.creators.join(", ")
								})] }),
								item.writers && item.writers.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-text-muted block text-xs uppercase tracking-wider mb-0.5",
									children: "Writers"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-text-primary font-medium",
									children: item.writers.join(", ")
								})] }),
								item.networks && item.networks.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-text-muted block text-xs uppercase tracking-wider mb-0.5",
									children: "Networks"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-text-primary font-medium",
									children: item.networks.join(", ")
								})] }),
								item.countries && item.countries.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-text-muted block text-xs uppercase tracking-wider mb-0.5",
									children: "Country"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-text-secondary",
									children: item.countries.join(", ")
								})] }),
								item.languages && item.languages.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-text-muted block text-xs uppercase tracking-wider mb-0.5",
									children: "Original Language"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-text-secondary uppercase",
									children: item.languages.join(", ")
								})] }),
								item.productionCompanies && item.productionCompanies.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-text-muted block text-xs uppercase tracking-wider mb-0.5",
										children: "Production"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-text-secondary",
										children: item.productionCompanies.join(" · ")
									})]
								})
							]
						})
					]
				}),
				item.cast && item.cast.length > 0 && /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .4,
						delay: .3
					},
					className: "mt-10",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-lg font-semibold mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-text-muted" }), "Cast"]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-4",
						children: item.cast.map((member) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 bg-surface border border-border rounded-xl p-3 min-w-[200px]",
							children: [member.image ? /* @__PURE__ */ jsx("img", {
								src: member.image,
								alt: member.name,
								className: "h-10 w-10 rounded-full object-cover bg-card",
								loading: "lazy"
							}) : /* @__PURE__ */ jsx("div", {
								className: "h-10 w-10 rounded-full bg-card flex items-center justify-center text-text-muted text-sm font-medium",
								children: member.name[0]
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium text-text-primary",
								children: member.name
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-text-muted",
								children: member.character
							})] })]
						}, member.id))
					})]
				}),
				hasSeries && seasons.length > 0 && /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .4,
						delay: .4
					},
					className: "mt-10",
					children: /* @__PURE__ */ jsx(EpisodeGrid, {
						seasons,
						episodes,
						activeSeason,
						onSeasonChange: setActiveSeason,
						loading: episodesLoading,
						seriesId: item.id
					})
				}),
				recommendations.length > 0 && /* @__PURE__ */ jsx("div", {
					className: "mt-12",
					children: /* @__PURE__ */ jsx(MediaRail, {
						title: "You Might Also Like",
						items: recommendations,
						className: "!px-0 [&>div:first-child]:!px-0 [&>div:last-child>div]:!px-0"
					})
				})
			]
		})]
	});
}
//#endregion
export { MediaDetail as t };
