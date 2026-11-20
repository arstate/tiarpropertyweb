import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyDetailView } from '@/components/PropertyDetailView';
import { TIAR_PROPERTIES, buildPropertyMetadata } from '@/data/properties';

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
  const meta = buildPropertyMetadata(property, 'Produk Rumah | Tiar Property');
  return {
    ...meta,
    alternates: {
      canonical: `/properti/${id}`,
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
