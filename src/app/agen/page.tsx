import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { AgentDirectoryView } from '@/components/AgentDirectoryView';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Direktori Konsultan & Agen Marketing Properti | Tiar Property',
  description:
    'Temukan konsultan properti resmi Tiar Property untuk wilayah Surabaya & Sidoarjo. Pendampingan survei lokasi 100% gratis, simulasi KPR promo DP 0%, dan kawal berkas ke 5 bank rekanan BUMN sampai ACC.',
  keywords: [
    'agen properti sidoarjo',
    'agen properti surabaya',
    'konsultan kpr surabaya',
    'survei rumah sukodono',
    'konsultan tiar property',
    'mbak ningsih tiar property',
  ],
  openGraph: {
    title: 'Direktori Konsultan & Agen Marketing Resmi | Tiar Property',
    description:
      'Pilih konsultan pendamping survei unit rumah impian Anda di Surabaya & Sidoarjo. Layanan survei gratis, simulasi KPR, dan kawal berkas 100% sampai ACC.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Tiar Property',
  },
};

export default function AgenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f7faf8]">
          <div className="w-8 h-8 rounded-full border-2 border-[#16362f] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AgentDirectoryView />
    </Suspense>
  );
}
