import React from 'react';

export function ComparisonTable() {
  const comparisonData = [
    {
      param: 'Pengeluaran Bulanan',
      ngontrak: 'Rp 2 Jt - 2,5 Jt / bulan (Uang Hangus)',
      tiar: 'Mulai Rp 1,8 Jt / bln (+Subsidi 1,4 Jt x 6 Bln)',
    },
    {
      param: 'Status Hak Milik',
      ngontrak: 'Hanya hak pakai sewa, aset milik orang lain',
      tiar: 'Aset Pribadi & Sertifikat SHM Lengkap',
    },
    {
      param: 'Kenaikan Nilai (Investasi)',
      ngontrak: '0% (Hilang tergerus waktu)',
      tiar: 'Capital Gain naik 10% - 15% setiap tahun',
    },
    {
      param: 'Modal Awal Masuk',
      ngontrak: 'Wajib bayar 1 tahun di depan (Rp 25–30 Jt)',
      tiar: 'Cukup UTJ Rp 1–2 Juta (DP 0% All-In Free)',
    },
    {
      param: 'Keleluasaan Renovasi',
      ngontrak: 'Dilarang paku dinding & modifikasi tata ruang',
      tiar: 'Bebas dekorasi & perluas bangunan',
    },
  ];

  return (
    <section id="komparasi" className="py-16 md:py-24 bg-[#f7faf8] border-t border-[#dde8e2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[#081613] tracking-tight">
            Ngontrak vs Beli Rumah Sendiri
          </h2>
          <p className="text-[#477769] mt-2 text-xs sm:text-sm font-normal">
            Biaya bulanan setara biaya sewa, namun di Tiar Property uang Anda berubah menjadi aset sah keluarga.
          </p>
        </div>

        {/* 1. Mobile View (< md): Stacked Clean Comparison Cards */}
        <div className="block md:hidden space-y-3">
          {comparisonData.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-[#dde8e2] shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#081613] tracking-tight">
                  {item.param}
                </span>
                <span className="text-[10px] font-bold text-[#477769] px-2 py-0.5 rounded-full bg-[#f7faf8] border border-[#dde8e2]">
                  Poin 0{idx + 1}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Sewa / Ngontrak */}
                <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/60 flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 block mb-1">
                    Sewa / Ngontrak
                  </span>
                  <p className="text-xs text-rose-950 font-medium leading-snug">
                    {item.ngontrak}
                  </p>
                </div>

                {/* Beli di Tiar Property */}
                <div className="p-2.5 rounded-xl bg-[#ebf2ee] border border-[#3a6356]/30 flex flex-col justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#16362f] flex items-center gap-1 block mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3a6356] shrink-0" />
                    Tiar Property
                  </span>
                  <p className="text-xs text-[#081613] font-black leading-snug">
                    {item.tiar}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Desktop View (md: and up): Clean Minimal Table */}
        <div className="hidden md:block overflow-hidden rounded-3xl border border-[#dde8e2] bg-white shadow-reome-card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7faf8] border-b border-[#dde8e2]">
                <th className="w-[24%] py-4 px-5 sm:px-6 text-xs font-black text-[#477769] uppercase tracking-wider">
                  Parameter
                </th>
                <th className="w-[38%] py-4 px-5 sm:px-6 text-xs font-black text-[#477769] uppercase tracking-wider">
                  Sewa / Ngontrak
                </th>
                <th className="w-[38%] py-4 px-5 sm:px-6 text-xs font-black text-[#081613] uppercase tracking-wider bg-[#dde8e2]/60 border-l border-[#dde8e2]">
                  Beli di Tiar Property
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dde8e2] text-xs sm:text-sm">
              {comparisonData.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#f7faf8] transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-[#081613]">{item.param}</td>
                  <td className="py-4 px-5 sm:px-6 text-rose-800/80 font-medium">{item.ngontrak}</td>
                  <td className="py-4 px-5 sm:px-6 text-[#081613] font-black bg-[#dde8e2]/30 border-l border-[#dde8e2]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16362f] shrink-0" />
                      <span>{item.tiar}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
