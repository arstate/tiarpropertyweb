'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PropertyCard } from '@/components/PropertyCard';
import { TIAR_PROPERTIES, PropertyUnit, WA_CS_NUMBER } from '@/data/properties';

type CityFilter = 'semua' | 'Surabaya' | 'Sidoarjo';
type FloorFilter = 'semua' | 1 | 2;
type CicilanFilter = 'semua' | 'dibawah-2jt' | '2jt-3jt' | 'diatas-3jt';
type OpenDropdown = 'kota' | 'tipe' | 'cicilan' | 'mobile-filter' | null;

interface FilterOption<T> {
  value: T;
  label: string;
  hint: string;
}

const CITY_OPTIONS: FilterOption<CityFilter>[] = [
  { value: 'semua', label: 'Semua Kota', hint: 'Surabaya & Sidoarjo' },
  { value: 'Surabaya', label: 'Surabaya', hint: 'MERR, Rungkut, Surabaya Timur' },
  { value: 'Sidoarjo', label: 'Sidoarjo', hint: 'Sukodono, Sedati, Waru' },
];

const FLOOR_OPTIONS: FilterOption<FloorFilter>[] = [
  { value: 'semua', label: 'Semua Tipe', hint: '1 & 2 Lantai' },
  { value: 1, label: '1 Lantai', hint: 'Praktis & Cicilan Ringan' },
  { value: 2, label: '2 Lantai', hint: 'Keluarga & Ruang Lebih Luas' },
];

const CICILAN_OPTIONS: FilterOption<CicilanFilter>[] = [
  { value: 'semua', label: 'Semua Cicilan', hint: 'Semua Rentang Promo' },
  { value: 'dibawah-2jt', label: '< 2 Jt/bln', hint: 'Mulai 1,2–1,9 Jt/bln' },
  { value: '2jt-3jt', label: '2 – 3 Jt/bln', hint: 'Cicilan Terjangkau' },
  { value: 'diatas-3jt', label: '> 3 Jt/bln', hint: 'Klaster Premium / 2 Lantai' },
];

interface PropertiCatalogViewProps {
  basePath?: '/properti' | '/produk';
  pageTitle?: string;
}

