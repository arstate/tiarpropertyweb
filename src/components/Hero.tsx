import React from 'react';
import { SearchFilterBar } from '@/components/SearchFilterBar';
import { UspFeatureBar } from '@/components/UspFeatureBar';

export function Hero() {
  return (
    <section className="relative">
      {/* Cropped Architectural Visual Frame (Lowered Crop Line) */}
      <div className="hero-visual-frame relative w-full h-[340px] sm:h-[370px] md:h-[390px] lg:h-[415px] xl:h-[440px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=85"
          alt="Luxury Architecture"
          className="w-full h-full object-cover"
        />
        {/* Subtle dark tint ONLY for text legibility */}
        <div className="absolute inset-0 bg-[#081613]/40" />

        {/* Centered Hero Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pb-7 sm:pb-8 md:pb-8 lg:pb-9">
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-white max-w-3xl lg:max-w-4xl mx-auto leading-tight drop-shadow-md">
            Cari Rumah, Cluster & Investasi Jadi Lebih Mudah
          </h1>
          <p className="mt-2 sm:mt-2.5 md:mt-3 text-xs sm:text-sm md:text-sm lg:text-base text-[#dde8e2] max-w-lg md:max-w-xl lg:max-w-2xl mx-auto font-normal">
            Pilihan Hunian Strategis Surabaya & Sidoarjo • DP 0% • All-In Bebas Biaya
          </p>

          {/* Translucent Glass Pill Badge */}
          <div className="mt-2.5 sm:mt-3 md:mt-3.5 inline-flex items-center gap-2 px-3 sm:px-3.5 md:px-4 py-1 sm:py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-[10px] sm:text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8baf9f] animate-pulse" />
            <span>Cukup UTJ 1–2 Jt Langsung Proses Berkas KPR</span>
          </div>
        </div>
      </div>

      {/* Floating Bars Stack: Search Bar centered right on the crop line */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 sm:-mt-8 md:-mt-8 lg:-mt-9 xl:-mt-10 z-20 space-y-2 sm:space-y-2.5 md:space-y-2.5 lg:space-y-3">
        <SearchFilterBar />
        <UspFeatureBar />
      </div>
    </section>
  );
}
