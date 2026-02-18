import React from 'react';
import { motion } from 'framer-motion';

export const SocialProof: React.FC = () => {
  const items = [
    "Rumah di Sidoarjo Sold Out!",
    "Unit Terakhir di Cluster A",
    "Pak Budi - Approved KPR",
    "Ibu Siti - Serah Terima Kunci",
    "Kenaikan Harga Minggu Depan",
    "Diskon 50% Biaya Admin",
    "Type 36 - Sisa 2 Unit",
    "Promo Merdeka Berakhir Segera"
  ];

  return (
    <section className="py-8 bg-luxury-green overflow-hidden">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear"
          }}
          className="flex gap-12 items-center"
        >
          {[...items, ...items, ...items].map((text, i) => (
            <div key={i} className="flex items-center gap-4 text-luxury-offwhite opacity-70 hover:opacity-100 transition-opacity cursor-default">
              <span className="w-2 h-2 bg-luxury-yellow rounded-full animate-pulse"></span>
              <span className="text-xl font-serif tracking-wide">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};