export function PropertiCatalogView({
  basePath = '/properti',
  pageTitle = 'Pilihan Klaster & Rumah Siap Huni',
}: PropertiCatalogViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Instant scroll cut to the very top upon navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Initialize filters from search parameters
  const initialQ = searchParams?.get('q') || '';
  const initialCityParam = searchParams?.get('kota')?.toLowerCase();
  const initialCity: CityFilter =
    initialCityParam === 'surabaya'
      ? 'Surabaya'
      : initialCityParam === 'sidoarjo'
      ? 'Sidoarjo'
      : 'semua';

  const initialFloorParam = searchParams?.get('tipe');
  const initialFloor: FloorFilter =
    initialFloorParam === '1' ? 1 : initialFloorParam === '2' ? 2 : 'semua';

  const initialCicilanParam = searchParams?.get('cicilan') as CicilanFilter;
  const initialCicilan: CicilanFilter =
    initialCicilanParam === 'dibawah-2jt' ||
    initialCicilanParam === '2jt-3jt' ||
    initialCicilanParam === 'diatas-3jt'
      ? initialCicilanParam
      : 'semua';

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedCity, setSelectedCity] = useState<CityFilter>(initialCity);
  const [selectedFloor, setSelectedFloor] = useState<FloorFilter>(initialFloor);
  const [selectedCicilan, setSelectedCicilan] = useState<CicilanFilter>(initialCicilan);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [dropdownDirection, setDropdownDirection] = useState<{ [key: string]: 'down' | 'up' }>({});

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

  const toggleDropdown = (
    key: 'kota' | 'tipe' | 'cicilan' | 'mobile-filter',
    btnEl: HTMLElement | null
  ) => {
    if (openDropdown === key) {
      setOpenDropdown(null);
      return;
    }

    if (btnEl && typeof window !== 'undefined') {
      const rect = btnEl.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Menus are ~180-240px tall. If space below is less than 230px and space above has more room, dropup!
      const isUp = spaceBelow < 230 && spaceAbove > spaceBelow;
      setDropdownDirection((prev) => ({ ...prev, [key]: isUp ? 'up' : 'down' }));
    }
    setOpenDropdown(key);
  };

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!openDropdown) return;
      const target = e.target as HTMLElement;
      // If clicking inside the active dropdown menu or its trigger button, don't close
      if (
        target.closest?.('[data-dropdown-menu]') ||
        target.closest?.('[data-dropdown-trigger]')
      ) {
        return;
      }
      setOpenDropdown(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openDropdown]);

  // Sync searchParams back into state on navigation
  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get('q') || '';
    const cityParam = searchParams.get('kota')?.toLowerCase();
    const city: CityFilter =
      cityParam === 'surabaya' ? 'Surabaya' : cityParam === 'sidoarjo' ? 'Sidoarjo' : 'semua';
    const floorParam = searchParams.get('tipe');
    const floor: FloorFilter = floorParam === '1' ? 1 : floorParam === '2' ? 2 : 'semua';
    const cicilanParam = searchParams.get('cicilan') as CicilanFilter;
    const cicilan: CicilanFilter =
      cicilanParam === 'dibawah-2jt' || cicilanParam === '2jt-3jt' || cicilanParam === 'diatas-3jt'
        ? cicilanParam
        : 'semua';

    setSelectedCity((prev) => (prev !== city ? city : prev));
    setSelectedFloor((prev) => (prev !== floor ? floor : prev));
    setSelectedCicilan((prev) => (prev !== cicilan ? cicilan : prev));
  }, [searchParams]);

  // Sync active filters to URL search parameters for bookmarking & shareability
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


  // Update filter setters with URL synchronization
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

  // Filter properties
  const filteredProperties = useMemo(() => {
    return TIAR_PROPERTIES.filter((property) => {
      // 1. Text Search Filter
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

      // 2. City Filter
      if (selectedCity !== 'semua' && property.city !== selectedCity) {
        return false;
      }

      // 3. Floor Filter
      if (selectedFloor !== 'semua' && property.floors !== selectedFloor) {
        return false;
      }

      // 4. Cicilan Filter
      if (selectedCicilan === 'dibawah-2jt' && property.cicilanNominal >= 2.0) {
        return false;
      }
      if (
        selectedCicilan === '2jt-3jt' &&
        (property.cicilanNominal < 2.0 || property.cicilanNominal > 3.0)
      ) {
        return false;
      }
      if (selectedCicilan === 'diatas-3jt' && property.cicilanNominal <= 3.0) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCity, selectedFloor, selectedCicilan]);

  const activeFilterCount =
    (selectedCity !== 'semua' ? 1 : 0) +
    (selectedFloor !== 'semua' ? 1 : 0) +
    (selectedCicilan !== 'semua' ? 1 : 0);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || activeFilterCount > 0;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('semua');
    setSelectedFloor('semua');
    setSelectedCicilan('semua');
    setOpenDropdown(null);
    syncFiltersToUrl('', 'semua', 'semua', 'semua');
  };

  const consultationWaUrl = `https://wa.me/${WA_CS_NUMBER}?text=${encodeURIComponent(
    'Halo Mbak Ningsih, saya sedang melihat katalog rumah di website Tiar Property. Mau konsultasi unit rumah impian yang cocok dengan budget dan lokasi saya, boleh minta tolong ditemenin cek lokasinya kak?'
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf8] text-[#081613]">
      <main className="flex-1 pb-20 md:pb-28">
        {/* Top Header / Breadcrumb Section */}
        <section className="bg-gradient-to-b from-[#ebf2ee] via-[#f2f7f4] to-[#f7faf8] border-b border-[#dde8e2] pt-5 sm:pt-7 md:pt-10 pb-7 sm:pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#477769] mb-3 sm:mb-4">
              <Link href="/" className="hover:text-[#081613] transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Beranda</span>
              </Link>
              <span>/</span>
              <span className="text-[#081613] font-bold">Katalog Semua Rumah</span>
            </div>

            {/* Header Content */}
            <div className="max-w-4xl">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#081613] tracking-tight leading-tight [text-wrap:balance]">
                {pageTitle === 'Pilihan Klaster & Rumah Siap Huni' ? (
                  <>
                    Pilihan Klaster &amp; Rumah <span className="inline-block whitespace-nowrap">Siap Huni</span>
                  </>
                ) : (
                  pageTitle
                )}
              </h1>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-[#477769] font-normal leading-relaxed">
                Jelajahi seluruh klaster hunian modern di lokasi paling berkembang Surabaya & Sidoarjo. Nikmati promo{' '}
                <strong className="text-[#081613] font-bold">DP 0%</strong>,{' '}
                <strong className="text-[#081613] font-bold">All-In Free Biaya Notaris & KPR</strong>, serta{' '}
                <strong className="text-[#081613] font-bold">Subsidi Angsuran Rp 1,4 Juta</strong>.
              </p>

              {/* USP Micro-Tags */}
              <div className="mt-3 sm:mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-[11px] sm:text-xs font-bold text-[#16362f]">
                <span className="px-3 py-1 rounded-full bg-white/85 border border-[#dde8e2] shadow-xs inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                  <svg className="w-3.5 h-3.5 text-[#3a6356] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Cukup UTJ 1–2 Jt Langsung Berkas KPR</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/85 border border-[#dde8e2] shadow-xs inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                  <svg className="w-3.5 h-3.5 text-[#3a6356] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Pendampingan 100% Sampai ACC Bank</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/85 border border-[#dde8e2] shadow-xs inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                  <svg className="w-3.5 h-3.5 text-[#3a6356] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>SHM & IMB Siap Splitz</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Controls Section (Sticky Header - precisely docked under navbar) */}
        <section
          className="sticky top-12 sm:top-[52px] z-40 bg-[#f7faf8]/95 backdrop-blur-md border-b border-[#dde8e2] py-2 sm:py-2.5 shadow-xs"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1.5 sm:space-y-2">
            {/* Primary Controls Row: Compact Search Bar + Filters (Left) & Result Counter (Right) */}
            <div className="relative flex items-center justify-between gap-2.5 sm:gap-3 w-full">
              {/* Left Controls Cluster */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                {/* Search Input Bar (Proportioned width: flexible on mobile, compact max-w-sm on tablet/desktop) */}
                <div className="relative flex-1 sm:flex-initial sm:w-64 md:w-72 lg:w-80 min-w-0">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-[#5d8b7b]">
                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setOpenDropdown(null)}
                    placeholder="Cari klaster, lokasi..."
                    className="w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-2 sm:py-2.5 rounded-2xl bg-white border border-[#dde8e2] text-xs sm:text-sm text-[#081613] placeholder-[#8baf9f] focus:outline-none focus:ring-2 focus:ring-[#16362f] focus:border-transparent shadow-xs transition-all truncate"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8baf9f] hover:text-[#081613] transition-colors"
                      aria-label="Hapus kata kunci pencarian"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Desktop & Tablet: 3 Sleek Custom Dropdown / Dropup Buttons side-by-side (md:flex) */}
                <div className="hidden md:flex items-center gap-2 shrink-0">
                {/* 1. Kota Dropdown / Dropup */}
                <div className="relative">
                  <button
                    type="button"
                    data-dropdown-trigger="kota"
                    onClick={(e) => toggleDropdown('kota', e.currentTarget)}
                    className={`px-3 py-2 sm:py-2.5 rounded-2xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs border cursor-pointer select-none ${
                      selectedCity !== 'semua'
                        ? 'bg-[#081613] text-white border-[#081613]'
                        : 'bg-white text-[#16362f] border-[#dde8e2] hover:bg-[#ebf2ee] hover:border-[#8baf9f]'
                    }`}
                    aria-expanded={openDropdown === 'kota'}
                    aria-haspopup="menu"
                    title={selectedCity !== 'semua' ? `Kota: ${selectedCity}` : 'Filter Wilayah/Kota'}
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{selectedCity === 'semua' ? 'Kota' : selectedCity}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openDropdown === 'kota'
                          ? dropdownDirection['kota'] === 'up'
                            ? ''
                            : 'rotate-180'
                          : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {dropdownDirection['kota'] === 'up' && openDropdown === 'kota' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      )}
                    </svg>
                  </button>

                  {openDropdown === 'kota' && (
                    <div
                      data-dropdown-menu="kota"
                      className={`absolute left-0 ${
                        dropdownDirection['kota'] === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
                      } z-50 w-52 bg-white/98 backdrop-blur-md rounded-2xl border border-[#dde8e2] shadow-reome-card shadow-xl p-1.5 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100`}
                      role="menu"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#477769] border-b border-[#dde8e2]/60 mb-1">
                        Pilih Wilayah
                      </div>
                      {CITY_OPTIONS.map((opt) => {
                        const isSelected = selectedCity === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              handleCityChange(opt.value);
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#081613] text-white shadow-xs'
                                : 'text-[#16362f] hover:bg-[#ebf2ee] hover:text-[#081613]'
                            }`}
                            role="menuitem"
                          >
                            <div className="flex flex-col text-left">
                              <span className="font-bold">{opt.label}</span>
                              <span
                                className={`text-[10px] ${
                                  isSelected ? 'text-[#8baf9f]' : 'text-[#5d8b7b]'
                                }`}
                              >
                                {opt.hint}
                              </span>
                            </div>
                            {isSelected && (
                              <svg
                                className="w-4 h-4 text-[#8baf9f] shrink-0 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Tipe Lantai Dropdown / Dropup */}
                <div className="relative">
                  <button
                    type="button"
                    data-dropdown-trigger="tipe"
                    onClick={(e) => toggleDropdown('tipe', e.currentTarget)}
                    className={`px-3 py-2 sm:py-2.5 rounded-2xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs border cursor-pointer select-none ${
                      selectedFloor !== 'semua'
                        ? 'bg-[#081613] text-white border-[#081613]'
                        : 'bg-white text-[#16362f] border-[#dde8e2] hover:bg-[#ebf2ee] hover:border-[#8baf9f]'
                    }`}
                    aria-expanded={openDropdown === 'tipe'}
                    aria-haspopup="menu"
                    title={selectedFloor !== 'semua' ? `Tipe: ${selectedFloor} Lantai` : 'Filter Tipe Lantai'}
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{selectedFloor === 'semua' ? 'Tipe' : `${selectedFloor} Lantai`}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openDropdown === 'tipe'
                          ? dropdownDirection['tipe'] === 'up'
                            ? ''
                            : 'rotate-180'
                          : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {dropdownDirection['tipe'] === 'up' && openDropdown === 'tipe' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      )}
                    </svg>
                  </button>

                  {openDropdown === 'tipe' && (
                    <div
                      data-dropdown-menu="tipe"
                      className={`absolute left-0 ${
                        dropdownDirection['tipe'] === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
                      } z-50 w-52 bg-white/98 backdrop-blur-md rounded-2xl border border-[#dde8e2] shadow-reome-card shadow-xl p-1.5 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100`}
                      role="menu"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#477769] border-b border-[#dde8e2]/60 mb-1">
                        Pilih Tipe Lantai
                      </div>
                      {FLOOR_OPTIONS.map((opt) => {
                        const isSelected = selectedFloor === opt.value;
                        return (
                          <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => {
                              handleFloorChange(opt.value);
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#081613] text-white shadow-xs'
                                : 'text-[#16362f] hover:bg-[#ebf2ee] hover:text-[#081613]'
                            }`}
                            role="menuitem"
                          >
                            <div className="flex flex-col text-left">
                              <span className="font-bold">{opt.label}</span>
                              <span
                                className={`text-[10px] ${
                                  isSelected ? 'text-[#8baf9f]' : 'text-[#5d8b7b]'
                                }`}
                              >
                                {opt.hint}
                              </span>
                            </div>
                            {isSelected && (
                              <svg
                                className="w-4 h-4 text-[#8baf9f] shrink-0 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Cicilan Dropdown / Dropup */}
                <div className="relative">
                  <button
                    type="button"
                    data-dropdown-trigger="cicilan"
                    onClick={(e) => toggleDropdown('cicilan', e.currentTarget)}
                    className={`px-3 py-2 sm:py-2.5 rounded-2xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs border cursor-pointer select-none ${
                      selectedCicilan !== 'semua'
                        ? 'bg-[#081613] text-white border-[#081613]'
                        : 'bg-white text-[#16362f] border-[#dde8e2] hover:bg-[#ebf2ee] hover:border-[#8baf9f]'
                    }`}
                    aria-expanded={openDropdown === 'cicilan'}
                    aria-haspopup="menu"
                    title={
                      selectedCicilan !== 'semua'
                        ? `Cicilan: ${
                            selectedCicilan === 'dibawah-2jt'
                              ? '< 2 Jt/bln'
                              : selectedCicilan === '2jt-3jt'
                              ? '2–3 Jt/bln'
                              : '> 3 Jt/bln'
                          }`
                        : 'Filter Rentang Cicilan'
                    }
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>
                      {selectedCicilan === 'semua'
                        ? 'Cicilan'
                        : selectedCicilan === 'dibawah-2jt'
                        ? '< 2 Jt/bln'
                        : selectedCicilan === '2jt-3jt'
                        ? '2–3 Jt/bln'
                        : '> 3 Jt/bln'}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openDropdown === 'cicilan'
                          ? dropdownDirection['cicilan'] === 'up'
                            ? ''
                            : 'rotate-180'
                          : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {dropdownDirection['cicilan'] === 'up' && openDropdown === 'cicilan' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      )}
                    </svg>
                  </button>

                  {openDropdown === 'cicilan' && (
                    <div
                      data-dropdown-menu="cicilan"
                      className={`absolute right-0 ${
                        dropdownDirection['cicilan'] === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
                      } z-50 w-56 bg-white/98 backdrop-blur-md rounded-2xl border border-[#dde8e2] shadow-reome-card shadow-xl p-1.5 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100`}
                      role="menu"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#477769] border-b border-[#dde8e2]/60 mb-1">
                        Pilih Rentang Cicilan
                      </div>
                      {CICILAN_OPTIONS.map((opt) => {
                        const isSelected = selectedCicilan === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              handleCicilanChange(opt.value);
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#081613] text-white shadow-xs'
                                : 'text-[#16362f] hover:bg-[#ebf2ee] hover:text-[#081613]'
                            }`}
                            role="menuitem"
                          >
                            <div className="flex flex-col text-left">
                              <span className="font-bold">{opt.label}</span>
                              <span
                                className={`text-[10px] ${
                                  isSelected ? 'text-[#8baf9f]' : 'text-[#5d8b7b]'
                                }`}
                              >
                                {opt.hint}
                              </span>
                            </div>
                            {isSelected && (
                              <svg
                                className="w-4 h-4 text-[#8baf9f] shrink-0 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile: Unified Filter Dropdown Trigger Button (< md) */}
              <div className="flex md:hidden items-center shrink-0">
                <button
                  type="button"
                  data-dropdown-trigger="mobile-filter"
                  onClick={(e) => toggleDropdown('mobile-filter', e.currentTarget)}
                  className={`px-3 py-2 rounded-2xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs border cursor-pointer select-none ${
                    activeFilterCount > 0
                      ? 'bg-[#081613] text-white border-[#081613]'
                      : 'bg-white text-[#16362f] border-[#dde8e2] hover:bg-[#ebf2ee]'
                  }`}
                  aria-label="Buka filter properti"
                  aria-expanded={openDropdown === 'mobile-filter'}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#8baf9f] text-[#081613] text-[10px] font-black inline-flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === 'mobile-filter' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right: Counter & Quick Reset on Desktop/Tablet */}
            <div className="hidden sm:flex items-center gap-2 shrink-0 text-xs text-[#477769] font-medium select-none">
              <span>
                Menampilkan{' '}
                <strong className="font-black text-[#081613]">
                  {filteredProperties.length}
                </strong>{' '}
                unit klaster
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-1.5 font-bold text-[#3a6356] hover:text-[#081613] underline transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Mobile Custom Dropup Drawer / Bottom Sheet */}
            {openDropdown === 'mobile-filter' && (
                <>
                  {/* Backdrop overlay */}
                  <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity md:hidden"
                    onClick={() => setOpenDropdown(null)}
                    aria-hidden="true"
                  />

                  {/* Drawer dialog */}
                  <div
                    data-dropdown-menu="mobile-filter"
                    className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white border-t border-[#dde8e2] shadow-2xl p-4 sm:p-5 max-h-[85vh] overflow-y-auto md:hidden animate-in slide-in-from-bottom duration-200"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Filter Options"
                  >
                    {/* Pull Bar */}
                    <div className="w-10 h-1 rounded-full bg-[#dde8e2] mx-auto mb-3.5" />

                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#dde8e2]">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#081613] text-sm">Filter Properti</span>
                        {activeFilterCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#081613] text-[#dde8e2] text-[10px] font-bold">
                            {activeFilterCount} aktif
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {activeFilterCount > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              handleCityChange('semua');
                              handleFloorChange('semua');
                              handleCicilanChange('semua');
                            }}
                            className="text-xs font-bold text-[#3a6356] hover:text-[#081613] underline cursor-pointer"
                          >
                            Reset Filter
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(null)}
                          className="p-1 rounded-full text-[#5d8b7b] hover:text-[#081613] hover:bg-[#ebf2ee] transition-colors"
                          aria-label="Tutup filter"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="py-3 space-y-4 text-xs">
                      {/* Kota Filter Section */}
                      <div>
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#477769] mb-1.5">
                          Wilayah / Kota
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {CITY_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleCityChange(opt.value)}
                              className={`py-2 px-2 rounded-xl font-bold text-xs text-center transition-all cursor-pointer ${
                                selectedCity === opt.value
                                  ? 'bg-[#081613] text-white shadow-xs'
                                  : 'bg-[#f7faf8] text-[#16362f] border border-[#dde8e2] hover:bg-[#ebf2ee]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tipe Lantai Section */}
                      <div>
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#477769] mb-1.5">
                          Tipe Lantai
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {FLOOR_OPTIONS.map((opt) => (
                            <button
                              key={String(opt.value)}
                              type="button"
                              onClick={() => handleFloorChange(opt.value)}
                              className={`py-2 px-2 rounded-xl font-bold text-xs text-center transition-all cursor-pointer ${
                                selectedFloor === opt.value
                                  ? 'bg-[#081613] text-white shadow-xs'
                                  : 'bg-[#f7faf8] text-[#16362f] border border-[#dde8e2] hover:bg-[#ebf2ee]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cicilan Promo Section */}
                      <div>
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#477769] mb-1.5">
                          Cicilan Promo
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {CICILAN_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleCicilanChange(opt.value)}
                              className={`py-2 px-2.5 rounded-xl font-bold text-xs text-center transition-all cursor-pointer ${
                                selectedCicilan === opt.value
                                  ? 'bg-[#081613] text-white shadow-xs'
                                  : 'bg-[#f7faf8] text-[#16362f] border border-[#dde8e2] hover:bg-[#ebf2ee]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Apply Button */}
                    <div className="pt-3 border-t border-[#dde8e2]">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(null)}
                        className="w-full py-3 rounded-xl bg-[#081613] hover:bg-[#16362f] text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Lihat {filteredProperties.length} Unit Klaster</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Quick Filter Chips */}
            <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => handleCityChange('semua')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  selectedCity === 'semua'
                    ? 'bg-[#081613] text-white shadow-xs'
                    : 'bg-white text-[#16362f] border border-[#dde8e2] hover:bg-[#ebf2ee]'
                }`}
              >
                Semua Kota
              </button>
              <button
                type="button"
                onClick={() => handleCityChange(selectedCity === 'Surabaya' ? 'semua' : 'Surabaya')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  selectedCity === 'Surabaya'
                    ? 'bg-[#081613] text-white shadow-xs'
                    : 'bg-white text-[#16362f] border border-[#dde8e2] hover:bg-[#ebf2ee]'
                }`}
              >
                📍 Surabaya
              </button>
              <button
                type="button"
                onClick={() => handleCityChange(selectedCity === 'Sidoarjo' ? 'semua' : 'Sidoarjo')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  selectedCity === 'Sidoarjo'
                    ? 'bg-[#081613] text-white shadow-xs'
                    : 'bg-white text-[#16362f] border border-[#dde8e2] hover:bg-[#ebf2ee]'
                }`}
              >
                📍 Sidoarjo
              </button>
              <button
                type="button"
                onClick={() => handleFloorChange(selectedFloor === 1 ? 'semua' : 1)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  selectedFloor === 1
                    ? 'bg-[#081613] text-white shadow-xs'
                    : 'bg-white text-[#16362f] border border-[#dde8e2] hover:bg-[#ebf2ee]'
                }`}
              >
                🏠 1 Lantai
              </button>
              <button
                type="button"
                onClick={() => handleFloorChange(selectedFloor === 2 ? 'semua' : 2)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  selectedFloor === 2
                    ? 'bg-[#081613] text-white shadow-xs'
                    : 'bg-white text-[#16362f] border border-[#dde8e2] hover:bg-[#ebf2ee]'
                }`}
              >
                🏠 2 Lantai
              </button>
              <button
                type="button"
                onClick={() => handleCicilanChange(selectedCicilan === 'dibawah-2jt' ? 'semua' : 'dibawah-2jt')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  selectedCicilan === 'dibawah-2jt'
                    ? 'bg-[#081613] text-white shadow-xs'
                    : 'bg-white text-[#16362f] border border-[#dde8e2] hover:bg-[#ebf2ee]'
                }`}
              >
                💳 &lt; 2 Jt/bln
              </button>
            </div>

            {/* Mobile-only counter (desktop has counter docked in the main row) */}
            <div className="flex sm:hidden items-center justify-between text-xs text-[#477769] pt-1 border-t border-[#dde8e2]/60">
              <span>
                <strong className="font-extrabold text-[#081613]">
                  {filteredProperties.length}
                </strong>{' '}
                unit klaster ditemukan
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="font-bold text-[#3a6356] hover:text-[#081613] underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Property Grid Results */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7 sm:mt-10 md:mt-12">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-9">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  basePath={basePath}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-14 sm:py-20 px-4 bg-white rounded-3xl border border-[#dde8e2] shadow-reome-card max-w-xl mx-auto my-6">
              <div className="w-14 h-14 rounded-full bg-[#ebf2ee] text-[#16362f] flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#081613] tracking-tight">
                Tidak Ada Unit yang Cocok
              </h3>
              <p className="text-xs sm:text-sm text-[#477769] mt-2 max-w-md mx-auto leading-relaxed">
                Kami tidak menemukan klaster yang memenuhi kriteria pencarian Anda. Coba hapus sebagian filter atau tanyakan unit rekomendasi khusus langsung ke tim analis kami.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold bg-[#ebf2ee] text-[#081613] hover:bg-[#dde8e2] transition-all"
                >
                  Reset Semua Filter
                </button>
                <a
                  href={consultationWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-black bg-[#081613] text-white hover:bg-[#16362f] transition-all shadow-md active:scale-95"
                >
                  Tanya Mbak Ningsih via WhatsApp
                </a>
              </div>
            </div>
          )}
        </section>

        {/* Bottom Fast Assistance Card */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
          <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-[#081613] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-[#16362f] text-[#dde8e2] mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#8baf9f] animate-pulse" />
                Layanan Khusus Konsumen
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                Butuh Bantuan Cek Lokasi atau Simulasi KPR?
              </h3>
              <p className="text-xs sm:text-sm text-[#dde8e2]/80 mt-1.5 max-w-xl font-normal leading-relaxed">
                Mau saya temenin cek lokasinya kak? Tim analis Tiar Property siap mendampingi survei langsung dan mengawal pengajuan berkas KPR sampai disetujui 100%.
              </p>
            </div>
            <a
              href={consultationWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-black bg-white text-[#081613] hover:bg-[#dde8e2] transition-all shadow-md active:scale-95 w-full md:w-auto"
            >
              <span>Mau Saya Temenin Cek Lokasi?</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp Quick Action */}
      <FloatingWhatsApp />

      <Footer />
    </div>
  );
}
