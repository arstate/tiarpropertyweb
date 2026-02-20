import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    const onHashChange = () => {
      setActiveHash(window.location.hash || '#home');
    };

    onHashChange();
    window.addEventListener('hashchange', onHashChange);

    const handleScroll = () => {
      // If on a sub-page (starts with #/), don't let scroll spy overwrite
      if (window.location.hash.startsWith('#/') && window.location.hash !== '#/about-us') {
        return;
      }

      // Sections in their actual DOM order (Home -> Area -> About -> Footer)
      const sections = ['home', 'area', 'about', 'footer'];
      const scrollThreshold = 150;

      // Check if we're at the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

      let current = '#home';

      if (isAtBottom) {
        current = '#footer';
      } else {
        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= scrollThreshold) {
              current = `#${sectionId}`;
            }
          }
        }
      }

      if (current !== activeHash) {
        setActiveHash(current);
        // Update URL without adding to history to prevent breaking "Back" button
        if (window.location.hash !== current) {
          window.history.replaceState(null, '', current);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeHash]);

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'Area', href: '#area' },
    { name: 'About', href: '#about' },
    { name: 'Katalog', href: '#/cari-rumah' },
    { name: 'Konsultasi', href: '#footer' },
  ];

  const handleNav = (href: string) => {
    window.location.hash = href;
    setMobileMenuOpen(false);
  };

  const isLinkActive = (href: string) => {
    // Special handling for Katalog (Search Page)
    if (href === '#/cari-rumah') {
      return activeHash.startsWith('#/cari-rumah') || activeHash.startsWith('#/properti');
    }
    // Special handling for About (Section and Page)
    if (href === '#about') {
      return activeHash === '#about' || activeHash === '#/about-us';
    }
    // Special handling for Home
    if (href === '#home') {
      return activeHash === '' || activeHash === '##' || activeHash === '#home';
    }
    // Standard hash matching
    return activeHash === href;
  };

  return (
    <>
      {/* 
        Outer Container: Fixed position, establishes Z-index context.
        Extended max-w-7xl for a wide, premium feel across the screen.
      */}
      <div className="fixed top-6 inset-x-0 z-50 mx-auto max-w-7xl px-4 md:px-8 pointer-events-none">

        {/* iOS-Style Glassmorphic Navbar Pill with VIBRANT Gold matching the slider */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-50 flex items-center justify-between rounded-full border border-white/40 bg-gradient-to-r from-[#C5A059]/85 via-[#E3C67B]/95 to-[#C5A059]/85 px-8 py-3.5 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.15)] pointer-events-auto overflow-hidden"
        >
          {/* Subtle Glass Shimmer Effect */}
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none"
            initial={{ x: '-150%' }}
            animate={{ x: '150%' }}
            transition={{
              repeat: Infinity,
              duration: 5,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          >
            <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-20 blur-xl" />
          </motion.div>

          {/* Logo - Darker for readability on high-saturation glass */}
          <button
            onClick={() => handleNav('#home')}
            className="relative z-10 font-serif text-2xl font-bold tracking-tight text-luxury-green hover:scale-105 transition-transform bg-transparent border-none cursor-pointer"
          >
            TIAR<span className="text-black/60">.</span>
          </button>

          {/* Desktop Links - Bold and dark for maximum contrast */}
          <div className="hidden md:flex items-center gap-10 relative z-10">
            {links.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.href)}
                  className={`text-sm font-extrabold transition-colors relative group tracking-wide antialiased bg-transparent border-none cursor-pointer ${active ? 'text-black' : 'text-luxury-green hover:text-black'
                    }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-luxury-green transition-all ${active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </button>
              );
            })}
          </div>

          {/* CTA Button (Desktop) - High contrast solid element */}
          <div className="hidden md:block relative z-10">
            <button
              onClick={() => handleNav('#footer')}
              className="rounded-full bg-luxury-green px-8 py-2.5 text-xs font-extrabold text-white transition-all hover:scale-105 hover:bg-black active:scale-95 uppercase tracking-wider shadow-lg shadow-black/20 border-none cursor-pointer"
            >
              Hubungi Kami
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-luxury-green p-1 active:scale-95 transition-transform relative z-10 bg-transparent border-none cursor-pointer"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </motion.div>

        {/* Mobile Menu Overlay & Popup */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm pointer-events-auto"
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10, x: 10 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="absolute top-full right-4 md:right-8 mt-4 w-72 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/40 p-2 z-50 flex flex-col overflow-hidden md:hidden origin-top-right pointer-events-auto"
              >
                <div className="flex flex-col relative z-10">
                  {links.map((link, i) => {
                    const active = isLinkActive(link.href);
                    return (
                      <motion.button
                        key={link.name}
                        onClick={() => handleNav(link.href)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`font-serif text-lg font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-between group w-full text-left bg-transparent border-none cursor-pointer ${active ? 'bg-luxury-gold/20 text-black' : 'text-luxury-green hover:bg-luxury-gold/10 hover:text-black'
                          }`}
                      >
                        {link.name}
                        <ArrowRight size={16} className={`transition-all duration-300 ${active ? 'text-luxury-gold opacity-100 translate-x-0' : 'text-luxury-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0'
                          }`} />
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-luxury-green/10 px-2 pb-2">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => handleNav('#footer')}
                    className="flex items-center justify-center w-full py-3 bg-luxury-green text-white font-bold text-center rounded-xl text-sm hover:bg-black transition-colors shadow-inner border-none cursor-pointer"
                  >
                    Hubungi Kami
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};