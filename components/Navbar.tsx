import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'Area', href: '#area' },
    { name: 'Promo', href: '#promo' },
    { name: 'Konsultasi', href: '#footer' },
  ];

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: -100 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-6 inset-x-0 z-50 mx-auto max-w-5xl px-4 md:px-0"
      >
        <div className="relative flex items-center justify-between rounded-full border border-luxury-green/10 bg-white/70 px-6 py-3 backdrop-blur-xl shadow-lg shadow-luxury-green/5">
          {/* Logo */}
          <a href="#" className="font-serif text-xl font-bold tracking-tight text-luxury-green">
            TIAR<span className="text-luxury-gold">.</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-luxury-green/80 hover:text-luxury-green transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-gold transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#footer"
              className="rounded-full bg-luxury-green px-5 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Hubungi Kami
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-luxury-green"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 bg-luxury-offwhite pt-24 px-6 md:hidden"
        >
          <div className="flex flex-col gap-6">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-serif text-luxury-green"
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};