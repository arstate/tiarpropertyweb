'use client';

import React, { useState } from 'react';
import { WA_CS_NUMBER, DEFAULT_WA_MESSAGE } from '@/data/properties';

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah benar promo DP 0% dan tidak ada biaya tambahan?',
      a: 'Benar 100%. Konsumen cukup menyiapkan tanda jadi (UTJ) Rp 1 Jt – 2 Jt. Seluruh biaya BPHTB, Notaris, AJB, BBN, dan subsidi KPR sudah ditanggung all-in oleh developer.',
    },
    {
      q: 'Bagaimana jika ada riwayat BI Checking / SLIK OJK kurang lancar?',
      a: 'Jangan berkecil hati. Tim analis perbankan Tiar Property akan memeriksa SLIK Anda secara privat dan memetakan ke bank rekanan (dari 5 bank BUMN) dengan kebijakan yang paling fleksibel.',
    },
    {
      q: 'Kapan jadwal survei lokasi dan apakah bisa didampingi?',
      a: 'Buka setiap hari (Senin s/d Minggu, pukul 08.00–17.00 WIB). Klik WhatsApp Admin Mbak Ningsih untuk konfirmasi jam survei, dan tim kami mendampingi langsung ke lokasi klaster.',
    },
    {
      q: 'Berapa lama proses pengajuan berkas KPR sampai disetujui (ACC)?',
      a: 'Rata-rata 7 hingga 14 hari kerja setelah berkas lengkap. Tim Tiar Property mendampingi setiap tahapan sampai terbit Surat Keputusan Kredit (SP3K) resmi.',
    },
  ];

  const waUrl = `https://wa.me/${WA_CS_NUMBER}?text=${DEFAULT_WA_MESSAGE}`;

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#f7faf8] border-t border-[#dde8e2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[#081613] tracking-tight">
            Tanya Jawab Seputar KPR (FAQ)
          </h2>
          <p className="text-[#477769] mt-2 text-xs sm:text-sm font-normal">
            Jawaban transparan seputar proses pembelian, legalitas, dan pendampingan bank.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#dde8e2] bg-white overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-[#081613] hover:text-[#16362f] transition-colors"
                >
                  <span>{item.q}</span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-transform ${isOpen ? 'rotate-180 bg-[#081613] text-white border-[#081613]' : 'bg-[#f7faf8] text-[#477769] border-[#dde8e2]'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#16362f] leading-relaxed border-t border-[#dde8e2]/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-6 rounded-3xl bg-white border border-[#dde8e2] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm font-black text-[#081613]">Ada pertanyaan lain? Admin Mbak Ningsih siap bantu.</p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-2.5 rounded-full text-xs font-bold bg-[#081613] text-white hover:bg-[#16362f] transition-all"
          >
            Tanya Mbak Ningsih
          </a>
        </div>
      </div>
    </section>
  );
}
