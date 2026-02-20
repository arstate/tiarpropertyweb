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
        id: 1,
        title: "The Grand Dhika",
        location: "Sidoarjo Kota",
        developer: "Adhi Persada Properti",
        priceRange: 500,
        priceDisplay: "Start 500jt-an",
        beds: 3,
        baths: 2,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
        tag: "Hot Deal",
        type: "Tropical Modern"
    },
    {
        id: 2,
        title: "Urban Living Trosobo",
        location: "Krian",
        developer: "Urban Development",
        priceRange: 300,
        priceDisplay: "Cicilan 2jt-an",
        beds: 2,
        baths: 1,
        image: "https://images.unsplash.com/photo-1512915923507-50e47b499147?auto=format&fit=crop&q=80&w=1200",
        tag: "Best Seller",
        type: "Scandinavian"
    },
    {
        id: 3,
        title: "Royal Juanda",
        location: "Sedati",
        developer: "Royal Group",
        priceRange: 800,
        priceDisplay: "Start 800jt-an",
        beds: 4,
        baths: 3,
        image: "https://images.unsplash.com/photo-1512918766775-d56a1327548c?auto=format&fit=crop&q=80&w=1200",
        tag: "Premium",
        type: "Classic"
    },
    {
        id: 4,
        title: "Sapphire Residence",
        location: "Waru",
        developer: "Jewel Property",
        priceRange: 600,
        priceDisplay: "Start 600jt-an",
        beds: 3,
        baths: 2,
        image: "https://images.unsplash.com/photo-1512914890251-2f96a9b0926b?auto=format&fit=crop&q=80&w=1200",
        tag: "New Cluster",
        type: "Industrial"
    }
];
