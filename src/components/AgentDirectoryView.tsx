'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { TIAR_AGENTS, buildAgentWaUrl } from '@/data/agents';
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
    <div className="min-h-screen flex flex-col bg-[#F1F1F1] text-[#38352C]">
      <main className="flex-1 pb-20 md:pb-28">
        {/* Editorial Header */}
        <section className="pt-24 sm:pt-28 pb-10 border-b border-[#C5BEB4] bg-[#FAF8F5]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between gap-3 text-xs font-medium text-[#57534A] mb-2">
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 min-h-[44px] -ml-2 px-2 hover:text-[#38352C] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
                  <span>Beranda</span>
                </Link>
                <span aria-hidden="true">·</span>
                <span className="text-[#38352C] font-semibold">Tim Konsultan Resmi</span>
              </div>

              <Link
                href="/properti"
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full bg-[#E8E4E1] border border-[#C5BEB4] text-[#38352C] font-medium hover:bg-[#38352C] hover:text-[#E8E4E1] transition-colors whitespace-nowrap"
              >
                <span>Koleksi Klaster</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-[56ch]">
                <h1 className="font-display font-medium text-[clamp(2.25rem,4.4vw,3.9rem)] leading-[1.05] tracking-[-0.025em] text-[#38352C]">
                  Konsultan pendamping survei dan berkas KPR.
                </h1>
                <p className="mt-3 font-body text-base leading-[1.6] text-[#57534A]">
                  Pendampingan survei fisik unit Surabaya dan Sidoarjo serta pengawalan berkas ke{' '}
                  <span className="num-clean font-medium text-[#38352C]">5</span> bank BUMN rekanan{' '}
                  <span className="num-clean font-medium text-[#38352C]">100%</span> bebas biaya.
                </p>
              </div>

              {/* Segmented Filter Control (0% Serif Numerals) */}
              <div
                role="tablist"
                aria-label="Filter wilayah konsultan"
                className="inline-flex items-center gap-1 p-1.5 rounded-full bg-[#E8E4E1] border border-[#C5BEB4] self-start lg:self-auto"
              >
                {[
                  { key: 'semua' as CityFilter, label: 'Semua', count: countSemua },
                  { key: 'sidoarjo' as CityFilter, label: 'Sidoarjo', count: countSidoarjo },
                  { key: 'surabaya' as CityFilter, label: 'Surabaya', count: countSurabaya },
                ].map((tab) => {
                  const active = selectedFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedFilter(tab.key)}
                      className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#38352C] text-[#E8E4E1]'
                          : 'text-[#57534A] hover:text-[#38352C]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`num-clean text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          active
                            ? 'bg-[#FFCA4F] text-[#38352C]'
                            : 'bg-[#FAF8F5] text-[#38352C]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Agent Portrait Cards Grid */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAgents.map((agent) => {
              const activeCityContext =
                selectedFilter === 'sidoarjo'
                  ? 'Sidoarjo'
                  : selectedFilter === 'surabaya'
                  ? 'Surabaya'
                  : agent.citySpecialist;
              const waUrl = buildAgentWaUrl(agent, { city: activeCityContext });

              return (
                <article
                  key={agent.id}
                  className="rounded-2xl bg-[#E8E4E1] p-4 ring-1 ring-inset ring-[#38352C]/14 flex flex-col justify-between gap-4 group"
                >
                  <div className="flex flex-col gap-4">
                    {/* Portrait Photo 3:4 */}
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#C5BEB4]/40 ring-1 ring-inset ring-[#38352C]/10 group-hover:ring-[#38352C]/35 transition-colors">
                      <img
                        src={agent.photoUrl}
                        alt={agent.name}
                        width={600}
                        height={800}
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#38352C]/90 backdrop-blur-md text-[#E8E4E1] text-xs font-medium">
                        {agent.citySpecialist}
                      </span>
                      <span className="num-clean absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF8F5]/95 text-[#38352C] text-xs font-semibold">
                        <Star
                          className="w-3.5 h-3.5 text-[#38352C] fill-[#FFCA4F]"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span>{agent.rating.toFixed(1)}</span>
                      </span>
                    </div>

                    <div className="px-1 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-display font-medium text-2xl leading-tight text-[#38352C]">
                          {agent.name}
                        </h2>
                        <ShieldCheck
                          className="w-4 h-4 text-[#38352C] shrink-0"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-xs font-medium text-[#57534A]">{agent.role}</p>
                      <p className="text-xs text-[#57534A] leading-relaxed pt-1">
                        {agent.bio}
                      </p>
                      <p className="num-clean text-xs font-semibold text-[#38352C] pt-1">
                        {agent.totalDealsAssisted} keluarga terbantu ACC
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dual-cta w-full justify-between"
                    >
                      <span className="dual-cta__label flex-1">Mau Saya Temenin?</span>
                      <span className="dual-cta__circle" aria-hidden="true">
                        <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                      </span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Service Guarantee Strip */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-16 sm:mt-24">
          <div className="rounded-2xl bg-[#FAF8F5] border border-[#C5BEB4] p-7 sm:p-10">
            <h2 className="font-display font-medium text-[clamp(1.85rem,3.2vw,2.75rem)] leading-[1.1] text-[#38352C] mb-8 max-w-[24ch]">
              Mengapa survei bersama konsultan resmi Tiar Property?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: '.01',
                  title: 'Survei Lokasi Didampingi',
                  desc: (
                    <>
                      Pendampingan langsung setiap akhir pekan untuk mengecek fisik bangunan, lebar jalan{' '}
                      <span className="num-clean font-medium text-[#38352C]">8</span> meter, dan akses lingkungan.
                    </>
                  ),
                },
                {
                  num: '.02',
                  title: 'Cek SLIK & Hitung Cicilan Privat',
                  desc: (
                    <>
                      Analisis kemampuan angsuran dan pengecekan riwayat perbankan secara privat agar peluang ACC
                      mendekati <span className="num-clean font-medium text-[#38352C]">100%</span>.
                    </>
                  ),
                },
                {
                  num: '.03',
                  title: (
                    <>
                      Kawal <span className="num-clean">5</span> Bank Rekanan BUMN
                    </>
                  ),
                  desc: (
                    <>
                      Koordinasi berkas ke Bank BTN, BRI, BSI, Mandiri, dan BNI hingga terbit SP
                      <span className="num-clean font-medium text-[#38352C]">3</span>K dan tanda tangan akad notaris.
                    </>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="rounded-2xl bg-[#E8E4E1] p-6 ring-1 ring-inset ring-[#38352C]/14 flex flex-col gap-3"
                >
                  <span className="num-clean text-xl font-semibold text-[#57534A]">
                    {item.num}
                  </span>
                  <h3 className="font-display font-medium text-2xl text-[#38352C]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#57534A] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
