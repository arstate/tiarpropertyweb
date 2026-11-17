'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TIAR_AGENTS, AgentProfile, buildAgentWaUrl } from '@/data/agents';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

type CityFilter = 'semua' | 'sidoarjo' | 'surabaya';

export function AgentDirectoryView() {
  const [selectedFilter, setSelectedFilter] = useState<CityFilter>('semua');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const filteredAgents = TIAR_AGENTS.filter((agent) => {
    if (!agent.isActive) return false;
    if (selectedFilter === 'sidoarjo') {
      return (
        agent.citySpecialist === 'Sidoarjo' ||
        agent.citySpecialist === 'Surabaya & Sidoarjo'
      );
    }
    if (selectedFilter === 'surabaya') {
      return (
        agent.citySpecialist === 'Surabaya' ||
        agent.citySpecialist === 'Surabaya & Sidoarjo'
      );
    }
    return true;
  });

  const countSemua = TIAR_AGENTS.filter((a) => a.isActive).length;
  const countSidoarjo = TIAR_AGENTS.filter(
    (a) =>
      a.isActive &&
      (a.citySpecialist === 'Sidoarjo' || a.citySpecialist === 'Surabaya & Sidoarjo')
  ).length;
  const countSurabaya = TIAR_AGENTS.filter(
    (a) =>
      a.isActive &&
      (a.citySpecialist === 'Surabaya' || a.citySpecialist === 'Surabaya & Sidoarjo')
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf8] text-[#081613]">
      <main className="flex-1 pb-20 md:pb-28">
        {/* Top Breadcrumb */}
        <div className="border-b border-[#dde8e2] bg-[#ebf2ee]/50 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-medium text-[#477769] truncate">
              <Link href="/" className="hover:text-[#081613] transition-colors shrink-0">
                Beranda
              </Link>
              <span className="text-[#8baf9f]">/</span>
              <span className="text-[#081613] font-bold truncate">
                Konsultan Resmi
              </span>
            </div>

            <Link
              href="/properti"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#16362f] border border-[#dde8e2] font-bold hover:bg-[#ebf2ee] transition-all text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Katalog Rumah</span>
            </Link>
          </div>
        </div>

        {/* Clean Architectural Header & Filter Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-2">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 border-b border-[#dde8e2] pb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#3a6356] block mb-1">
                Tim Lapangan & Analis KPR
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#081613] tracking-tight">
                Konsultan Properti Resmi
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-[#477769] max-w-xl leading-relaxed">
                Pendampingan survei fisik unit Surabaya-Sidoarjo dan pengawalan berkas KPR ke 5 Bank BUMN 100% gratis.
              </p>
            </div>

            {/* Segmented Filter Control */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#dde8e2] shadow-xs shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setSelectedFilter('semua')}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === 'semua'
                    ? 'bg-[#081613] text-white shadow-xs'
                    : 'text-[#477769] hover:text-[#081613]'
                }`}
              >
                <span>Semua</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedFilter === 'semua' ? 'bg-[#3a6356] text-white' : 'bg-[#ebf2ee] text-[#16362f]'
                  }`}
                >
                  {countSemua}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('sidoarjo')}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === 'sidoarjo'
                    ? 'bg-[#081613] text-white shadow-xs'
                    : 'text-[#477769] hover:text-[#081613]'
                }`}
              >
                <span>Sidoarjo</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedFilter === 'sidoarjo' ? 'bg-[#3a6356] text-white' : 'bg-[#ebf2ee] text-[#16362f]'
                  }`}
                >
                  {countSidoarjo}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFilter('surabaya')}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === 'surabaya'
                    ? 'bg-[#081613] text-white shadow-xs'
                    : 'text-[#477769] hover:text-[#081613]'
                }`}
              >
                <span>Surabaya</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedFilter === 'surabaya' ? 'bg-[#3a6356] text-white' : 'bg-[#ebf2ee] text-[#16362f]'
                  }`}
                >
                  {countSurabaya}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Agent Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAgents.length === 0 ? (
              <div className="col-span-full py-12 text-center text-[#477769] bg-white rounded-3xl border border-[#dde8e2] p-8">
                <p className="text-sm font-bold text-[#081613]">Tidak ada konsultan untuk filter wilayah ini.</p>
                <p className="text-xs text-[#477769] mt-1">Silakan pilih tab Semua Wilayah untuk melihat seluruh tim konsultan.</p>
              </div>
            ) : (
              filteredAgents.map((agent) => {
                const activeCityContext =
                  selectedFilter === 'sidoarjo'
                    ? 'Sidoarjo'
                    : selectedFilter === 'surabaya'
                    ? 'Surabaya'
                    : agent.citySpecialist;
                const waUrl = buildAgentWaUrl(agent, { city: activeCityContext });

                return (
                  <div
                    key={agent.id}
                    className="bg-white border border-[#dde8e2] rounded-3xl p-3 sm:p-3.5 shadow-reome-card flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                  >
                    <div>
                      {/* Dominant Large Portrait Marketing Photo 3:4 */}
                      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#e6eeea]">
                        <img
                          src={agent.photoUrl}
                          alt={agent.name}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        {/* City Badge Overlay */}
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#081613]/80 backdrop-blur-md text-white text-[10px] font-bold tracking-tight">
                          {agent.citySpecialist}
                        </span>

                        {/* Rating Overlay */}
                        <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#081613] text-[11px] font-black shadow-xs">
                          <span className="text-amber-500">★</span>
                          <span>{agent.rating.toFixed(1)}</span>
                        </span>

                        {/* Live Ready Status Overlay */}
                        <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#16362f] text-[10px] font-bold shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Siap Dampingi Survei</span>
                        </span>
                      </div>

                      {/* Clean & Minimal Info */}
                      <div className="pt-3.5 pb-2 px-1">
                        <h2 className="text-base sm:text-lg font-black text-[#081613] tracking-tight leading-snug">
                          {agent.name}
                        </h2>
                        <p className="text-xs font-bold text-[#3a6356] mt-0.5 truncate">
                          {agent.role}
                        </p>
                        <p className="text-[11px] font-semibold text-[#477769] mt-1.5">
                          {agent.totalDealsAssisted} Unit Terbantu ACC
                        </p>
                      </div>
                    </div>

                    {/* Direct WhatsApp CTA Button */}
                    <div className="pt-2 px-1">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center py-2.5 sm:py-3 px-3 rounded-xl bg-[#081613] text-white hover:bg-[#16362f] text-xs font-bold transition-all shadow-xs active:scale-95 text-center cursor-pointer tracking-tight"
                      >
                        Mau Saya Temenin?
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Commitment & Bank Partners Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
          <div className="bg-white rounded-3xl border border-[#dde8e2] p-8 sm:p-10 shadow-reome-card">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#3a6356] block">
                Garansi Layanan Konsumen
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#081613] tracking-tight mt-1">
                Kenapa Wajib Didampingi Konsultan Tiar Property?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-5 rounded-2xl bg-[#f7faf8] border border-[#dde8e2]">
                <div className="w-10 h-10 rounded-full bg-[#081613] text-white flex items-center justify-center mx-auto mb-3 text-sm font-black">
                  1
                </div>
                <h4 className="text-sm font-black text-[#081613]">Survei Lokasi Didampingi</h4>
                <p className="text-xs text-[#477769] mt-1.5 leading-relaxed">
                  Tim kami mendampingi survei langsung setiap Sabtu-Minggu untuk cek kualitas bangunan fisik, lebar jalan, dan fasilitas lingkungan.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f7faf8] border border-[#dde8e2]">
                <div className="w-10 h-10 rounded-full bg-[#081613] text-white flex items-center justify-center mx-auto mb-3 text-sm font-black">
                  2
                </div>
                <h4 className="text-sm font-black text-[#081613]">BI Checking / SLIK Gratis</h4>
                <p className="text-xs text-[#477769] mt-1.5 leading-relaxed">
                  Analisis kemampuan angsuran dan pengecekan riwayat perbankan di awal agar peluang pengajuan KPR disetujui mendekati 100%.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f7faf8] border border-[#dde8e2]">
                <div className="w-10 h-10 rounded-full bg-[#081613] text-white flex items-center justify-center mx-auto mb-3 text-sm font-black">
                  3
                </div>
                <h4 className="text-sm font-black text-[#081613]">Kawal 5 Bank Rekanan BUMN</h4>
                <p className="text-xs text-[#477769] mt-1.5 leading-relaxed">
                  Bantuan koordinasi berkas ke Bank BTN, BRI, BSI, Mandiri, dan BNI hingga penerbitan SP3K dan proses tanda tangan akad notaris.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
