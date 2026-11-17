import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyDetailView } from '@/components/PropertyDetailView';
import { TIAR_PROPERTIES } from '@/data/properties';

export const dynamic = 'force-static';
export const revalidate = false;

export function generateStaticParams() {
  return TIAR_PROPERTIES.map((property) => ({
    id: property.id,
  }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = TIAR_PROPERTIES.find((p) => p.id === id);
  if (!property) return { title: 'Produk Rumah | Tiar Property' };

  return {
    title: `${property.codeName} - ${property.locationAreaShort} | Tiar Property`,
    description: `${property.codeName} di ${property.locationArea}. Harga mulai ${property.priceStart}, ${property.cicilanPromo}, ${property.utjAmount}. Promo DP 0% & All-In Free Biaya.`,
    openGraph: {
      title: `${property.codeName} | Tiar Property`,
      description: `${property.locationArea}. Harga mulai ${property.priceStart}, cicilan ${property.cicilanPromo}.`,
      images: [{ url: property.imageUrl }],
    },
  };
}

export default async function ProdukDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = TIAR_PROPERTIES.find((p) => p.id === id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailView property={property} basePath="/produk" />;
}
