'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  RotateCcw,
  MapPin,
  Layers,
  CreditCard,
  SlidersHorizontal,
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { TIAR_PROPERTIES, WA_CS_NUMBER } from '@/data/properties';

type CityFilter = 'semua' | 'Surabaya' | 'Sidoarjo';
type FloorFilter = 'semua' | 1 | 2;
type CicilanFilter = 'semua' | 'dibawah-2jt' | '2jt-3jt' | 'diatas-3jt';

const CITY_OPTIONS: { value: CityFilter; label: string }[] = [
  { value: 'semua', label: 'Semua Kota' },
  { value: 'Sidoarjo', label: 'Sidoarjo' },
  { value: 'Surabaya', label: 'Surabaya' },
];

const FLOOR_OPTIONS: { value: FloorFilter; label: string }[] = [
  { value: 'semua', label: 'Semua Tipe' },
  { value: 1, label: '1 Lantai' },
  { value: 2, label: '2 Lantai' },
];

const CICILAN_OPTIONS: { value: CicilanFilter; label: string }[] = [
  { value: 'semua', label: 'Semua Cicilan' },
  { value: 'dibawah-2jt', label: '< Rp 2 Jt/bln' },
  { value: '2jt-3jt', label: 'Rp 2–3 Jt/bln' },
  { value: 'diatas-3jt', label: '> Rp 3 Jt/bln' },
];

function parseFloorParam(param: string | null | undefined): FloorFilter {
  if (!param) return 'semua';
  if (param === '1' || param.startsWith('1')) return 1;
  if (param === '2' || param.startsWith('2')) return 2;
  return 'semua';
}

function parseCicilanParam(param: string | null | undefined): CicilanFilter {
  if (!param) return 'semua';
  if (param === 'dibawah-2jt' || param === '2.0' || param === 'under2') return 'dibawah-2jt';
  if (param === '2jt-3jt') return '2jt-3jt';
  if (param === 'diatas-3jt') return 'diatas-3jt';
  return 'semua';
}

interface PropertiCatalogViewProps {
  basePath?: '/properti' | '/produk';
  pageTitle?: string;
}

