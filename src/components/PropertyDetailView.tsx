'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyUnit, WA_CS_NUMBER, TIAR_PROPERTIES } from '@/data/properties';
import { getAgentById, getAgentForProperty, buildAgentWaUrl } from '@/data/agents';
import {
  calculateMonthlyInstallment,
  calculatePromoInstallment,
  formatRupiah,
} from '@/utils/kpr';

interface PropertyDetailViewProps {
  property: PropertyUnit;
  basePath?: '/properti' | '/produk';
}

function parsePriceToNumber(priceStr: string): number {
  const match = priceStr.match(/(\d+(?:[.,]\d+)?)/);
  if (match) {
    const num = parseFloat(match[1].replace(',', '.'));
    if (priceStr.toLowerCase().includes('jt')) {
      return Math.round(num * 1_000_000);
    }
    if (priceStr.toLowerCase().includes('m')) {
      return Math.round(num * 1_000_000_000);
    }
    return Math.round(num);
  }
  return 350_000_000;
}

function getProximityHighlights(city: string) {
  if (city === 'Surabaya') {
    return [
      { time: '3 Menit', title: 'Akses MERR & OERR Surabaya', desc: 'Mobilitas lancar ke pusat kota, koridor bisnis, & kawasan perniagaan timur.' },
      { time: '5 Menit', title: 'Gerbang Tol Surabaya', desc: 'Akses cepat ke Tol Gunungsari, Tol Tambak Sumur, & Bandara Juanda.' },
      { time: '7 Menit', title: 'Pusat Belanja & Lifestyle Mall', desc: 'Dekat Galaxy Mall Surabaya, Pakuwon City Mall, & Transmart Rungkut.' },
      { time: '5 Menit', title: 'Kampus & Universitas Favorit', desc: 'Dekat Institut Teknologi Sepuluh Nopember (ITS), UPN Veteran, & UNAIR.' },
      { time: '8 Menit', title: 'Fasilitas Kesehatan Terpadu', desc: 'Dekat RS Premiere Surabaya, RS Royal Surabaya, & RS Mitra Keluarga.' },
      { time: '24 Jam', title: 'Keamanan One Gate System', desc: 'Portal otomatis, CCTV 24 jam, lingkungan asri, dan saluran bebas banjir.' },
    ];
  }
  return [
    { time: '5 Menit', title: 'Bandara Internasional Juanda', desc: 'Akses super cepat ke Terminal 1 & 2 via jalur bypass bebas macet.' },
    { time: '5 Menit', title: 'Gerbang Tol Juanda & Waru', desc: 'Koneksi kilat ke Tol Trans Jawa, Surabaya-Mojokerto, & Tol Tanjung Perak.' },
    { time: '7 Menit', title: 'Cito Mall & Bundaran Waru', desc: 'Pusat belanja modern di gerbang perbatasan strategis Surabaya-Sidoarjo.' },
    { time: '8 Menit', title: 'Stasiun Kereta Api & Terminal', desc: 'Dekat Stasiun Sidoarjo / Gedangan & Terminal Purabaya Bungurasih.' },
    { time: '7 Menit', title: 'Rumah Sakit & Layanan Medis', desc: 'Dekat RS Mitra Keluarga Waru, RSUD Sidoarjo, & RS Siti Hajar.' },
    { time: 'ROW 8M', title: 'Jalan Lingkungan Paving Lebar', desc: 'Jalan paving 8 meter leluasa 2 mobil papasan & saluran tertutup anti banjir.' },
  ];
}

const PROMO_PERKS = [
  {
    title: 'Free BPHTB (Pajak Pembeli)',
    desc: 'Bebas biaya Bea Perolehan Hak atas Tanah dan Bangunan daerah.',
    badge: 'Hemat Belasan Juta',
  },
  {
    title: 'Free AJB & Balik Nama (BBN)',
    desc: 'Pengurusan Akta Jual Beli & sertifikat balik nama ke nama Anda gratis.',
    badge: 'All-In Free',
  },
  {
    title: 'Free Biaya Notaris / PPAT',
    desc: 'Seluruh jasa pengurusan legalitas di Notaris/PPAT ditanggung developer.',
    badge: 'Gratis 100%',
  },
  {
    title: 'Subsidi Biaya KPR s/d 20 Jt',
    desc: 'Bebas biaya administrasi bank, appraisal, provisi, & asuransi KPR.',
    badge: 'Subsidi Bank',
  },
  {
    title: 'Subsidi Angsuran Rp 1,4 Jt',
    desc: 'Bantuan potongan angsuran bulanan nyata selama 6–12 bulan pertama.',
    badge: 'Cashback Cicilan',
  },
  {
    title: 'SHM & IMB/PBG Splitz Siap Akad',
    desc: 'Sertifikat sudah pecah per kavling, bebas sengketa & aman 100%.',
    badge: 'Legalitas Pasti',
  },
  {
    title: 'Bonus Pompa Air & Meja Dapur',
    desc: 'Fasilitas dapur dan instalasi air siap pakai langsung tanpa renovasi.',
    badge: 'Bonus Hunian',
  },
  {
    title: 'Pendampingan 100% ACC Bank',
    desc: 'Tim analis mendampingi proses berkas ke 5 bank rekanan BUMN sampai lolos.',
    badge: 'Kawal Sampai ACC',
  },
];

