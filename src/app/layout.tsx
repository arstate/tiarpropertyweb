import type { Metadata } from 'next';
import { Cormorant_Garamond, Golos_Text, JetBrains_Mono } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
});

const golos = Golos_Text({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Tiar Property | Hunian Eksklusif Surabaya & Sidoarjo — DP 0% All-In Free',
  description:
    'Kurasi hunian strategis di Sukodono, Sedati Juanda, Waru, MERR, dan Surabaya Barat. Program DP 0%, UTJ mulai Rp 1 Juta, bebas biaya akad, dan pendampingan 5 bank BUMN hingga ACC.',
  keywords: [
    'rumah sidoarjo dp 0',
    'rumah surabaya dp 0',
    'kpr sukodono',
    'rumah dekat juanda',
    'tiar property',
  ],
  authors: [{ name: 'Tiar Property' }],
  openGraph: {
    title: 'Tiar Property | Hunian Surabaya & Sidoarjo DP 0% All-In Free',
    description:
      'Cukup UTJ Rp 1–5 Juta langsung proses berkas KPR. Bebas BPHTB, AJB, Notaris, dan subsidi angsuran Rp 1,4 Jt/bulan.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Tiar Property',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F1F1F1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`scroll-smooth ${cormorant.variable} ${golos.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-[#F1F1F1] text-[#38352C] antialiased selection:bg-[#FFCA4F] selection:text-[#38352C]">
        <Navbar />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
