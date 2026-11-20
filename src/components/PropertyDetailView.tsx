'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  MapPin,
  Lock,
  User,
  Star,
  ShieldCheck,
  X,
  Plus,
  Minus,
  MessageCircle,
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyUnit, TIAR_PROPERTIES } from '@/data/properties';
import { getAgentById, getAgentForProperty, buildAgentWaUrl } from '@/data/agents';

interface PropertyDetailViewProps {
  property: PropertyUnit;
  basePath?: '/properti' | '/produk';
}

function getProximityHighlights(city: string) {
  if (city === 'Surabaya') {
    return [
      {
        time: '3 Menit',
        title: 'Akses MERR & OERR Surabaya',
        desc: 'Mobilitas lancar ke pusat kota, koridor bisnis, dan kawasan niaga timur.',
      },
      {
        time: '5 Menit',
        title: 'Gerbang Tol Surabaya',
        desc: 'Akses cepat ke Tol Gunungsari, Tol Tambak Sumur, dan Bandara Juanda.',
      },
      {
        time: '7 Menit',
        title: 'Pusat Belanja & Gaya Hidup',
        desc: 'Dekat Galaxy Mall Surabaya, Pakuwon City Mall, dan Transmart Rungkut.',
      },
      {
        time: '5 Menit',
        title: 'Kampus & Universitas Favorit',
        desc: 'Dekat Institut Teknologi Sepuluh Nopember (ITS), UPN Veteran, dan UNAIR.',
      },
      {
        time: '8 Menit',
        title: 'Fasilitas Kesehatan Terpadu',
        desc: 'Dekat RS Premiere Surabaya, RS Royal Surabaya, dan RS Mitra Keluarga.',
      },
      {
        time: '24 Jam',
        title: 'Keamanan One Gate System',
        desc: 'Portal otomatis, kamera pemantau kawasan, serta saluran tertutup anti banjir.',
      },
    ];
  }
  return [
    {
      time: '5 Menit',
      title: 'Bandara Internasional Juanda',
      desc: 'Akses cepat ke Terminal 1 dan 2 melalui jalur bypass yang lancar.',
    },
    {
      time: '5 Menit',
      title: 'Gerbang Tol Juanda & Waru',
      desc: 'Koneksi langsung ke Tol Trans Jawa, Surabaya–Mojokerto, dan Tanjung Perak.',
    },
    {
      time: '7 Menit',
      title: 'Cito Mall & Bundaran Waru',
      desc: 'Pusat belanja dan transit utama di perbatasan selatan Surabaya dan Sidoarjo.',
    },
    {
      time: '8 Menit',
      title: 'Stasiun & Terminal Utama',
      desc: 'Dekat Stasiun Sidoarjo atau Gedangan serta Terminal Purabaya Bungurasih.',
    },
    {
      time: '7 Menit',
      title: 'Rumah Sakit & Layanan Medis',
      desc: 'Dekat RS Mitra Keluarga Waru, RSUD Sidoarjo, dan RS Siti Hajar.',
    },
    {
      time: 'ROW 8M',
      title: 'Jalan Lingkungan Paving Lebar',
      desc: 'Jalan paving selebar 8 meter untuk 2 mobil bersimpangan dengan saluran tertutup.',
    },
  ];
}

const PROMO_PERKS = [
  {
    index: '.01',
    title: 'Free BPHTB (Pajak Pembeli)',
    desc: 'Bebas Bea Perolehan Hak atas Tanah dan Bangunan sesuai ketentuan program.',
    badge: 'Hemat Belasan Juta',
  },
  {
    index: '.02',
    title: 'Free AJB & Balik Nama (BBN)',
    desc: 'Pengurusan Akta Jual Beli serta proses balik nama sertifikat tanpa biaya ekstra.',
    badge: 'All-In Free',
  },
  {
    index: '.03',
    title: 'Free Biaya Notaris / PPAT',
    desc: 'Seluruh jasa pengurusan akta di Notaris dan PPAT sudah ditanggung penuh.',
    badge: 'Gratis 100%',
  },
  {
    index: '.04',
    title: (
      <>
        Subsidi Biaya KPR s/d <span className="num-clean">20</span> Jt
      </>
    ),
    desc: 'Keringanan biaya administrasi bank, appraisal, provisi, dan asuransi akad.',
    badge: 'Subsidi Bank',
  },
  {
    index: '.05',
    title: (
      <>
        Subsidi Angsuran <span className="num-clean">Rp 1,4</span> Jt
      </>
    ),
    desc: (
      <>
        Bantuan potongan cicilan bulanan nyata selama <span className="num-clean">6 hingga 12</span> bulan pertama.
      </>
    ),
    badge: 'Potongan Cicilan',
  },
  {
    index: '.06',
    title: 'SHM & IMB/PBG Splitz Siap Akad',
    desc: 'Sertifikat sudah pecah per kavling, terverifikasi aman dan siap tanda tangan akad.',
    badge: 'Legalitas Pasti',
  },
  {
    index: '.07',
    title: 'Bonus Pompa Air & Meja Dapur',
    desc: 'Instalasi air bersih dan fasilitas dapur siap pakai saat serah terima kunci.',
    badge: 'Bonus Hunian',
  },
  {
    index: '.08',
    title: (
      <>
        Pendampingan <span className="num-clean">100%</span> ACC Bank
      </>
    ),
    desc: (
      <>
        Tim analis mendampingi proses berkas ke <span className="num-clean">5</span> bank rekanan BUMN sampai lolos.
      </>
    ),
    badge: 'Kawal Sampai ACC',
  },
];

