import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Globe, Users, Heart, Award } from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t('about.features.security.title'),
      description: t('about.features.security.description'),
    },
    {
      icon: Zap,
      title: t('about.features.speed.title'),
      description: t('about.features.speed.description'),
    },
    {
      icon: Globe,
      title: t('about.features.global.title'),
      description: t('about.features.global.description'),
    },
    {
      icon: Users,
      title: t('about.features.community.title'),
      description: t('about.features.community.description'),
    },
    {
      icon: Heart,
      title: t('about.features.privacy.title'),
      description: t('about.features.privacy.description'),
    },
    {
      icon: Award,
      title: t('about.features.quality.title'),
      description: t('about.features.quality.description'),
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
            {t('about.title')}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>
        </motion.div>

        {/* Ad Placeholder */}
        <motion.div
          className="mb-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">Advertisement</div>
          <div className="h-24 bg-white/50 dark:bg-neutral-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300 dark:border-blue-700">
            <span className="text-neutral-500 dark:text-neutral-400">Ad Space - 728x90</span>
          </div>
        </motion.div>

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-neutral-800 dark:text-neutral-200">
            {t('about.mission.title')}
          </h2>
          <div className="max-w-4xl mx-auto text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-6">
            <p>{t('about.mission.description1')}</p>
            <p>{t('about.mission.description2')}</p>
            <p>{t('about.mission.description3')}</p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
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
        </motion.div>

        {/* Another Ad Placeholder */}
        <motion.div
          className="mb-16 p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl border border-green-200 dark:border-green-800 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="text-green-600 dark:text-green-400 text-sm font-medium mb-2">Sponsored Content</div>
          <div className="h-32 bg-white/50 dark:bg-neutral-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-300 dark:border-green-700">
            <span className="text-neutral-500 dark:text-neutral-400">Ad Space - 300x250</span>
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-3xl font-display font-bold mb-6 text-neutral-800 dark:text-neutral-200">
            {t('about.cta.title')}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
            {t('about.cta.description')}
          </p>
          <motion.a
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('about.cta.button')}
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};