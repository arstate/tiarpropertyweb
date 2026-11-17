import { Hero } from '@/components/Hero';
import { PropertyCatalog } from '@/components/PropertyCatalog';
import { HeroOffers } from '@/components/HeroOffers';
import { KprCalculator } from '@/components/KprCalculator';
import { ComparisonTable } from '@/components/ComparisonTable';
import { Testimonials } from '@/components/Testimonials';
import { FaqSection } from '@/components/FaqSection';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Footer } from '@/components/Footer';

// Konfigurasi Maksimal Vercel Free Tier (Anti-Jebol):
// 1. 'force-static' = Halaman di-render sebagai file HTML murni saat build time.
// 2. revalidate = false = Cache permanen di Edge CDN Vercel.
// 3. ZERO Serverless Function Invocations: Berapapun user yang akses terus-menerus,
//    serverless function TIDAK PERNAH dipanggil (0/100.000 kuota terpakai).
export const dynamic = 'force-static';
export const revalidate = false;

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f7faf8]">
      <Hero />
      <PropertyCatalog />
      <HeroOffers />
      <KprCalculator />
      <ComparisonTable />
      <Testimonials />
      <FaqSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
