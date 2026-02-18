import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center px-6 pt-32 pb-12 overflow-hidden">
      
      {/* Background Abstract Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_60s_linear_infinite]">
          <circle cx="200" cy="200" r="150" stroke="#283428" strokeWidth="1" fill="none" />
          <rect x="150" y="150" width="100" height="100" stroke="#C5A059" strokeWidth="1" fill="none" transform="rotate(45 200 200)" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Text Content */}
        <div className="lg:col-span-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-luxury-green/20 text-luxury-green text-xs font-semibold tracking-wider mb-6">
              PREMIUM REAL ESTATE • SURABAYA & SIDOARJO
            </span>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-luxury-green mb-8">
              Stop <span className="italic text-luxury-gold">Ngontrak.</span> <br />
              Saatnya Punya Rumah.
            </h1>
            
            <p className="font-sans text-luxury-slate text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Temukan hunian impian dengan skema pembayaran fleksibel di lokasi strategis. 
              Kawasan urban Sidoarjo yang nempel Surabaya.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-4 bg-luxury-green text-white rounded-none overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-luxury-yellow/90 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                <span className="relative flex items-center gap-2 font-semibold group-hover:text-luxury-green transition-colors">
                  Cari Rumah <ArrowRight size={18} />
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border border-luxury-green text-luxury-green font-semibold hover:bg-luxury-green/5 transition-colors"
              >
                Konsultasi Gratis
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Visual Element / Right Side */}
        <div className="lg:col-span-4 relative h-[400px] lg:h-[600px] hidden lg:block">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4, duration: 1 }}
             className="relative w-full h-full"
           >
              {/* Architectural Floating Card 1 */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-64 h-80 bg-white shadow-2xl p-4 z-20"
              >
                <div className="w-full h-4/5 bg-gray-200 mb-4 overflow-hidden relative">
                    <img src="https://picsum.photos/400/500?random=1" alt="Architecture" className="object-cover w-full h-full" />
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-luxury-slate uppercase">Type 45/90</p>
                        <p className="font-serif text-lg text-luxury-green">Modern Tropical</p>
                    </div>
                    <div className="h-8 w-8 bg-luxury-yellow rounded-full flex items-center justify-center">
                        <ArrowRight size={14} className="text-luxury-green" />
                    </div>
                </div>
              </motion.div>

              {/* Architectural Floating Card 2 */}
              <motion.div 
                 animate={{ y: [0, 30, 0] }}
                 transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                 className="absolute bottom-20 left-0 w-56 h-64 bg-luxury-green p-6 z-10 text-white shadow-xl"
              >
                 <div className="h-full flex flex-col justify-between">
                    <h3 className="font-serif text-2xl italic">Special Offer</h3>
                    <div>
                        <p className="text-3xl font-bold text-luxury-yellow">0%</p>
                        <p className="text-sm opacity-80">Down Payment</p>
                    </div>
                 </div>
              </motion.div>
           </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-luxury-green/40"
      >
        <ArrowDown size={24} />
      </motion.div>
    </section>
  );
};