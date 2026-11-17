import React from 'react';
import { SearchFilterBar, type QuickFilterKey } from '@/components/SearchFilterBar';

interface UspFeatureBarProps {
  activeFilter?: QuickFilterKey;
  onFilterChange?: (filter: QuickFilterKey) => void;
}

export function UspFeatureBar({
  activeFilter = 'all',
  onFilterChange,
}: UspFeatureBarProps) {
  return (
    <section
      aria-labelledby="mission-heading"
      className="py-16 sm:py-24 lg:py-32 bg-[#F1F1F1]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left 5-col Portrait Architecture Photo */}
        <div className="lg:col-span-5">
          <div className="rounded-xl overflow-hidden aspect-[4/5] bg-[#E8E4E1] ring-1 ring-inset ring-[#38352C]/14">
            <img
              src="/images/properties/editorial-diptych.webp"
              alt="Ruang keluarga hangat dengan pencahayaan alami di unit contoh Sidoarjo"
              width={1000}
              height={1250}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right 7-col Editorial Statement + Clean Metrics + Quick Filter */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h2
            id="mission-heading"
            className="font-display font-medium text-[clamp(2rem,3.6vw,3.3rem)] leading-[1.1] tracking-[-0.025em] text-[#38352C] max-w-[20ch]"
          >
            Punya rumah pertama tanpa menunggu tabungan DP menumpuk.
          </h2>

          <p className="font-body text-base sm:text-[17px] leading-[1.65] text-[#57534A] max-w-[56ch]">
            Klaster bebas banjir berlebar jalan{' '}
            <span className="num-clean font-medium text-[#38352C]">8</span> meter di Surabaya dan Sidoarjo. Kami bantu
            cek SLIK OJK secara privat hingga akad notaris tanpa biaya tambahan.
          </p>

          {/* 3 Clean Key Metrics (0% Serif Numerals) */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-5 border-t border-[#C5BEB4]">
            <div>
              <div className="num-clean text-xl sm:text-2xl lg:text-[28px] font-semibold leading-tight text-[#38352C]">
                0% DP
              </div>
              <div className="num-clean text-xs sm:text-sm text-[#57534A] mt-1">
                UTJ mulai Rp 1 Jt
              </div>
            </div>
            <div>
              <div className="num-clean text-xl sm:text-2xl lg:text-[28px] font-semibold leading-tight text-[#38352C]">
                Rp 1,7 Jt
              </div>
              <div className="text-xs sm:text-sm text-[#57534A] mt-1">
                Cicilan awal per bulan
              </div>
            </div>
            <div>
              <div className="num-clean text-xl sm:text-2xl lg:text-[28px] font-semibold leading-tight text-[#38352C]">
                5 Bank
              </div>
              <div className="text-xs sm:text-sm text-[#57534A] mt-1">
                BTN, BRI, BSI, Mandiri, BNI
              </div>
            </div>
          </div>

          <SearchFilterBar activeFilter={activeFilter} onFilterChange={onFilterChange} />
        </div>
      </div>
    </section>
  );
}
