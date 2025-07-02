import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSelector } from '../ui/LanguageSelector';

// Define animation variants for reusability
const logoPulse = {
  animate: { scale: [1, 1.2, 1] },
  transition: { duration: 2, repeat: 3 }, // Limited repeat for performance
};

const headerSlide = {
  initial: { y: -100 },
  animate: { y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const navHover = {
  whileHover: { y: -2 },
  transition: { type: 'spring', stiffness: 300 },
};

// Navigation link styles
const navLinkClass = 'text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors';

// Navigation items configuration
const navItems = [
  { href: '/', labelKey: 'nav.home', fallback: 'Home' },
  { href: '/about', labelKey: 'nav.about', fallback: 'About' },
  { href: '/features', labelKey: 'nav.features', fallback: 'Features' },
  { href: '/privacy', labelKey: 'nav.privacy', fallback: 'Privacy' },
];

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200/50 dark:border-neutral-700/50"
      {...headerSlide}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link to="/" aria-label="ProximaShare Home">
              <div className="relative">
                <Share2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                <motion.div
                  className="absolute inset-0 w-8 h-8 rounded-full bg-primary-500/20"
                  {...logoPulse}
                />
              </div>
            </Link>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ProximaShare
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div key={item.href} {...navHover}>
                <Link
                  to={item.href}
                  className={navLinkClass}
                  aria-label={t(item.labelKey, item.fallback)}
                >
                  {t(item.labelKey, item.fallback)}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-700 dark:text-neutral-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Theme and Language Selectors */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.nav
          className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white dark:bg-neutral-900 p-4`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label={t(item.labelKey, item.fallback)}
            >
              {t(item.labelKey, item.fallback)}
            </Link>
          ))}
        </motion.nav>
      </div>
    </motion.header>
  );
};