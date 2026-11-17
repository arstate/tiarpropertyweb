'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WA_CS_NUMBER, DEFAULT_WA_MESSAGE } from '@/data/properties';

interface NavItem {
  id: string;
  label: string;
  href: string;
  visibilityClass?: string;
}

interface PillPosition {
  left: number;
  width: number;
  ready: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'katalog', label: 'Pilihan Klaster', href: '/#katalog' },
  { id: 'semua-rumah', label: 'Semua Rumah', href: '/properti' },
  { id: 'konsultan', label: 'Konsultan', href: '/agen' },
  { id: 'promo', label: 'Promo DP 0%', href: '/#promo', visibilityClass: 'hidden lg:inline-flex' },
  { id: 'kalkulator', label: 'Simulasi KPR', href: '/#kalkulator' },
  { id: 'komparasi', label: 'Ngontrak vs Beli', href: '/#komparasi', visibilityClass: 'hidden xl:inline-flex' },
  { id: 'faq', label: 'FAQ', href: '/#faq', visibilityClass: 'hidden lg:inline-flex' },
];

function isItemVisibleOnClient(id: string): boolean {
  if (typeof window === 'undefined') return true;
  const width = window.innerWidth;
  if (id === 'komparasi') return width >= 1280;
  if (id === 'promo' || id === 'faq') return width >= 1024;
  return true;
}

function resolveActiveId(pathname: string | null): string {
  if (
    pathname === '/properti' ||
    pathname?.startsWith('/properti/') ||
    pathname === '/produk' ||
    pathname?.startsWith('/produk/')
  ) {
    return 'semua-rumah';
  }
  if (pathname === '/agen' || pathname?.startsWith('/agen/')) {
    return 'konsultan';
  }
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '');
    if (hash && NAV_ITEMS.some((item) => item.id === hash) && isItemVisibleOnClient(hash)) {
      return hash;
    }
  }
  return 'katalog';
}

/**
 * Ultra-clean compact Navbar with hardware-accelerated sliding active dark pill.
 * Cross-browser GPU transform animation with zero-glitch SSR frame.
 */
