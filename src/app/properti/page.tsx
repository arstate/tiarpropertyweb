import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { PropertiCatalogView } from '@/components/PropertiCatalogView';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Katalog Lengkap Rumah & Klaster Pilihan | Tiar Property',
  description:
    'Temukan daftar lengkap klaster hunian modern di Surabaya & Sidoarjo. Promo DP 0%, Cukup UTJ 1–2 Jt Langsung Berkas KPR, Cicilan 1–2 Jt-an, All-In Bebas Seluruh Biaya.',
  keywords: [
    'katalog rumah surabaya',
    'katalog rumah sidoarjo',
    'rumah dp 0 sidoarjo',
    'rumah minimalis 2 lantai rungkut',
    'rumah dekat juanda',
    'tiar property katalog',
  ],
  openGraph: {
    title: 'Katalog Semua Rumah & Klaster Pilihan | Tiar Property',
    description:
      'Pilihan lengkap unit rumah siap huni & inden di Surabaya & Sidoarjo. Promo DP 0%, Free BPHTB/KPR, Subsidi Angsuran 1,4 Jt.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Tiar Property',
  },
};

export default function PropertiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1]">
          <div className="w-8 h-8 rounded-full border-2 border-[#38352C] border-t-transparent animate-spin" />
        </div>
      }
    >
      <PropertiCatalogView />
    </Suspense>
  );
}
