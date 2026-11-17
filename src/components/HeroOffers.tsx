import React from 'react';
import { HERO_OFFERS } from '@/data/properties';

export function HeroOffers() {
  return (
    <section id="promo" className="py-16 md:py-24 bg-white border-t border-[#dde8e2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-black text-[#081613] tracking-tight">
            All-In Free & Jaminan Transparansi
          </h2>
          <p className="text-[#477769] mt-2 text-xs sm:text-sm font-normal">
            Seluruh biaya BPHTB, Notaris, AJB, dan subsidi KPR sudah ditanggung developer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {HERO_OFFERS.map((offer, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f7faf8] border border-[#dde8e2] hover:border-[#3a6356]/40 hover:-translate-y-0.5 hover:shadow-xs transition-all"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#081613] flex items-center justify-center text-[#dde8e2] mb-4 sm:mb-5 font-black text-xs">
                0{idx + 1}
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#081613] mb-1.5 sm:mb-2 tracking-tight">
                {offer.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#477769] leading-relaxed">
                {offer.description}
              </p>
            </div>
          ))}
        </div>

        {/* Hadiah Langsung Banner */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-[#081613] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-2xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#3a6356] text-[#dde8e2]">
              Hadiah Langsung Konsumen
            </span>
            <h4 className="text-lg sm:text-2xl md:text-3xl font-black mt-2.5 sm:mt-3 tracking-tight">
              Bonus Pompa Air, Meja Dapur, & Free IPL 6 Bulan
            </h4>
            <p className="text-xs sm:text-sm text-[#dde8e2] mt-1.5 sm:mt-2 leading-relaxed">
              Khusus pengajuan berkas KPR minggu ini. Tim analis mengawal berkas sampai persetujuan resmi (ACC).
            </p>
          </div>
          <a
            href="#katalog"
            className="w-full md:w-auto text-center shrink-0 px-7 py-3 rounded-full font-bold text-xs sm:text-sm bg-[#dde8e2] text-[#081613] hover:bg-white transition-all shadow-md active:scale-95"
          >
            Klaim Bonus Promo
          </a>
        </div>
      </div>
    </section>
  );
}
