'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, MapPin, Building2, CreditCard, Layers, ArrowRight } from 'lucide-react';
import { TIAR_PROPERTIES } from '@/data/properties';

export type QuickFilterKey = 'all' | 'sidoarjo' | 'surabaya' | 'under2' | '2floor';

interface SearchFilterBarProps {
  activeFilter?: QuickFilterKey;
  onFilterChange?: (filter: QuickFilterKey) => void;
}

const FILTER_OPTIONS: {
  key: QuickFilterKey;
  label: string;
  countSuffix?: boolean;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  fallbackHref: string;
}[] = [
  {
    key: 'all',
    label: 'Semua Klaster',
    countSuffix: true,
    icon: Home,
    fallbackHref: '/properti',
  },
  {
    key: 'sidoarjo',
    label: 'Sidoarjo & Juanda',
    icon: MapPin,
    fallbackHref: '/properti?kota=Sidoarjo',
  },
  {
    key: 'surabaya',
    label: 'Surabaya MERR & Barat',
    icon: Building2,
    fallbackHref: '/properti?kota=Surabaya',
  },
  {
    key: 'under2',
    label: 'Cicilan < Rp 2 Jt',
    icon: CreditCard,
    fallbackHref: '/properti?cicilan=dibawah-2jt',
  },
  {
    key: '2floor',
    label: 'Rumah 2 Lantai',
    icon: Layers,
    fallbackHref: '/properti?tipe=2',
  },
];

export function SearchFilterBar({
  activeFilter = 'all',
  onFilterChange,
}: SearchFilterBarProps) {
  const router = useRouter();
  const totalCount = TIAR_PROPERTIES.length;

  const handleClick = (key: QuickFilterKey, fallbackHref: string) => {
    if (onFilterChange) {
      onFilterChange(key);
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <div className="pt-5 border-t border-[#C5BEB4] flex flex-col gap-4">
      <div
        role="group"
        aria-label="Saring klaster cepat"
        className="flex flex-wrap items-center gap-2"
      >
        {FILTER_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = activeFilter === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => handleClick(option.key, option.fallbackHref)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border text-sm font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] motion-reduce:transition-none cursor-pointer active:scale-[0.97] ${
                isActive
                  ? 'bg-[#38352C] text-[#E8E4E1] border-[#38352C]'
                  : 'bg-[#E8E4E1] text-[#38352C] border-[#C5BEB4] hover:border-[#38352C] hover:bg-[#FAF8F5]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.6} aria-hidden="true" />
              <span className="num-clean">
                {option.label}
                {option.countSuffix ? ` (${totalCount})` : ''}
              </span>
            </button>
          );
        })}

        <Link
          href="/properti"
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full text-sm font-medium text-[#57534A] hover:text-[#38352C] underline underline-offset-4 decoration-[#C5BEB4] hover:decoration-[#38352C] whitespace-nowrap transition-colors"
        >
          <span>Filter Lanjut</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
