import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Tiar Property | Hunian Eksklusif Surabaya & Sidoarjo',
  description:
    'Temukan hunian impian di Sukodono, Juanda, dan Surabaya. Promo DP 0%, Free Semua Biaya, dan Subsidi Angsuran Rp 1,4 Juta. Pendampingan KPR resmi.',
  keywords: [
    'rumah mewah sidoarjo',
    'rumah dp 0 surabaya',
    'kpr sukodono',
    'rumah dekat juanda',
    'tiar property',
  ],
  authors: [{ name: 'Tiar Property' }],
  openGraph: {
    title: 'Tiar Property | Rumah DP 0% & All-In Free Surabaya-Sidoarjo',
    description: 'Cukup UTJ 1–2 Jt Langsung Berkas KPR. Subsidi Angsuran Rp 1,4 Jt x 6 Bulan. Pendampingan 100% sampai ACC.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Tiar Property',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f2c26',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`scroll-smooth ${playfair.variable}`}>
      <body className="min-h-screen bg-[#faf9f6] text-[#1c2522] antialiased selection:bg-[#163e36] selection:text-[#f8f4ec]">
        <Navbar />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
