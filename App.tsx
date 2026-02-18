import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { PropertyShowcase } from './components/PropertyShowcase';
import { ValueProps } from './components/ValueProps';
import { SocialProof } from './components/SocialProof';
import { Footer } from './components/Footer';
import { ChatAgent } from './components/ChatAgent';

export default function App() {
  // Smooth scroll behavior for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-luxury-offwhite font-sans overflow-x-hidden selection:bg-luxury-green selection:text-luxury-yellow">
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <BentoGrid />
        <PropertyShowcase />
        <ValueProps />
        <SocialProof />
      </main>

      <Footer />
      
      {/* Floating AI Agent */}
      <ChatAgent />
    </div>
  );
}