export function PropertyDetailView({ property, basePath = '/properti' }: PropertyDetailViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSharelocModalOpen, setIsSharelocModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Instant scroll cut to the very top upon navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
    setIsSharelocModalOpen(false);
  }, [property.id]);

  const gallery = property.galleryImages?.length ? property.galleryImages : [property.imageUrl];

  // Resolve assigned agent PIC for this specific cluster
  const assignedAgent = property.assignedAgentId
    ? getAgentById(property.assignedAgentId) || getAgentForProperty(property.id)
    : getAgentForProperty(property.id);

  const waUrl = buildAgentWaUrl(assignedAgent, { propertyName: property.codeName });

  // Real Google Maps background image (regional aerial/roadmap snapshot)
  const mapBgImage =
    property.city === 'Surabaya'
      ? '/images/maps/gmaps_surabaya.webp'
      : '/images/maps/gmaps_sidoarjo.webp';

  // Related clusters (prioritize same city, exclude current)
  const relatedUnits = useMemo(() => {
    const sameCity = TIAR_PROPERTIES.filter((p) => p.id !== property.id && p.city === property.city);
    const otherCity = TIAR_PROPERTIES.filter((p) => p.id !== property.id && p.city !== property.city);
    return [...sameCity, ...otherCity].slice(0, 3);
  }, [property.id, property.city]);

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  // Touch and mouse drag swipe handlers for main image
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    setTouchStartX(e.clientX);
    setDragOffset(0);
    setIsSwiping(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const diff = e.clientX - touchStartX;
    if (Math.abs(diff) > 5) {
      setIsSwiping(true);
      setDragOffset(diff);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (touchStartX !== null) {
      const diff = e.clientX - touchStartX;
      const threshold = 40;
      if (diff > threshold) {
        prevImage();
      } else if (diff < -threshold) {
        nextImage();
      }
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}
    }
    setTouchStartX(null);
    setDragOffset(0);
    setTimeout(() => setIsSwiping(false), 80);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}
    setTouchStartX(null);
    setDragOffset(0);
    setIsSwiping(false);
  };

  // Keyboard navigation & body scroll lock for lightbox and shareloc modal
  useEffect(() => {
    if (!isLightboxOpen && !isSharelocModalOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setIsSharelocModalOpen(false);
      }
      if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, isSharelocModalOpen, gallery.length]);

  // Mini KPR interactive simulation states
  const unitBasePrice = useMemo(() => parsePriceToNumber(property.priceStart), [property.priceStart]);
  const [simPrice, setSimPrice] = useState<number>(unitBasePrice);
  const [simDpPercent, setSimDpPercent] = useState<number>(0);
  const [simTenorYears, setSimTenorYears] = useState<number>(20);
  const simInterestRate = 3.4;

  useEffect(() => {
    setSimPrice(unitBasePrice);
    setSimDpPercent(0);
    setSimTenorYears(20);
  }, [unitBasePrice]);

  const simDpAmount = (simPrice * simDpPercent) / 100;
  const simPrincipal = simPrice - simDpAmount;

  const simMonthlyInstallment = useMemo(() => {
    return calculateMonthlyInstallment({
      propertyPrice: simPrice,
      dpPercent: simDpPercent,
      tenorYears: simTenorYears,
      interestRateAnnual: simInterestRate,
    });
  }, [simPrice, simDpPercent, simTenorYears]);

  const simPromoInstallment = useMemo(() => {
    return calculatePromoInstallment(simMonthlyInstallment, 1400000);
  }, [simMonthlyInstallment]);

  const simWaMessage = useMemo(() => {
    return encodeURIComponent(
      `Halo ${assignedAgent.name}, saya sedang melihat unit "${property.codeName}" di website Tiar Property.\n\nSimulasi KPR saya:\n- Harga Unit: ${formatRupiah(simPrice)}\n- DP: ${simDpPercent}% (${formatRupiah(simDpAmount)})\n- Tenor KPR: ${simTenorYears} Tahun\n- Estimasi Cicilan: ${formatRupiah(simMonthlyInstallment)}/bln (Promo Subsidi: ${formatRupiah(simPromoInstallment)}/bln)\n\nBoleh minta tolong ditemenin survei ke lokasinya kak?`
    );
  }, [assignedAgent.name, property.codeName, simPrice, simDpPercent, simDpAmount, simTenorYears, simMonthlyInstallment, simPromoInstallment]);

  const simWaUrl = `https://wa.me/${assignedAgent.phone}?text=${simWaMessage}`;

  const sharelocWaMessage = useMemo(() => {
    return encodeURIComponent(
      `Halo ${assignedAgent.name}, saya sedang melihat unit "${property.codeName}" di website Tiar Property.\n\nBoleh minta tolong kirimkan titik shareloc akuratnya kak? Sekalian mau janjian ditemenin survei langsung ke lokasinya.`
    );
  }, [assignedAgent.name, property.codeName]);

  const sharelocWaUrl = `https://wa.me/${assignedAgent.phone}?text=${sharelocWaMessage}`;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: `${property.codeName} - Tiar Property`,
          text: `Cek klaster ${property.codeName} di ${property.locationAreaShort}. Promo DP 0% & cicilan ${property.cicilanPromo}!`,
          url: window.location.href,
        }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href)
          .then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          })
          .catch(() => {});
      }
    }
  };

  const proximityItems = getProximityHighlights(property.city);

  const rowFeature = property.features?.find((f) => /row/i.test(f));
  const rowMatch = rowFeature ? rowFeature.match(/(\d+\s*meter|\d+m)/i) : null;
  const rowVal = rowMatch ? `${rowMatch[1].toUpperCase()} Paving` : '8 Meter Paving';

  const technicalSpecs = [
    { label: 'Luas Tanah (LT)', value: property.specs.luasTanah, sub: 'Dimensi kavling ideal' },
    { label: 'Luas Bangunan (LB)', value: property.specs.luasBangunan, sub: 'Tata ruang optimal' },
    { label: 'Kamar Tidur (KT)', value: `${property.specs.bedrooms} Kamar`, sub: 'Pencahayaan alami' },
    { label: 'Kamar Mandi (KM)', value: `${property.specs.bathrooms} Ruang`, sub: 'Sanitair modern' },
    { label: 'Jumlah Lantai', value: `${property.floors} Lantai`, sub: property.floors === 2 ? 'Konsep Mezzanine / 2 Tingkat' : 'Desain Praktis 1 Lantai' },
    { label: 'Daya Listrik', value: property.floors === 2 ? '2.200 Watt' : '1.300 Watt', sub: 'Instalasi PLN resmi' },
    { label: 'Sumber Air Bersih', value: 'PDAM / Sumur Bor', sub: 'Air jernih lancar 24 jam' },
    { label: 'Kapasitas Carport', value: '1–2 Mobil', sub: 'Paving block tebal rapi' },
    { label: 'Lebar ROW Jalan', value: rowVal, sub: 'Leluasa 2 mobil papasan' },
    { label: 'Legalitas Tanah', value: 'SHM & IMB/PBG Splitz', sub: 'Siap balik nama di notaris' },
    { label: 'Struktur Pondasi', value: 'Batu Kali & Beton Bertulang', sub: 'Standar SNI kokoh tahan gempa' },
    { label: 'Rangka & Atap', value: 'Baja Ringan Galvalum', sub: 'Genteng beton monier' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf8] text-[#081613]">
      <main className="flex-1 pb-28 lg:pb-24">
        {/* Top Breadcrumb & Share Action Bar */}
        <section className="bg-gradient-to-b from-[#ebf2ee] to-[#f7faf8] border-b border-[#dde8e2] py-3.5 sm:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2 font-semibold text-[#477769] truncate">
              <Link href="/" className="hover:text-[#081613] transition-colors shrink-0 hidden sm:inline">
                Beranda
              </Link>
              <span className="opacity-60 hidden sm:inline">/</span>
              <Link href={basePath} className="hover:text-[#081613] transition-colors shrink-0 inline-flex items-center gap-1 font-bold text-[#16362f]">
                <svg className="w-3.5 h-3.5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Semua Rumah</span>
              </Link>
              <span className="opacity-60">/</span>
              <span className="text-[#3a6356] font-medium shrink-0 hidden md:inline">{property.city}</span>
              <span className="opacity-60 hidden md:inline">/</span>
              <span className="text-[#081613] font-black truncate">{property.codeName}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#16362f] border border-[#dde8e2] font-bold hover:bg-[#ebf2ee] transition-all text-xs shadow-xs cursor-pointer"
                title="Bagikan tautan properti"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>{isCopied ? 'Tersalin!' : 'Bagikan'}</span>
              </button>

              <Link
                href={basePath}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#081613] text-white font-bold hover:bg-[#16362f] transition-all text-xs shadow-xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Katalog Semua Rumah</span>
              </Link>
            </div>
          </div>
        </section>

        {/* MASTER MARKETPLACE 2-COLUMN LAYOUT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN: 8 Columns on Desktop (Main Content Stream) */}
            <div className="lg:col-span-8 space-y-8 sm:space-y-10 min-w-0">
              
              {/* 1. Grand Interactive Visual Gallery */}
              <div className="space-y-3">
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  onClick={() => {
                    if (!isSwiping && dragOffset === 0) {
                      setIsLightboxOpen(true);
                    }
                  }}
                  className="relative aspect-[16/10] sm:aspect-[16/10] rounded-3xl overflow-hidden bg-[#081613] border border-[#dde8e2] shadow-reome-card group select-none cursor-grab active:cursor-grabbing touch-pan-y"
                  title="Geser foto atau ketuk untuk perbesar"
                >
                  <div
                    className={`w-full h-full ${
                      isSwiping ? '' : 'transition-transform duration-200 ease-out'
                    }`}
                    style={{
                      transform: dragOffset !== 0 ? `translateX(${Math.max(-120, Math.min(120, dragOffset))}px)` : undefined,
                    }}
                  >
                    <img
                      src={gallery[activeImageIndex]}
                      alt={`${property.codeName} - Foto ${activeImageIndex + 1}`}
                      draggable={false}
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-102"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081613]/70 via-transparent to-black/20 pointer-events-none" />

                  {/* Floating Clean Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-[#081613]/85 backdrop-blur-md text-white border border-white/20 shadow-xs inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      DP 0% • {property.utjAmount}
                    </span>
                  </div>

                  {/* Desktop Navigation Arrows (< and >) */}
                  {gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="hidden sm:flex absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#081613]/70 hover:bg-[#081613] backdrop-blur-md text-white border border-white/20 items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 z-10"
                        aria-label="Foto sebelumnya"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="hidden sm:flex absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#081613]/70 hover:bg-[#081613] backdrop-blur-md text-white border border-white/20 items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 z-10"
                        aria-label="Foto selanjutnya"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Bottom Counter */}
                  <div className="absolute bottom-3.5 right-3.5 flex items-center pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-[#081613]/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white/90">
                      {activeImageIndex + 1} / {gallery.length}
                    </span>
                  </div>
                </div>

                {/* Horizontal Thumbnails Ribbon */}
                {gallery.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1">
                    {gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 sm:w-24 aspect-[4/3] rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-2 border-[#081613] shadow-md opacity-100 scale-[1.02]'
                            : 'border-2 border-[#dde8e2] opacity-60 hover:opacity-100 hover:border-[#3a6356]'
                        }`}
                        aria-label={`Pilih foto ${idx + 1}`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Mobile-Only Action & PIC Card (< lg) */}
              <div className="lg:hidden bg-white p-5 rounded-3xl border border-[#dde8e2] shadow-reome-card space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-[#477769] flex items-center gap-1 font-medium truncate">
                      <svg className="w-3.5 h-3.5 text-[#3a6356] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{property.locationArea}</span>
                    </p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                      Verified
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-[#081613] tracking-tight">
                    {property.codeName}
                  </h1>

                  <div className="pt-1 flex items-baseline flex-wrap gap-x-2.5 gap-y-1">
                    <span className="text-2xl font-black text-[#081613] tracking-tight">
                      {property.priceStart}
                    </span>
                    <span className="text-xs font-bold text-[#3a6356] bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                      Cicilan {property.cicilanPromo}
                    </span>
                    <span className="text-xs text-[#8baf9f] line-through font-medium">
                      {property.priceStrikethrough}
                    </span>
                  </div>

                  {/* Quick specs chips */}
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#16362f] overflow-x-auto no-scrollbar">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ebf2ee] shrink-0 border border-[#dde8e2]">
                      <span className="text-[#8baf9f] font-normal">LT</span> {property.specs.luasTanah}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ebf2ee] shrink-0 border border-[#dde8e2]">
                      <span className="text-[#8baf9f] font-normal">LB</span> {property.specs.luasBangunan}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ebf2ee] shrink-0 border border-[#dde8e2]">
                      <span className="text-[#8baf9f] font-normal">KT</span> {property.specs.bedrooms}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ebf2ee] shrink-0 border border-[#dde8e2]">
                      <span className="text-[#8baf9f] font-normal">KM</span> {property.specs.bathrooms}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ebf2ee] shrink-0 border border-[#dde8e2]">
                      <span className="text-[#8baf9f] font-normal">Lantai</span> {property.floors}
                    </span>
                  </div>
                </div>

                {/* PIC Consultant box on mobile */}
                <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#dde8e2] space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#16362f] shadow-xs shrink-0 bg-[#dde8e2]">
                        <img
                          src={assignedAgent.photoUrl}
                          alt={assignedAgent.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-[#081613]/90 text-[7px] font-black text-white text-center py-0.5 tracking-tight">
                          PIC
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-black text-[#081613] truncate">
                            {assignedAgent.name}
                          </h3>
                          <span className="text-[10px] font-bold text-[#16362f] bg-[#ebf2ee] px-1.5 py-0.5 rounded-full shrink-0">
                            ★ {assignedAgent.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-[#3a6356] font-medium flex items-center gap-1.5 mt-0.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <span className="truncate">Siap Dampingi Survei</span>
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/agen"
                      className="shrink-0 text-xs font-bold text-[#16362f] bg-white border border-[#dde8e2] px-3 py-1.5 rounded-full"
                    >
                      Profil
                    </Link>
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-black bg-[#081613] text-white hover:bg-[#16362f] shadow-md active:scale-95 text-center cursor-pointer"
                  >
                    <span>Mau Saya Temenin Cek Lokasi?</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* 4. Section: Paket Promo All-In Free */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dde8e2] shadow-reome-card">
                <div className="max-w-3xl mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-[#ebf2ee] text-[#16362f] mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Garansi Bebas Biaya Ekstra
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#081613] tracking-tight">
                    Paket Promo All-In Free — Hemat Puluhan Juta
                  </h2>
                  <p className="text-xs sm:text-sm text-[#477769] mt-1.5">
                    Seluruh biaya legalitas, pajak, notaris, hingga subsidi KPR bank sudah ditanggung secara all-in. Cukup siapkan tanda jadi (UTJ) untuk langsung proses berkas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {PROMO_PERKS.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#f7faf8] border border-[#dde8e2] hover:border-[#3a6356] hover:bg-white transition-all space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#3a6356]">
                          {item.badge}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <h3 className="font-black text-xs sm:text-sm text-[#081613] tracking-tight group-hover:text-[#16362f]">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#477769] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Section: Rincian Spesifikasi Teknis (Architectural Datasheet) */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dde8e2] shadow-reome-card">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#3a6356] block">
                      Transparansi Rancang Bangun
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#081613] tracking-tight">
                      Rincian Spesifikasi Teknis Unit
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-[#477769] bg-[#f7faf8] px-3.5 py-1.5 rounded-full border border-[#dde8e2] self-start sm:self-auto">
                    Standar Mutu Bangunan Prima
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Column 1 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#f7faf8] border border-[#dde8e2]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#081613] mb-3 pb-2 border-b border-[#dde8e2]">
                      Tata Ruang &amp; Dimensi Utama
                    </h3>
                    <div className="divide-y divide-[#dde8e2]/80">
                      {technicalSpecs.slice(0, 6).map((spec, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 gap-3">
                          <div>
                            <span className="text-xs font-medium text-[#477769] block">{spec.label}</span>
                            <span className="text-[10px] text-[#8baf9f]">{spec.sub}</span>
                          </div>
                          <span className="text-xs sm:text-sm font-black text-[#081613] text-right shrink-0">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#f7faf8] border border-[#dde8e2]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#081613] mb-3 pb-2 border-b border-[#dde8e2]">
                      Konstruksi &amp; Legalitas Kawasan
                    </h3>
                    <div className="divide-y divide-[#dde8e2]/80">
                      {technicalSpecs.slice(6, 12).map((spec, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 gap-3">
                          <div>
                            <span className="text-xs font-medium text-[#477769] block">{spec.label}</span>
                            <span className="text-[10px] text-[#8baf9f]">{spec.sub}</span>
                          </div>
                          <span className="text-xs sm:text-sm font-black text-[#081613] text-right shrink-0">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* 6. Section: Lokasi Emas & Aksesibilitas */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dde8e2] shadow-reome-card space-y-6">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-[#ebf2ee] text-[#16362f] mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Aksesibilitas Nol Menit
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#081613] tracking-tight">
                    Lokasi Emas di {property.city} — Bebas Macet &amp; Strategis
                  </h2>
                  <p className="text-xs sm:text-sm text-[#477769] mt-1.5 leading-relaxed">
                    Dikelilingi simpul transportasi bandara internasional, akses tol, fasilitas pendidikan, dan pusat perbelanjaan terkemuka.
                  </p>
                </div>

                {/* Proximity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {proximityItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#f7faf8] border border-[#dde8e2] hover:border-[#3a6356] transition-all space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#081613] text-white">
                          {item.time}
                        </span>
                        <span className="text-[10px] text-[#8baf9f] font-bold uppercase tracking-wider">
                          Fasilitas Sekitar
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-black text-[#081613] tracking-tight group-hover:text-[#16362f]">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#477769] leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Authentic Google Maps Interactive Preview Canvas (Click to Open Shareloc Modal) */}
                <div
                  onClick={() => setIsSharelocModalOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsSharelocModalOpen(true);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="block relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#dde8e2] bg-[#f2efe9] group shadow-reome-card hover:shadow-xl hover:border-[#3a6356] transition-all duration-300 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#3a6356]"
                  title="Klik untuk melihat rute & minta titik shareloc resmi"
                  aria-label="Buka navigasi rute Google Maps dan minta titik shareloc resmi"
                >
                  {/* Real Google Maps Satellite/Roadmap Static Image Background */}
                  <div className="relative w-full aspect-[16/11] sm:aspect-[21/10] overflow-hidden bg-[#e5e3df]">
                    <img
                      src={mapBgImage}
                      alt={`Peta Google Maps Kawasan ${property.codeName}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-[1.03] saturate-[1.05]"
                      loading="lazy"
                    />

                    {/* Subtle vignette gradient for readable UI badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15 pointer-events-none" />

                    {/* Geofence Radar Pulse Rings in center */}
                    <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                      <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-emerald-500/50 bg-emerald-500/10 animate-ping" />
                      <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-emerald-600/60 bg-emerald-500/15" />
                    </div>

                    {/* Authentic Google Maps Red Teardrop Marker Pin */}
                    <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-10 transition-transform duration-300 group-hover:scale-110">
                      <div className="relative flex flex-col items-center">
                        <svg className="w-9 h-11 sm:w-10 sm:h-12 drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M16 0C7.16 0 0 7.16 0 16C0 26 13 38 16 40C19 38 32 26 32 16C32 7.16 24.84 0 16 0Z"
                            fill="#EA4335"
                            stroke="#C5221F"
                            strokeWidth="1"
                          />
                          <circle cx="16" cy="15" r="7" fill="#FFFFFF" />
                          <circle cx="16" cy="15" r="3.5" fill="#EA4335" />
                        </svg>
                      </div>
                    </div>

                    {/* Interactive Pin Tooltip Speech Bubble (Floats above the marker) */}
                    <div className="absolute top-[20%] sm:top-[22%] left-1/2 -translate-x-1/2 -translate-y-full z-15 pointer-events-none transition-all duration-300 group-hover:-translate-y-[115%] group-hover:scale-105">
                      <div className="relative bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-2xl shadow-xl border border-gray-200/90 text-center whitespace-nowrap">
                        <div className="flex items-center gap-1.5 justify-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs sm:text-sm font-black text-gray-900 tracking-tight">{property.codeName}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Terverifikasi</span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-blue-600 font-bold mt-0.5 flex items-center justify-center gap-1">
                          <span>Klik untuk Rute Navigasi Google Maps</span>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                        {/* Speech Bubble Arrow Pointer */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-200" />
                      </div>
                    </div>

                    {/* Google Maps Top-Left Search Card */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
                      <div className="bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-md border border-gray-200/90 flex items-center gap-2 sm:gap-2.5 transition-transform group-hover:scale-102">
                        <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                        </div>
                        <div className="leading-tight">
                          <span className="text-xs font-black text-gray-900 block truncate max-w-[130px] sm:max-w-xs">{property.codeName}</span>
                          <span className="text-[10px] text-gray-500 font-medium block truncate max-w-[130px] sm:max-w-xs">{property.locationArea}</span>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600 text-white text-[10px] font-bold shrink-0 shadow-xs">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          Rute
                        </span>
                      </div>
                    </div>

                    {/* Google Maps Top-Right Switcher */}
                    <div className="absolute top-3 right-3 hidden sm:flex items-center rounded-xl overflow-hidden bg-white/95 backdrop-blur-md shadow-md border border-gray-200/80 text-[11px] font-bold pointer-events-none z-10">
                      <span className="px-3 py-1.5 bg-[#e8f0fe] text-[#1a73e8] border-r border-gray-200 font-black">Peta</span>
                      <span className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-semibold">Satelit</span>
                    </div>

                    {/* Google Maps Bottom-Right Zoom & Pegman Controls */}
                    <div className="absolute bottom-3 right-3 hidden sm:flex flex-col items-center gap-2 pointer-events-none z-10">
                      {/* Pegman yellow icon */}
                      <div className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md shadow-md border border-gray-200/80 flex items-center justify-center text-amber-500 font-bold text-sm">
                        🧍
                      </div>
                      {/* Zoom buttons */}
                      <div className="flex flex-col rounded-lg overflow-hidden bg-white/95 backdrop-blur-md shadow-md border border-gray-200/80 text-gray-700 text-sm font-black divide-y divide-gray-200">
                        <span className="w-8 h-8 flex items-center justify-center hover:bg-gray-50">+</span>
                        <span className="w-8 h-8 flex items-center justify-center hover:bg-gray-50">−</span>
                      </div>
                    </div>

                    {/* Google Maps Bottom-Left Logo */}
                    <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[10px] text-gray-600 font-medium pointer-events-none z-10 drop-shadow-sm">
                      <span className="font-black text-gray-800 tracking-tight bg-white/80 backdrop-blur-xs px-1.5 py-0.5 rounded">Google</span>
                      <span className="text-[9px] text-gray-600 bg-white/80 backdrop-blur-xs px-1.5 py-0.5 rounded">Data peta ©2026</span>
                    </div>

                    {/* Floating Bottom Center CTA Prompt Pill */}
                    <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-15">
                      <div className="bg-[#081613]/90 hover:bg-[#081613] text-white px-4 sm:px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md border border-white/20 flex items-center justify-center gap-2 text-xs font-black tracking-tight transition-transform duration-200 group-hover:scale-105">
                        <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Buka Rute &amp; Titik Lokasi Google Maps</span>
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">↗</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Section: Mini Simulasi KPR Interaktif */}
              <div id="simulasi-kpr" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dde8e2] shadow-reome-card">
                <div className="max-w-2xl mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-[#ebf2ee] text-[#16362f] mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Kalkulator KPR 2026
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#081613] tracking-tight">
                    Simulasi Angsuran KPR Unit {property.codeName}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#477769] mt-1.5">
                    Hitung estimasi cicilan per bulan dengan suku bunga promo 3,4% fixed dan skema subsidi angsuran Rp 1,4 Juta.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Slider Harga */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs sm:text-sm font-bold text-[#16362f]">Estimasi Harga Unit</label>
                      <span className="text-sm sm:text-base font-black text-[#081613]">{formatRupiah(simPrice)}</span>
                    </div>
                    <input
                      type="range"
                      min={200000000}
                      max={1000000000}
                      step={10000000}
                      value={simPrice}
                      onChange={(e) => setSimPrice(Number(e.target.value))}
                      className="w-full h-2 bg-[#dde8e2] rounded-lg appearance-none cursor-pointer accent-[#081613]"
                    />
                    <div className="flex justify-between text-[10px] text-[#8baf9f] mt-1 font-bold">
                      <span>Rp 200 Jt</span>
                      <span>Rp 1 Miliar</span>
                    </div>
                  </div>

                  {/* Uang Muka DP */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs sm:text-sm font-bold text-[#16362f]">Uang Muka (DP): {simDpPercent}%</label>
                      <span className="text-xs font-bold text-[#3a6356]">{formatRupiah(simDpAmount)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 5, 10].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSimDpPercent(val)}
                          className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                            simDpPercent === val
                              ? 'bg-[#081613] text-white border-[#081613] shadow-xs'
                              : 'bg-[#f7faf8] text-[#16362f] border-[#dde8e2] hover:bg-[#ebf2ee]'
                          }`}
                        >
                          <span>{val === 0 ? 'DP 0% (Promo)' : `${val}%`}</span>
                          {val > 0 && (
                            <span
                              className={`text-[10px] font-normal truncate max-w-full ${
                                simDpPercent === val ? 'text-white/80' : 'text-[#5d8b7b]'
                              }`}
                            >
                              {formatRupiah((simPrice * val) / 100)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tenor */}
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-[#16362f] block mb-2">
                      Jangka Waktu (Tenor): {simTenorYears} Tahun
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 15, 20, 25].map((tenor) => (
                        <button
                          key={tenor}
                          type="button"
                          onClick={() => setSimTenorYears(tenor)}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            simTenorYears === tenor
                              ? 'bg-[#081613] text-white border-[#081613] shadow-xs'
                              : 'bg-[#f7faf8] text-[#16362f] border-[#dde8e2] hover:bg-[#ebf2ee]'
                          }`}
                        >
                          {tenor} Tahun
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Result Box */}
                  <div className="bg-[#081613] text-white p-5 sm:p-6 rounded-2xl space-y-4 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                          Cicilan Setelah Subsidi Rp 1,4 Jt
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-2xl sm:text-3xl font-black text-white" data-kpr-result="promo">
                            {formatRupiah(simPromoInstallment)}
                          </span>
                          <span className="text-xs text-white/60">/bulan</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#8baf9f] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full self-start sm:self-auto">
                        *Berlaku 6–12 bulan pertama
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-white/80">
                      <div>
                        <span className="text-[10px] text-white/50 block">Cicilan Normal (3,4%)</span>
                        <span className="font-bold text-white">{formatRupiah(simMonthlyInstallment)}/bln</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block">Plafon Pinjaman</span>
                        <span className="font-bold text-white">{formatRupiah(simPrincipal)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block">Tenor Pinjaman</span>
                        <span className="font-bold text-white">{simTenorYears} Tahun</span>
                      </div>
                    </div>

                    <a
                      href={simWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-black bg-white text-[#081613] hover:bg-[#dde8e2] transition-all shadow-md active:scale-95 text-center cursor-pointer"
                    >
                      <span>Ajukan Simulasi ke {assignedAgent.name}</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>

                  <p className="text-[11px] text-[#8baf9f] text-center">
                    *Didampingi analis resmi ke 5 Bank Rekanan BUMN (BTN, BRI, BSI, Mandiri, BNI) hingga disetujui (ACC).
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: 4 Columns Sticky Action Sidebar on Desktop */}
            <div className="hidden lg:block lg:col-span-4 sticky top-20 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-[#dde8e2] shadow-reome-card space-y-5">
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-[#477769] flex items-center gap-1.5 font-medium truncate">
                      <svg className="w-3.5 h-3.5 text-[#3a6356] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{property.locationAreaShort}</span>
                    </p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Verified
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-[#081613] tracking-tight leading-snug">
                    {property.codeName}
                  </h2>

                  {/* Price Block */}
                  <div className="pt-1 flex items-baseline flex-wrap gap-x-2.5 gap-y-1">
                    <span className="text-2xl sm:text-3xl font-black text-[#081613] tracking-tight">
                      {property.priceStart}
                    </span>
                    <span className="text-xs font-bold text-[#3a6356] bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                      Cicilan {property.cicilanPromo}
                    </span>
                  </div>
                  <span className="text-xs text-[#8baf9f] line-through font-medium block">
                    {property.priceStrikethrough}
                  </span>

                  {/* Compact Specs Row */}
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#16362f] overflow-x-auto no-scrollbar">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ebf2ee] shrink-0 border border-[#dde8e2]">
                      <span className="text-[#8baf9f] font-normal">LT</span> {property.specs.luasTanah}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ebf2ee] shrink-0 border border-[#dde8e2]">
                      <span className="text-[#8baf9f] font-normal">LB</span> {property.specs.luasBangunan}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ebf2ee] shrink-0 border border-[#dde8e2]">
                      <span className="text-[#8baf9f] font-normal">KT</span> {property.specs.bedrooms}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#ebf2ee] shrink-0 border border-[#dde8e2]">
                      <span className="text-[#8baf9f] font-normal">KM</span> {property.specs.bathrooms}
                    </span>
                  </div>
                </div>

                {/* Key Promo Highlights */}
                <div className="p-3.5 rounded-2xl bg-[#ebf2ee]/60 border border-[#dde8e2] text-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#16362f] font-bold">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>DP 0% (Tanpa Uang Muka)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#16362f] font-bold">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Cukup Tanda Jadi (UTJ) {property.utjAmount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#16362f] font-bold">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free BPHTB, AJB, BBN &amp; Biaya Notaris</span>
                  </div>
                </div>

                {/* PIC Consultant Card */}
                <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#dde8e2] space-y-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#16362f] shadow-xs shrink-0 bg-[#dde8e2]">
                        <img
                          src={assignedAgent.photoUrl}
                          alt={assignedAgent.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-[#081613]/90 text-[7px] font-black text-white text-center py-0.5 tracking-tight">
                          PIC
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-black text-[#081613] truncate">
                            {assignedAgent.name}
                          </h3>
                          <span className="text-[10px] font-bold text-[#16362f] bg-[#ebf2ee] px-1.5 py-0.5 rounded-full shrink-0">
                            ★ {assignedAgent.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-[#3a6356] font-medium flex items-center gap-1.5 mt-0.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <span className="truncate">Siap Dampingi Survei</span>
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/agen"
                      className="shrink-0 text-xs font-bold text-[#16362f] hover:text-[#081613] bg-white border border-[#dde8e2] hover:bg-[#ebf2ee] px-3 py-1.5 rounded-full transition-all shadow-xs"
                    >
                      Profil
                    </Link>
                  </div>

                  {/* Primary CTA Button */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-black bg-[#081613] text-white hover:bg-[#16362f] transition-all shadow-md active:scale-95 text-center cursor-pointer"
                  >
                    <span>Mau Saya Temenin Cek Lokasi?</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>

                {/* Secondary Quick Jump Button */}
                <div className="pt-1 flex items-center justify-between text-xs text-[#477769]">
                  <a
                    href="#simulasi-kpr"
                    className="inline-flex items-center gap-1 font-bold text-[#16362f] hover:underline"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span>Hitung Simulasi KPR</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="font-bold text-[#16362f] hover:underline cursor-pointer"
                  >
                    Bagikan Unit
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 6: Rekomendasi Properti Lainnya (Klaster Serupa di Surabaya & Sidoarjo) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-9">
            <div>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#3a6356] block">
                Pilihan Alternatif Terbaik
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#081613] tracking-tight">
                Rekomendasi Properti Lainnya
              </h2>
              <p className="text-xs sm:text-sm text-[#477769] mt-1">
                Klaster Serupa di Surabaya &amp; Sidoarjo — Pilihan hunian favorit dengan promo DP 0% &amp; cicilan terjangkau
              </p>
            </div>
            <Link
              href={basePath}
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#16362f] hover:text-[#081613] underline shrink-0"
            >
              <span>Lihat Semua Klaster ({TIAR_PROPERTIES.length})</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-9">
            {relatedUnits.map((item) => (
              <PropertyCard
                key={item.id}
                property={item}
                basePath={basePath}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Full-screen Lightbox Gallery Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan penuh foto properti"
          className="fixed inset-0 z-50 bg-[#081613]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between text-white text-xs z-10">
            <span className="font-bold">
              {property.codeName} — Foto {activeImageIndex + 1} dari {gallery.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Tutup galeri"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Enlarge Image View */}
          <div
            className="relative flex-1 flex items-center justify-center max-h-[75vh] my-auto cursor-pointer"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsLightboxOpen(false);
            }}
          >
            <img
              src={gallery[activeImageIndex]}
              alt={`${property.codeName} - Foto ${activeImageIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
                  aria-label="Foto sebelumnya"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
                  aria-label="Foto selanjutnya"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10">
            {gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-white scale-105 opacity-100 ring-2 ring-white/60'
                    : 'border-white/20 opacity-50 hover:opacity-90'
                }`}
              >
                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* High-Converting Locked Shareloc & WhatsApp Routing Modal */}
      {isSharelocModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Akses Titik Lokasi Google Maps"
          className="fixed inset-0 z-50 bg-[#081613]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSharelocModalOpen(false);
          }}
        >
          <div
            className="relative bg-white rounded-3xl p-5 sm:p-7 max-w-[440px] w-full shadow-2xl border border-[#dde8e2] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Title & Clean Close Button */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ebf2ee] border border-[#d2e2d8] text-[#16362f] text-[10px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Akses Navigasi Google Maps</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#081613] tracking-tight leading-snug">
                  Minta Titik Shareloc &amp; Rute Presisi
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsSharelocModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f4f7f5] hover:bg-[#e4ede7] text-[#477769] hover:text-[#081613] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label="Tutup popup"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Property Unit Context Card with Mini Map Pin */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#f7faf8] border border-[#dde8e2]">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#dde8e2] bg-[#ebf2ee]">
                <img
                  src={property.imageUrl}
                  alt={property.codeName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-0.5 left-1 text-[8px] font-black text-white bg-black/60 px-1 py-0.2 rounded">
                  {property.city}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3a6356] block truncate">
                  {property.locationArea}
                </span>
                <h4 className="text-xs font-bold text-[#081613] truncate">
                  {property.codeName}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Unit Ready • Siap Dampingi
                  </span>
                </div>
              </div>
            </div>

            {/* Explanatory Context */}
            <p className="text-xs text-[#477769] leading-relaxed">
              Demi keamanan ketersediaan unit dan privasi klaster, titik gerbang akurat serta rute bebas hambatan dikirimkan langsung oleh konsultan resmi kami via WhatsApp.
            </p>

            {/* PIC Consultant Card - High-End Concierge Style */}
            <div className="p-3 rounded-2xl bg-[#f7faf8] border border-[#dde8e2] flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 ring-2 ring-emerald-600/30">
                <img
                  src={assignedAgent.photoUrl}
                  alt={assignedAgent.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h5 className="text-xs sm:text-sm font-black text-[#081613] truncate">
                      {assignedAgent.name}
                    </h5>
                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-200/60 shrink-0">
                    ★ 4.9
                  </span>
                </div>
                <p className="text-[10px] text-[#3a6356] font-medium truncate">
                  Konsultan Lapangan &amp; Pendamping Survei
                </p>
                <p className="text-[11px] text-[#477769] mt-0.5 leading-snug">
                  &ldquo;Saya temenin survei &amp; kirimkan titik shareloc-nya kak.&rdquo;
                </p>
              </div>
            </div>

            {/* Actions: Primary WhatsApp & Secondary Close */}
            <div className="space-y-2 pt-1">
              <a
                href={sharelocWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsSharelocModalOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-black bg-[#081613] hover:bg-[#16362f] text-white shadow-lg shadow-[#081613]/15 transition-all active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Minta Titik Shareloc ke {assignedAgent.name.split(' ')[0]}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              <button
                type="button"
                onClick={() => setIsSharelocModalOpen(false)}
                className="w-full py-1 text-center text-xs font-semibold text-[#8baf9f] hover:text-[#081613] transition-colors cursor-pointer"
              >
                Kembali ke Halaman Unit
              </button>
            </div>

            {/* Footer Trust 3-Col Grid */}
            <div className="pt-2.5 border-t border-[#dde8e2] grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#081613]">Gratis Survei</span>
                <span className="text-[9px] text-[#477769]">Siap Dijemput</span>
              </div>
              <div className="flex flex-col items-center border-x border-[#dde8e2]">
                <span className="text-[10px] font-bold text-[#081613]">Respon Cepat</span>
                <span className="text-[9px] text-[#477769]">&lt; 5 Menit di WA</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#081613]">Resmi Tiar</span>
                <span className="text-[9px] text-[#477769]">Partner PT TMJ</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8: Mobile Sticky Bottom Action Bar (< lg) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#dde8e2] px-4 py-3 shadow-[0_-4px_20px_rgba(8,22,19,0.08)] pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-[#8baf9f] uppercase tracking-wider block">
            Harga Mulai
          </span>
          <span className="text-base sm:text-lg font-black text-[#081613] tracking-tight block truncate">
            {property.priceStart}
          </span>
          <span className="text-[10px] font-bold text-[#3a6356] block truncate">
            {property.cicilanPromo}
          </span>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-5 py-3 rounded-full text-xs font-black bg-[#081613] text-white hover:bg-[#16362f] shadow-md flex items-center gap-1.5 active:scale-95 text-center cursor-pointer"
        >
          <span>Mau Saya Temenin Survei?</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      {/* Floating WhatsApp Quick Action - Desktop only on detail page to prevent collision with Mobile Sticky Bar */}
      <div className="hidden lg:block">
        <FloatingWhatsApp />
      </div>

      <Footer />
    </div>
  );
}
