import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { About } from './components/pages/About';
import { Features } from './components/pages/Features';
import { Privacy } from './components/pages/Privacy';
import { Scene3D } from './components/3d/Scene3D';
import { CookieConsent } from './components/privacy/CookieConsent';
import { Preloader } from './components/ui/Preloader';
import './i18n';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Prevent scrolling during preloader
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  useEffect(() => {
    // Simple routing based on hash
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Set initial page

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'features':
        return <Features />;
      case 'privacy':
        return <Privacy />;
      default:
        return (
          <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
            <Scene3D />
            <main>
              <Hero />
            </main>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="preloader" onComplete={handlePreloaderComplete} />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Header />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
            <CookieConsent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;