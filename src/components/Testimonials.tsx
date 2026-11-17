import React from 'react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Aditya & Rina',
      profile: 'Karyawan Swasta Rungkut',
      badge: 'ACC Bank BTN',
      quote:
        'Awalnya ragu ada rumah tanpa DP beneran. Ternyata pas ketemu tim Tiar Property beneran cuma keluar uang UTJ 1 Juta. Semua biaya pajak & notaris gratis!',
      unit: 'Cluster Sukodono',
    },
    {
      name: 'Dimas Pratama',
      profile: 'PNS Surabaya Timur',
      badge: 'ACC Bank BSI',
      quote:
        'Program subsidi angsuran 1,4 juta sangat membantu di bulan-bulan awal. Respon Mbak Ningsih di WhatsApp ramah dan nemenin survei langsung.',
      unit: 'Cluster Sedati Juanda',
    },
    {
      name: 'Bagus & Maya',
      profile: 'Pasangan Baru Menikah',
      badge: 'ACC Bank Mandiri',
      quote:
        'Daripada bayar sewa tahunan yang uangnya hangus, mending ambil rumah di Tiar Property. Angsuran mirip sewa kontrakan tapi statusnya SHM milik sendiri.',
      unit: 'Cluster Waru Gateway',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-t border-[#dde8e2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[#081613] tracking-tight">
            Keluarga yang Sudah ACC KPR
          </h2>
          <p className="text-[#477769] mt-2 text-xs sm:text-sm font-normal">
            Pendampingan berkas 100% ke 5 bank rekanan BUMN sampai serah terima kunci.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-[#f7faf8] border border-[#dde8e2] hover:border-[#3a6356]/40 hover:-translate-y-0.5 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#081613] text-[#dde8e2]">
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-bold text-[#477769]">{item.unit}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#16362f] leading-relaxed font-normal italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#dde8e2] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#081613] text-[#dde8e2] flex items-center justify-center font-black text-xs">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-black text-[#081613]">{item.name}</p>
                  <p className="text-[10px] text-[#477769] font-medium">{item.profile}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
