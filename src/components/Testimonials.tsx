import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

const VALUE_CARDS = [
  {
    index: '.01',
    title: 'SHM & IMB pecah per kavling',
    text: 'Sertifikat Hak Milik dan PBG setiap unit siap diproses sampai akad notaris.',
  },
  {
    index: '.02',
    title: (
      <>
        <span className="num-clean">5</span> Bank BUMN Rekanan Resmi
      </>
    ),
    text: 'Didukung BTN, BRI, BSI syariah, Mandiri, dan BNI dengan bunga promo ringan.',
  },
  {
    index: '.03',
    title: 'Gratis BPHTB, AJB & Notaris',
    text: (
      <>
        Bebas biaya balik nama dan subsidi angsuran hingga{' '}
        <span className="num-clean font-medium text-[#38352C]">Rp 20</span> juta.
      </>
    ),
  },
  {
    index: '.04',
    title: 'Ditemani hingga serah terima',
    text: 'Satu konsultan mendampingi dari survei lokasi hingga kunci rumah diserahkan.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Aditya & Rina',
    profile: 'Karyawan Swasta, Rungkut',
    badge: 'ACC Bank BTN',
    quote: (
      <>
        Awalnya ragu ada rumah tanpa DP beneran. Pas ketemu tim Tiar Property memang cuma siapkan UTJ{' '}
        <span className="num-clean font-medium text-[#38352C]">Rp 1</span> juta. Semua biaya pajak dan notaris gratis.
      </>
    ),
    unit: 'Klaster Sukodono',
  },
  {
    name: 'Dimas Pratama',
    profile: 'PNS, Surabaya Timur',
    badge: 'ACC Bank BSI',
    quote: (
      <>
        Program subsidi angsuran <span className="num-clean font-medium text-[#38352C]">Rp 1,4</span> juta sangat
        membantu di bulan awal. Respon Mbak Ningsih di WhatsApp ramah dan menemani survei langsung.
      </>
    ),
    unit: 'Klaster Sedati Juanda',
  },
  {
    name: 'Bagus & Maya',
    profile: 'Pasangan Baru Menikah',
    badge: 'ACC Bank Mandiri',
    quote:
      'Daripada bayar sewa tahunan yang uangnya hangus, lebih baik ambil rumah sendiri. Angsuran setara kontrakan namun sertifikat SHM atas nama sendiri.',
    unit: 'Klaster Waru Gateway',
  },
];

export function Testimonials() {
  return (
    <section
      aria-labelledby="value-heading"
      className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#C5BEB4]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* 4-Column Legal & Guarantee Cards (.01-.04 Clean Numerals) */}
        <div className="max-w-[54ch] mb-10 sm:mb-12">
          <h2
            id="value-heading"
            className="font-display font-medium text-[clamp(2.1rem,4vw,3.5rem)] leading-[1.06] tracking-[-0.025em] text-[#38352C]"
          >
            Kepastian legalitas dan biaya dari awal hingga akad.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 sm:mb-20">
          {VALUE_CARDS.map((card, idx) => (
            <ScrollReveal key={card.index} delay={idx * 80} className="h-full">
              <article
                className="rounded-2xl bg-[#E8E4E1] p-6 min-h-[220px] h-full flex flex-col justify-between gap-6 ring-1 ring-inset ring-[#38352C]/14"
              >
              <span className="num-clean text-2xl font-semibold leading-none text-[#57534A]">
                {card.index}
              </span>
              <div>
                <h3 className="font-display font-medium text-2xl leading-[1.2] text-[#38352C] mb-2">
                  {card.title}
                </h3>
                <p className="font-body text-sm leading-[1.55] text-[#57534A]">
                  {card.text}
                </p>
              </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* Client ACC Testimonials (Upright Serif/Body, 0 Italic Slop) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pt-10 border-t border-[#C5BEB4]">
          <div>
            <h3 className="font-display font-medium text-[clamp(1.75rem,3vw,2.65rem)] leading-[1.1] text-[#38352C]">
              Keluarga yang sudah serah terima kunci.
            </h3>
            <p className="text-sm text-[#57534A] mt-1.5">
              Pendampingan berkas penuh ke <span className="num-clean">5</span> bank rekanan BUMN hingga SP<span className="num-clean">3</span>K terbit.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((item, idx) => (
            <ScrollReveal key={item.name} delay={idx * 100} className="h-full">
              <article
                className="rounded-2xl bg-[#E8E4E1] p-6 h-full ring-1 ring-inset ring-[#38352C]/14 flex flex-col justify-between gap-6"
              >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38352C] text-[#E8E4E1] text-xs font-medium whitespace-nowrap">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FFCA4F]" strokeWidth={1.75} aria-hidden="true" />
                    <span>{item.badge}</span>
                  </span>
                  <span className="text-xs font-medium text-[#57534A]">{item.unit}</span>
                </div>

                <p className="font-body text-[15px] leading-[1.6] text-[#38352C]">
                  “{item.quote}”
                </p>
              </div>

              <div className="pt-4 border-t border-[#C5BEB4] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#38352C] text-[#E8E4E1] flex items-center justify-center font-display font-semibold text-base shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#38352C]">{item.name}</p>
                  <p className="text-xs text-[#57534A]">{item.profile}</p>
                </div>
              </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
