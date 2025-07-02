import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const greetings = [
  { lang: 'en', text: 'Hello' },
  { lang: 'fr', text: 'Bonjour' },
  { lang: 'es', text: 'Hola' },
  { lang: 'de', text: 'Hallo' },
  { lang: 'ja', text: 'こんにちは' },
  { lang: 'zh', text: '你好' },
];

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % greetings.length);
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-neutral-800"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <div className="relative mb-8">
          <motion.div
            className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-primary-200 dark:border-primary-800"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.h1
            key={greetings[currentIndex].lang}
            className="text-4xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {greetings[currentIndex].text}
          </motion.h1>
        </AnimatePresence>

        <motion.p
          className="text-lg text-neutral-600 dark:text-neutral-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t('preloader.welcome')}
        </motion.p>

        <div className="w-64 h-2 mx-auto bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <motion.p
          className="mt-4 text-sm text-neutral-500 dark:text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {progress}%
        </motion.p>
      </div>
    </motion.div>
  );
};