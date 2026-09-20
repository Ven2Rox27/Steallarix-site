// ============================================================
// Stellarix — Watchlist Store (Zustand + localStorage)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WatchlistItem, MediaItem } from '../lib/api/types';

interface WatchlistState {
  items: WatchlistItem[];
  addItem: (media: MediaItem) => void;
  removeItem: (mediaId: string) => void;
  toggleItem: (media: MediaItem) => void;
  isInWatchlist: (mediaId: string) => boolean;
  clear: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (media: MediaItem) => {
        const exists = get().items.some((i) => i.mediaId === media.id);
        if (exists) return;

        set((state) => ({
          items: [
            ...state.items,
            {
              mediaId: media.id,
              title: media.title,
              posterUrl: media.posterUrl,
              mediaType: media.mediaType,
              addedAt: Date.now(),
              rating: media.rating,
              year: media.year,
              genres: media.genres,
            },
          ],
        }));
      },

      removeItem: (mediaId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.mediaId !== mediaId),
        }));
      },

      toggleItem: (media: MediaItem) => {
        const exists = get().items.some((i) => i.mediaId === media.id);
        if (exists) {
          get().removeItem(media.id);
        } else {
          get().addItem(media);
        }
      },

      isInWatchlist: (mediaId: string) => {
        return get().items.some((i) => i.mediaId === mediaId);
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: 'stellarix-watchlist',
    }
  )
);
