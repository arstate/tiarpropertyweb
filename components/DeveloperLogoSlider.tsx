import React from 'react';
import { motion } from 'framer-motion';

export const DeveloperLogoSlider: React.FC = () => {
  const developers = [
    { id: 20, name: "Ciputra Group" },
    { id: 45, name: "Adhi Persada" },
    { id: 60, name: "Pakuwon Jati" },
    { id: 80, name: "Sinar Mas Land" },
    { id: 102, name: "Intiland" },
    { id: 120, name: "Summarecon" },
    { id: 140, name: "Lippo Homes" },
    { id: 160, name: "Agung Podomoro" }
  ];

  // Duplicate sets to create a seamless loop
  const allDevelopers = [...developers, ...developers, ...developers, ...developers];

  return (
    <section className="py-20 bg-white border-b border-luxury-green/5 overflow-hidden relative z-10">

      {/* Section Label */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="text-[10px] md:text-xs font-bold text-luxury-gold uppercase tracking-[0.3em] border border-luxury-gold/20 px-4 py-2 rounded-full bg-luxury-offwhite/50 backdrop-blur-sm">
          Official Developer Partners
        </span>
      </div>

      <div className="relative w-full">
        {/* Gradient Masks for Smooth Edges */}
        <div className="absolute top-0 left-0 w-24 md:w-64 h-full bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-24 md:w-64 h-full bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Track */}
        <div className="flex">
          <motion.div
            className="flex gap-12 md:gap-20 items-start min-w-max px-4"
            animate={{ x: ["0%", "-25%"] }}
            transition={{
              repeat: Infinity,
              duration: 40,
              ease: "linear"
            }}
          >
            {allDevelopers.map((dev, index) => (
              <div
                key={index}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Image Container 1:1 */}
                <div className="w-24 h-24 md:w-32 md:h-32 mb-4 relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:scale-110 group-hover:border-luxury-gold/30">
                  <img
                    src={`https://picsum.photos/id/${dev.id}/400/400`}
                    alt={dev.name}
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-luxury-green/5 group-hover:bg-transparent transition-colors"></div>
                </div>

                {/* Developer Name */}
                <span className="text-xs md:text-sm font-serif italic text-luxury-green/60 group-hover:text-luxury-gold transition-colors duration-300 tracking-wide text-center">
                  {dev.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
