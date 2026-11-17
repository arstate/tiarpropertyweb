import React from 'react';
import Link from 'next/link';
import { WA_CS_NUMBER, DEFAULT_WA_MESSAGE } from '@/data/properties';

export function Footer() {
  const waUrl = `https://wa.me/${WA_CS_NUMBER}?text=${DEFAULT_WA_MESSAGE}`;

  return (
    <footer className="bg-[#081613] border-t border-[#16362f] py-14 text-white text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[#16362f]">
          {/* Brand */}
          <div>
            <div className="flex items-center">
              <span className="text-xl font-black text-white tracking-tighter">
                Tiar<span className="text-[#dde8e2]">Property</span>
              </span>
            </div>
            <p className="mt-3.5 text-white/90 text-xs leading-relaxed max-w-sm">
              Partner Pemasaran Hunian Terpercaya Surabaya & Sidoarjo. Solusi punya rumah pertama DP 0% & All-In Free.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs font-bold text-[#dde8e2]">
              <Link href="/properti" className="hover:text-white transition-colors">
                Katalog Rumah →
              </Link>
              <span>•</span>
              <Link href="/agen" className="hover:text-white transition-colors">
                Tim Konsultan →
              </Link>
            </div>
          </div>

          {/* Area */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3.5">
              Area Pemasaran
            </h4>
            <ul className="space-y-1.5 text-xs text-white/90">
              <li>• Sukodono & Anggaswangi, Sidoarjo</li>
              <li>• Sedati, Kwangsan, & Akses Juanda</li>
              <li>• Waru, Gedangan, & Perbatasan Surabaya</li>
              <li>• MERR & Rungkut, Surabaya Timur</li>
            </ul>
          </div>

          {/* Konsultasi */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3.5">
              Layanan Konsumen
            </h4>
            <p className="text-xs text-white/90 mb-4 leading-relaxed">
              Konsultasi syarat KPR, BI checking, dan booking jadwal survei didampingi tim kami.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#081613] text-xs font-black hover:bg-[#dde8e2] transition-all shadow-md active:scale-95"
            >
              <span>Konsultasi WA: Tim Konsultan</span>
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/70 gap-4">
          <p>© {new Date().getFullYear()} Tiar Property. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Surabaya & Sidoarjo, Jawa Timur</span>
            <span>•</span>
            <Link href="/admin" className="text-white/40 hover:text-white/80 transition-colors">
              Portal Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
