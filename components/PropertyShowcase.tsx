import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, MoveRight } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  image: string;
  tag: string;
}

const properties: Property[] = [
  {
    id: 1,
    title: "The Grand Dhika",
    location: "Sidoarjo Kota (Nempel Surabaya)",
    price: "Start 500jt-an",
    beds: 3,
    baths: 2,
    image: "https://picsum.photos/600/400?random=10",
    tag: "Hot Deal"
  },
  {
    id: 2,
    title: "Urban Living Trosobo",
    location: "Krian, Sidoarjo",
    price: "Cicilan 2jt-an",
    beds: 2,
    baths: 1,
    image: "https://picsum.photos/600/400?random=11",
    tag: "Best Seller"
  },
  {
    id: 3,
    title: "Royal Juanda",
    location: "Sedati, Dekat Bandara",
    price: "Start 800jt-an",
    beds: 4,
    baths: 3,
    image: "https://picsum.photos/600/400?random=12",
    tag: "Premium"
  },
  {
    id: 4,
    title: "Sapphire Residence",
    location: "Warou, Sidoarjo",
    price: "Start 600jt-an",
    beds: 3,
    baths: 2,
    image: "https://picsum.photos/600/400?random=13",
    tag: "New Cluster"
  }
];

export const PropertyShowcase: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  // Transform vertical scroll to horizontal scroll for this section
  // Strictly captures scroll to prevent page movement when cursor is in slider
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;

        // STOP propagation and prevent default to lock scroll to this element only
        e.preventDefault();
        e.stopPropagation();
        
        // Use scrollTo with smooth behavior for nice wheel inertia
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 3, // Multiplier for faster traversal
          behavior: 'smooth'
        });
      };
      
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  return (
    <section id="area" className="py-24 bg-white relative overflow-hidden z-20">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-luxury-green/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row justify-between items-end">
        <div>
           <span className="text-luxury-yellow font-bold tracking-widest text-sm uppercase">Collection</span>
           <h2 className="font-serif text-4xl md:text-5xl text-luxury-green mt-2">
             Hidden Gems <br/> <span className="text-luxury-gold italic text-3xl md:text-4xl">Kawasan Penyangga Surabaya</span>
           </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-luxury-slate">
          Scroll untuk melihat <MoveRight className="animate-pulse" />
        </div>
      </div>

      {/* Horizontal Container */}
      <div 
        ref={scrollRef}
        // Increased padding (px-8 md:px-24) to prevent first/last items from hitting the edge
        // Added pt-16 pb-16 to ensure top/bottom scaling doesn't get clipped
        className="flex overflow-x-auto gap-8 px-8 md:px-24 py-16 snap-x snap-mandatory no-scrollbar items-center"
        style={{ scrollPaddingLeft: '2rem', scrollPaddingRight: '2rem' }}
        onMouseLeave={() => setHoveredId(null)}
      >
        {properties.map((prop, index) => (
          <motion.div 
            key={prop.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            onHoverStart={() => setHoveredId(prop.id)}
            animate={{
              scale: hoveredId === null ? 1 : hoveredId === prop.id ? 1.15 : 0.9,
              opacity: hoveredId === null || hoveredId === prop.id ? 1 : 0.5,
              filter: hoveredId === null || hoveredId === prop.id ? "blur(0px)" : "blur(4px)",
              zIndex: hoveredId === prop.id ? 50 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
            className="min-w-[85vw] md:min-w-[400px] snap-center cursor-pointer bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-6">
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-luxury-green uppercase tracking-wide">
                {prop.tag}
              </div>
              <motion.img 
                src={prop.image} 
                alt={prop.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
              
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-bold text-xl">{prop.price}</p>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-luxury-green">{prop.title}</h3>
              <div className="flex items-center gap-2 text-luxury-slate text-sm mt-1 mb-3">
                <MapPin size={14} />
                {prop.location}
              </div>
              <div className="flex gap-4 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bed size={16} /> {prop.beds} Beds
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bath size={16} /> {prop.baths} Baths
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Call to action card at end of scroll */}
        <motion.div 
          onHoverStart={() => setHoveredId(999)}
          animate={{
            scale: hoveredId === null ? 1 : hoveredId === 999 ? 1.15 : 0.9,
            opacity: hoveredId === null || hoveredId === 999 ? 1 : 0.5,
            filter: hoveredId === null || hoveredId === 999 ? "blur(0px)" : "blur(4px)",
            zIndex: hoveredId === 999 ? 50 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className="min-w-[85vw] md:min-w-[300px] snap-center flex items-center justify-center bg-luxury-green rounded-2xl p-8 text-center text-white"
        >
          <div>
            <h3 className="font-serif text-2xl mb-4">Masih banyak lagi...</h3>
            <button className="px-6 py-3 border border-luxury-yellow text-luxury-yellow hover:bg-luxury-yellow hover:text-luxury-green transition-colors rounded-full font-semibold">
              Lihat Katalog Lengkap
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};