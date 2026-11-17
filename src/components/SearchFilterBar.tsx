import React from 'react';
import Link from 'next/link';

/**
 * Floating search bar pill component matching Reome design.
 * - Mobile: Ultra-clean single-row search pill + horizontal quick tags (eliminates 300px visual clutter).
 * - Desktop: Segmented luxury pill bar with quick links to full catalog.
 */
export function SearchFilterBar() {
  return (
    <div className="w-full">
      {/* 1. Mobile View (< md): Compact Single-Row Search Pill + Quick Tags */}
      <div className="block md:hidden space-y-2">
        <div className="bg-white rounded-full shadow-reome-pill p-1.5 pl-3.5 border border-[#dde8e2] flex items-center justify-between gap-2">
          <Link
            href="/properti"
            scroll={true}
            className="flex items-center gap-2.5 flex-1 min-w-0 py-1"
          >
            <span className="text-[#3a6356] shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <span className="text-xs font-semibold text-[#477769] truncate">
              Cari klaster di Surabaya & Sidoarjo...
            </span>
          </Link>
          <Link
            href="/properti"
            scroll={true}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#081613] text-white hover:bg-[#16362f] transition-all shadow-sm active:scale-95 flex items-center gap-1 shrink-0"
          >
            <span>Cari</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Quick Filter Tags on Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          <Link
            href="/properti"
            scroll={true}
            className="text-[11px] font-bold text-[#16362f] bg-white/95 border border-[#dde8e2] rounded-full px-2.5 py-1 whitespace-nowrap shadow-xs hover:border-[#3a6356] active:scale-95 transition-all flex items-center gap-1 shrink-0"
          >
            <span className="text-[#3a6356]">📍</span>
            <span>Surabaya & Sidoarjo</span>
          </Link>
          <Link
            href="/#promo"
            className="text-[11px] font-bold text-[#16362f] bg-white/95 border border-[#dde8e2] rounded-full px-2.5 py-1 whitespace-nowrap shadow-xs hover:border-[#3a6356] active:scale-95 transition-all flex items-center gap-1 shrink-0"
          >
            <span className="text-[#3a6356]">✨</span>
            <span>DP 0% (Tanpa DP)</span>
          </Link>
          <Link
            href="/properti?cicilan=dibawah-2jt"
            scroll={true}
            className="text-[11px] font-bold text-[#16362f] bg-white/95 border border-[#dde8e2] rounded-full px-2.5 py-1 whitespace-nowrap shadow-xs hover:border-[#3a6356] active:scale-95 transition-all flex items-center gap-1 shrink-0"
          >
            <span className="text-[#3a6356]">💳</span>
            <span>Cicilan &lt; 2 Jt</span>
          </Link>
          <Link
            href="/properti"
            scroll={true}
            className="text-[11px] font-bold text-[#16362f] bg-white/95 border border-[#dde8e2] rounded-full px-2.5 py-1 whitespace-nowrap shadow-xs hover:border-[#3a6356] active:scale-95 transition-all flex items-center gap-1 shrink-0"
          >
            <span className="text-[#3a6356]">🏠</span>
            <span>1 & 2 Lantai</span>
          </Link>
        </div>
      </div>

      {/* 2. Desktop View (md: and up): Reome Segmented Pill Bar */}
      <div className="hidden md:flex bg-white rounded-full shadow-reome-pill p-1.5 lg:p-1.5 xl:p-2 border border-[#dde8e2] flex-row items-center justify-between gap-1 lg:gap-1.5 xl:gap-2">
        {/* Lokasi */}
        <Link
          href="/properti"
          scroll={true}
          className="flex items-center gap-1.5 lg:gap-2 xl:gap-2.5 px-2.5 py-1.5 lg:px-3 lg:py-1.5 xl:px-3.5 xl:py-2 hover:bg-[#f7faf8] rounded-full transition-colors flex-1"
        >
          <span className="text-[#3a6356] shrink-0">
            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-[18px] xl:h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          <span className="text-[11px] lg:text-xs xl:text-[13px] font-bold text-[#081613] tracking-tight whitespace-nowrap">
            Surabaya & Sidoarjo
          </span>
        </Link>

        <div className="w-px h-5 lg:h-5 xl:h-6 bg-[#dde8e2] shrink-0" />

        {/* Tipe Hunian */}
        <Link
          href="/properti"
          scroll={true}
          className="flex items-center gap-1.5 lg:gap-2 xl:gap-2.5 px-2.5 py-1.5 lg:px-3 lg:py-1.5 xl:px-3.5 xl:py-2 hover:bg-[#f7faf8] rounded-full transition-colors flex-1"
        >
          <span className="text-[#3a6356] shrink-0">
            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-[18px] xl:h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </span>
          <span className="text-[11px] lg:text-xs xl:text-[13px] font-bold text-[#081613] tracking-tight whitespace-nowrap">
            1 & 2 Lantai
          </span>
        </Link>

        <div className="w-px h-5 lg:h-5 xl:h-6 bg-[#dde8e2] shrink-0" />

        {/* Cicilan Promo */}
        <Link
          href="/properti?cicilan=dibawah-2jt"
          scroll={true}
          className="flex items-center gap-1.5 lg:gap-2 xl:gap-2.5 px-2.5 py-1.5 lg:px-3 lg:py-1.5 xl:px-3.5 xl:py-2 hover:bg-[#f7faf8] rounded-full transition-colors flex-1"
        >
          <span className="text-[#3a6356] shrink-0">
            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-[18px] xl:h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span className="text-[11px] lg:text-xs xl:text-[13px] font-bold text-[#081613] tracking-tight whitespace-nowrap">
            1,2 - 2,5 Jt / bln
          </span>
        </Link>

        <div className="w-px h-5 lg:h-5 xl:h-6 bg-[#dde8e2] shrink-0" />

        {/* Uang Muka */}
        <a
          href="/#promo"
          className="flex items-center gap-1.5 lg:gap-2 xl:gap-2.5 px-2.5 py-1.5 lg:px-3 lg:py-1.5 xl:px-3.5 xl:py-2 hover:bg-[#f7faf8] rounded-full transition-colors flex-1"
        >
          <span className="text-[#3a6356] shrink-0">
            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-[18px] xl:h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span className="text-[11px] lg:text-xs xl:text-[13px] font-bold text-[#081613] tracking-tight whitespace-nowrap">
            DP 0% (Tanpa DP)
          </span>
        </a>

        {/* Action Button: Solid Deep Pine Pill -> Link to /properti */}
        <Link
          href="/properti"
          scroll={true}
          className="px-3.5 py-1.5 lg:px-4 lg:py-2 xl:px-5 xl:py-2.5 rounded-full text-center text-xs lg:text-xs xl:text-sm font-bold bg-[#081613] text-white hover:bg-[#16362f] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 lg:gap-2 shrink-0"
        >
          <span>Cari Unit</span>
          <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
