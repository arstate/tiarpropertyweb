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

export const HERO_OFFERS = [
  {
    title: 'DP 0% (Tanpa DP)',
    description: 'Cukup UTJ 1 Juta, langsung proses berkas KPR ke bank.',
  },
  {
    title: 'All-In Free Biaya',
    description: 'Gratis BPHTB, AJB, Notaris, & subsidi biaya KPR s/d 20 Jt.',
  },
  {
    title: 'Subsidi Angsuran 1,4 Jt',
    description: 'Potongan angsuran Rp 1,4 Juta/bulan di 6–12 bulan pertama.',
  },
  {
    title: 'Kawal KPR 100% ACC',
    description: 'Tim analis mengawal ke 5 bank rekanan BUMN sampai disetujui.',
  },
];

export const WA_CS_NUMBER = '6282142193231';
export const DEFAULT_WA_MESSAGE = encodeURIComponent(
  'Halo Mbak Ningsih, saya lihat website Tiar Property. Mau tanya promo rumah DP 0% dan cicilan 1-2 Jt-an, boleh minta tolong ditemenin cek lokasinya kak?'
);