export function PropertiCatalogView({
  basePath = '/properti',
  pageTitle = 'Koleksi Klaster & Rumah Siap Huni',
}: PropertiCatalogViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const initialQ = searchParams?.get('q') || '';
  const initialCityParam = searchParams?.get('kota')?.toLowerCase();
  const initialCity: CityFilter =
    initialCityParam === 'surabaya'
      ? 'Surabaya'
      : initialCityParam === 'sidoarjo'
      ? 'Sidoarjo'
      : 'semua';
  const initialFloor = parseFloorParam(searchParams?.get('tipe'));
  const initialCicilan = parseCicilanParam(searchParams?.get('cicilan'));

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedCity, setSelectedCity] = useState<CityFilter>(initialCity);
  const [selectedFloor, setSelectedFloor] = useState<FloorFilter>(initialFloor);
  const [selectedCicilan, setSelectedCicilan] = useState<CicilanFilter>(initialCicilan);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Redirect legacy ?unit= or ?id= query param directly to the dedicated detail page
  useEffect(() => {
    if (!searchParams) return;
    const targetUnitId = searchParams.get('unit') || searchParams.get('id');
    if (targetUnitId) {
      const exists = TIAR_PROPERTIES.some((p) => p.id === targetUnitId);
      if (exists) {
        router.replace(`${basePath}/${targetUnitId}`);
      } else if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('unit');
        url.searchParams.delete('id');
        router.replace(url.pathname + (url.search ? url.search : ''));
      }
    }
  }, [searchParams, basePath, router]);

  // Sync searchParams back into state on navigation
  useEffect(() => {
    if (!searchParams) return;
    const cityParam = searchParams.get('kota')?.toLowerCase();
    const city: CityFilter =
      cityParam === 'surabaya' ? 'Surabaya' : cityParam === 'sidoarjo' ? 'Sidoarjo' : 'semua';
    const floor = parseFloorParam(searchParams.get('tipe'));
    const cicilan = parseCicilanParam(searchParams.get('cicilan'));

    setSelectedCity((prev) => (prev !== city ? city : prev));
    setSelectedFloor((prev) => (prev !== floor ? floor : prev));
    setSelectedCicilan((prev) => (prev !== cicilan ? cicilan : prev));
  }, [searchParams]);

  const syncFiltersToUrl = useCallback(
    (q: string, city: CityFilter, floor: FloorFilter, cicilan: CicilanFilter) => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);

      if (q.trim()) url.searchParams.set('q', q.trim());
      else url.searchParams.delete('q');

      if (city !== 'semua') url.searchParams.set('kota', city.toLowerCase());
      else url.searchParams.delete('kota');

      if (floor !== 'semua') url.searchParams.set('tipe', String(floor));
      else url.searchParams.delete('tipe');

      if (cicilan !== 'semua') url.searchParams.set('cicilan', cicilan);
      else url.searchParams.delete('cicilan');

      window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
    },
    []
  );

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    syncFiltersToUrl(val, selectedCity, selectedFloor, selectedCicilan);
  };

  const handleCityChange = (city: CityFilter) => {
    setSelectedCity(city);
    syncFiltersToUrl(searchQuery, city, selectedFloor, selectedCicilan);
  };

  const handleFloorChange = (floor: FloorFilter) => {
    setSelectedFloor(floor);
    syncFiltersToUrl(searchQuery, selectedCity, floor, selectedCicilan);
  };

  const handleCicilanChange = (cicilan: CicilanFilter) => {
    setSelectedCicilan(cicilan);
    syncFiltersToUrl(searchQuery, selectedCity, selectedFloor, cicilan);
  };

  const filteredProperties = useMemo(() => {
    return TIAR_PROPERTIES.filter((property) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = property.codeName.toLowerCase().includes(query);
        const matchLocation = property.locationArea.toLowerCase().includes(query);
        const matchLocationShort = property.locationAreaShort.toLowerCase().includes(query);
        const matchFeatures = property.features.some((f) => f.toLowerCase().includes(query));
        const matchPrice = property.priceStart.toLowerCase().includes(query);
        const matchCicilan = property.cicilanPromo.toLowerCase().includes(query);
        const matchSpecs =
          `${property.specs.bedrooms} kamar`.includes(query) ||
          `${property.specs.bathrooms} kamar mandi`.includes(query) ||
          `${property.floors} lantai`.includes(query) ||
          property.specs.luasTanah.toLowerCase().includes(query);

        if (
          !matchTitle &&
          !matchLocation &&
          !matchLocationShort &&
          !matchFeatures &&
          !matchPrice &&
          !matchCicilan &&
          !matchSpecs
        ) {
          return false;
        }
      }

      if (selectedCity !== 'semua' && property.city !== selectedCity) return false;
      if (selectedFloor !== 'semua' && property.floors !== selectedFloor) return false;

      if (selectedCicilan === 'dibawah-2jt' && property.cicilanNominal >= 2.0) return false;
      if (
        selectedCicilan === '2jt-3jt' &&
        (property.cicilanNominal < 2.0 || property.cicilanNominal > 3.0)
      ) {
        return false;
      }
      if (selectedCicilan === 'diatas-3jt' && property.cicilanNominal <= 3.0) return false;

      return true;
    });
  }, [searchQuery, selectedCity, selectedFloor, selectedCicilan]);

  const activeFilterCount =
    (selectedCity !== 'semua' ? 1 : 0) +
    (selectedFloor !== 'semua' ? 1 : 0) +
    (selectedCicilan !== 'semua' ? 1 : 0);

  const hasActiveFilters = Boolean(searchQuery.trim()) || activeFilterCount > 0;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('semua');
    setSelectedFloor('semua');
    setSelectedCicilan('semua');
    setMobileFilterOpen(false);
    syncFiltersToUrl('', 'semua', 'semua', 'semua');
  };

  const consultationWaUrl = `https://wa.me/${WA_CS_NUMBER}?text=${encodeURIComponent(
    'Halo Mbak Ningsih, saya sedang melihat katalog rumah di website Tiar Property. Mau minta tolong hitung cicilan dan ditemenin cek lokasinya kak?'
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F1F1] text-[#38352C]">
      <main className="flex-1 pb-20 sm:pb-28">
        {/* Editorial Header */}
        <section className="pt-24 sm:pt-28 pb-10 sm:pb-12 border-b border-[#C5BEB4] bg-[#FAF8F5]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-2 text-xs font-medium text-[#57534A] mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-[#38352C] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
                <span>Beranda</span>
              </Link>
              <span aria-hidden="true">·</span>
              <span className="text-[#38352C] font-semibold">Katalog Semua Rumah</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-[58ch]">
                <h1 className="font-display font-medium text-[clamp(2.25rem,4.4vw,3.9rem)] leading-[1.05] tracking-[-0.025em] text-[#38352C]">
                  {pageTitle}
                </h1>
                <p className="mt-3 font-body text-base leading-[1.6] text-[#57534A]">
                  Kurasi klaster hunian strategis Surabaya dan Sidoarjo dengan skema DP{' '}
                  <span className="num-clean font-medium text-[#38352C]">0%</span>, cukup UTJ{' '}
                  <span className="num-clean font-medium text-[#38352C]">Rp 1–5</span> juta, bebas biaya notaris, dan
                  subsidi angsuran <span className="num-clean font-medium text-[#38352C]">Rp 1,4</span> juta per bulan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#38352C]">
                <span className="num-clean px-3.5 py-2 rounded-full bg-[#E8E4E1] border border-[#C5BEB4] whitespace-nowrap">
                  UTJ Rp 1–5 Jt Langsung KPR
                </span>
                <span className="num-clean px-3.5 py-2 rounded-full bg-[#E8E4E1] border border-[#C5BEB4] whitespace-nowrap">
                  5 Bank BUMN Rekanan
                </span>
                <span className="px-3.5 py-2 rounded-full bg-[#E8E4E1] border border-[#C5BEB4] whitespace-nowrap">
                  SHM &amp; IMB Pecah
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Travertine Filter Bar */}
        <section
          aria-label="Filter pencarian klaster"
          className="border-b border-[#C5BEB4] bg-[#E8E4E1] py-4"
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[220px] max-w-md">
                <Search
                  className="w-4 h-4 text-[#57534A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Cari kode klaster, Sukodono, Juanda, MERR..."
                  aria-label="Cari klaster atau lokasi"
                  className="w-full min-h-[44px] pl-10 pr-9 rounded-full bg-[#FAF8F5] border border-[#C5BEB4] text-sm text-[#38352C] placeholder:text-[#57534A]/70 focus:outline-none focus:border-[#38352C] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    aria-label="Hapus kata kunci"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534A] hover:text-[#38352C] cursor-pointer"
                  >
                    <X className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                )}
              </div>

              {/* Mobile Filter Drawer Toggle */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen((prev) => !prev)}
                className="lg:hidden inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border border-[#C5BEB4] bg-[#FAF8F5] text-sm font-medium text-[#38352C] whitespace-nowrap cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
                <span className="num-clean">
                  Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                </span>
              </button>

              {/* Desktop Pill Groups */}
              <div className="hidden lg:flex flex-wrap items-center gap-2">
                {/* City Pills */}
                <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#FAF8F5] border border-[#C5BEB4]">
                  {CITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleCityChange(opt.value)}
                      className={`inline-flex items-center gap-1.5 min-h-[36px] px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCity === opt.value
                          ? 'bg-[#38352C] text-[#E8E4E1]'
                          : 'text-[#57534A] hover:text-[#38352C]'
                      }`}
                    >
                      {opt.value !== 'semua' && (
                        <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                      )}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>

                {/* Floor Pills */}
                <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#FAF8F5] border border-[#C5BEB4]">
                  {FLOOR_OPTIONS.map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => handleFloorChange(opt.value)}
                      className={`inline-flex items-center gap-1.5 min-h-[36px] px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer num-clean ${
                        selectedFloor === opt.value
                          ? 'bg-[#38352C] text-[#E8E4E1]'
                          : 'text-[#57534A] hover:text-[#38352C]'
                      }`}
                    >
                      {opt.value !== 'semua' && (
                        <Layers className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                      )}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>

                {/* Cicilan Pills */}
                <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#FAF8F5] border border-[#C5BEB4]">
                  {CICILAN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleCicilanChange(opt.value)}
                      className={`inline-flex items-center gap-1.5 min-h-[36px] px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer num-clean ${
                        selectedCicilan === opt.value
                          ? 'bg-[#38352C] text-[#E8E4E1]'
                          : 'text-[#57534A] hover:text-[#38352C]'
                      }`}
                    >
                      {opt.value !== 'semua' && (
                        <CreditCard className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                      )}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Counter + Reset */}
              <div className="flex items-center gap-3 text-xs text-[#57534A] ml-auto lg:ml-0">
                <span className="num-clean whitespace-nowrap">
                  Menampilkan <strong className="font-semibold text-[#38352C]">{filteredProperties.length}</strong> dari{' '}
                  {TIAR_PROPERTIES.length} klaster
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#38352C] underline underline-offset-4 cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3 h-3" strokeWidth={1.75} />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile/Tablet Collapsible Filter Panel */}
            {mobileFilterOpen && (
              <div className="lg:hidden rounded-2xl bg-[#FAF8F5] border border-[#C5BEB4] p-4 flex flex-col gap-4">
                <div>
                  <span className="block text-xs font-semibold text-[#57534A] mb-2">
                    Wilayah / Kota
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleCityChange(opt.value)}
                        className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-full border text-xs font-medium whitespace-nowrap cursor-pointer ${
                          selectedCity === opt.value
                            ? 'bg-[#38352C] text-[#E8E4E1] border-[#38352C]'
                            : 'bg-[#E8E4E1] text-[#38352C] border-[#C5BEB4]'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-[#57534A] mb-2">
                    Tipe Lantai
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {FLOOR_OPTIONS.map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => handleFloorChange(opt.value)}
                        className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-full border text-xs font-medium whitespace-nowrap cursor-pointer num-clean ${
                          selectedFloor === opt.value
                            ? 'bg-[#38352C] text-[#E8E4E1] border-[#38352C]'
                            : 'bg-[#E8E4E1] text-[#38352C] border-[#C5BEB4]'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-[#57534A] mb-2">
                    Rentang Cicilan
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CICILAN_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleCicilanChange(opt.value)}
                        className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-full border text-xs font-medium whitespace-nowrap cursor-pointer num-clean ${
                          selectedCicilan === opt.value
                            ? 'bg-[#38352C] text-[#E8E4E1] border-[#38352C]'
                            : 'bg-[#E8E4E1] text-[#38352C] border-[#C5BEB4]'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Property Results Grid */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  basePath={basePath}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#E8E4E1] border border-[#C5BEB4] p-8 sm:p-12 max-w-xl mx-auto my-8 text-center flex flex-col items-center gap-4">
              <h2 className="font-display font-medium text-2xl sm:text-3xl text-[#38352C]">
                Belum ada klaster yang sesuai kriteria filter.
              </h2>
              <p className="text-sm text-[#57534A] leading-relaxed">
                Coba reset sebagian filter atau tanyakan rekomendasi unit langsung ke Mbak Ningsih sesuai anggaran
                Anda.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full border border-[#38352C] bg-transparent text-[#38352C] text-sm font-medium cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
                  <span>Reset Semua Filter</span>
                </button>
                <a
                  href={consultationWaUrl}
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
          )}
        </section>

        {/* Bottom Consultation Banner */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-16 sm:mt-24">
          <div className="rounded-2xl bg-[#38352C] text-[#E8E4E1] p-7 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-[56ch]">
              <h2 className="font-display font-medium text-[clamp(1.85rem,3.4vw,2.9rem)] leading-[1.08] text-[#E8E4E1]">
                Ingin dihitungkan cicilan dan ditemani survei langsung?
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#C5BEB4] leading-relaxed">
                Tim konsultan Tiar Property siap membantu cek kelayakan SLIK OJK dan mendampingi kunjungan ke lokasi
                klaster setiap akhir pekan.
              </p>
            </div>

            <a
              href={consultationWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dual-cta self-start lg:self-auto shrink-0"
            >
              <span className="dual-cta__label">Mau Saya Temenin Cek Lokasi?</span>
              <span className="dual-cta__circle" aria-hidden="true">
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </span>
            </a>
          </div>
        </section>
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
