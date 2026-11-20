import React from 'react';
import { ArrowRight } from 'lucide-react';
import { buildMainWaUrl } from '@/data/properties';
import { ScrollReveal } from '@/components/ScrollReveal';

const JOURNEY_STEPS = [
  {
    num: '.01',
    title: 'Konsultasi anggaran dan cek SLIK OJK gratis',
    desc: (
      <>
        Hitung rasio angsuran atau penggabungan penghasilan pasangan (Joint Income) sebelum memilih unit secara
        privat.
      </>
    ),
  },
  {
    num: '.02',
    title: 'Pendampingan survei fisik langsung di lokasi',
    desc: (
      <>
        Tinjau lebar jalan <span className="num-clean font-medium text-[#38352C]">8</span> meter, struktur bangunan,
        serta akses tol dan bandara bersama konsultan.
      </>
    ),
  },
  {
    num: '.03',
    title: (
      <>
        Kunci kavling cukup UTJ <span className="num-clean">Rp 1</span> sampai{' '}
        <span className="num-clean">5</span> juta
      </>
    ),
    desc: (
      <>
        Skema DP <span className="num-clean font-medium text-[#38352C]">0%</span> tanpa uang muka; nilai UTJ langsung
        memotong harga jual unit.
      </>
    ),
  },
  {
    num: '.04',
    title: (
      <>
        Pengajuan berkas ke <span className="num-clean">5</span> bank BUMN rekanan
      </>
    ),
    desc: (
      <>
        Dikawal ke BTN, BRI, BSI, Mandiri, dan BNI dengan bunga promo{' '}
        <span className="num-clean font-medium text-[#38352C]">3,4%</span> plus subsidi{' '}
        <span className="num-clean font-medium text-[#38352C]">Rp 1,4</span> juta per bulan.
      </>
    ),
  },
  {
    num: '.05',
    title: 'Akad notaris bebas biaya dan serah terima kunci',
    desc: (
      <>
        Gratis BPHTB, AJB, balik nama, dan notaris, plus bonus pompa air atau IPL{' '}
        <span className="num-clean font-medium text-[#38352C]">6</span> bulan.
      </>
    ),
  },
];

export function HeroOffers() {
  const waUrl = buildMainWaUrl(
    'Halo Mbak Ningsih, saya mau ditemenin cek kelayakan KPR dan pilih klaster terbaik Tiar Property.'
  );

  return (
    <section
      id="alur-kawal"
      aria-labelledby="journey-heading"
      className="py-16 sm:py-24 lg:py-32 bg-[#FAF8F5] border-y border-[#C5BEB4]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
        {/* Sticky Left 5-col Editorial Spine */}
        <ScrollReveal className="lg:col-span-5 lg:sticky lg:top-[max(6.5rem,calc(50svh-10.5rem))] flex flex-col items-start gap-5">
          <h2
            id="journey-heading"
            className="font-display font-medium text-[clamp(2.3rem,4.4vw,4.35rem)] leading-[1.03] tracking-[-0.03em] text-[#38352C] max-w-[14ch]"
          >
            Urusan berkas sampai akad biar kami yang kawal.
          </h2>

          <p className="font-body text-base leading-[1.6] text-[#57534A] max-w-[42ch]">
            Dari cek kelayakan pasangan hingga akta notaris, satu konsultan mendampingi tanpa biaya tambahan.
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dual-cta mt-1"
          >
            <span className="dual-cta__label">Mau Saya Temenin Cek?</span>
            <span className="dual-cta__circle" aria-hidden="true">
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </span>
          </a>
        </ScrollReveal>

        {/* Right 7-col .01-.05 Travertine Cards (0% Serif Numerals) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {JOURNEY_STEPS.map((step, idx) => (
            <ScrollReveal key={step.num} delay={idx * 90}>
              <article
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 sm:gap-6 items-start rounded-2xl bg-[#E8E4E1] p-6 sm:p-7 ring-1 ring-inset ring-[#38352C]/14"
              >
                <span className="num-clean text-2xl sm:text-[26px] font-semibold leading-none text-[#57534A] pt-1">
                  {step.num}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display font-medium text-[clamp(1.35rem,2vw,1.75rem)] leading-[1.2] text-[#38352C] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="font-body text-[15px] leading-[1.6] text-[#57534A]">
                    {step.desc}
                  </p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
