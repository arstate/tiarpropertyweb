import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import type { PropertyUnit } from '@/data/properties';
import { buildMainWaUrl } from '@/data/properties';

interface PropertyCardProps {
  property: PropertyUnit;
  basePath?: string;
  aspectVariant?: 'wide' | 'tall' | 'standard';
}

export function PropertyCard({
  property,
  basePath = '/properti',
  aspectVariant = 'standard',
}: PropertyCardProps) {
  const detailHref = `${basePath}/${property.id}`;
  const waHref = buildMainWaUrl(
    `Halo Mbak Ningsih, saya tertarik dengan klaster "${property.codeName}" (${property.locationAreaShort}) harga mulai ${property.priceStart}. Boleh minta tolong ditemenin survei lokasinya kak?`
  );

  const aspectClass =
    aspectVariant === 'wide'
      ? 'aspect-[4/3] sm:aspect-[16/10]'
      : aspectVariant === 'tall'
      ? 'aspect-[4/3] lg:aspect-[4/5]'
      : 'aspect-[4/3]';

  return (
    <article className="group flex flex-col gap-4 min-w-0">
      <Link
        href={detailHref}
        className={`relative block overflow-hidden rounded-xl bg-[#E8E4E1] ring-1 ring-inset ring-[#38352C]/14 group-hover:ring-[#38352C]/40 transition-colors ${aspectClass}`}
      >
        <img
          src={property.imageUrl}
          alt={`Fasad ${property.codeName} di ${property.locationAreaShort}`}
          width={1200}
          height={900}
          decoding="async"
          className="w-full h-full object-cover"
        />
        {property.status === 'reserved' && (
          <span className="num-clean absolute top-3 left-3 px-3 py-1 rounded-full bg-[#38352C]/90 text-[#FFCA4F] text-xs font-medium">
            Unit Terbatas
          </span>
        )}
        {property.status === 'sold' && (
          <span className="num-clean absolute top-3 left-3 px-3 py-1 rounded-full bg-[#38352C]/90 text-[#E8E4E1] text-xs font-medium">
            Terjual
          </span>
        )}
      </Link>

      {/* Meta Top Row with Hairline Rule */}
      <div className="flex items-baseline justify-between gap-3 pb-2.5 border-b border-[#C5BEB4]">
        <h3 className="font-display font-medium text-[clamp(1.45rem,2.1vw,1.95rem)] leading-[1.15] text-[#38352C] min-w-0">
          <Link href={detailHref} className="hover:underline underline-offset-4 decoration-[#C5BEB4]">
            {property.codeName}
          </Link>
        </h3>
        <span className="mono-num text-sm font-medium text-[#38352C] whitespace-nowrap shrink-0">
          {property.priceStart}
        </span>
      </div>

      {/* Specs & Promo Row (0% Serif Numerals) */}
      <div className="flex flex-col gap-1.5 text-sm text-[#57534A]">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span>{property.locationAreaShort}</span>
          <div className="num-clean flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px]">
            <span>{property.specs.bedrooms} KT</span>
            <span aria-hidden="true" className="text-[#C5BEB4]">/</span>
            <span>{property.specs.bathrooms} KM</span>
            <span aria-hidden="true" className="text-[#C5BEB4]">/</span>
            <span>LT {property.specs.luasTanah}</span>
            <span aria-hidden="true" className="text-[#C5BEB4]">/</span>
            <span>LB {property.specs.luasBangunan}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px]">
          <span className="num-clean font-medium text-[#38352C]">
            Cicilan {property.cicilanPromo}
          </span>
          <span className="num-clean text-[#57534A]">
            {property.utjAmount} | {property.floors} Lantai
          </span>
        </div>
      </div>

      {/* Clean Action Row (>= 44px touch targets, single line) */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Link
          href={detailHref}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-full border border-[#C5BEB4] bg-transparent text-[#38352C] text-sm font-medium hover:bg-[#E8E4E1] hover:border-[#38352C] active:scale-[0.97] transition-[background-color,border-color,transform] motion-reduce:transition-none whitespace-nowrap"
        >
          <span>Lihat Detail Unit</span>
          <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.6} aria-hidden="true" />
        </Link>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-full bg-[#E8E4E1] text-[#38352C] border border-transparent text-sm font-medium hover:bg-[#38352C] hover:text-[#E8E4E1] active:scale-[0.97] transition-[background-color,color,transform] motion-reduce:transition-none whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 shrink-0" strokeWidth={1.6} aria-hidden="true" />
          <span>Tanya Unit</span>
        </a>
      </div>
    </article>
  );
}
