// ============================================================
// Stellarix — Search Overlay
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Star } from 'lucide-react';
import type { MediaItem } from '../../lib/api/types';
import { searchMedia } from '../../lib/api/mediaService';
import Badge from '../common/Badge';
import { cn } from '../../utils/cn';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'stellarix-recent-searches';

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  const searches = getRecentSearches().filter((s) => s !== query);
  searches.unshift(query);
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(searches.slice(0, 8))
  );
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Keyboard: Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const doSearch = useCallback(async (q: string) => {
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

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      doSearch(query);
    }
  };

  const handleRecentClick = (q: string) => {
    setQuery(q);
    doSearch(q);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-base/95 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-3xl px-4 pt-20 sm:pt-24">
            {/* Search Header */}
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search movies, anime, TV shows..."
                className="w-full h-14 pl-12 pr-12 bg-surface border border-border rounded-2xl text-text-primary text-lg placeholder:text-text-faint outline-none focus:border-accent/50 transition-colors"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </form>

            {/* Results Area */}
            <div className="mt-6 max-h-[60vh] overflow-y-auto">
              {/* Loading */}
              {loading && (
                <div className="flex items-center gap-3 py-8 justify-center">
                  <div className="h-5 w-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  <span className="text-text-muted text-sm">Searching...</span>
                </div>
              )}

              {/* Results */}
              {!loading && results.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-text-muted px-2 mb-3">
                    {results.length} result{results.length !== 1 ? 's' : ''} found
                  </p>
                  {results.map((item) => (
                    <a
                      key={item.id}
                      href={
                        item.mediaType === 'movie'
                          ? `/movie/${item.id}`
                          : `/${item.mediaType}/${item.id}`
                      }
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                      onClick={() => {
                        if (query.trim()) saveRecentSearch(query.trim());
                        onClose();
                      }}
                    >
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="h-16 w-11 rounded-lg object-cover bg-card shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-text-primary truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="type" className="text-[9px]">
                            {item.mediaType}
                          </Badge>
                          <span className="text-xs text-text-muted">{item.year}</span>
                          <span className="flex items-center gap-0.5 text-xs text-accent-amber">
                            <Star className="h-3 w-3 fill-current" />
                            {item.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-1 line-clamp-1">
                          {item.genres.map((g) => g.name).join(' · ')}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-12">
                  <Search className="h-10 w-10 text-text-faint" />
                  <p className="text-text-muted text-sm">
                    No results found for "{query}"
                  </p>
                  <p className="text-text-faint text-xs">
                    Try a different search term
                  </p>
                </div>
              )}

              {/* Recent Searches (when no query) */}
              {!loading && !query.trim() && recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-2 mb-3">
                    <Clock className="h-4 w-4 text-text-muted" />
                    <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                      Recent Searches
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleRecentClick(search)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.08] transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Default state: no query, no recent */}
              {!loading && !query.trim() && recentSearches.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-12">
                  <TrendingUp className="h-10 w-10 text-text-faint" />
                  <p className="text-text-muted text-sm">
                    Search for your favorite movies, anime, and TV shows
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
