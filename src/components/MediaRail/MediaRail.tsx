// ============================================================
// Stellarix — Horizontal Media Rail
// ============================================================

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MediaItem, WatchProgress } from '../../lib/api/types';
import MediaCard from '../MediaCard/MediaCard';
import { cn } from '../../utils/cn';

interface MediaRailProps {
  title: string;
  items: MediaItem[];
  progressMap?: Record<string, WatchProgress>;
  seeAllHref?: string;
  className?: string;
}

export default function MediaRail({
  title,
  items,
  progressMap,
  seeAllHref,
  className,
}: MediaRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
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
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, items]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={cn('relative', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight">
          {title}
        </h2>
        {seeAllHref && (
          <a
            href={seeAllHref}
            className="text-sm text-text-muted hover:text-accent transition-colors"
          >
            See All
          </a>
        )}
      </div>

      {/* Rail Container */}
      <div className="relative group/rail">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-12 z-10 w-12 flex items-center justify-center bg-gradient-to-r from-base to-transparent opacity-0 group-hover/rail:opacity-100 transition-opacity duration-300 hidden md:flex"
            aria-label="Scroll left"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white">
              <ChevronLeft className="h-5 w-5" />
            </div>
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2 scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {(items || []).filter((item) => item && item.id).map((item, i) => (
            <MediaCard
              key={item.id}
              item={item}
              index={i}
              progress={
                progressMap?.[item.id] ??
                (progressMap?.[`${item.id}-${progressMap?.[item.id]?.episodeId}`]
                  ? progressMap[item.id]
                  : undefined)
              }
            />
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-12 z-10 w-12 flex items-center justify-center bg-gradient-to-l from-base to-transparent opacity-0 group-hover/rail:opacity-100 transition-opacity duration-300 hidden md:flex"
            aria-label="Scroll right"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white">
              <ChevronRight className="h-5 w-5" />
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
