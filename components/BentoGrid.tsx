import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Home, DollarSign, AlertCircle } from 'lucide-react';

export const BentoGrid: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 md:w-2/3"
      >
        <h2 className="font-serif text-4xl md:text-5xl text-luxury-green mb-4">
          Kenapa Harus <span className="text-luxury-gold italic">Sekarang?</span>
        </h2>
        <p className="text-luxury-slate text-lg">
          Jangan biarkan inflasi memakan tabungan Anda. Lihat perbandingannya.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* Card 1: Main Comparison (Large) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-yellow/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-luxury-green text-white rounded-xl">
                <Home size={24} />
              </div>
              <h3 className="text-xl font-bold text-luxury-green">Biaya Ngontrak vs KPR</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-medium">Ngontrak (10 Thn)</span>
                <span className="text-red-500 font-bold">- Rp 300 Juta+</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-luxury-green/5 border border-luxury-green/20 rounded-xl">
                <span className="text-luxury-green font-medium">Cicil Rumah</span>
                <span className="text-luxury-green font-bold">Aset Milik Sendiri</span>
              </div>
            </div>
            
            <p className="mt-6 text-sm text-gray-500 leading-relaxed">
              Uang kontrak hilang begitu saja. Cicilan rumah menjadi aset yang nilainya terus naik setiap tahun.
            </p>
          </div>
        </motion.div>

        {/* Card 2: Inflation Stat (Tall) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-1 row-span-2 bg-luxury-green text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div>
            <TrendingUp size={32} className="text-luxury-yellow mb-4" />
            <h3 className="text-3xl font-serif">Kenaikan Properti</h3>
          </div>
          <div className="relative z-10">
            <p className="text-5xl font-bold text-luxury-yellow mb-2">15%</p>
            <p className="text-sm opacity-80">Rata-rata kenaikan harga properti per tahun di Sidoarjo & Surabaya.</p>
          </div>
        </motion.div>

        {/* Card 3: Pain Point (Small) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-1 bg-gray-100 p-6 rounded-3xl flex flex-col justify-center border border-gray-200"
        >
          <AlertCircle className="text-red-500 mb-2" />
          <h4 className="font-bold text-luxury-green">Jangan Tunda</h4>
          <p className="text-xs text-gray-600 mt-1">Harga bahan bangunan naik terus setiap bulan.</p>
        </motion.div>

        {/* Card 4: Solution (Small) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-1 bg-luxury-yellow p-6 rounded-3xl flex flex-col justify-center shadow-lg"
        >
          <DollarSign className="text-luxury-green mb-2" />
          <h4 className="font-bold text-luxury-green text-lg">Cicilan Ringan</h4>
          <p className="text-xs text-luxury-green/80 mt-1 font-medium">Mulai 2 Jutaan/bulan.</p>
        </motion.div>

      </div>
    </section>
  );
};