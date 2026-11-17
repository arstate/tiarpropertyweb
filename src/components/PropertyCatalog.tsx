'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { TIAR_PROPERTIES } from '@/data/properties';
import { PropertyCard } from '@/components/PropertyCard';
import { UspFeatureBar } from '@/components/UspFeatureBar';
import type { QuickFilterKey } from '@/components/SearchFilterBar';

const MARQUEE_ITEMS = [
  <React.Fragment key="dp0">
    DP <span className="num-clean">0%</span> Cukup UTJ <span className="num-clean">Rp 1</span> Juta
  </React.Fragment>,
  <React.Fragment key="free">
    Free BPHTB, AJB, BBN &amp; Notaris
  </React.Fragment>,
  <React.Fragment key="sub">
    Subsidi Angsuran <span className="num-clean">Rp 1,4</span> Juta per Bulan
  </React.Fragment>,
  <React.Fragment key="bank">
    Kawal Berkas <span className="num-clean">5</span> Bank BUMN Sampai ACC
  </React.Fragment>,
];

const LOOKBOOK_LAYOUTS: {
  gridClass: string;
  aspectVariant: 'wide' | 'tall';
}[] = [
  { gridClass: 'lg:col-span-7', aspectVariant: 'wide' },
  { gridClass: 'lg:col-span-5', aspectVariant: 'tall' },
  { gridClass: 'lg:col-start-2 lg:col-span-4', aspectVariant: 'tall' },
  { gridClass: 'lg:col-start-7 lg:col-span-6', aspectVariant: 'wide' },
  { gridClass: 'lg:col-span-7', aspectVariant: 'wide' },
  { gridClass: 'lg:col-span-5', aspectVariant: 'tall' },
];

export function PropertyCatalog() {
  const [activeFilter, setActiveFilter] = useState<QuickFilterKey>('all');

  const filteredProperties = useMemo(() => {
    const base = TIAR_PROPERTIES.filter((p) => {
      if (activeFilter === 'sidoarjo') return p.city === 'Sidoarjo';
      if (activeFilter === 'surabaya') return p.city === 'Surabaya';
      if (activeFilter === 'under2') return p.cicilanNominal < 2;
      if (activeFilter === '2floor') return p.floors === 2;
      return true;
    });
    // Default lookbook curates 6 staggered residences on homepage while /properti shows all
    return activeFilter === 'all' ? base.slice(0, 6) : base;
  }, [activeFilter]);

  return (
    <>
      {/* SECTION 1: EDITORIAL DIPTYCH MISSION + QUICK FILTER */}
      <UspFeatureBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* SECTION 2: INFINITE EDITORIAL SERIF MARQUEE */}
      <div
        aria-label="Keunggulan program hunian"
        className="marquee-band border-y border-[#C5BEB4] py-5 sm:py-6 overflow-hidden bg-[#FAF8F5]"
      >
        <div className="marquee-track">
          {[0, 1].map((dupIdx) => (
            <div
              key={dupIdx}
              aria-hidden={dupIdx === 1}
              className="flex items-center gap-8 sm:gap-10 pr-8 sm:pr-10"
            >
              {MARQUEE_ITEMS.map((item, idx) => (
                <React.Fragment key={`${dupIdx}-${idx}`}>
                  <span className="font-display font-medium text-[clamp(1.6rem,3vw,2.65rem)] leading-[1.1] whitespace-nowrap text-[#38352C]">
                    {item}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-2.5 h-2.5 rounded-full bg-[#FFCA4F] shrink-0"
                  />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: ASYMMETRIC STAGGERED PROPERTY LOOKBOOK */}
      <section
        id="klaster"
        aria-labelledby="lookbook-heading"
        className="py-16 sm:py-24 lg:py-32 bg-[#F1F1F1]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="flex flex-col gap-3 max-w-[54ch]">
              <h2
                id="lookbook-heading"
                className="font-display font-medium text-[clamp(2.1rem,4vw,3.6rem)] leading-[1.06] tracking-[-0.025em] text-[#38352C] max-w-[18ch]"
              >
                Koleksi klaster pilihan siap huni.
              </h2>
              <p className="font-body text-base leading-[1.6] text-[#57534A]">
                Nama klaster memakai kode kurasi resmi. Titik koordinat survei dikirim konsultan pendamping.
              </p>
            </div>

            <Link
              href="/properti"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full border border-[#C5BEB4] bg-[#E8E4E1] text-[#38352C] text-sm font-medium hover:bg-[#38352C] hover:text-[#E8E4E1] hover:border-[#38352C] active:scale-[0.97] transition-[background-color,color,border-color,transform] motion-reduce:transition-none whitespace-nowrap self-start md:self-auto"
            >
              <span className="num-clean">
                Lihat Semua {TIAR_PROPERTIES.length} Klaster
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="rounded-2xl bg-[#E8E4E1] border border-[#C5BEB4] p-8 sm:p-10 flex flex-col items-start gap-4">
              <p className="font-display text-2xl text-[#38352C]">
                Belum ada klaster yang cocok dengan filter tersebut.
              </p>
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full bg-[#38352C] text-[#E8E4E1] text-sm font-medium cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                <span>Tampilkan Semua Klaster</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-14 lg:gap-y-20 lg:gap-x-8 items-start">
              {filteredProperties.map((property, index) => {
                const layout = LOOKBOOK_LAYOUTS[index % LOOKBOOK_LAYOUTS.length];
                return (
                  <div key={property.id} className={layout.gridClass}>
                    <PropertyCard
                      property={property}
                      basePath="/properti"
                      aspectVariant={layout.aspectVariant}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
