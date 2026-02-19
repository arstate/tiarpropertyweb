import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Bed, Bath, ArrowLeft, CheckCircle2, Phone, 
  MessageCircle, Maximize, ShieldCheck, Share2, 
  X, ChevronLeft, ChevronRight 
} from 'lucide-react';

// Mock Database for Detail Page
const propertyDB = [
  {
    id: 1,
    title: "The Grand Dhika",
    location: "Sidoarjo Kota (Nempel Surabaya)",
    priceDisplay: "Start 500jt-an",
    fullPrice: "Rp 500.000.000",
    beds: 3,
    baths: 2,
    landSize: "90m²",
    buildingSize: "45m²",
    type: "Tropical Modern",
    description: "Hunian modern tropis yang terletak strategis di perbatasan Sidoarjo and Surabaya. Dilengkapi dengan fasilitas one gate system, taman bermain anak, dan keamanan 24 jam. Desain ceiling tinggi membuat sirkulasi udara sangat lancar, cocok untuk keluarga muda yang menginginkan hunian sehat.",
    features: ["One Gate System", "CCTV 24 Jam", "Taman Bermain", "Masjid Complex", "Row Jalan 8 Meter", "Smart Door Lock"],
    mainImage: "https://picsum.photos/1200/800?random=10",
    gallery: [
      "https://picsum.photos/1200/800?random=101",
      "https://picsum.photos/1200/800?random=102",
      "https://picsum.photos/1200/800?random=103",
      "https://picsum.photos/1200/800?random=104"
    ]
  },
  {
    id: 2,
    title: "Urban Living Trosobo",
    location: "Krian, Sidoarjo",
    priceDisplay: "Cicilan 2jt-an",
    fullPrice: "Rp 300.000.000",
    beds: 2,
    baths: 1,
    landSize: "72m²",
    buildingSize: "36m²",
    type: "Scandinavian",
    description: "Konsep hunian Scandinavian yang minimalis dan fungsional. Terletak di kawasan berkembang Krian dengan akses mudah ke jalan bypass. Sangat cocok untuk milenial yang mencari rumah pertama dengan cicilan yang sangat terjangkau setara biaya kos.",
    features: ["Minimalist Garden", "Carport Luas", "Dekat Pasar Krian", "Bebas Banjir", "Air PDAM"],
    mainImage: "https://picsum.photos/1200/800?random=11",
    gallery: [
      "https://picsum.photos/1200/800?random=111",
      "https://picsum.photos/1200/800?random=112",
      "https://picsum.photos/1200/800?random=113"
    ]
  },
  {
    id: 3,
    title: "Royal Juanda",
    location: "Sedati, Dekat Bandara",
    priceDisplay: "Start 800jt-an",
    fullPrice: "Rp 850.000.000",
    beds: 4,
    baths: 3,
    landSize: "120m²",
    buildingSize: "100m²",
    type: "Classic Premium",
    description: "Hunian prestisius selangkah dari Bandara Juanda T2. Menawarkan kemewahan desain klasik dengan sentuhan modern. Lingkungan sangat eksklusif dengan tetangga terpilih. Nilai investasi yang sangat tinggi karena lokasi premium.",
    features: ["Club House", "Kolam Renang", "Underground Cable", "Fiber Optic Ready", "Gym Center"],
    mainImage: "https://picsum.photos/1200/800?random=12",
    gallery: [
      "https://picsum.photos/1200/800?random=121",
      "https://picsum.photos/1200/800?random=122",
      "https://picsum.photos/1200/800?random=123"
    ]
  },
  {
    id: 4,
    title: "Sapphire Residence",
    location: "Waru, Sidoarjo",
    priceDisplay: "Start 600jt-an",
    fullPrice: "Rp 600.000.000",
    beds: 3,
    baths: 2,
    landSize: "90m²",
    buildingSize: "50m²",
    type: "Industrial",
    description: "Cluster baru dengan desain Industrial yang kekinian. Lokasi sangat strategis di Waru, pintu gerbang Surabaya-Sidoarjo. Dekat dengan terminal Bungurasih dan akses tol.",
    features: ["Smart Home System", "Rooftop Garden Option", "Security 24H", "Dekat Mall Cito"],
    mainImage: "https://picsum.photos/1200/800?random=13",
    gallery: [
      "https://picsum.photos/1200/800?random=131",
      "https://picsum.photos/1200/800?random=132",
      "https://picsum.photos/1200/800?random=133"
    ]
  },
  {
    id: 5,
    title: "Green View Regency",
    location: "Sidoarjo Kota",
    priceDisplay: "Start 450jt-an",
    fullPrice: "Rp 450.000.000",
    beds: 2,
    baths: 1,
    landSize: "84m²",
    buildingSize: "40m²",
    type: "Minimalist",
    description: "Perumahan asri di jantung kota Sidoarjo. Lingkungan hijau dengan banyak pepohonan rindang. Akses mudah ke Alun-alun Sidoarjo dan pusat pemerintahan.",
    features: ["Taman Hijau", "Jogging Track", "Playground", "One Gate"],
    mainImage: "https://picsum.photos/1200/800?random=14",
    gallery: [
      "https://picsum.photos/1200/800?random=141",
      "https://picsum.photos/1200/800?random=142"
    ]
  },
  {
    id: 6,
    title: "Citra Garden Estate",
    location: "Waru",
    priceDisplay: "Start 1.2M",
    fullPrice: "Rp 1.200.000.000",
    beds: 4,
    baths: 3,
    landSize: "150m²",
    buildingSize: "120m²",
    type: "Modern Luxury",
    description: "The epitome of luxury living. Kawasan elite dengan fasilitas bintang lima. Desain arsitektur kelas dunia dengan material premium. Privasi dan kenyamanan penghuni adalah prioritas utama.",
    features: ["Private Pool Option", "Golf Course View", "Luxury Club House", "International School Nearby"],
    mainImage: "https://picsum.photos/1200/800?random=15",
    gallery: [
      "https://picsum.photos/1200/800?random=151",
      "https://picsum.photos/1200/800?random=152"
    ]
  }
];

