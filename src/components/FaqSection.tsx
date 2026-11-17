import React from 'react';
import { ArrowRight, Plus, Minus } from 'lucide-react';
import { WA_CS_NUMBER, DEFAULT_WA_MESSAGE } from '@/data/properties';

const FAQS = [
  {
    q: (
      <>
        Apakah benar bisa ambil rumah dengan DP <span className="num-clean">0%</span> tanpa uang muka?
      </>
    ),
    a: (
      <>
        Benar. Konsumen cukup menyiapkan tanda jadi (UTJ) <span className="num-clean">Rp 1</span> juta hingga{' '}
        <span className="num-clean">Rp 5</span> juta sesuai klaster untuk mengunci kavling, yang langsung memotong
        harga jual. Seluruh biaya BPHTB, AJB, BBN, dan notaris ditanggung gratis.
      </>
    ),
    defaultOpen: true,
  },
  {
    q: 'Bagaimana jika ada riwayat BI Checking / SLIK OJK kurang lancar?',
    a: (
      <>
        Jangan khawatir. Tim analis kami akan mengecek kondisi SLIK secara privat serta menghitung rasio angsuran (
        <span className="num-clean">35% hingga 40%</span> penghasilan bersih atau Joint Income pasangan) lalu memetakan ke{' '}
        <span className="num-clean">5</span> bank BUMN rekanan dengan kebijakan paling fleksibel.
      </>
    ),
  },
  {
    q: 'Mengapa titik lokasi tepat baru dibagikan saat jadwal survei?',
    a: (
      <>
        Untuk melindungi kuota promo DP <span className="num-clean">0%</span> serta memastikan Anda disambut konsultan
        pendamping resmi saat tiba di klaster agar bonus unit tetap tercatat.
      </>
    ),
  },
  {
    q: 'Berapa lama proses pengajuan berkas KPR sampai disetujui bank?',
    a: (
      <>
        Rata-rata <span className="num-clean">7</span> hingga <span className="num-clean">14</span> hari kerja setelah
        berkas lengkap. Tim kami mengawal proses dari awal hingga terbit Surat Keputusan Kredit (SP
        <span className="num-clean">3</span>K) dan akad notaris.
      </>
    ),
  },
];

export function FaqSection() {
  const waUrl = `https://wa.me/${WA_CS_NUMBER}?text=${DEFAULT_WA_MESSAGE}`;

  return (
    <section
      id="pertanyaan"
      aria-labelledby="faq-heading"
      className="py-16 sm:py-24 bg-[#F1F1F1] border-t border-[#C5BEB4]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Sticky Question Intro + CTA Box */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <h2
              id="faq-heading"
              className="font-display font-medium text-[clamp(2.1rem,3.8vw,3.3rem)] leading-[1.08] tracking-[-0.025em] text-[#38352C] max-w-[16ch]"
            >
              Pertanyaan yang paling sering ditanyakan.
            </h2>
            <p className="font-body text-base leading-[1.6] text-[#57534A] max-w-[40ch]">
              Jawaban transparan seputar skema tanpa uang muka, legalitas kavling, hingga pendampingan berkas bank.
            </p>

            <div className="rounded-2xl bg-[#E8E4E1] p-6 ring-1 ring-inset ring-[#38352C]/14 flex flex-col items-start gap-4 mt-2">
              <p className="text-sm font-medium text-[#38352C]">
                Masih ada pertanyaan seputar unit atau penghasilan? Mbak Ningsih siap memandu langsung.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dual-cta"
              >
                <span className="dual-cta__label">Tanya Mbak Ningsih</span>
                <span className="dual-cta__circle" aria-hidden="true">
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </span>
              </a>
            </div>
          </div>

          {/* Right Native <details> Accordion with 1px Hairline Dividers */}
          <div className="lg:col-span-7 border-t border-[#C5BEB4]">
            {FAQS.map((item, idx) => (
              <details
                key={idx}
                open={item.defaultOpen}
                className="group border-b border-[#C5BEB4]"
              >
                <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer py-6 flex items-center justify-between gap-4 font-display font-medium text-[clamp(1.25rem,2vw,1.65rem)] leading-[1.25] text-[#38352C] hover:text-[#57534A] transition-colors">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="w-9 h-9 rounded-full border border-[#C5BEB4] flex items-center justify-center shrink-0 text-[#38352C]"
                  >
                    <Plus className="w-4 h-4 block group-open:hidden" strokeWidth={1.75} />
                    <Minus className="w-4 h-4 hidden group-open:block" strokeWidth={1.75} />
                  </span>
                </summary>
                <div className="pb-6 pr-8 font-body text-[15px] leading-[1.65] text-[#57534A] max-w-[64ch]">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