export function Navbar() {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname?.startsWith('/admin/')) {
    return null;
  }

  const isPropertiPage =
    pathname === '/properti' ||
    pathname?.startsWith('/properti/') ||
    pathname === '/produk' ||
    pathname?.startsWith('/produk/');
  const isAgenPage = pathname === '/agen' || pathname?.startsWith('/agen/');
  const isDedicatedSubpage = isPropertiPage || isAgenPage;

  const initialActiveId = resolveActiveId(pathname);
  const [activeId, setActiveId] = useState<string>(initialActiveId);
  const [isTransitionReady, setIsTransitionReady] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [pill, setPill] = useState<PillPosition>({ left: 0, width: 0, ready: false });
  const navRef = useRef<HTMLElement>(null);
  const isClickScrollingRef = useRef<number>(0);

  const updatePill = useCallback(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector<HTMLElement>(`[data-nav-id="${activeId}"]`);
    if (activeEl) {
      setPill({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        ready: true,
      });
    }
  }, [activeId]);

  // Initial mount: measure and place pill statically (transition: none).
  // Enable smooth sliding transitions only on subsequent updates.
  useEffect(() => {
    updatePill();
    const timer = setTimeout(() => {
      setIsTransitionReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [updatePill]);

  // Update pill position whenever activeId changes
  useEffect(() => {
    updatePill();
  }, [activeId, updatePill]);

  // Sync activeId with path changes (e.g. Next.js router navigation, browser back/forward)
  useEffect(() => {
    setMobileMenuOpen(false);
    if (Date.now() < isClickScrollingRef.current) return;
    const resolved = resolveActiveId(pathname);
    setActiveId(resolved);
  }, [pathname]);

  // Handle window resize: disable transitions during resize to prevent lagging/rubberbanding,
  // re-measure active item, and ensure activeId stays on a visible item
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout | null = null;

    const handleResize = () => {
      setIsResizing(true);
      updatePill();
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsResizing(false);
        updatePill();
      }, 150);

      // On property pages, activeId is strictly 'semua-rumah'
      if (isPropertiPage) {
        if (activeId !== 'semua-rumah') {
          setActiveId('semua-rumah');
        }
        return;
      }

      // On consultant/agent directory page, activeId is strictly 'konsultan'
      if (isAgenPage) {
        if (activeId !== 'konsultan') {
          setActiveId('konsultan');
        }
        return;
      }

      // On homepage, if active item becomes hidden on smaller viewport, fallback to katalog
      if (!isItemVisibleOnClient(activeId)) {
        setActiveId('katalog');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeId, isAgenPage, isPropertiPage, updatePill]);

  // Release click-scroll lock cleanly when smooth scroll completes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScrollEnd = () => {
      isClickScrollingRef.current = 0;
    };
    window.addEventListener('scrollend', handleScrollEnd, { passive: true });
    return () => window.removeEventListener('scrollend', handleScrollEnd);
  }, []);

  // Deterministic scrollspy for homepage sections
  useEffect(() => {
    if (isDedicatedSubpage || typeof window === 'undefined') return;
    const isHome = !pathname || pathname === '/';
    if (!isHome) return;

    const sectionIds = ['katalog', 'promo', 'kalkulator', 'komparasi', 'faq'];

    const updateScrollSpy = () => {
      // Honor click lock during smooth navigation animation
      if (Date.now() < isClickScrollingRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      const visibleCandidates = sectionIds.filter(
        (id) => isItemVisibleOnClient(id) && document.getElementById(id) !== null
      );
      if (visibleCandidates.length === 0) return;

      // 1. Top of page (< 200px) -> strictly 'katalog'
      if (scrollY < 200) {
        setActiveId((prev) => (prev === 'katalog' ? prev : 'katalog'));
        return;
      }

      // 2. Near bottom of page -> strictly last visible section (e.g. 'faq' or 'komparasi')
      if (windowHeight + scrollY >= scrollHeight - 150) {
        const lastVisibleId = visibleCandidates[visibleCandidates.length - 1];
        setActiveId((prev) => (prev === lastVisibleId ? prev : lastVisibleId));
        return;
      }

      // 3. Middle sections: find the deepest section whose top has entered the upper viewport
      const triggerOffset = 200;
      let currentId = visibleCandidates[0];
      for (let i = 0; i < visibleCandidates.length; i++) {
        const id = visibleCandidates[i];
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerOffset) {
          currentId = id;
        } else {
          break;
        }
      }

      setActiveId((prev) => (prev === currentId ? prev : currentId));
    };

    const handleScroll = () => {
      updateScrollSpy();
    };

    const hash = window.location.hash.replace('#', '');
    const hasHash = hash && sectionIds.includes(hash);
    if (!hasHash) {
      updateScrollSpy();
    } else {
      isClickScrollingRef.current = Date.now() + 1200;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDedicatedSubpage, pathname]);

  // Listen to hashchange
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && NAV_ITEMS.some((item) => item.id === hash) && isItemVisibleOnClient(hash)) {
        isClickScrollingRef.current = Date.now() + 1200;
        setActiveId(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    isClickScrollingRef.current = Date.now() + 1200;
    setActiveId(item.id);

    if (item.href.startsWith('/#') || item.href.startsWith('#')) {
      const isHome = !pathname || pathname === '/';
      if (isHome) {
        e.preventDefault();
        const targetEl = document.getElementById(item.id);
        if (targetEl) {
          const navHeight = 56;
          const topPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
          window.history.pushState(null, '', `#${item.id}`);
        }
      }
    }
  };

  const waUrl = `https://wa.me/${WA_CS_NUMBER}?text=${DEFAULT_WA_MESSAGE}`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f7faf8]/95 backdrop-blur-md border-b border-[#dde8e2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-13 flex items-center justify-between">
        {/* Brand Text-Only Wordmark */}
        <Link
          href="/"
          className="group flex items-center"
          onClick={(e) => {
            isClickScrollingRef.current = Date.now() + 1200;
            setActiveId('katalog');
            if (!pathname || pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.history.pushState(null, '', '/#katalog');
            }
          }}
        >
          <span className="text-lg sm:text-xl font-black tracking-tighter text-[#081613] select-none">
            Tiar<span className="text-[#3a6356] font-black">Property</span>
          </span>
        </Link>

        {/* Center Navigation Links with Smooth Sliding Dark Background Pill */}
        <nav
          ref={navRef}
          className="relative hidden md:flex items-center gap-1 sm:gap-1.5 text-xs sm:text-[13px] font-bold whitespace-nowrap"
          aria-label="Navigasi Utama"
        >
          {/* Hardware-accelerated sliding dark pill with Reome luxury shadow */}
          {pill.ready && (
            <span
              className="absolute left-0 top-0 bottom-0 rounded-full bg-[#081613] shadow-reome-pill pointer-events-none"
              style={{
                transform: `translate3d(${pill.left}px, 0, 0)`,
                width: `${pill.width}px`,
                transition:
                  isTransitionReady && !isResizing
                    ? 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), width 260ms cubic-bezier(0.16, 1, 0.3, 1)'
                    : 'none',
              }}
              aria-hidden="true"
            />
          )}

          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            const displayClass = item.visibilityClass ? item.visibilityClass : 'inline-flex';
            const className = `relative z-10 ${displayClass} items-center justify-center h-8 px-3.5 sm:px-4 rounded-full text-xs sm:text-[13px] font-bold tracking-tight transition-colors duration-200 select-none cursor-pointer ${
              isActive ? 'text-white' : 'text-[#477769] hover:text-[#081613]'
            }`;

            return (
              <Link
                key={item.id}
                href={item.href}
                data-nav-id={item.id}
                onClick={(e) => handleNavClick(e, item)}
                className={className}
              >
                {/* SSR initial frame: render static pill until dynamic pill is measured */}
                {isActive && !pill.ready && (
                  <span
                    className="absolute inset-0 rounded-full bg-[#081613] shadow-reome-pill -z-10"
                    aria-hidden="true"
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Compact Right CTA + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#081613] text-white hover:bg-[#16362f] transition-all shadow-xs active:scale-95"
          >
            Konsultasi WA
          </a>

          {/* Mobile Drawer Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-[#081613]/5 hover:bg-[#081613]/10 text-[#081613] transition-colors focus:outline-none"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#dde8e2] bg-[#f7faf8] px-4 py-3 space-y-1 shadow-lg transition-all">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                data-nav-id={item.id}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, item);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#081613] text-white'
                    : 'text-[#16362f] hover:bg-[#081613]/5'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'konsultan' && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-[#3a6356] text-white' : 'bg-[#dde8e2] text-[#16362f]'
                    }`}
                  >
                    Tim PIC
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
