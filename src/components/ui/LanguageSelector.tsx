import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === i18n.language) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);
    
    // Add a smooth transition effect
    await new Promise(resolve => setTimeout(resolve, 150));
    
    await i18n.changeLanguage(langCode);
    
    // Complete the transition
    setTimeout(() => {
      setIsChanging(false);
      setIsOpen(false);
    }, 150);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full bg-neutral-200/80 dark:bg-neutral-700/80 backdrop-blur-sm border border-neutral-300/50 dark:border-neutral-600/50 hover:bg-neutral-300/80 dark:hover:bg-neutral-600/80 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
        <AnimatePresence mode="wait">
          <motion.span
            key={currentLanguage.code}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hidden sm:inline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentLanguage.flag}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-full mt-2 w-48 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md rounded-lg shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden z-50"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-neutral-100/80 dark:hover:bg-neutral-700/80 transition-colors disabled:opacity-50"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  disabled={isChanging}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {language.name}
                    </span>
                  </div>
                  {currentLanguage.code === language.code && (
                    <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Loading overlay during language change */}
      <AnimatePresence>
        {isChanging && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Changing language...
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};