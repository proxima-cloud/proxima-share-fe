import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    setIsVisible(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't toggle necessary cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/50 dark:border-neutral-700/50 shadow-xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="container mx-auto max-w-6xl">
            {!showSettings ? (
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="flex items-start space-x-4">
                  <Cookie className="w-6 h-6 text-accent-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                      {t('privacy.cookies.title')}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
                      {t('privacy.cookies.description')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                  <motion.button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('privacy.cookies.customize')}</span>
                  </motion.button>

                  <motion.button
                    onClick={handleRejectAll}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('privacy.cookies.rejectAll')}
                  </motion.button>

                  <motion.button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('privacy.cookies.acceptAll')}
                  </motion.button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                    {t('privacy.cookies.settings')}
                  </h3>
                  <motion.button
                    onClick={() => setShowSettings(false)}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(preferences).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-neutral-800 dark:text-neutral-200">
                          {t(`privacy.cookies.types.${key}.title`)}
                        </h4>
                        <motion.button
                          onClick={() => togglePreference(key as keyof CookiePreferences)}
                          disabled={key === 'necessary'}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            value
                              ? 'bg-primary-600'
                              : 'bg-neutral-300 dark:bg-neutral-600'
                          } ${key === 'necessary' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            animate={{ x: value ? 26 : 2 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {t(`privacy.cookies.types.${key}.description`)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  <motion.button
                    onClick={handleAcceptSelected}
                    className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('privacy.cookies.savePreferences')}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};