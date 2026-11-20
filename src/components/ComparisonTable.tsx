import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { buildMainWaUrl } from '@/data/properties';
import { ScrollReveal } from '@/components/ScrollReveal';

const COMPARISON_ROWS = [
  {
    num: '01',
    param: 'Pengeluaran Bulanan',
    ngontrak: (
      <>
        <span className="num-clean">Rp 2</span> sampai{' '}
        <span className="num-clean">2,5</span> Jt/bulan (uang sewa hangus)
      </>
    ),
    tiar: (
      <>
        Mulai <span className="num-clean">Rp 1,7</span> Jt/bln (subsidi{' '}
        <span className="num-clean">Rp 1,4</span> Jt x{' '}
        <span className="num-clean">6</span> bulan)
      </>
    ),
  },
  {
    num: '02',
    param: 'Status Hak Milik',
    ngontrak: 'Hanya hak pakai sewa; properti tetap milik orang lain',
    tiar: 'Aset pribadi dengan sertifikat SHM pecah per kavling',
  },
  {
    num: '03',
    param: 'Kenaikan Nilai Aset',
    ngontrak: (
      <>
        <span className="num-clean">0%</span> (biaya naik tiap tahun)
      </>
    ),
    tiar: (
      <>
        Potensi kenaikan nilai <span className="num-clean">10% hingga 15%</span> setiap tahun
      </>
    ),
  },
  {
    num: '04',
    param: 'Modal Awal Masuk',
    ngontrak: (
      <>
        Bayar sewa <span className="num-clean">1 sampai 2</span> tahun di depan (
        <span className="num-clean">Rp 25 sampai 30</span> Jt)
      </>
    ),
    tiar: (
      <>
        Cukup UTJ <span className="num-clean">Rp 1 sampai 2</span> Juta (DP{' '}
        <span className="num-clean">0%</span> All-In Free)
      </>
    ),
  },
  {
    num: '05',
    param: 'Keleluasaan Renovasi',
    ngontrak: 'Terbatas aturan pemilik kontrakan',
    tiar: 'Bebas tata ruang, renovasi, dan perluas bangunan',
  },
];

export function ComparisonTable() {
  const waUrl = buildMainWaUrl(
    'Halo Mbak Ningsih, saya mau minta tolong hitung estimasi cicilan KPR DP 0% dan cek kelayakan SLIK OJK secara privat.'
  );

  return (
    <section
      id="komparasi"
      aria-labelledby="komparasi-heading"
      className="py-16 sm:py-24 lg:py-32 bg-[#F1F1F1]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-14">
          <div className="flex flex-col gap-3 max-w-[56ch]">
            <h2
              id="komparasi-heading"
              className="font-display font-medium text-[clamp(2.1rem,4vw,3.6rem)] leading-[1.06] tracking-[-0.025em] text-[#38352C] max-w-[19ch]"
            >
              Cicilan setara kontrakan, sertifikat SHM milik sendiri.
            </h2>
            <p className="font-body text-base leading-[1.6] text-[#57534A]">
              Ingin hitung rincian angsuran sesuai penghasilan atau Joint Income pasangan? Konsultan kami hitungkan
              langsung lewat WhatsApp tanpa biaya.
            </p>
          </div>

          {/* Primary Conversion CTA replacing automated calculator */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dual-cta whitespace-nowrap"
            >
              <span className="dual-cta__label">Hitung Cicilan &amp; Cek SLIK via WhatsApp</span>
              <span className="dual-cta__circle" aria-hidden="true">
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </span>
            </a>

            <Link
              href="/properti"
              className="inline-flex items-center justify-center min-h-[48px] px-5 rounded-full border border-[#C5BEB4] bg-transparent text-[#38352C] text-sm font-medium hover:bg-[#E8E4E1] hover:border-[#38352C] transition-colors whitespace-nowrap"
            >
              Lihat Unit Tersedia
            </Link>
          </div>
        </ScrollReveal>

        {/* Mobile (< md): Stacked Clean Travertine Comparison Cards */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {COMPARISON_ROWS.map((row) => (
            <article
              key={row.num}
              className="rounded-2xl bg-[#E8E4E1] border border-[#C5BEB4] p-5 flex flex-col gap-3.5"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#C5BEB4] pb-2.5">
                <h3 className="font-display font-medium text-xl text-[#38352C]">
                  {row.param}
                </h3>
                <span className="num-clean text-xs font-semibold text-[#57534A] px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#C5BEB4]">
                  .{row.num}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#FAF8F5] p-3.5 border border-[#C5BEB4]">
                  <span className="text-xs font-medium text-[#57534A] block mb-1">
                    Sewa / Ngontrak
                  </span>
                  <p className="text-sm text-[#57534A] leading-snug">{row.ngontrak}</p>
                </div>

                <div className="rounded-xl bg-[#38352C] text-[#E8E4E1] p-3.5">
                  <span className="text-xs font-medium text-[#FFCA4F] flex items-center gap-1.5 mb-1">
                    <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                    Tiar Property
                  </span>
                  <p className="text-sm font-medium text-[#E8E4E1] leading-snug">
                    {row.tiar}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Desktop (md+): Hairline Editorial Comparison Table */}
        <ScrollReveal delay={120} className="hidden md:block overflow-hidden rounded-2xl border border-[#C5BEB4] bg-[#FAF8F5]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#C5BEB4] bg-[#E8E4E1]">
                <th className="w-[24%] py-4 px-6 text-xs font-semibold tracking-wide text-[#57534A]">
                  Parameter
                </th>
                <th className="w-[36%] py-4 px-6 text-xs font-semibold tracking-wide text-[#57534A]">
                  Sewa / Ngontrak
                </th>
                <th className="w-[40%] py-4 px-6 text-xs font-semibold tracking-wide text-[#E8E4E1] bg-[#38352C]">
                  Beli di Tiar Property
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5BEB4] text-[15px]">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.num} className="hover:bg-[#E8E4E1]/40 transition-colors">
                  <td className="py-4 px-6 font-medium text-[#38352C]">{row.param}</td>
                  <td className="py-4 px-6 text-[#57534A]">{row.ngontrak}</td>
                  <td className="py-4 px-6 font-medium text-[#38352C] bg-[#E8E4E1]/55 border-l border-[#C5BEB4]">
                    <div className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 text-[#38352C] shrink-0 mt-0.5"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>{row.tiar}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollReveal>
      </div>
    </section>
  );
}
