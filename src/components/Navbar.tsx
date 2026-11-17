'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X, MessageCircle } from 'lucide-react';
import { WA_CS_NUMBER, DEFAULT_WA_MESSAGE } from '@/data/properties';

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
 * Detached Floating Top-Right Pill Navigation (N5) + Dark #38352C Floating Drawer.
 * Hidden automatically on /admin routes.
 */
export function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (
        drawerRef.current?.contains(target) ||
        toggleBtnRef.current?.contains(target)
      ) {
        return;
      }
      setDrawerOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [drawerOpen]);

  if (pathname === '/admin' || pathname?.startsWith('/admin/')) {
    return null;
  }

  const waUrl = `https://wa.me/${WA_CS_NUMBER}?text=${DEFAULT_WA_MESSAGE}`;

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

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none py-3.5 sm:py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3">
          {/* Left Detached Brand Pill */}
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-center gap-2.5 min-h-[44px] pl-1.5 pr-4 rounded-full bg-[#E8E4E1]/95 backdrop-blur-md border border-[#38352C]/14 text-[#38352C] shadow-[0_4px_16px_rgba(20,18,14,0.09)] hover:bg-[#FAF8F5] active:scale-[0.97] transition-[background-color,transform] motion-reduce:transition-none whitespace-nowrap shrink-0"
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
              className="hidden md:inline-flex items-center justify-center min-h-[44px] px-4 rounded-full bg-[#F1F1F1]/95 backdrop-blur-md border border-[#C5BEB4] text-[#38352C] text-sm font-medium hover:bg-[#E8E4E1] active:scale-[0.97] transition-[background-color,transform] motion-reduce:transition-none whitespace-nowrap shadow-[0_4px_16px_rgba(20,18,14,0.06)]"
            >
              Semua Rumah
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-full bg-[#38352C] text-[#E8E4E1] text-sm font-medium hover:bg-[#28251E] active:scale-[0.97] transition-[background-color,transform] motion-reduce:transition-none whitespace-nowrap shadow-[0_4px_16px_rgba(20,18,14,0.14)]"
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
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-full bg-[#E8E4E1]/95 backdrop-blur-md border border-[#38352C]/14 text-[#38352C] text-sm font-medium hover:bg-[#FAF8F5] active:scale-[0.97] transition-[background-color,transform] motion-reduce:transition-none whitespace-nowrap shadow-[0_4px_16px_rgba(20,18,14,0.09)] cursor-pointer"
            >
              <span>{drawerOpen ? 'Tutup' : 'Menu'}</span>
              {drawerOpen ? (
                <X className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              ) : (
                <Menu className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Top-Right Floating Dark Card Drawer (#38352C) */}
      <aside
        ref={drawerRef}
        id="tiar-nav-drawer"
        aria-label="Menu navigasi cepat"
        aria-hidden={!drawerOpen}
        className={`fixed top-[72px] sm:top-[76px] right-4 sm:right-6 lg:right-10 w-[calc(100%-2rem)] max-w-[360px] z-50 rounded-2xl bg-[#38352C] text-[#E8E4E1] p-6 shadow-[0_24px_64px_rgba(20,18,14,0.32)] border border-[#E8E4E1]/10 transition-[opacity,transform] duration-200 motion-reduce:transition-none origin-top-right ${
          drawerOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col">
          {DRAWER_LINKS.map((item) => (
            <li key={item.num}>
              <Link
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                tabIndex={drawerOpen ? 0 : -1}
                className="group flex items-center justify-between py-3.5 border-b border-[#E8E4E1]/15 hover:text-[#FFCA4F] transition-colors"
              >
                <span className="flex items-baseline gap-3.5">
                  <span className="num-clean text-xs font-semibold text-[#C5BEB4] group-hover:text-[#FFCA4F] transition-colors">
                    {item.num}
                  </span>
                  <span className="font-display text-[26px] font-medium leading-[1.15]">
                    {item.label}
                  </span>
                </span>
                <ArrowRight
                  className="w-5 h-5 text-[#C5BEB4] group-hover:text-[#FFCA4F] group-hover:translate-x-1 transition-[color,transform] motion-reduce:transition-none shrink-0"
                  strokeWidth={1.5}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-5 pt-4 flex flex-col gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={drawerOpen ? 0 : -1}
            className="dual-cta whitespace-nowrap w-full justify-between"
          >
            <span className="dual-cta__label flex-1">Jadwalkan Survei WA</span>
            <span className="dual-cta__circle" aria-hidden="true">
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </span>
          </a>

          <div className="pt-1 flex flex-col gap-0.5 text-xs text-[#C5BEB4]">
            <span>Surabaya Timur, Surabaya Barat &amp; Sidoarjo</span>
            <span className="num-clean font-medium text-[#E8E4E1]">
              PIC Utama: Mbak Ningsih (0821-4219-3231)
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
