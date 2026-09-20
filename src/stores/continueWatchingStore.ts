// ============================================================
// Stellarix — Continue Watching Store (Zustand + localStorage)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WatchProgress } from '../lib/api/types';

interface ContinueWatchingState {
  items: WatchProgress[];
  updateProgress: (progress: WatchProgress) => void;
  removeItem: (mediaId: string, episodeId?: string) => void;
  getProgress: (mediaId: string, episodeId?: string) => WatchProgress | null;
  clear: () => void;
}

export const useContinueWatchingStore = create<ContinueWatchingState>()(
  persist(
    (set, get) => ({
      items: [],

      updateProgress: (progress: WatchProgress) => {
        set((state) => {
          const key = progress.episodeId
            ? `${progress.mediaId}-${progress.episodeId}`
            : progress.mediaId;

          const existing = state.items.findIndex((i) => {
            const itemKey = i.episodeId
              ? `${i.mediaId}-${i.episodeId}`
              : i.mediaId;
            return itemKey === key;
          });

          const newItems = [...state.items];
          if (existing >= 0) {
            newItems[existing] = { ...progress, timestamp: Date.now() };
          } else {
            newItems.unshift({ ...progress, timestamp: Date.now() });
          }

          // Keep only the 20 most recent items
          return { items: newItems.slice(0, 20) };
        });
      },

      removeItem: (mediaId: string, episodeId?: string) => {
        set((state) => ({
          items: state.items.filter((i) => {
            if (episodeId) {
              return !(i.mediaId === mediaId && i.episodeId === episodeId);
            }
            return i.mediaId !== mediaId;
          }),
        }));
      },

      getProgress: (mediaId: string, episodeId?: string) => {
        const items = get().items;
        if (episodeId) {
          return (
            items.find(
              (i) => i.mediaId === mediaId && i.episodeId === episodeId
            ) ?? null
          );
        }
        return items.find((i) => i.mediaId === mediaId) ?? null;
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: 'stellarix-continue-watching',
    }
  )
);
