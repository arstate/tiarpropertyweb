import React from 'react';
import Link from 'next/link';
import { PropertyUnit } from '@/data/properties';

interface PropertyCardProps {
  property: PropertyUnit;
  onSelect?: (property: PropertyUnit) => void;
  basePath?: '/properti' | '/produk';
}

/**
 * Pure borderless property card matching Reome visual layout.
 * Single Responsibility: Render single listing with 4:3 photo, badges, 2-column inline metadata, and star rating.
 * Accessible with Link wrapper supporting direct navigation, new tab, and crawlability.
 */
export function PropertyCard({ property, basePath = '/properti' }: PropertyCardProps) {
  return (
    <Link
      href={`${basePath}/${property.id}`}
      className="group block cursor-pointer transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16362f] rounded-2xl"
    >
      {/* 4:3 Standalone Rounded Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#e6eeea]">
        <img
          src={property.imageUrl}
          alt={property.codeName}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#081613]/85 backdrop-blur-md text-white border border-white/20 shadow-xs">
            {property.city} • {property.floors} Lantai
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#16362f]/90 backdrop-blur-md text-white border border-white/20 shadow-xs">
            {property.utjAmount}
          </span>
        </div>
      </div>

      {/* 2-Column Inline Metadata (Exact Reome Structure) */}
      <div className="mt-3.5 space-y-1 px-0.5">
        {/* Row 1: Title & Key Metric */}
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base sm:text-lg text-[#081613] tracking-tight group-hover:text-[#16362f] transition-colors">
            {property.codeName}
          </h3>
          <span className="font-extrabold text-xs sm:text-sm text-[#081613] flex items-center gap-1.5">
            {property.specs.luasTanah}
            <svg className="w-3.5 h-3.5 text-[#5d8b7b] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </span>
        </div>

        {/* Row 2: Location Subtitle & Pricing */}
        <div className="flex items-center justify-between text-xs text-[#477769] font-medium">
          <span className="truncate max-w-[180px]">{property.locationAreaShort}</span>
          <div className="text-right flex items-center gap-1.5">
            <span className="text-[11px] text-[#8baf9f] line-through font-normal">
              {property.priceStrikethrough}
            </span>
            <span className="font-extrabold text-sm text-[#081613]">
              {property.priceStart}
            </span>
          </div>
        </div>

        {/* Row 3: Room Specs (KT • KM) & Cicilan */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <span className="font-semibold text-[#5d8b7b] flex items-center gap-1.5">
            <span>{property.specs.bedrooms} KT</span>
            <span className="text-[#8baf9f]">•</span>
            <span>{property.specs.bathrooms} KM</span>
          </span>
          <span className="font-bold text-[#081613]">
            {property.cicilanPromo}
          </span>
        </div>
      </div>
    </Link>
  );
}
