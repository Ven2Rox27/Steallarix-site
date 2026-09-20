// ============================================================
// Stellarix — User Preferences Store (Zustand + localStorage)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserPreferences, QualityLevel } from '../lib/api/types';

interface PreferencesState extends UserPreferences {
  setAutoplay: (value: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setSubtitleLanguage: (lang: string) => void;
  setAudioLanguage: (lang: string) => void;
  setQuality: (quality: QualityLevel) => void;
  reset: () => void;
}

const defaults: UserPreferences = {
  autoplay: true,
  defaultPlaybackSpeed: 1,
  preferredSubtitleLanguage: 'en',
  preferredAudioLanguage: 'en',
  preferredQuality: '1080p',
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaults,

      setAutoplay: (value) => set({ autoplay: value }),
      setPlaybackSpeed: (speed) => set({ defaultPlaybackSpeed: speed }),
      setSubtitleLanguage: (lang) =>
        set({ preferredSubtitleLanguage: lang }),
      setAudioLanguage: (lang) => set({ preferredAudioLanguage: lang }),
      setQuality: (quality) => set({ preferredQuality: quality }),
      reset: () => set(defaults),
    }),
    {
      name: 'stellarix-preferences',
    }
  )
);
