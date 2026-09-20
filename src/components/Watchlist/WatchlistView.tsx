// ============================================================
// Stellarix — Watchlist Page Component
// ============================================================

import { Bookmark, Trash2, Play, Star } from 'lucide-react';
import { useWatchlistStore } from '../../stores/watchlistStore';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { cn } from '../../utils/cn';

export default function WatchlistView() {
  const { items, removeItem } = useWatchlistStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">
            My Watchlist
          </h1>
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-white/[0.03] border border-border">
              <Bookmark className="h-8 w-8 text-text-faint" />
            </div>
            <p className="text-text-muted text-lg font-medium">
              Your watchlist is empty
            </p>
            <p className="text-text-faint text-sm text-center max-w-sm">
              Browse movies, anime, and TV shows and add them to your watchlist
              to keep track of what you want to watch.
            </p>
            <Button variant="secondary" size="md" href="/browse">
              Browse Content
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            My Watchlist
          </h1>
          <span className="text-sm text-text-muted">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {items.map((item) => {
            const detailUrl =
              item.mediaType === 'movie'
                ? `/movie/${item.mediaId}`
                : `/${item.mediaType}/${item.mediaId}`;

            return (
              <div key={item.mediaId} className="group relative">
                <a href={detailUrl} className="block">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card border border-border-subtle group-hover:border-border-strong transition-all duration-300 group-hover:scale-[1.03]">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Rating */}
                    {item.rating && item.rating > 0 && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="rating">
                          <Star className="h-3 w-3 fill-current" />
                          {item.rating.toFixed(1)}
                        </Badge>
                      </div>
                    )}

                    {/* Type badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="type" className="text-[9px]">
                        {item.mediaType}
                      </Badge>
                    </div>

                    {/* Hover actions */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors"
                        aria-label={`Play ${item.title}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href =
                            item.mediaType === 'movie'
                              ? `/watch/${item.mediaId}`
                              : detailUrl;
                        }}
                      >
                        <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                      </button>

                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-error/20 border border-error/30 text-error hover:bg-error/30 transition-colors"
                        aria-label={`Remove ${item.title} from watchlist`}
                        onClick={(e) => {
                          e.preventDefault();
                          removeItem(item.mediaId);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </a>

                {/* Info */}
                <div className="mt-2 px-0.5">
                  <h3 className="text-sm font-medium text-text-primary truncate">
                    <a href={detailUrl} className="hover:text-accent transition-colors">
                      {item.title}
                    </a>
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {item.year && item.year > 0 ? item.year : ''}{' '}
                    {item.genres && item.genres.length > 0 && (
                      <span>
                        · {item.genres.slice(0, 2).map((g) => g.name).join(', ')}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
