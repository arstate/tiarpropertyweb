import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, MoveRight } from 'lucide-react';
import { initialProperties as properties } from '../data/properties';

export const PropertyShowcase: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [centerId, setCenterId] = useState<number>(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Transform vertical scroll to horizontal scroll for this section
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        e.stopPropagation();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 3,
          behavior: 'smooth'
        });
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  // Check for desktop size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll position to determine center item
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const containerCenter = el.scrollLeft + el.clientWidth / 2;

      let closestId = -1;
      let minDist = Infinity;

      const cards = el.querySelectorAll('[data-card-id]');
      cards.forEach((card) => {
        const htmlCard = card as HTMLElement;
        const cardCenter = htmlCard.offsetLeft + htmlCard.offsetWidth / 2;
        const dist = Math.abs(containerCenter - cardCenter);
        if (dist < minDist) {
          minDist = dist;
          closestId = Number(htmlCard.getAttribute('data-card-id'));
        }
      });

      if (closestId !== -1) {
        setCenterId(closestId);
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to determine if we should show the "All Visible" state
  const showAll = isDesktop && !isHovered;

  return (
    <section id="area" className="py-24 bg-white relative overflow-hidden z-20">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-luxury-green/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row justify-between items-end">
        <div>
          <span className="text-luxury-yellow font-bold tracking-widest text-sm uppercase">Collection</span>
          <h2 className="font-serif text-4xl md:text-5xl text-luxury-green mt-2">
            Hidden Gems <br /> <span className="text-luxury-gold italic text-3xl md:text-4xl">Kawasan Penyangga Surabaya</span>
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-luxury-slate">
          Scroll untuk melihat <MoveRight className="animate-pulse" />
        </div>
      </div>

      {/* Horizontal Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 md:gap-8 px-8 md:px-24 py-12 snap-x snap-mandatory no-scrollbar items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {properties.map((prop, index) => {
          // On Desktop, we ignore centerId for styling to avoid auto-focusing items on scroll.
          // Focus is driven purely by hover on Desktop.
          // On Mobile, we keep centerId logic for the carousel feel.
          const isCentered = !isDesktop && (centerId === prop.id);

          return (
            <motion.div
              key={prop.id}
              data-card-id={prop.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              animate={{
                scale: showAll ? 1 : (isCentered ? 1 : 0.9),
                opacity: showAll ? 1 : (isCentered ? 1 : 0.6),
                filter: showAll ? "blur(0px)" : (isCentered ? "blur(0px)" : "blur(2px)"),
                zIndex: isCentered ? 10 : 1,
              }}
              whileHover={{
                scale: 1.05,
                opacity: 1,
                filter: "blur(0px)",
                zIndex: 20
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              onClick={() => window.location.hash = `#/properti/${prop.id}`}
              className="min-w-[70vw] md:min-w-[400px] snap-center cursor-pointer bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
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
                  <p className="font-bold text-xl">{prop.priceDisplay}</p>
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
          );
        })}

        {/* Call to action card at end of scroll */}
        <motion.div
          data-card-id={999}
          animate={{
            scale: showAll ? 1 : ((!isDesktop && centerId === 999) ? 1 : 0.9),
            opacity: showAll ? 1 : ((!isDesktop && centerId === 999) ? 1 : 0.6),
            filter: showAll ? "blur(0px)" : ((!isDesktop && centerId === 999) ? "blur(0px)" : "blur(2px)"),
          }}
          whileHover={{
            scale: 1.05,
            opacity: 1,
            filter: "blur(0px)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className="min-w-[70vw] md:min-w-[300px] snap-center flex items-center justify-center bg-luxury-green rounded-2xl p-8 text-center text-white"
        >
          <div>
            <h3 className="font-serif text-2xl mb-4">Masih banyak lagi...</h3>
            <button
              onClick={() => window.location.hash = '#/cari-rumah'}
              className="px-6 py-3 border border-luxury-yellow text-luxury-yellow hover:bg-luxury-yellow hover:text-luxury-green transition-colors rounded-full font-semibold inline-block cursor-pointer"
            >
              Lihat Katalog Lengkap
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};