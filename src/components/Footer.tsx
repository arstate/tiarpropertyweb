import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { WA_CS_NUMBER } from '@/data/properties';

export function Footer() {
  const waSurveyUrl = `https://wa.me/${WA_CS_NUMBER}?text=${encodeURIComponent(
    'Halo Mbak Ningsih, saya mau booking jadwal survei rumah Sabtu atau Minggu ini.'
  )}`;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F1F1F1] pt-14 sm:pt-20 pb-10 border-t border-[#C5BEB4]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Pre-Footer Survey CTA Strip */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 mb-12 border-b border-[#C5BEB4]">
          <h2 className="font-display font-medium text-[clamp(2.1rem,4vw,3.6rem)] leading-[1.06] tracking-[-0.025em] text-[#38352C] max-w-[18ch]">
            Siap melihat langsung kondisi unit akhir pekan ini?
          </h2>

          <a
            href={waSurveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dual-cta whitespace-nowrap self-start lg:self-auto"
          >
            <span className="dual-cta__label">Jadwalkan Survei Bersama</span>
            <span className="dual-cta__circle" aria-hidden="true">
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </span>
          </a>
        </div>

        {/* Ft2 Split Grid: 4-col Portrait Photo + 8-col Dark #38352C Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-4 rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[3/4] bg-[#E8E4E1] ring-1 ring-inset ring-[#38352C]/14">
            <img
              src="/images/properties/editorial-footer.webp"
              alt="Interior ruang tamu hangat rumah siap huni di kawasan Sidoarjo dan Surabaya"
              width={900}
              height={1200}
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-8 rounded-2xl bg-[#38352C] text-[#E8E4E1] p-7 sm:p-10 flex flex-col justify-between gap-12 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="font-body text-xs font-semibold text-[#C5BEB4] mb-2">
                  Navigasi
                </h3>
                <ul className="flex flex-col text-sm">
                  <li>
                    <Link href="/properti" className="inline-flex items-center min-h-[44px] hover:text-[#FFCA4F] transition-colors">
                      Koleksi Klaster
                    </Link>
                  </li>
                  <li>
                    <Link href="/#alur-kawal" className="inline-flex items-center min-h-[44px] hover:text-[#FFCA4F] transition-colors">
                      Alur Kawal Berkas
                    </Link>
                  </li>
                  <li>
                    <Link href="/#komparasi" className="inline-flex items-center min-h-[44px] hover:text-[#FFCA4F] transition-colors">
                      Komparasi Rumah
                    </Link>
                  </li>
                  <li>
                    <Link href="/agen" className="inline-flex items-center min-h-[44px] hover:text-[#FFCA4F] transition-colors">
                      Tim Konsultan
                    </Link>
                  </li>
                  <li>
                    <Link href="/#pertanyaan" className="inline-flex items-center min-h-[44px] hover:text-[#FFCA4F] transition-colors">
                      Pertanyaan Umum
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-body text-xs font-semibold text-[#C5BEB4] mb-4">
                  Area Pemasaran
                </h3>
                <ul className="flex flex-col gap-2.5 text-sm text-[#E8E4E1]/90">
                  <li>Sukodono &amp; Anggaswangi</li>
                  <li>Sedati &amp; Bypass Juanda</li>
                  <li>Waru &amp; Gedangan</li>
                  <li>MERR, Rungkut &amp; Wiyung</li>
                </ul>
              </div>

              <div>
                <h3 className="font-body text-xs font-semibold text-[#C5BEB4] mb-4">
                  Layanan Konsultan
                </h3>
                <ul className="flex flex-col gap-2.5 text-sm text-[#E8E4E1]/90">
                  <li>Mbak Ningsih (PIC Utama)</li>
                  <li className="mono-num text-[#FFCA4F]">0821-4219-3231</li>
                  <li className="num-clean">Setiap Hari, 08.00 sampai 20.00 WIB</li>
                  <li>Partner Resmi Bank BTN, BRI, BSI, Mandiri, BNI</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div
                aria-hidden="true"
                className="font-display font-medium text-[clamp(2.65rem,7.8vw,6.8rem)] leading-[0.86] tracking-[-0.03em] text-[#E8E4E1] pt-5 border-t border-[#E8E4E1]/15 whitespace-nowrap"
              >
                tiar property
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#C5BEB4]">
                <p className="num-clean">
                  © {currentYear} Tiar Property · Surabaya &amp; Sidoarjo, Jawa Timur
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center min-h-[44px] text-[#C5BEB4]/70 hover:text-[#E8E4E1] transition-colors"
                >
                  Portal Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
