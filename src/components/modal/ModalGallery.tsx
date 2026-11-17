'use client';

import React, { useRef, useState } from 'react';

interface ModalGalleryProps {
  images: string[];
  title: string;
}

interface GalleryDockProps {
  images: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function GalleryDock({ images, activeIndex, onSelect }: GalleryDockProps) {
  if (images.length <= 1) return null;
  return (
    <div className="hidden md:flex absolute bottom-4 inset-x-4 z-20 items-center justify-between gap-3 pointer-events-auto">
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#081613]/70 backdrop-blur-md border border-white/15 shadow-2xl">
        {images.map((imgUrl, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`relative w-12 h-9 rounded-xl overflow-hidden transition-all duration-200 ${
              activeIndex === idx ? 'ring-2 ring-white scale-105 shadow-md opacity-100' : 'opacity-55 hover:opacity-90'
            }`}
            aria-label={`Foto ${idx + 1}`}
          >
            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      <div className="px-3 py-1.5 rounded-full bg-[#081613]/70 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-2xl">
        Foto {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
}

function NavArrows({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-10">
      <button
        onClick={onPrev}
        className="pointer-events-auto w-8 h-8 rounded-full bg-[#081613]/60 hover:bg-[#081613]/90 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-95 border border-white/15"
        aria-label="Foto sebelumnya"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={onNext}
        className="pointer-events-auto w-8 h-8 rounded-full bg-[#081613]/60 hover:bg-[#081613]/90 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-95 border border-white/15"
        aria-label="Foto selanjutnya"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

function MobileCarousel({ images, title, activeIndex, scrollRef, onScroll }: {
  images: string[]; title: string; activeIndex: number;
  scrollRef: React.RefObject<HTMLDivElement | null>; onScroll: () => void;
}) {
  return (
    <div className="md:hidden relative w-full aspect-[4/3] bg-[#081613] overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar w-full h-full overscroll-x-contain"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        {images.map((imgUrl, idx) => (
          <div key={idx} className="snap-center shrink-0 w-full h-full relative">
            <img
              src={imgUrl}
              alt={`${title} foto ${idx + 1}`}
              draggable={false}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081613]/70 via-transparent to-black/20 pointer-events-none" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 pointer-events-none">
          Foto {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

function DesktopShowcase({ images, title, activeIndex, onSelect }: {
  images: string[]; title: string; activeIndex: number; onSelect: (idx: number) => void;
}) {
  const prev = () => onSelect((activeIndex - 1 + images.length) % images.length);
  const next = () => onSelect((activeIndex + 1) % images.length);
  return (
    <div className="hidden md:block relative w-full h-full min-h-[460px] flex-1">
      <img src={images[activeIndex]} alt={`${title} foto ${activeIndex + 1}`} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#081613]/90 via-[#081613]/20 to-black/30 pointer-events-none" />
      {images.length > 1 && <NavArrows onPrev={prev} onNext={next} />}
      <GalleryDock images={images} activeIndex={activeIndex} onSelect={onSelect} />
    </div>
  );
}

export function ModalGallery({ images, title }: ModalGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || el.clientWidth <= 0) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== activeIndex && idx >= 0 && idx < images.length) setActiveIndex(idx);
  };

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
    scrollRef.current?.scrollTo({ left: idx * (scrollRef.current?.clientWidth || 0), behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-auto md:h-full flex flex-col bg-[#081613]">
      <MobileCarousel images={images} title={title} activeIndex={activeIndex} scrollRef={scrollRef} onScroll={handleScroll} />
      <DesktopShowcase images={images} title={title} activeIndex={activeIndex} onSelect={handleSelect} />
    </div>
  );
}
