import { Property } from './properties';

export interface Property {
  id: number;
  title: string;
  location: string;
  developer: string;
  priceRange: number;
  priceDisplay: string;
  beds: number;
  baths: number;
  image: string;
  tag: string;
  type: string;
}

export const initialProperties: Property[] = [
  {
    "id": 1,
    "title": "The Grand Dhika",
    "location": "Sidoarjo Kota",
    "developer": "Adhi Persada Properti",
    "priceRange": 500,
    "priceDisplay": "Start 500jt-an",
    "beds": 3,
    "baths": 2,
    "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
    "tag": "Hot Deal",
    "type": "Tropical Modern"
  },
  {
    "id": 1771580368557,
    "title": "ee",
    "location": "e",
    "developer": "",
    "priceRange": 0,
    "priceDisplay": "e",
    "beds": 0,
    "baths": 0,
    "image": "e",
    "tag": "New",
    "type": "Modern"
  }
];