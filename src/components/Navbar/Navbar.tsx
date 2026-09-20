// ============================================================
// Stellarix — Premium Responsive Navbar
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bookmark,
  Menu,
  X,
  Play,
  Film,
  Tv,
  Sparkles,
  LayoutGrid,
  User,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavbarProps {
  currentPath?: string;
  onSearchOpen?: () => void;
}

const navLinks = [
  { href: '/', label: 'Home', icon: Play },
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/anime', label: 'Anime', icon: Sparkles },
  { href: '/tv-shows', label: 'TV Shows', icon: Tv },
  { href: '/browse', label: 'Browse', icon: LayoutGrid },
];

export default function Navbar({ currentPath = '/', onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'glass-strong border-b border-border shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-base/80 to-transparent'
        )}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan via-accent to-accent-magenta">
                <Play className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-text-primary hidden sm:block">
                Stellarix
              </span>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? currentPath === '/'
                    : currentPath?.startsWith(link.href);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                      isActive
                        ? 'text-text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-white/[0.06]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Search Button */}
              <button
                onClick={onSearchOpen}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              {/* Watchlist Link */}
              <a
                href="/watchlist"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                  currentPath === '/watchlist'
                    ? 'text-accent bg-white/[0.06]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.06]'
                )}
                aria-label="Watchlist"
              >
                <Bookmark className="h-[18px] w-[18px]" />
              </a>

              {/* User Avatar */}
              <button
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent-magenta/20 border border-border text-text-secondary hover:text-text-primary transition-colors"
                aria-label="User profile"
              >
                <User className="h-4 w-4" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface border-l border-border lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-lg font-bold tracking-tight text-text-primary">
                  Stellarix
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="p-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/'
                      ? currentPath === '/'
                      : currentPath?.startsWith(link.href);
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'text-text-primary bg-white/[0.06]'
                          : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      {link.label}
                    </a>
                  );
                })}

                <div className="pt-3 mt-3 border-t border-border space-y-1">
                  <a
                    href="/watchlist"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      currentPath === '/watchlist'
                        ? 'text-accent bg-white/[0.06]'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
                    )}
                  >
                    <Bookmark className="h-4.5 w-4.5" />
                    Watchlist
                  </a>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
