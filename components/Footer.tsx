import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Instagram, Facebook, Mail } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-[#1a221a] text-luxury-offwhite pt-24 pb-12 rounded-t-[3rem] mt-[-2rem] relative z-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="font-serif text-5xl md:text-7xl leading-none mb-8">
              Ready to <br />
              <span className="text-luxury-yellow">Move In?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              Jadwalkan survey lokasi sekarang. Kami jemput Anda, konsultasi gratis sambil ngopi santai.
            </p>
          </div>

          <div className="flex flex-col justify-end items-start md:items-end">
            <motion.a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-luxury-yellow text-luxury-green px-8 py-5 rounded-full text-xl font-bold mb-6 hover:shadow-[0_0_30px_rgba(255,234,0,0.3)] transition-shadow"
            >
              <Phone size={24} />
              Chat WhatsApp (Fast Respon)
            </motion.a>
            <p className="text-gray-500 text-sm">
              {siteConfig.contact.whatsapp.replace(/(\d{2})(\d{4})(\d{4})/, '+$1 $2-$3')} • Admin {siteConfig.logo.text}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-2xl font-bold">
            {siteConfig.logo.text}<span className="text-luxury-yellow">{siteConfig.logo.subtext ? ` ${siteConfig.logo.subtext}` : '.'}</span>
          </div>

          <div className="flex gap-6">
            <a href={siteConfig.social.instagram} className="hover:text-luxury-yellow transition-colors"><Instagram size={20} /></a>
            <a href={siteConfig.social.facebook} className="hover:text-luxury-yellow transition-colors"><Facebook size={20} /></a>
            <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-luxury-yellow transition-colors"><Mail size={20} /></a>
          </div>

          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {siteConfig.logo.text} Property. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};