export function PropertyDetailView({
  property,
  basePath = '/properti',
}: PropertyDetailViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSharelocModalOpen, setIsSharelocModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      if (swipeTimerRef.current) clearTimeout(swipeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
    setIsSharelocModalOpen(false);
  }, [property.id]);

  const gallery = property.galleryImages?.length
    ? property.galleryImages
    : [property.imageUrl];

  const assignedAgent = property.assignedAgentId
    ? getAgentById(property.assignedAgentId) || getAgentForProperty(property.id)
    : getAgentForProperty(property.id);

  const waUrl = buildAgentWaUrl(assignedAgent, { propertyName: property.codeName });

  const calcWaUrl = useMemo(() => {
    const msg = `Halo ${assignedAgent.name}, saya tertarik unit "${property.codeName}" (${property.priceStart}). Boleh minta tolong hitungkan rincian cicilan KPR DP 0% dan cek kelayakan SLIK OJK saya kak?`;
    return `https://wa.me/${assignedAgent.phone}?text=${encodeURIComponent(msg)}`;
  }, [assignedAgent.name, assignedAgent.phone, property.codeName, property.priceStart]);

  const sharelocWaUrl = useMemo(() => {
    const msg = `Halo ${assignedAgent.name}, saya sedang melihat unit "${property.codeName}" di website Tiar Property. Boleh minta tolong kirimkan titik shareloc akuratnya kak? Sekalian mau janjian ditemenin survei ke lokasi.`;
    return `https://wa.me/${assignedAgent.phone}?text=${encodeURIComponent(msg)}`;
  }, [assignedAgent.name, assignedAgent.phone, property.codeName]);

  const mapBgImage =
    property.city === 'Surabaya'
      ? '/images/maps/gmaps_surabaya.webp'
      : '/images/maps/gmaps_sidoarjo.webp';

  const relatedUnits = useMemo(() => {
    const sameCity = TIAR_PROPERTIES.filter(
      (p) => p.id !== property.id && p.city === property.city
    );
    const otherCity = TIAR_PROPERTIES.filter(
      (p) => p.id !== property.id && p.city !== property.city
    );
    return [...sameCity, ...otherCity].slice(0, 3);
  }, [property.id, property.city]);

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  // Touch & pointer drag swipe for gallery
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore pointer capture issues
    }
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
      if (diff > 40) prevImage();
      else if (diff < -40) nextImage();
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
    setTouchStartX(null);
    setDragOffset(0);
    if (swipeTimerRef.current) clearTimeout(swipeTimerRef.current);
    swipeTimerRef.current = setTimeout(() => setIsSwiping(false), 80);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    setTouchStartX(null);
    setDragOffset(0);
    setIsSwiping(false);
  };

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
        if (e.key === 'ArrowLeft') {
          setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
        }
        if (e.key === 'ArrowRight') {
          setActiveImageIndex((prev) => (prev + 1) % gallery.length);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, isSharelocModalOpen, gallery.length]);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    if (navigator.share) {
      navigator
        .share({
          title: `${property.codeName} — Tiar Property`,
          text: `Cek klaster ${property.codeName} di ${property.locationAreaShort}. Promo DP 0% & cicilan ${property.cicilanPromo}.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          setIsCopied(true);
          if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
          copyTimerRef.current = setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(() => {});
    }
  };

  const proximityItems = getProximityHighlights(property.city);

  const rowFeature = property.features?.find((f) => /row/i.test(f));
  const rowMatch = rowFeature ? rowFeature.match(/(\d+\s*meter|\d+m)/i) : null;
  const rowVal = rowMatch ? `${rowMatch[1].toUpperCase()} Paving` : '8 Meter Paving';

  const technicalSpecs = [
    { label: 'Luas Tanah (LT)', value: property.specs.luasTanah, sub: 'Dimensi kavling ideal' },
    { label: 'Luas Bangunan (LB)', value: property.specs.luasBangunan, sub: 'Tata ruang optimal' },
    {
      label: 'Kamar Tidur (KT)',
      value: `${property.specs.bedrooms} Kamar`,
      sub: 'Pencahayaan alami',
    },
    {
      label: 'Kamar Mandi (KM)',
      value: `${property.specs.bathrooms} Ruang`,
      sub: 'Sanitair modern',
    },
    {
      label: 'Jumlah Lantai',
      value: `${property.floors} Lantai`,
      sub: property.floors === 2 ? 'Konsep 2 Tingkat Modern' : 'Desain Praktis 1 Lantai',
    },
    {
      label: 'Daya Listrik',
      value: property.floors === 2 ? '2.200 Watt' : '1.300 Watt',
      sub: 'Instalasi PLN resmi',
    },
    { label: 'Sumber Air Bersih', value: 'PDAM / Sumur Bor', sub: 'Air jernih lancar 24 jam' },
    { label: 'Kapasitas Carport', value: '1 sampai 2 Mobil', sub: 'Paving block tebal rapi' },
    { label: 'Lebar ROW Jalan', value: rowVal, sub: 'Leluasa 2 mobil papasan' },
    { label: 'Legalitas Tanah', value: 'SHM & IMB/PBG Splitz', sub: 'Siap balik nama di notaris' },
    {
      label: 'Struktur Pondasi',
      value: 'Batu Kali & Beton Bertulang',
      sub: 'Standar SNI tahan gempa',
    },
    { label: 'Rangka & Atap', value: 'Baja Ringan Galvalum', sub: 'Genteng beton monier' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F1F1] text-[#38352C]">
      <main className="flex-1 pb-28 lg:pb-24">
        {/* Top Editorial Breadcrumb Bar */}
        <section className="pt-24 sm:pt-28 pb-4 sm:pb-6 border-b border-[#C5BEB4] bg-[#FAF8F5]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#57534A] min-w-0 truncate">
              <Link
                href="/"
                className="hover:text-[#38352C] transition-colors hidden sm:inline-flex items-center min-h-[44px] -ml-1.5 px-1.5 shrink-0"
              >
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#57534A] hidden sm:inline shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <Link
                href={basePath}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-1.5 text-[#38352C] font-semibold hover:underline underline-offset-4 shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:hidden" strokeWidth={1.75} aria-hidden="true" />
                <span>Semua Rumah</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#57534A] hidden md:inline shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span className="hidden md:inline shrink-0 px-1">{property.city}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#57534A] shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span className="text-[#38352C] font-semibold truncate pl-1">{property.codeName}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full bg-[#E8E4E1] border border-[#C5BEB4] text-xs font-medium text-[#38352C] hover:bg-[#FAF8F5] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
                <span>{isCopied ? 'Tautan Tersalin' : 'Bagikan'}</span>
              </button>

              <Link
                href={basePath}
                className="hidden sm:inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full bg-[#38352C] text-[#E8E4E1] text-xs font-medium hover:bg-[#28251E] transition-colors whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
                <span>Katalog Semua Rumah</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Main 2-Column Editorial Detail Stream */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT 8-COL MAIN STREAM */}
            <div className="lg:col-span-8 space-y-10 min-w-0">
              {/* 1. Interactive Gallery (16:10) */}
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
                  title="Geser foto atau ketuk untuk perbesar"
                  className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#181612] ring-1 ring-inset ring-[#38352C]/14 group select-none cursor-grab active:cursor-grabbing touch-pan-y"
                >
                  <div
                    className={`w-full h-full ${
                      isSwiping ? '' : 'transition-transform duration-200 ease-out'
                    }`}
                    style={{
                      transform:
                        dragOffset !== 0
                          ? `translateX(${Math.max(-120, Math.min(120, dragOffset))}px)`
                          : undefined,
                    }}
                  >
                    <img
                      src={gallery[activeImageIndex]}
                      alt={`${property.codeName} - Foto ${activeImageIndex + 1}`}
                      draggable={false}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#181612]/65 via-transparent to-black/15 pointer-events-none"
                  />

                  <div className="absolute top-3.5 left-3.5 pointer-events-none">
                    <span className="num-clean inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#38352C]/90 backdrop-blur-md text-[#FAF8F5] text-xs font-medium border border-[#FAF8F5]/15">
                      <span className="w-2 h-2 rounded-full bg-[#FFCA4F]" aria-hidden="true" />
                      <span>DP 0% · {property.utjAmount}</span>
                    </span>
                  </div>

                  {gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        aria-label="Foto sebelumnya"
                        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#38352C]/80 hover:bg-[#38352C] backdrop-blur-md text-[#FAF8F5] border border-white/20 items-center justify-center transition-colors cursor-pointer z-10"
                      >
                        <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
                      </button>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        aria-label="Foto selanjutnya"
                        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#38352C]/80 hover:bg-[#38352C] backdrop-blur-md text-[#FAF8F5] border border-white/20 items-center justify-center transition-colors cursor-pointer z-10"
                      >
                        <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-3.5 right-3.5 pointer-events-none">
                    <span className="mono-num px-3 py-1 rounded-full bg-[#38352C]/85 backdrop-blur-md border border-white/15 text-xs font-medium text-[#FAF8F5]">
                      {activeImageIndex + 1} / {gallery.length}
                    </span>
                  </div>
                </div>

                {gallery.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                    {gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        aria-label={`Pilih foto ${idx + 1}`}
                        className={`relative w-22 sm:w-26 aspect-[4/3] rounded-xl overflow-hidden shrink-0 transition-opacity cursor-pointer ${
                          activeImageIndex === idx
                            ? 'ring-2 ring-[#38352C] opacity-100'
                            : 'ring-1 ring-[#C5BEB4] opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Mobile-Only Summary & Assigned PIC Card (< lg) */}
              <div className="lg:hidden rounded-2xl bg-[#E8E4E1] p-5 sm:p-6 ring-1 ring-inset ring-[#38352C]/14 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-[#57534A] flex items-center gap-1.5 min-w-0 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#38352C]" strokeWidth={1.75} aria-hidden="true" />
                      <span className="truncate">{property.locationArea}</span>
                    </p>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C5BEB4] text-[#38352C] shrink-0">
                      Terverifikasi
                    </span>
                  </div>

                  <h2 className="font-display font-medium text-3xl leading-[1.1] text-[#38352C]">
                    {property.codeName}
                  </h2>

                  <div className="pt-1 flex items-baseline flex-wrap gap-x-3 gap-y-1">
                    <span className="num-clean text-2xl font-semibold text-[#38352C]">
                      {property.priceStart}
                    </span>
                    <span className="num-clean text-xs font-medium px-3 py-1 rounded-full bg-[#38352C] text-[#FFCA4F]">
                      Cicilan {property.cicilanPromo}
                    </span>
                    <span className="num-clean text-xs text-[#57534A] line-through">
                      {property.priceStrikethrough}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs font-medium text-[#38352C] overflow-x-auto no-scrollbar">
                    <span className="num-clean px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C5BEB4] shrink-0">
                      LT {property.specs.luasTanah}
                    </span>
                    <span className="num-clean px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C5BEB4] shrink-0">
                      LB {property.specs.luasBangunan}
                    </span>
                    <span className="num-clean px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C5BEB4] shrink-0">
                      {property.specs.bedrooms} KT · {property.specs.bathrooms} KM
                    </span>
                    <span className="num-clean px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C5BEB4] shrink-0">
                      {property.floors} Lantai
                    </span>
                  </div>
                </div>

                {/* PIC Consultant Card on Mobile */}
                <div className="rounded-xl bg-[#FAF8F5] border border-[#C5BEB4] p-4 space-y-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden ring-1 ring-[#38352C]/20 shrink-0 bg-[#E8E4E1]">
                        <img
                          src={assignedAgent.photoUrl}
                          alt={assignedAgent.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-body text-sm font-semibold text-[#38352C] truncate">
                            {assignedAgent.name}
                          </h3>
                          <span className="num-clean inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#38352C] bg-[#E8E4E1] px-2 py-0.5 rounded-full shrink-0">
                            <Star className="w-3 h-3 fill-[#FFCA4F] text-[#38352C]" strokeWidth={1.5} />
                            {assignedAgent.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-[#57534A] flex items-center gap-1.5 mt-0.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#82886E] shrink-0" />
                          <span className="truncate">Siap Dampingi Survei</span>
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/agen"
                      className="shrink-0 min-h-[44px] inline-flex items-center px-3.5 rounded-full bg-[#E8E4E1] border border-[#C5BEB4] text-xs font-medium text-[#38352C]"
                    >
                      Profil
                    </Link>
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dual-cta whitespace-nowrap w-full justify-between"
                  >
                    <span className="dual-cta__label flex-1">Mau Saya Temenin Cek Lokasi?</span>
                    <span className="dual-cta__circle" aria-hidden="true">
                      <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                    </span>
                  </a>
                </div>
              </div>

              {/* 3. Paket Promo All-In Free (.01 - .08 Cards) */}
              <section className="rounded-2xl bg-[#FAF8F5] border border-[#C5BEB4] p-6 sm:p-8">
                <div className="max-w-[54ch] mb-7">
                  <span className="text-xs font-medium text-[#57534A] block mb-1.5">
                    Garansi Bebas Biaya Ekstra
                  </span>
                  <h2 className="font-display font-medium text-[clamp(1.85rem,3vw,2.6rem)] leading-[1.1] text-[#38352C]">
                    Paket Promo All-In Free, Hemat Puluhan Juta
                  </h2>
                  <p className="text-sm text-[#57534A] mt-2 leading-relaxed">
                    Seluruh biaya legalitas, pajak, notaris, hingga subsidi KPR bank sudah ditanggung all-in. Cukup
                    siapkan tanda jadi (<span className="num-clean font-medium text-[#38352C]">{property.utjAmount}</span>)
                    untuk langsung proses berkas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PROMO_PERKS.map((item) => (
                    <div
                      key={item.index}
                      className="rounded-xl bg-[#E8E4E1] p-5 ring-1 ring-inset ring-[#38352C]/14 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="num-clean text-sm font-semibold text-[#57534A]">
                          {item.index}
                        </span>
                        <span className="num-clean text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C5BEB4] text-[#38352C]">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="font-display font-medium text-xl leading-snug text-[#38352C]">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#57534A] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. Hairline Specs Matrix */}
              <section className="rounded-2xl bg-[#FAF8F5] border border-[#C5BEB4] p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
                  <div>
                    <span className="text-xs font-medium text-[#57534A] block mb-1.5">
                      Transparansi Rancang Bangun
                    </span>
                    <h2 className="font-display font-medium text-[clamp(1.85rem,3vw,2.6rem)] leading-[1.1] text-[#38352C]">
                      Rincian Spesifikasi Teknis Unit
                    </h2>
                  </div>
                  <span className="text-xs font-medium text-[#38352C] bg-[#E8E4E1] px-3.5 py-1.5 rounded-full border border-[#C5BEB4] self-start sm:self-auto">
                    Standar Mutu Bangunan Prima
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Tata Ruang & Dimensi Utama', items: technicalSpecs.slice(0, 6) },
                    { title: 'Konstruksi & Legalitas Kawasan', items: technicalSpecs.slice(6, 12) },
                  ].map((col) => (
                    <div
                      key={col.title}
                      className="rounded-xl bg-[#E8E4E1] p-5 ring-1 ring-inset ring-[#38352C]/14"
                    >
                      <h3 className="font-body text-xs font-semibold text-[#57534A] pb-3 mb-3 border-b border-[#C5BEB4]">
                        {col.title}
                      </h3>
                      <div className="divide-y divide-[#C5BEB4]">
                        {col.items.map((spec, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4"
                          >
                            <div>
                              <span className="text-sm font-medium text-[#38352C] block">
                                {spec.label}
                              </span>
                              <span className="text-xs text-[#57534A]">{spec.sub}</span>
                            </div>
                            <span className="num-clean text-sm font-semibold text-[#38352C] text-right shrink-0">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Lokasi & Aksesibilitas + Static Map + Locked Shareloc Modal Trigger */}
              <section className="rounded-2xl bg-[#FAF8F5] border border-[#C5BEB4] p-6 sm:p-8 space-y-6">
                <div className="max-w-[54ch]">
                  <span className="text-xs font-medium text-[#57534A] block mb-1.5">
                    Aksesibilitas Kawasan
                  </span>
                  <h2 className="font-display font-medium text-[clamp(1.85rem,3vw,2.6rem)] leading-[1.1] text-[#38352C]">
                    Lokasi Strategis di {property.city}
                  </h2>
                  <p className="text-sm text-[#57534A] mt-2 leading-relaxed">
                    Dikelilingi simpul transportasi bandara internasional, akses tol, fasilitas pendidikan, dan pusat
                    perbelanjaan utama.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {proximityItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-[#E8E4E1] p-5 ring-1 ring-inset ring-[#38352C]/14 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="num-clean px-3 py-1 rounded-full text-xs font-semibold bg-[#38352C] text-[#FFCA4F]">
                          {item.time}
                        </span>
                        <span className="text-xs text-[#57534A]">Fasilitas Sekitar</span>
                      </div>
                      <h3 className="font-display font-medium text-xl text-[#38352C]">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#57534A] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Clickable Static Maps Preview -> Opens Locked Shareloc Modal */}
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
                  title="Klik untuk melihat rute dan minta titik shareloc resmi"
                  aria-label="Buka navigasi rute Google Maps dan minta titik shareloc resmi"
                  className="block relative rounded-2xl overflow-hidden border border-[#C5BEB4] bg-[#E8E4E1] group cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#38352C]"
                >
                  <div className="relative w-full aspect-[16/10] sm:aspect-[21/10] overflow-hidden bg-[#E8E4E1]">
                    <img
                      src={mapBgImage}
                      alt={`Peta kawasan ${property.codeName}`}
                      decoding="async"
                      className="w-full h-full object-cover contrast-[1.02]"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15 pointer-events-none"
                    />

                    {/* Radar Pulse Rings */}
                    <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                      <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-emerald-500/50 bg-emerald-500/10 animate-ping" />
                      <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-emerald-600/60 bg-emerald-500/15" />
                    </div>

                    {/* Google Maps Pin */}
                    <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-10">
                      <svg
                        className="w-9 h-11 sm:w-10 sm:h-12 drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]"
                        viewBox="0 0 32 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
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

                    {/* Top-Left Search Card */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
                      <div className="bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl shadow-md border border-gray-200/90 flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-rose-600" strokeWidth={2} />
                        </div>
                        <div className="leading-tight">
                          <span className="text-xs font-semibold text-gray-900 block truncate max-w-[140px] sm:max-w-xs">
                            {property.codeName}
                          </span>
                          <span className="text-[10px] text-gray-500 block truncate max-w-[140px] sm:max-w-xs">
                            {property.locationArea}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Top-Right Switcher */}
                    <div className="absolute top-3 right-3 hidden sm:flex items-center rounded-xl overflow-hidden bg-white/95 backdrop-blur-md shadow-md border border-gray-200/80 text-[11px] font-semibold pointer-events-none z-10">
                      <span className="px-3 py-1.5 bg-[#e8f0fe] text-[#1a73e8] border-r border-gray-200">
                        Peta
                      </span>
                      <span className="px-3 py-1.5 text-gray-600">Satelit</span>
                    </div>

                    {/* Bottom-Right Controls (Lucide User icon replacing emoji) */}
                    <div className="absolute bottom-3 right-3 hidden sm:flex flex-col items-center gap-2 pointer-events-none z-10">
                      <div className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md shadow-md border border-gray-200/80 flex items-center justify-center text-amber-600">
                        <User className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                      </div>
                      <div className="flex flex-col rounded-lg overflow-hidden bg-white/95 backdrop-blur-md shadow-md border border-gray-200/80 text-gray-700 text-sm font-bold divide-y divide-gray-200">
                        <span className="w-8 h-8 flex items-center justify-center">
                          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                        </span>
                        <span className="w-8 h-8 flex items-center justify-center">
                          <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                        </span>
                      </div>
                    </div>

                    {/* Floating Bottom Center CTA Prompt */}
                    <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-10">
                      <div className="bg-[#38352C]/95 text-[#FAF8F5] px-4 sm:px-5 py-2.5 rounded-full shadow-xl backdrop-blur-md flex items-center justify-center gap-2 text-xs font-medium whitespace-nowrap">
                        <Lock className="w-3.5 h-3.5 text-[#FFCA4F] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                        <span>Buka Rute &amp; Minta Shareloc Resmi</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Direct WhatsApp Consultation CTA (Replaces removed Mini-KPR Calculator) */}
              <section
                aria-labelledby="konsultasi-cicilan-heading"
                className="rounded-2xl bg-[#38352C] text-[#E8E4E1] p-7 sm:p-10 flex flex-col gap-6"
              >
                <div className="max-w-[54ch] space-y-2.5">
                  <span className="text-xs font-medium text-[#FFCA4F] block">
                    Konsultasi Pembiayaan Privat
                  </span>
                  <h2
                    id="konsultasi-cicilan-heading"
                    className="font-display font-medium text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.08] text-[#FAF8F5]"
                  >
                    Hitung rincian cicilan dan cek SLIK OJK langsung bersama analis kami.
                  </h2>
                  <p className="text-sm sm:text-base text-[#C5BEB4] leading-relaxed">
                    Setiap penghasilan atau skema Joint Income memiliki opsi tenor dan bank BUMN rekanan paling
                    menguntungkan. Konsultasikan gratis via WhatsApp bersama{' '}
                    <strong className="font-semibold text-[#FAF8F5]">{assignedAgent.name}</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={calcWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dual-cta whitespace-nowrap"
                  >
                    <span className="dual-cta__label">Hitung Cicilan &amp; Cek SLIK via WhatsApp</span>
                    <span className="dual-cta__circle" aria-hidden="true">
                      <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsSharelocModalOpen(true)}
                    className="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full border border-[#E8E4E1]/25 text-[#E8E4E1] text-sm font-medium hover:bg-[#E8E4E1]/10 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <MapPin className="w-4 h-4 text-[#FFCA4F]" strokeWidth={1.75} />
                    <span>Minta Shareloc Survei</span>
                  </button>
                </div>
              </section>
            </div>

            {/* RIGHT 4-COL STICKY SIDEBAR ON DESKTOP */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-5">
              <div className="rounded-2xl bg-[#E8E4E1] p-6 ring-1 ring-inset ring-[#38352C]/14 space-y-6">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-[#57534A] flex items-center gap-1.5 min-w-0 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#38352C] shrink-0" strokeWidth={1.75} />
                      <span className="truncate">{property.locationAreaShort}</span>
                    </p>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#C5BEB4] text-[#38352C] shrink-0">
                      Terverifikasi
                    </span>
                  </div>

                  <h1 className="font-display font-medium text-3xl leading-[1.1] text-[#38352C]">
                    {property.codeName}
                  </h1>

                  <div className="pt-1 flex items-baseline flex-wrap gap-x-3 gap-y-1">
                    <span className="num-clean text-3xl font-semibold text-[#38352C]">
                      {property.priceStart}
                    </span>
                    <span className="num-clean text-xs font-medium px-3 py-1 rounded-full bg-[#38352C] text-[#FFCA4F]">
                      Cicilan {property.cicilanPromo}
                    </span>
                  </div>
                  <span className="num-clean text-xs text-[#57534A] line-through block">
                    {property.priceStrikethrough}
                  </span>

                  <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-[#38352C]">
                    <span className="num-clean px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C5BEB4]">
                      LT {property.specs.luasTanah}
                    </span>
                    <span className="num-clean px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C5BEB4]">
                      LB {property.specs.luasBangunan}
                    </span>
                    <span className="num-clean px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C5BEB4]">
                      {property.specs.bedrooms} KT · {property.specs.bathrooms} KM
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#FAF8F5] border border-[#C5BEB4] p-4 space-y-2.5 text-xs font-medium text-[#38352C]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#38352C] shrink-0" strokeWidth={2} />
                    <span className="num-clean">DP 0% (Tanpa Uang Muka)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#38352C] shrink-0" strokeWidth={2} />
                    <span className="num-clean">Cukup Tanda Jadi ({property.utjAmount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#38352C] shrink-0" strokeWidth={2} />
                    <span>Free BPHTB, AJB, BBN &amp; Biaya Notaris</span>
                  </div>
                </div>

                {/* PIC Consultant Card */}
                <div className="rounded-xl bg-[#FAF8F5] border border-[#C5BEB4] p-4 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-[#38352C]/20 shrink-0 bg-[#E8E4E1]">
                        <img
                          src={assignedAgent.photoUrl}
                          alt={assignedAgent.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-body text-sm font-semibold text-[#38352C] truncate">
                            {assignedAgent.name}
                          </h3>
                          <span className="num-clean inline-flex items-center gap-0.5 text-[11px] font-semibold bg-[#E8E4E1] px-2 py-0.5 rounded-full shrink-0">
                            <Star className="w-3 h-3 fill-[#FFCA4F] text-[#38352C]" strokeWidth={1.5} />
                            {assignedAgent.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-[#57534A] flex items-center gap-1.5 mt-0.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#82886E] shrink-0" />
                          <span className="truncate">Siap Dampingi Survei</span>
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/agen"
                      className="shrink-0 min-h-[44px] inline-flex items-center px-3.5 rounded-full bg-[#E8E4E1] border border-[#C5BEB4] text-xs font-medium text-[#38352C] hover:bg-[#38352C] hover:text-[#E8E4E1] transition-colors"
                    >
                      Profil
                    </Link>
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dual-cta whitespace-nowrap w-full justify-between"
                  >
                    <span className="dual-cta__label flex-1">Mau Saya Temenin Cek Lokasi?</span>
                    <span className="dual-cta__circle" aria-hidden="true">
                      <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                    </span>
                  </a>

                  <a
                    href={calcWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-full border border-[#38352C] text-xs font-semibold text-[#38352C] hover:bg-[#38352C] hover:text-[#E8E4E1] transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    <span>Hitung Cicilan &amp; Cek SLIK via WA</span>
                  </a>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#57534A]">
                  <button
                    type="button"
                    onClick={() => setIsSharelocModalOpen(true)}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-2 -ml-2 text-[#38352C] hover:underline underline-offset-4 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Minta Shareloc Lokasi</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center min-h-[44px] px-2 -mr-2 text-[#38352C] hover:underline underline-offset-4 cursor-pointer"
                  >
                    {isCopied ? 'Tautan Tersalin' : 'Bagikan Unit'}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Clusters Section */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-16 sm:mt-24 pt-12 border-t border-[#C5BEB4]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-medium text-[#57534A] block mb-1.5">
                Pilihan Alternatif Terbaik
              </span>
              <h2 className="font-display font-medium text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08] text-[#38352C]">
                Rekomendasi klaster lainnya
              </h2>
            </div>

            <Link
              href={basePath}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full border border-[#C5BEB4] bg-[#E8E4E1] text-sm font-medium text-[#38352C] hover:bg-[#38352C] hover:text-[#E8E4E1] transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              <span className="num-clean">Lihat Semua {TIAR_PROPERTIES.length} Klaster</span>
              <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedUnits.map((item) => (
              <PropertyCard key={item.id} property={item} basePath={basePath} />
            ))}
          </div>
        </section>
      </main>

      {/* Fullscreen Lightbox Gallery Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan penuh foto properti"
          className="fixed inset-0 z-50 bg-[#181612]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}
        >
          <div className="flex items-center justify-between text-[#FAF8F5] text-sm z-10">
            <span className="num-clean font-medium">
              {property.codeName}: Foto {activeImageIndex + 1} dari {gallery.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Tutup galeri"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center max-h-[75vh] my-auto cursor-pointer"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsLightboxOpen(false);
            }}
          >
            <img
              src={gallery[activeImageIndex]}
              alt={`${property.codeName} - Foto ${activeImageIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl cursor-default"
            />
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Foto sebelumnya"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Foto selanjutnya"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" strokeWidth={1.75} />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10">
            {gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border transition-[border-color,opacity,transform] motion-reduce:transition-none cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-[#FFCA4F] scale-105 opacity-100'
                    : 'border-white/20 opacity-50 hover:opacity-90'
                }`}
              >
                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Locked Shareloc Modal Popup */}
      {isSharelocModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shareloc-modal-title"
          className="fixed inset-0 z-50 bg-[#181612]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSharelocModalOpen(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#FAF8F5] text-[#38352C] rounded-2xl p-6 sm:p-7 max-w-[460px] w-full shadow-2xl flex flex-col gap-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-medium text-[#57534A] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#38352C]" strokeWidth={1.75} />
                  <span>Akses Navigasi Google Maps</span>
                </span>
                <h3
                  id="shareloc-modal-title"
                  className="font-display font-medium text-2xl leading-tight text-[#38352C]"
                >
                  Titik Lokasi Dijaga Privat
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsSharelocModalOpen(false)}
                aria-label="Tutup popup"
                className="w-11 h-11 rounded-full bg-[#E8E4E1] hover:bg-[#C5BEB4]/40 text-[#38352C] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* Locked Blurred Regional Map Preview */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-[#E8E4E1] border border-[#C5BEB4]">
              <img
                src={mapBgImage}
                alt={`Pratinjau area peta ${property.locationAreaShort}`}
                className="w-full h-full object-cover blur-[4px] brightness-90"
              />
              <div className="absolute inset-0 bg-[#181612]/50 flex flex-col items-center justify-center gap-1.5 p-4 text-center text-[#FAF8F5]">
                <Lock className="w-5 h-5 text-[#FFCA4F]" strokeWidth={1.75} />
                <span className="text-sm font-medium">{property.locationArea}</span>
              </div>
            </div>

            <p className="text-sm text-[#57534A] leading-relaxed">
              Demi melindungi kuota promo DP <span className="num-clean font-medium text-[#38352C]">0%</span> dan
              kenyamanan jadwal kunjungan, titik koordinat Shareloc klaster{' '}
              <strong className="font-semibold text-[#38352C]">{property.codeName}</strong> dikirimkan langsung via
              WhatsApp oleh konsultan resmi kami.
            </p>

            {/* PIC Consultant Card */}
            <div className="p-3.5 rounded-xl bg-[#E8E4E1] border border-[#C5BEB4] flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-1 ring-[#38352C]/20 shrink-0">
                <img
                  src={assignedAgent.photoUrl}
                  alt={assignedAgent.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h4 className="font-body text-sm font-semibold text-[#38352C] truncate">
                      {assignedAgent.name}
                    </h4>
                    <ShieldCheck className="w-4 h-4 text-[#38352C] shrink-0" strokeWidth={1.75} />
                  </div>
                  <span className="num-clean inline-flex items-center gap-0.5 text-xs font-semibold bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#C5BEB4] shrink-0">
                    <Star className="w-3 h-3 fill-[#FFCA4F] text-[#38352C]" strokeWidth={1.5} />
                    {assignedAgent.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-[#57534A] truncate">
                  Konsultan Lapangan &amp; Pendamping Survei
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={sharelocWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsSharelocModalOpen(false)}
                className="dual-cta whitespace-nowrap w-full justify-between"
              >
                <span className="dual-cta__label flex-1">
                  Minta Titik Shareloc ke {assignedAgent.name.split(' ')[0]}
                </span>
                <span className="dual-cta__circle" aria-hidden="true">
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </span>
              </a>

              <button
                type="button"
                onClick={() => setIsSharelocModalOpen(false)}
                className="w-full min-h-[44px] text-center text-xs font-medium text-[#57534A] hover:text-[#38352C] transition-colors cursor-pointer"
              >
                Kembali ke Halaman Unit
              </button>
            </div>

            {/* Footer Trust 3-Col Grid */}
            <div className="pt-3 border-t border-[#C5BEB4] grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-[#38352C]">Gratis Survei</span>
                <span className="text-[10px] text-[#57534A]">Siap Ditemani</span>
              </div>
              <div className="flex flex-col items-center border-x border-[#C5BEB4] px-1">
                <span className="text-[11px] font-semibold text-[#38352C]">Respon Cepat</span>
                <span className="num-clean text-[10px] text-[#57534A]">&lt; 5 Menit di WA</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-[#38352C]">Resmi Tiar</span>
                <span className="text-[10px] text-[#57534A]">Partner Resmi</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar (< lg) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#C5BEB4] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3 shadow-[0_-8px_24px_rgba(20,18,14,0.08)]">
        <div className="min-w-0">
          <span className="text-[11px] font-medium text-[#57534A] block">Harga Mulai</span>
          <span className="num-clean text-lg font-semibold text-[#38352C] block truncate">
            {property.priceStart}
          </span>
          <span className="num-clean text-xs font-medium text-[#57534A] block truncate">
            Cicilan {property.cicilanPromo}
          </span>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dual-cta whitespace-nowrap shrink-0"
        >
          <span className="dual-cta__label">Mau Saya Temenin?</span>
          <span className="dual-cta__circle" aria-hidden="true">
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </span>
        </a>
      </div>

      {/* Desktop Floating WhatsApp */}
      <div className="hidden lg:block">
        <FloatingWhatsApp />
      </div>

      <Footer />
    </div>
  );
}