export const PropertyDetailPage: React.FC = () => {
  const [property, setProperty] = useState<any>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    // Parse ID from URL hash: #/properti/1
    const hash = window.location.hash;
    const id = parseInt(hash.split('/').pop() || "0");
    const found = propertyDB.find(p => p.id === id);
    
    if (found) {
        setProperty(found);
    }
  }, []);

  // Construct full image list for navigation
  const allImages = property ? [property.mainImage, ...property.gallery] : [];

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % allImages.length);
    }
  }, [lightboxIndex, allImages.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! - 1 + allImages.length) % allImages.length);
    }
  }, [lightboxIndex, allImages.length]);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNext, handlePrev, handleClose]);

  if (!property) {
    return (
        <div className="min-h-screen pt-32 flex items-center justify-center">
            <p>Loading Property Details...</p>
        </div>
    );
  }

  const whatsappMessage = `Halo Admin Tiar Property, saya tertarik dengan unit *${property.title}* di ${property.location} yang harganya ${property.priceDisplay}. Boleh minta info pricelist dan simulasi KPR?`;
  const whatsappLink = `https://wa.me/6282227896809?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-white min-h-screen pt-36 pb-24 font-sans relative">
        
        {/* Full-Screen Lightbox */}
        <AnimatePresence>
            {lightboxIndex !== null && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center select-none"
                    onClick={handleClose}
                >
                    {/* Top Bar */}
                    <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center text-white z-[110]">
                        <div className="text-sm font-bold tracking-widest uppercase opacity-60">
                            {property.title} • {lightboxIndex + 1} / {allImages.length}
                        </div>
                        <button 
                            onClick={handleClose}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer border-none"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation Buttons */}
                    <button 
                        onClick={handlePrev}
                        className="absolute left-6 w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-white z-[110] cursor-pointer border-none"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button 
                        onClick={handleNext}
                        className="absolute right-6 w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-white z-[110] cursor-pointer border-none"
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Image Container */}
                    <motion.div 
                        key={lightboxIndex}
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 1.05, x: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full h-full max-w-6xl max-h-[80vh] p-4 flex items-center justify-center"
                    >
                        <img 
                            src={allImages[lightboxIndex]} 
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                            alt={`Preview ${lightboxIndex}`}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-8 text-center text-white/50 text-xs tracking-widest uppercase px-12">
                        Gunakan tombol panah atau klik kanan/kiri untuk navigasi
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Breadcrumb / Back */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
            <button 
                onClick={() => window.location.hash = '#/cari-rumah'}
                className="flex items-center gap-2 text-luxury-slate hover:text-luxury-green transition-colors text-sm font-semibold uppercase tracking-wider cursor-pointer bg-transparent border-none"
            >
                <ArrowLeft size={16} /> Kembali ke Katalog
            </button>
        </div>

        {/* Hero Image Grid */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Main Image (Left) */}
                <div 
                    className="lg:col-span-8 aspect-video lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden relative group shadow-lg cursor-zoom-in"
                    onClick={() => setLightboxIndex(0)}
                >
                     <img src={property.mainImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main" />
                     <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-luxury-green font-bold text-sm uppercase tracking-wide">
                        {property.type}
                     </div>
                </div>

                {/* Side Images (Right) */}
                <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:h-[600px]">
                    {/* Thumbnail 1 (Second Image in List) */}
                    <div 
                        className="aspect-square lg:aspect-auto lg:h-full rounded-3xl overflow-hidden relative group shadow-md cursor-zoom-in"
                        onClick={() => setLightboxIndex(1)}
                    >
                        <img src={property.gallery[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 1" />
                    </div>
                    
                    {/* Thumbnail 2 (Third Image in List) */}
                    <div 
                        className="aspect-square lg:aspect-auto lg:h-full rounded-3xl overflow-hidden relative group cursor-pointer shadow-md"
                        onClick={() => setLightboxIndex(2)}
                    >
                        {property.gallery[1] ? (
                            <>
                                <img src={property.gallery[1]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 2" />
                                {property.gallery.length > 2 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl hover:bg-black/40 transition-colors backdrop-blur-[2px]">
                                        +{property.gallery.length - 2} More Photos
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <p className="text-sm">No more photos</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-12 gap-12 relative">
            
            {/* Left Content: Details */}
            <div className="xl:col-span-8 relative z-10">
                
                {/* Title Section */}
                <div className="mb-8 border-b border-gray-100 pb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                        <div>
                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-luxury-green mb-3 leading-tight">{property.title}</h1>
                            <div className="flex items-center gap-2 text-luxury-slate text-lg">
                                <MapPin size={20} className="text-luxury-gold" /> {property.location}
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <button className="p-3 rounded-full border border-gray-200 hover:bg-luxury-gold hover:text-white hover:border-luxury-gold text-luxury-slate transition-all cursor-pointer bg-white">
                                <Share2 size={20} />
                             </button>
                        </div>
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                        <div className="bg-luxury-offwhite p-5 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-50">
                            <Bed size={28} className="text-luxury-gold mb-2" />
                            <span className="font-bold text-luxury-green text-xl">{property.beds}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest text-nowrap">Kamar Tidur</span>
                        </div>
                        <div className="bg-luxury-offwhite p-5 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-50">
                            <Bath size={28} className="text-luxury-gold mb-2" />
                            <span className="font-bold text-luxury-green text-xl">{property.baths}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest text-nowrap">Kamar Mandi</span>
                        </div>
                         <div className="bg-luxury-offwhite p-5 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-50">
                            <Maximize size={28} className="text-luxury-gold mb-2" />
                            <span className="font-bold text-luxury-green text-xl">{property.landSize}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest text-nowrap">Luas Tanah</span>
                        </div>
                         <div className="bg-luxury-offwhite p-5 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-50">
                            <ShieldCheck size={28} className="text-luxury-gold mb-2" />
                            <span className="font-bold text-luxury-green text-xl">SHM</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest text-nowrap">Sertifikat</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-12">
                    <h2 className="font-serif text-3xl text-luxury-green mb-6">Deskripsi Hunian</h2>
                    <p className="text-gray-600 leading-relaxed text-lg max-w-3xl">
                        {property.description}
                    </p>
                </div>

                {/* Facilities */}
                <div className="mb-12">
                    <h2 className="font-serif text-3xl text-luxury-green mb-8">Fasilitas Unggulan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {property.features.map((feature: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-luxury-gold transition-all hover:shadow-lg hover:shadow-luxury-gold/5">
                                <div className="p-2 bg-luxury-green/5 rounded-full">
                                    <CheckCircle2 size={22} className="text-luxury-green" />
                                </div>
                                <span className="text-gray-700 font-semibold">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right Sidebar: Sticky Pricing & CTA */}
            <div className="hidden xl:block xl:col-span-4 relative">
                <div className="sticky top-28 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-luxury-gold/10 z-20 max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
                    <div className="text-center mb-8">
                         <p className="text-luxury-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Exclusive Offer</p>
                         <div className="font-serif text-4xl text-luxury-green mb-3">{property.priceDisplay}</div>
                         <div className="inline-block px-3 py-1.5 bg-red-50 rounded-lg">
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                                *Harga dapat berubah sewaktu-waktu
                            </p>
                         </div>
                    </div>

                    <div className="space-y-4">
                        <motion.a 
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-5 bg-luxury-green text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-luxury-green/20"
                        >
                            <MessageCircle size={22} />
                            Chat Admin WhatsApp
                        </motion.a>
                        
                        <button className="w-full py-5 border-2 border-luxury-green text-luxury-green rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-luxury-offwhite transition-all cursor-pointer bg-white">
                            <Phone size={22} />
                            Jadwalkan Survey
                        </button>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-luxury-gold p-0.5 overflow-hidden shrink-0 shadow-lg">
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" alt="Agent" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Listed by</p>
                                <p className="font-bold text-luxury-green text-lg">Aries Kusheryana</p>
                                <p className="text-xs text-luxury-gold font-medium">Senior Property Consultant</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* Mobile Fixed Bottom CTA Bar */}
        <div className="xl:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 flex items-center justify-between gap-5">
            <div className="flex-1">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Harga Mulai</p>
                 <p className="font-serif text-2xl font-bold text-luxury-green">{property.priceDisplay}</p>
            </div>
            <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-luxury-green text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
                <MessageCircle size={20} />
                WhatsApp
            </a>
        </div>

    </div>
  );
};