'use client';

import React, { useState } from 'react';
import { WA_CS_NUMBER } from '@/data/properties';
import {
  calculateMonthlyInstallment,
  calculatePromoInstallment,
  formatRupiah,
} from '@/utils/kpr';

export function KprCalculator() {
  const [propertyPrice, setPropertyPrice] = useState<number>(350000000);
  const [dpPercent, setDpPercent] = useState<number>(0);
  const [tenorYears, setTenorYears] = useState<number>(20);
  const interestRate = 3.4;

  const dpAmount = (propertyPrice * dpPercent) / 100;
  const principal = propertyPrice - dpAmount;

  const monthlyInstallment = calculateMonthlyInstallment({
    propertyPrice,
    dpPercent,
    tenorYears,
    interestRateAnnual: interestRate,
  });

  const promoInstallment = calculatePromoInstallment(monthlyInstallment, 1400000);

  const waMessage = encodeURIComponent(
    `Halo Mbak Ningsih, simulasi KPR saya:\nHarga: ${formatRupiah(propertyPrice)}\nDP: ${dpPercent}%\nTenor: ${tenorYears} Thn\nEstimasi: ${formatRupiah(monthlyInstallment)}/bln (Promo: ${formatRupiah(promoInstallment)}/bln)\n\nBisa dibantu cek bank yang ACC?`
  );
  const waUrl = `https://wa.me/${WA_CS_NUMBER}?text=${waMessage}`;

  return (
    <section id="kalkulator" className="py-16 md:py-24 bg-[#f7faf8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[#081613] tracking-tight">
            Simulasi Mandiri KPR 2026
          </h2>
          <p className="text-[#477769] mt-2 text-xs sm:text-sm font-normal">
            Hitung estimasi cicilan dengan skema promo bunga 3,4% dan subsidi Rp 1,4 Juta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white p-6 sm:p-10 rounded-3xl border border-[#dde8e2] shadow-reome-card">
          {/* Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-bold text-[#16362f]">Estimasi Harga Properti</label>
                <span className="text-sm sm:text-base font-black text-[#081613]">{formatRupiah(propertyPrice)}</span>
              </div>
              <input
                type="range"
                min={250000000}
                max={1200000000}
                step={25000000}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full h-2 bg-[#dde8e2] rounded-lg appearance-none cursor-pointer accent-[#081613]"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-[#16362f] block mb-2">
                Uang Muka: {dpPercent}% ({formatRupiah(dpAmount)})
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[0, 5, 10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDpPercent(val)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      dpPercent === val
                        ? 'bg-[#081613] text-white border-[#081613]'
                        : 'bg-[#f7faf8] text-[#16362f] border-[#dde8e2]'
                    }`}
                  >
                    {val === 0 ? 'DP 0% (Promo)' : `${val}%`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-[#16362f] block mb-2">
                Tenor: {tenorYears} Tahun
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 20, 25].map((tenor) => (
                  <button
                    key={tenor}
                    type="button"
                    onClick={() => setTenorYears(tenor)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      tenorYears === tenor
                        ? 'bg-[#081613] text-white border-[#081613]'
                        : 'bg-[#f7faf8] text-[#16362f] border-[#dde8e2]'
                    }`}
                  >
                    {tenor} Thn
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-[#081613] text-white flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8baf9f]">
                Estimasi Angsuran
              </span>
              <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/15">
                <p className="text-xs text-[#dde8e2]">Promo Subsidi Rp 1,4 Jt (6-12 Bln):</p>
                <p className="text-2xl sm:text-3xl font-black mt-1">
                  {formatRupiah(promoInstallment)}
                  <span className="text-xs font-normal text-[#8baf9f]"> /bln</span>
                </p>
              </div>
              <div className="mt-4 flex justify-between text-xs text-[#8baf9f] pt-2 border-t border-white/10">
                <span>Angsuran Normal:</span>
                <span className="font-bold text-white">{formatRupiah(monthlyInstallment)} /bln</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-3.5 rounded-full font-bold text-xs bg-[#dde8e2] text-[#081613] hover:bg-white transition-all shadow-md active:scale-95"
              >
                Konsultasikan ke Mbak Ningsih
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
