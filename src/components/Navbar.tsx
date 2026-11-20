'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { buildMainWaUrl } from '@/data/properties';

interface DrawerLink {
  num: string;
  label: string;
  href: string;
}

const DRAWER_LINKS: DrawerLink[] = [
  { num: '.01', label: 'Koleksi Klaster', href: '/properti' },
  { num: '.02', label: 'Alur Kawal Berkas', href: '/#alur-kawal' },
  { num: '.03', label: 'Tim Konsultan', href: '/agen' },
  { num: '.04', label: 'Tanya Jawab', href: '/#pertanyaan' },
];

/**
 * Detached Floating Pill Navigation -> Compact Centered Floating Bar on Scroll
 * + Full-Screen Dark #38352C Drawer with SVG Hamburger-to-X Morph & Staggered Links.
 * Hidden automatically on /admin routes.
 */
export function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  if (pathname === '/admin' || pathname?.startsWith('/admin/')) {
    return null;
  }

  const waUrl = buildMainWaUrl();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setDrawerOpen(false);
    if (href.startsWith('/#') && (!pathname || pathname === '/')) {
      const targetId = href.replace('/#', '');
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        window.history.pushState(null, '', `#${targetId}`);
      }
    }
  };

  const isCompactCentered = scrolled && !drawerOpen;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[60] pointer-events-none py-3.5 sm:py-4 px-4 sm:px-6 lg:px-10">
        <div
          className={`mx-auto flex items-center justify-between gap-3 transition-all duration-500 ease-in-out ${
            isCompactCentered
              ? 'max-w-[680px] px-2.5 py-1.5 rounded-full bg-[#E8E4E1]/95 backdrop-blur-md border border-[#38352C]/14 shadow-[0_12px_32px_rgba(20,18,14,0.14)] pointer-events-auto'
              : 'max-w-[1440px] px-0 py-0 rounded-none bg-transparent border-transparent shadow-none'
          }`}
        >
          {/* Left Detached Brand Pill */}
          <Link
            href="/"
            className={`pointer-events-auto inline-flex items-center gap-2.5 min-h-[44px] pl-1.5 pr-4 rounded-full text-[#38352C] hover:bg-[#FAF8F5] active:scale-[0.97] transition-all duration-300 ease-in-out motion-reduce:transition-none whitespace-nowrap shrink-0 ${
              isCompactCentered
                ? 'bg-transparent border-transparent shadow-none'
                : 'bg-[#E8E4E1]/95 backdrop-blur-md border border-[#38352C]/14 shadow-[0_4px_16px_rgba(20,18,14,0.09)]'
            }`}
            aria-label="Tiar Property Beranda"
          >
            <span className="w-8 h-8 rounded-full bg-[#38352C] text-[#E8E4E1] flex items-center justify-center font-display text-sm font-semibold tracking-tight shrink-0">
              TP
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Tiar Property
            </span>
          </Link>

          {/* Right Detached Pills */}
          <nav
            aria-label="Navigasi Utama"
            className="pointer-events-auto flex items-center gap-2 shrink-0"
          >
            <Link
              href="/properti"
              className={`hidden md:inline-flex items-center justify-center min-h-[44px] px-4 rounded-full text-[#38352C] text-sm font-medium hover:bg-[#E8E4E1] active:scale-[0.97] transition-all duration-300 ease-in-out motion-reduce:transition-none whitespace-nowrap ${
                isCompactCentered
                  ? 'bg-[#F1F1F1]/80 border border-[#C5BEB4]/70 shadow-none'
                  : 'bg-[#F1F1F1]/95 backdrop-blur-md border border-[#C5BEB4] shadow-[0_4px_16px_rgba(20,18,14,0.06)]'
              }`}
            >
              Semua Rumah
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-full bg-[#38352C] text-[#E8E4E1] text-sm font-medium hover:bg-[#28251E] active:scale-[0.97] transition-[background-color,transform] duration-300 ease-in-out motion-reduce:transition-none whitespace-nowrap shadow-[0_4px_16px_rgba(20,18,14,0.14)]"
            >
              <MessageCircle className="w-4 h-4 text-[#FFCA4F] shrink-0" strokeWidth={1.75} />
              <span>Konsultasi WA</span>
            </a>

            <button
              ref={toggleBtnRef}
              type="button"
              onClick={() => setDrawerOpen((prev) => !prev)}
              aria-expanded={drawerOpen}
              aria-controls="tiar-nav-drawer"
              aria-label={drawerOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className={`inline-flex items-center justify-center gap-2.5 min-h-[44px] px-4 rounded-full text-sm font-medium active:scale-[0.97] transition-all duration-300 ease-in-out motion-reduce:transition-none whitespace-nowrap cursor-pointer ${
                drawerOpen
                  ? 'bg-[#FAF8F5] text-[#38352C] border border-[#FAF8F5] shadow-[0_4px_16px_rgba(20,18,14,0.2)]'
                  : isCompactCentered
                  ? 'bg-[#FAF8F5] text-[#38352C] border border-[#38352C]/14 shadow-none hover:bg-[#F1F1F1]'
                  : 'bg-[#E8E4E1]/95 backdrop-blur-md border border-[#38352C]/14 text-[#38352C] shadow-[0_4px_16px_rgba(20,18,14,0.09)] hover:bg-[#FAF8F5]'
              }`}
            >
              <span>{drawerOpen ? 'Tutup' : 'Menu'}</span>
              {/* SVG Hamburger-to-X Morph */}
              <svg
                viewBox="0 0 20 20"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                aria-hidden="true"
                className="shrink-0"
              >
                <line
                  x1="3"
                  y1="5.5"
                  x2="17"
                  y2="5.5"
                  className="hamburger-line"
                  style={{
                    transform: drawerOpen
                      ? 'translateY(4.5px) rotate(45deg)'
                      : 'translateY(0) rotate(0deg)',
                  }}
                />
                <line
                  x1="3"
                  y1="10"
                  x2="17"
                  y2="10"
                  className="hamburger-line"
                  style={{
                    opacity: drawerOpen ? 0 : 1,
                    transform: drawerOpen ? 'scaleX(0)' : 'scaleX(1)',
                  }}
                />
                <line
                  x1="3"
                  y1="14.5"
                  x2="17"
                  y2="14.5"
                  className="hamburger-line"
                  style={{
                    transform: drawerOpen
                      ? 'translateY(-4.5px) rotate(-45deg)'
                      : 'translateY(0) rotate(0deg)',
                  }}
                />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Full-Screen Dark Editorial Drawer (#38352C) */}
      <aside
        ref={drawerRef}
        id="tiar-nav-drawer"
        aria-label="Menu navigasi cepat"
        aria-hidden={!drawerOpen}
        className={`fixed inset-0 z-50 w-screen h-[100dvh] bg-[#38352C] text-[#E8E4E1] flex flex-col justify-between px-6 sm:px-10 lg:px-16 pt-28 pb-10 overflow-y-auto transition-all duration-500 ease-in-out motion-reduce:transition-none ${
          drawerOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-w-[1440px] w-full mx-auto flex-1 flex flex-col justify-center">
          <ul className="flex flex-col">
            {DRAWER_LINKS.map((item, idx) => (
              <li
                key={item.num}
                style={{
                  transitionDelay: drawerOpen ? `${120 + idx * 75}ms` : '0ms',
                }}
                className={`transition-all duration-500 ease-in-out motion-reduce:transition-none ${
                  drawerOpen
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  tabIndex={drawerOpen ? 0 : -1}
                  className="group flex items-center justify-between py-5 sm:py-6 border-b border-[#E8E4E1]/15 hover:text-[#FFCA4F] transition-colors duration-300"
                >
                  <span className="flex items-center">
                    {/* Left Arrow (slides in on hover) */}
                    <ArrowRight
                      className="w-0 opacity-0 -translate-x-4 group-hover:w-6 group-hover:mr-4 group-hover:opacity-100 group-hover:translate-x-0 text-[#FFCA4F] transition-all duration-300 ease-in-out motion-reduce:transition-none shrink-0"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span className="flex items-baseline gap-4 sm:gap-6">
                      <span className="num-clean text-xs sm:text-sm font-semibold text-[#C5BEB4] group-hover:text-[#FFCA4F] transition-colors duration-300">
                        {item.num}
                      </span>
                      <span className="font-display text-[clamp(2rem,4.5vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.02em]">
                        {item.label}
                      </span>
                    </span>
                  </span>

                  {/* Right Arrow (slides out on hover) */}
                  <ArrowRight
                    className="w-6 h-6 text-[#C5BEB4] opacity-100 translate-x-0 group-hover:opacity-0 group-hover:translate-x-4 transition-all duration-300 ease-in-out motion-reduce:transition-none shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            transitionDelay: drawerOpen ? '420ms' : '0ms',
          }}
          className={`max-w-[1440px] w-full mx-auto pt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-[#E8E4E1]/15 transition-all duration-500 ease-in-out motion-reduce:transition-none ${
            drawerOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-col gap-1 text-xs sm:text-sm text-[#C5BEB4]">
            <span>Surabaya Timur, Surabaya Barat &amp; Sidoarjo</span>
            <span className="num-clean font-medium text-[#E8E4E1]">
              PIC Utama: Mbak Ningsih (0821-4219-3231)
            </span>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={drawerOpen ? 0 : -1}
            className="dual-cta whitespace-nowrap self-start sm:self-auto"
          >
            <span className="dual-cta__label">Jadwalkan Survei WA</span>
            <span className="dual-cta__circle" aria-hidden="true">
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </span>
          </a>
        </div>
      </aside>
    </>
  );
}
