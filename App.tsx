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

  const isSearchPage = route.startsWith('#/cari-rumah');
  const isAboutPage = route.startsWith('#/about-us');
  const isPropertyDetailPage = route.startsWith('#/properti/');
  const isAdminPage = route.startsWith('#/admin');

  return (
    <div className="min-h-screen bg-luxury-offwhite font-sans overflow-x-hidden selection:bg-luxury-green selection:text-luxury-yellow">
      {isAdminPage ? (
        <AdminPage />
      ) : isPropertyDetailPage ? (
        <PropertyDetailPage />
      ) : isSearchPage ? (
        <SearchPage />
      ) : isAboutPage ? (
        <AboutPage />
      ) : (
        <>
          <Navbar />
          <LandingPage />
          <Footer />
        </>
      )}

      {/* Floating AI Agent - Hidden on Property Detail or Admin Page */}
      {!isPropertyDetailPage && !isAdminPage && <ChatAgent />}
    </div>
  );
}