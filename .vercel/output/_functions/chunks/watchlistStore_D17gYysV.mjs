import { create } from "zustand";
import { persist } from "zustand/middleware";
//#region src/stores/watchlistStore.ts
var useWatchlistStore = create()(persist((set, get) => ({
	items: [],
	addItem: (media) => {
		if (get().items.some((i) => i.mediaId === media.id)) return;
		set((state) => ({ items: [...state.items, {
			mediaId: media.id,
			title: media.title,
			posterUrl: media.posterUrl,
			mediaType: media.mediaType,
			addedAt: Date.now(),
			rating: media.rating,
			year: media.year,
			genres: media.genres
		}] }));
	},
	removeItem: (mediaId) => {
		set((state) => ({ items: state.items.filter((i) => i.mediaId !== mediaId) }));
	},
	toggleItem: (media) => {
		if (get().items.some((i) => i.mediaId === media.id)) get().removeItem(media.id);
		else get().addItem(media);
	},
	isInWatchlist: (mediaId) => {
		return get().items.some((i) => i.mediaId === mediaId);
	},
	clear: () => set({ items: [] })
}), { name: "stellarix-watchlist" }));
//#endregion
export { useWatchlistStore as t };
