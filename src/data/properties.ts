import type { Metadata } from 'next';
import propertiesData from './properties.json';

export interface PropertyUnit {
  id: string;
  codeName: string;
  locationArea: string;
  locationAreaShort: string;
  city: 'Surabaya' | 'Sidoarjo';
  floors: 1 | 2;
  priceStart: string;
  priceStrikethrough: string;
  cicilanPromo: string;
  cicilanNominal: number; // Dalam jutaan rupiah (misal 1.9 = Rp 1,9 Jt)
  subsidiInfo: string;
  utjAmount: string;
  rating: number;
  specs: {
    bedrooms: number;
    bathrooms: number;
    luasTanah: string;
    luasBangunan: string;
  };
  features: string[];
  imageUrl: string;
  galleryImages: string[];
  assignedAgentId?: string;
  status?: 'available' | 'reserved' | 'sold';
}

export const TIAR_PROPERTIES: PropertyUnit[] = propertiesData as PropertyUnit[];

export const WA_CS_NUMBER = '6282142193231';
export const DEFAULT_WA_MESSAGE =
  'Halo Mbak Ningsih, saya lihat website Tiar Property. Mau tanya promo rumah DP 0% dan cicilan 1-2 Jt-an, boleh minta tolong ditemenin cek lokasinya kak?';

export function buildMainWaUrl(customMessage?: string): string {
  const message = customMessage ?? DEFAULT_WA_MESSAGE;
  return `https://wa.me/${WA_CS_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildPropertyMetadata(
  property: PropertyUnit | undefined,
  fallbackTitle: string
): Metadata {
  if (!property) return { title: fallbackTitle };

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
