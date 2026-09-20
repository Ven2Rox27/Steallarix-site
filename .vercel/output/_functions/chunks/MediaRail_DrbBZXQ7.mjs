import { r as cn } from "./Button_Bg0pP7Dn.mjs";
import { t as MediaCard } from "./MediaCard_6MMbAUS2.mjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/MediaRail/MediaRail.tsx
function MediaRail({ title, items, progressMap, seeAllHref, className }) {
	const scrollRef = useRef(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const checkScroll = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		setCanScrollLeft(el.scrollLeft > 10);
		setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
	}, []);
	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		checkScroll();
		el.addEventListener("scroll", checkScroll, { passive: true });
		window.addEventListener("resize", checkScroll);
		return () => {
			el.removeEventListener("scroll", checkScroll);
			window.removeEventListener("resize", checkScroll);
		};
	}, [checkScroll, items]);
	const scroll = (direction) => {
		const el = scrollRef.current;
		if (!el) return;
		const scrollAmount = el.clientWidth * .75;
		el.scrollBy({
			left: direction === "left" ? -scrollAmount : scrollAmount,
			behavior: "smooth"
		});
	};
	if (items.length === 0) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: cn("relative", className),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-4",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-lg sm:text-xl font-semibold text-text-primary tracking-tight",
				children: title
			}), seeAllHref && /* @__PURE__ */ jsx("a", {
				href: seeAllHref,
				className: "text-sm text-text-muted hover:text-accent transition-colors",
				children: "See All"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative group/rail",
			children: [
				canScrollLeft && /* @__PURE__ */ jsx("button", {
					onClick: () => scroll("left"),
					className: "absolute left-0 top-0 bottom-12 z-10 w-12 flex items-center justify-center bg-gradient-to-r from-base to-transparent opacity-0 group-hover/rail:opacity-100 transition-opacity duration-300 hidden md:flex",
					"aria-label": "Scroll left",
					children: /* @__PURE__ */ jsx("div", {
						className: "h-10 w-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white",
						children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-5 w-5" })
					})
				}),
				/* @__PURE__ */ jsx("div", {
					ref: scrollRef,
					className: "flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2 scroll-smooth",
					style: { WebkitOverflowScrolling: "touch" },
					children: (items || []).filter((item) => item && item.id).map((item, i) => /* @__PURE__ */ jsx(MediaCard, {
						item,
						index: i,
						progress: progressMap?.[item.id] ?? (progressMap?.[`${item.id}-${progressMap?.[item.id]?.episodeId}`] ? progressMap[item.id] : void 0)
					}, item.id))
				}),
				canScrollRight && /* @__PURE__ */ jsx("button", {
					onClick: () => scroll("right"),
					className: "absolute right-0 top-0 bottom-12 z-10 w-12 flex items-center justify-center bg-gradient-to-l from-base to-transparent opacity-0 group-hover/rail:opacity-100 transition-opacity duration-300 hidden md:flex",
					"aria-label": "Scroll right",
					children: /* @__PURE__ */ jsx("div", {
						className: "h-10 w-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white",
						children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5" })
					})
				})
			]
		})]
	});
}
//#endregion
export { MediaRail as t };
