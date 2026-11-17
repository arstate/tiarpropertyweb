import { Hero } from '@/components/Hero';
import { PropertyCatalog } from '@/components/PropertyCatalog';
import { HeroOffers } from '@/components/HeroOffers';
import { ComparisonTable } from '@/components/ComparisonTable';
import { Testimonials } from '@/components/Testimonials';
import { FaqSection } from '@/components/FaqSection';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-static';
export const revalidate = false;

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F1F1F1] text-[#38352C]">
      <Hero />
      <PropertyCatalog />
      <HeroOffers />
      <ComparisonTable />
      <Testimonials />
      <FaqSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
