import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Globe, Lock, Download, Share, Clock, Users } from 'lucide-react';

export const Features: React.FC = () => {
  const { t } = useTranslation();

  const mainFeatures = [
    {
      icon: Shield,
      title: t('features.main.security.title'),
      description: t('features.main.security.description'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Zap,
      title: t('features.main.speed.title'),
      description: t('features.main.speed.description'),
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: Globe,
      title: t('features.main.global.title'),
      description: t('features.main.global.description'),
      color: 'from-green-500 to-teal-600',
    },
  ];

  const detailedFeatures = [
    {
      icon: Lock,
      title: t('features.detailed.encryption.title'),
      description: t('features.detailed.encryption.description'),
    },
    {
      icon: Download,
      title: t('features.detailed.download.title'),
      description: t('features.detailed.download.description'),
    },
    {
      icon: Share,
      title: t('features.detailed.sharing.title'),
      description: t('features.detailed.sharing.description'),
    },
    {
      icon: Clock,
      title: t('features.detailed.expiration.title'),
      description: t('features.detailed.expiration.description'),
    },
    {
      icon: Users,
      title: t('features.detailed.collaboration.title'),
      description: t('features.detailed.collaboration.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
            {t('features.title')}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Main Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="relative bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`} />
              <feature.icon className="w-12 h-12 text-primary-600 dark:text-primary-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">
                {feature.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Ad Placeholder */}
        <motion.div
          className="mb-20 p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-2">Advertisement</div>
          <div className="h-24 bg-white/50 dark:bg-neutral-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300 dark:border-purple-700">
            <span className="text-neutral-500 dark:text-neutral-400">Ad Space - 970x90</span>
          </div>
        </motion.div>

        {/* Detailed Features */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-neutral-800 dark:text-neutral-200">
            {t('features.detailed.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detailedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Ad */}
        <motion.div
          className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-2">Sponsored</div>
          <div className="h-32 bg-white/50 dark:bg-neutral-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-orange-300 dark:border-orange-700">
            <span className="text-neutral-500 dark:text-neutral-400">Ad Space - 320x100</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};