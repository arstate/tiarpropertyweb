import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { PropertiCatalogView } from '@/components/PropertiCatalogView';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Katalog Produk & Rumah Pilihan | Tiar Property',
  description:
    'Temukan daftar lengkap produk klaster hunian modern di Surabaya & Sidoarjo. Promo DP 0%, Cukup UTJ 1–2 Jt Langsung Berkas KPR, Cicilan 1–2 Jt-an, All-In Bebas Seluruh Biaya.',
  keywords: [
    'produk tiar property',
    'katalog rumah surabaya',
    'katalog rumah sidoarjo',
    'rumah dp 0 sidoarjo',
    'tiar property',
  ],
  openGraph: {
    title: 'Katalog Produk & Rumah Pilihan | Tiar Property',
    description:
      'Pilihan lengkap unit rumah siap huni & inden di Surabaya & Sidoarjo. Promo DP 0%, Free BPHTB/KPR, Subsidi Angsuran 1,4 Jt.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Tiar Property',
  },
};

export default function ProdukPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f7faf8]">
          <div className="w-8 h-8 rounded-full border-2 border-[#16362f] border-t-transparent animate-spin" />
        </div>
      }
    >
      <PropertiCatalogView
        basePath="/produk"
        pageTitle="Katalog Produk & Rumah Pilihan"
      />
    </Suspense>
  );
}
