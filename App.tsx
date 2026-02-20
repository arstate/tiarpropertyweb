import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatAgent } from './components/ChatAgent';
import { LandingPage } from './components/LandingPage';
import { SearchPage } from './components/SearchPage';
import { AboutPage } from './components/AboutPage';
import { PropertyDetailPage } from './components/PropertyDetailPage';
import { AdminPage } from './components/AdminPage';

export default function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    // Scroll behavior setting
    document.documentElement.style.scrollBehavior = 'smooth';

    // Hash router logic
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const currentHash = route || window.location.hash;
  const isSearchPage = currentHash.includes('/cari-rumah');
  const isAboutPage = currentHash.includes('/about-us');
  const isPropertyDetailPage = currentHash.includes('/properti/');
  const isAdminPage = currentHash.includes('/admin');

  return (
    <div className="min-h-screen bg-luxury-offwhite font-sans overflow-x-hidden selection:bg-luxury-green selection:text-luxury-yellow relative">
      {!isAdminPage && <Navbar />}

      {isAdminPage ? (
        <AdminPage />
      ) : isPropertyDetailPage ? (
        <PropertyDetailPage />
      ) : isSearchPage ? (
        <SearchPage />
      ) : isAboutPage ? (
        <AboutPage />
      ) : (
        <LandingPage />
      )}

      {!isAdminPage && <Footer />}

      {/* Floating AI Agent - Hidden on Property Detail or Admin Page */}
      {!isPropertyDetailPage && !isAdminPage && <ChatAgent />}
    </div>
  );
}