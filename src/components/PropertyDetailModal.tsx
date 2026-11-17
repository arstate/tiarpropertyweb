'use client';

import React, { useEffect } from 'react';
import { PropertyUnit } from '@/data/properties';
import { getAgentById, getAgentForProperty, buildAgentWaUrl } from '@/data/agents';
import { ModalGallery } from '@/components/modal/ModalGallery';
import { ModalInfo } from '@/components/modal/ModalInfo';

interface ModalProps {
  property: PropertyUnit | null;
  onClose: () => void;
}

function useModalLock(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);
}

function ModalCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute top-[max(0.875rem,env(safe-area-inset-top))] right-3.5 md:top-6 md:right-6 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white md:bg-[#ebf2ee] md:hover:bg-[#dde8e2] md:text-[#081613] md:border md:border-[#dde8e2] flex items-center justify-center backdrop-blur-md transition-all shadow-sm active:scale-95"
      aria-label="Tutup"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

function ModalBottomBar({ waUrl }: { waUrl: string }) {
  return (
    <div className="p-4 sm:p-5 border-t border-[#dde8e2] bg-white flex items-center justify-between gap-3 shrink-0 shadow-[0_-4px_16px_rgba(8,22,19,0.04)] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="hidden sm:block">
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#3a6356] block">Layanan Konsumen</span>
        <span className="text-xs font-black text-[#081613]">Kawal KPR 100% ACC</span>
      </div>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-black bg-[#081613] text-white hover:bg-[#16362f] transition-all text-center shadow-md active:scale-95"
      >
        Mau Saya Temenin Cek Lokasi?
      </a>
    </div>
  );
}

function getWaUrl(property: PropertyUnit) {
  const assignedAgent = property.assignedAgentId
    ? getAgentById(property.assignedAgentId) || getAgentForProperty(property.id)
    : getAgentForProperty(property.id);
  return buildAgentWaUrl(assignedAgent, { propertyName: property.codeName });
}

function ModalCard({ property, gallery, onClose }: { property: PropertyUnit; gallery: string[]; onClose: () => void }) {
  const waUrl = getWaUrl(property);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full h-full md:h-[620px] md:max-h-[88vh] max-w-5xl bg-[#f7faf8] md:rounded-3xl shadow-2xl overflow-hidden border-0 md:border md:border-[#dde8e2] flex flex-col md:grid md:grid-cols-12"
    >
      <ModalCloseButton onClose={onClose} />

      {/* MOBILE: Seluruh konten (Galeri foto di paling atas + Deskripsi info di bawahnya) kescroll bersamaan dalam 1 native scroll container */}
      <div
        className="md:hidden flex-1 overflow-y-auto overscroll-contain min-h-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <ModalGallery images={gallery} title={property.codeName} />
        <ModalInfo property={property} />
      </div>
      <div className="md:hidden shrink-0">
        <ModalBottomBar waUrl={waUrl} />
      </div>

      {/* DESKTOP: Grid 2 Kolom (Kiri Galeri, Kanan Info kescroll mandiri) */}
      <div className="hidden md:block md:col-span-6 h-full overflow-hidden">
        <ModalGallery images={gallery} title={property.codeName} />
      </div>
      <div className="hidden md:flex md:col-span-6 h-full flex-col justify-between overflow-hidden bg-[#f7faf8]">
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
          <ModalInfo property={property} />
        </div>
        <ModalBottomBar waUrl={waUrl} />
      </div>
    </div>
  );
}

export function PropertyDetailModal({ property, onClose }: ModalProps) {
  useModalLock(Boolean(property), onClose);
  if (!property) return null;
  const gallery = property.galleryImages?.length ? property.galleryImages : [property.imageUrl];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center md:p-6 bg-[#081613]/75 backdrop-blur-sm animate-in fade-in duration-200 overscroll-contain"
    >
      <ModalCard property={property} gallery={gallery} onClose={onClose} />
    </div>
  );
}
