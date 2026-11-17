import React from 'react';
import Link from 'next/link';
import { TIAR_PROPERTIES } from '@/data/properties';
import { PropertyCard } from '@/components/PropertyCard';

/**
 * Catalog grid orchestrator matching Reome layout.
 * Generous top padding to ensure comfortable breathing room below floating bars.
 */
export function PropertyCatalog() {
  const firstBatch = TIAR_PROPERTIES.slice(0, 3);
  const secondBatch = TIAR_PROPERTIES.slice(3, 6);

  return (
    <section id="katalog" className="pt-10 sm:pt-12 md:pt-14 lg:pt-16 pb-20 md:pb-28 bg-[#f7faf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
        {/* Section 1: Rekomendasi Pilihan ("Brome the Startss") */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-4xl font-black text-[#081613] tracking-tight">
              Rekomendasi Klaster Pilihan
            </h2>
            <p className="text-[#477769] mt-2 text-xs sm:text-sm font-normal">
              Pilihan favorit keluarga muda di lokasi paling berkembang Surabaya & Sidoarjo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-9">
            {firstBatch.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Siap Huni & Investasi ("Calsblir chicn Sestorts") */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-4xl font-black text-[#081613] tracking-tight">
              Klaster Siap Huni & Investasi Emas
            </h2>
            <p className="text-[#477769] mt-2 text-xs sm:text-sm font-normal">
              Akses cepat nol menit fasilitas publik, bandara Juanda, kampus ternama, & gerbang tol
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-9">
            {secondBatch.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        </div>

        {/* Section 3: CTA Navigasi ke Halaman Katalog Lengkap */}
        <div className="pt-2 text-center">
          <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white border border-[#dde8e2] shadow-reome-card max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#ebf2ee] text-[#16362f] mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#3a6356] animate-pulse" />
                Pilihan Lengkap Seluruh Unit
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#081613] tracking-tight [text-wrap:balance]">
                Cari Unit Sesuai Kriteria & Budget Anda?
              </h3>
              <p className="text-xs sm:text-sm text-[#477769] mt-1.5 max-w-xl">
                Jelajahi seluruh klaster di Surabaya & Sidoarjo. Filter instan berdasarkan wilayah, tipe 1 & 2 lantai, hingga simulasi cicilan bulanan.
              </p>
            </div>
            <Link
              href="/properti"
              scroll={true}
              className="shrink-0 inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full text-xs sm:text-sm font-black bg-[#081613] text-white hover:bg-[#16362f] hover:gap-3.5 transition-all shadow-md active:scale-95 w-full md:w-auto"
            >
              <span>Lihat Semua Rumah</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
