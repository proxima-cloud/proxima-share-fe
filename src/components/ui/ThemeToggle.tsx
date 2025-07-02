import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/useThemeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-neutral-200/80 dark:bg-neutral-700/80 backdrop-blur-sm border border-neutral-300/50 dark:border-neutral-600/50 hover:bg-neutral-300/80 dark:hover:bg-neutral-600/80 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="relative w-5 h-5"
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: theme === 'dark' ? 0 : 1,
            scale: theme === 'dark' ? 0.5 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Sun className="w-5 h-5 text-amber-500" />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: theme === 'dark' ? 1 : 0,
            scale: theme === 'dark' ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        >
          <Moon className="w-5 h-5 text-blue-400" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
};