import React from 'react';
import { PropertyUnit } from '@/data/properties';

interface ModalInfoProps {
  property: PropertyUnit;
}

function InfoHeader({ property }: { property: PropertyUnit }) {
  return (
    <div className="pr-10 sm:pr-12">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ebf2ee] text-[#1b3b30] text-[11px] font-bold mb-2">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        <span>{property.locationAreaShort}</span>
      </div>
      <h3 className="text-xl sm:text-2xl font-black text-[#081613] tracking-tight leading-tight">
        {property.codeName}
      </h3>
      <p className="text-xs text-[#477769] mt-1">{property.locationArea}</p>
    </div>
  );
}

function PricingPromoRow({ subsidiInfo, utjAmount }: { subsidiInfo?: string; utjAmount: string }) {
  if (!subsidiInfo) return null;
  return (
    <div className="mt-3 pt-2.5 border-t border-[#f0f5f2] flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
      <div className="flex items-center gap-1.5 text-[#1b3b30] font-semibold text-[11px] sm:text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3a6356] shrink-0" />
        <span>{subsidiInfo}</span>
      </div>
      <span className="text-[10px] font-bold text-[#1b3b30] bg-[#ebf2ee] px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">{utjAmount}</span>
    </div>
  );
}

function InfoPricingCard({ property }: { property: PropertyUnit }) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-[#dde8e2] shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8baf9f] block">Harga Mulai</span>
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mt-1">
            <span className="text-xl sm:text-2xl font-black text-[#081613] tracking-tight whitespace-nowrap">{property.priceStart}</span>
            <span className="text-xs text-[#8baf9f] line-through font-semibold whitespace-nowrap">{property.priceStrikethrough}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3a6356] block">Cicilan Promo</span>
          <span className="text-base sm:text-lg font-black text-[#1b3b30] block mt-1 whitespace-nowrap">{property.cicilanPromo}</span>
        </div>
      </div>
      <PricingPromoRow subsidiInfo={property.subsidiInfo} utjAmount={property.utjAmount} />
    </div>
  );
}

function InfoSpecsGrid({ property }: { property: PropertyUnit }) {
  const specs = [
    { label: 'Luas Tanah', val: property.specs.luasTanah },
    { label: 'Luas Bangunan', val: property.specs.luasBangunan },
    { label: 'Kamar Tidur', val: `${property.specs.bedrooms} Ruang` },
    { label: 'Kamar Mandi', val: `${property.specs.bathrooms} Ruang` },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-2 text-center">
      {specs.map((item, idx) => (
        <div key={idx} className="px-2 py-2.5 rounded-2xl bg-white border border-[#dde8e2] flex flex-col items-center justify-center min-w-0">
          <span className="text-xs sm:text-sm font-black text-[#081613] block whitespace-nowrap">{item.val}</span>
          <span className="text-[10px] sm:text-[11px] text-[#477769] font-medium block whitespace-nowrap tracking-tight mt-0.5">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function InfoFeaturesList({ features }: { features: string[] }) {
  return (
    <div>
      <h4 className="text-[11px] font-black text-[#081613] uppercase tracking-wider mb-2.5">Fasilitas & Keunggulan Klaster</h4>
      <ul className="space-y-2 text-xs text-[#16362f]">
        {features.map((feat, idx) => (
          <li key={idx} className="flex items-center gap-2.5">
            <span className="w-4 h-4 rounded-full bg-[#ebf2ee] text-[#1b3b30] flex items-center justify-center shrink-0">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="font-medium">{feat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ModalInfo({ property }: ModalInfoProps) {
  return (
    <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 pb-8 sm:pb-8">
      <InfoHeader property={property} />
      <InfoPricingCard property={property} />
      <InfoSpecsGrid property={property} />
      <InfoFeaturesList features={property.features} />
    </div>
  );
}
