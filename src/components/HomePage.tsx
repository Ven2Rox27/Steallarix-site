// ============================================================
// Stellarix — Home Page Content (React island)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Hero from './Hero/Hero';
import MediaRail from './MediaRail/MediaRail';
import type { MediaItem, WatchProgress } from '../lib/api/types';
import { useContinueWatchingStore } from '../stores/continueWatchingStore';
import {
  getFeatured,
  getTrending,
  getNewReleases,
  getTopRated,
  getByGenre,
} from '../lib/api/mediaService';
import { featuredMedia } from '../lib/api/mockData';

export default function HomePage() {
  const [featured, setFeatured] = useState<MediaItem[]>(() => featuredMedia || []);
  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>([]);
  const [trendingAll, setTrendingAll] = useState<MediaItem[]>([]);
  const [recentAnime, setRecentAnime] = useState<MediaItem[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [trendingTV, setTrendingTV] = useState<MediaItem[]>([]);
  const [newReleases, setNewReleases] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [actionItems, setActionItems] = useState<MediaItem[]>([]);
  const [sciFiItems, setSciFiItems] = useState<MediaItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const loadData = useCallback(async () => {
    // 1. Load Continue Watching from local store
    if (typeof window !== 'undefined') {
      try {
        const rawStoreItems = useContinueWatchingStore.getState().items || [];
        const sanitized = rawStoreItems.filter((item) => {
          const isMock =
            !item.mediaId ||
            item.mediaId.startsWith('ani-') ||
            item.mediaId.startsWith('tv-') ||
            item.title?.toLowerCase().includes('void breaker') ||
            item.title?.toLowerCase().includes('the architect');
          return !isMock;
        });

        if (sanitized.length !== rawStoreItems.length) {
          useContinueWatchingStore.setState({ items: sanitized });
        }
        setContinueWatching(sanitized);
      } catch (e) {
        console.warn('Failed to parse continue watching:', e);
      }
    }

    // 2. Fetch all sections in parallel using Promise.allSettled
    try {
      const [
        featuredRes,
        trendingAllRes,
        trendingMoviesRes,
        trendingTVRes,
        newReleasesRes,
        topRatedRes,
        actionRes,
        sciFiRes,
        recentAnimeRes,
      ] = await Promise.allSettled([
        getFeatured(),
        getTrending('all'),
        getTrending('movie'),
        getTrending('tv'),
        getNewReleases(),
        getTopRated(),
        getByGenre('action'),
        getByGenre('sci-fi'),
        getTrending('anime'),
      ]);

      if (featuredRes.status === 'fulfilled' && featuredRes.value.length > 0) {
        setFeatured(featuredRes.value);
      }
      if (trendingAllRes.status === 'fulfilled') {
        setTrendingAll(trendingAllRes.value);
      }
      if (trendingMoviesRes.status === 'fulfilled') {
        setTrendingMovies(trendingMoviesRes.value);
      }
      if (trendingTVRes.status === 'fulfilled') {
        setTrendingTV(trendingTVRes.value);
      }
      if (newReleasesRes.status === 'fulfilled') {
        setNewReleases(newReleasesRes.value);
      }
      if (topRatedRes.status === 'fulfilled') {
        setTopRated(topRatedRes.value);
      }
      if (actionRes.status === 'fulfilled') {
        setActionItems(actionRes.value);
      }
      if (sciFiRes.status === 'fulfilled') {
        setSciFiItems(sciFiRes.value);
      }
      if (recentAnimeRes.status === 'fulfilled') {
        setRecentAnime(recentAnimeRes.value);
      }
      setLoadError(false);
    } catch (err) {
      console.warn('Error loading homepage rails:', err);
      setLoadError(true);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Safety timer: NEVER leave page stuck in loading state for > 2.5 seconds
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setLoaded(true);
      }
    }, 2500);

    const handleNavigation = () => {
      if (!isMounted) return;
      loadData();
    };

    handleNavigation();

    // Support Astro client-side navigation (astro:page-load) & browser back/forward (pageshow)
    document.addEventListener('astro:page-load', handleNavigation);
    window.addEventListener('pageshow', handleNavigation);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      document.removeEventListener('astro:page-load', handleNavigation);
      window.removeEventListener('pageshow', handleNavigation);
    };
  }, [loadData]);

  // Build continueWatching progress map
  const progressMap: Record<string, WatchProgress> = {};
  (continueWatching || []).forEach((p) => {
    if (p && p.mediaId) {
      progressMap[p.mediaId] = p;
    }
  });

  // Convert continueWatching to MediaItems for display
  const cwMediaItems: MediaItem[] = (continueWatching || [])
    .filter((p) => p && p.mediaId)
    .map((p) => ({
      id: p.mediaId,
      title: p.title || 'Untitled',
      posterUrl: p.posterUrl || '',
      backdropUrl: p.posterUrl || '',
      description: '',
      mediaType: p.mediaType || 'movie',
      year: 0,
      rating: 0,
      genres: [],
      badges: [],
    }));

  // Initial spinner only when nothing has loaded yet
  if (!loaded && featured.length === 0 && trendingAll.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-text-muted text-sm">Loading content...</p>
        </div>
      </div>
    );
  }

  const hasAnyRail =
    cwMediaItems.length > 0 ||
    recentAnime.length > 0 ||
    trendingAll.length > 0 ||
    trendingMovies.length > 0 ||
    newReleases.length > 0 ||
    trendingTV.length > 0 ||
    topRated.length > 0 ||
    actionItems.length > 0 ||
    sciFiItems.length > 0;

  return (
    <main>
      {/* Hero */}
      {featured.length > 0 && <Hero items={featured} />}

      {/* Content Rails */}
      <div className="relative z-10 -mt-16 space-y-10 pb-20">
        {/* Continue Watching */}
        {cwMediaItems.length > 0 && (
          <MediaRail
            title="Continue Watching"
            items={cwMediaItems}
            progressMap={progressMap}
          />
        )}

        {/* Recently Added Anime */}
        {recentAnime.length > 0 && (
          <MediaRail
            title="Recently Added Anime"
            items={recentAnime}
            seeAllHref="/anime"
          />
        )}

        {/* Trending */}
        {trendingAll.length > 0 && (
          <MediaRail
            title="Trending Now"
            items={trendingAll}
            seeAllHref="/browse"
          />
        )}

        {/* Trending Movies */}
        {trendingMovies.length > 0 && (
          <MediaRail
            title="Trending Movies"
            items={trendingMovies}
            seeAllHref="/movies"
          />
        )}

        {/* New Releases */}
        {newReleases.length > 0 && (
          <MediaRail
            title="New Releases"
            items={newReleases}
            seeAllHref="/browse"
          />
        )}

        {/* Trending TV */}
        {trendingTV.length > 0 && (
          <MediaRail
            title="Trending TV Shows"
            items={trendingTV}
            seeAllHref="/tv-shows"
          />
        )}

        {/* Top Rated */}
        {topRated.length > 0 && (
          <MediaRail
            title="Top Rated"
            items={topRated}
            seeAllHref="/browse"
          />
        )}

        {/* Action */}
        {actionItems.length > 0 && (
          <MediaRail title="Action & Adventure" items={actionItems} />
        )}

        {/* Sci-Fi */}
        {sciFiItems.length > 0 && (
          <MediaRail title="Sci-Fi" items={sciFiItems} />
        )}

        {/* Empty / Error state if no content rendered */}
        {loaded && !hasAnyRail && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-text-muted text-base font-medium">
              {loadError ? 'Unable to load content right now.' : 'No content available.'}
            </p>
            <button
              onClick={() => {
                setLoaded(false);
                loadData();
              }}
              className="px-5 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/80 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
