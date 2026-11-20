'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { buildMainWaUrl } from '@/data/properties';

export function FloatingWhatsApp() {
  const pathname = usePathname();

  if (pathname === '/admin' || pathname?.startsWith('/admin/')) {
    return null;
  }

  const waUrl = buildMainWaUrl();

  return (
    <aside
      aria-label="WhatsApp Konsultan Tiar Property"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 hidden md:flex items-center gap-3"
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:inline-flex items-center gap-2.5 min-h-[44px] px-4 rounded-full bg-[#FAF8F5]/95 backdrop-blur-md border border-[#C5BEB4] text-xs font-medium text-[#38352C] shadow-[0_8px_24px_rgba(20,18,14,0.12)] hover:bg-[#E8E4E1] transition-colors whitespace-nowrap"
      >
        <span className="w-2 h-2 rounded-full bg-[#82886E] shrink-0" aria-hidden="true" />
        <span>Mau saya temenin cek lokasi kak?</span>
      </a>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Mbak Ningsih"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#38352C] text-[#FFCA4F] border border-[#E8E4E1]/15 flex items-center justify-center shadow-[0_12px_32px_rgba(20,18,14,0.28)] hover:bg-[#28251E] hover:scale-105 active:scale-95 transition-[background-color,transform] motion-reduce:transition-none"
      >
        <MessageCircle className="w-6 h-6" strokeWidth={1.75} aria-hidden="true" />
      </a>
    </aside>
  );
}
