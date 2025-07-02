import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Eye, Lock, Trash2, FileText, Globe } from 'lucide-react';

export const Privacy: React.FC = () => {
  const { t } = useTranslation();

  const principles = [
    {
      icon: Shield,
      title: t('privacy.principles.protection.title'),
      description: t('privacy.principles.protection.description'),
    },
    {
      icon: Eye,
      title: t('privacy.principles.transparency.title'),
      description: t('privacy.principles.transparency.description'),
    },
    {
      icon: Lock,
      title: t('privacy.principles.security.title'),
      description: t('privacy.principles.security.description'),
    },
    {
      icon: Trash2,
      title: t('privacy.principles.deletion.title'),
      description: t('privacy.principles.deletion.description'),
    },
    {
      icon: FileText,
      title: t('privacy.principles.minimal.title'),
      description: t('privacy.principles.minimal.description'),
    },
    {
      icon: Globe,
      title: t('privacy.principles.compliance.title'),
      description: t('privacy.principles.compliance.description'),
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
            {t('privacy.title')}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            {t('privacy.subtitle')}
          </p>
        </motion.div>

        {/* Privacy Principles */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <principle.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
                {principle.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Ad Placeholder */}
        <motion.div
          className="mb-16 p-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-2">Advertisement</div>
          <div className="h-24 bg-white/50 dark:bg-neutral-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-indigo-300 dark:border-indigo-700">
            <span className="text-neutral-500 dark:text-neutral-400">Ad Space - 728x90</span>
          </div>
        </motion.div>

        {/* Privacy Policy Content */}
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">
              {t('privacy.policy.dataCollection.title')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              {t('privacy.policy.dataCollection.description')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>{t('privacy.policy.dataCollection.item1')}</li>
              <li>{t('privacy.policy.dataCollection.item2')}</li>
              <li>{t('privacy.policy.dataCollection.item3')}</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">
              {t('privacy.policy.dataUsage.title')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('privacy.policy.dataUsage.description')}
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">
              {t('privacy.policy.dataRetention.title')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t('privacy.policy.dataRetention.description')}
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">
              {t('privacy.policy.userRights.title')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              {t('privacy.policy.userRights.description')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>{t('privacy.policy.userRights.right1')}</li>
              <li>{t('privacy.policy.userRights.right2')}</li>
              <li>{t('privacy.policy.userRights.right3')}</li>
              <li>{t('privacy.policy.userRights.right4')}</li>
            </ul>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">
            {t('privacy.contact.title')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {t('privacy.contact.description')}
          </p>
          <motion.a
            href="mailto:privacy@proximashare.com"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('privacy.contact.button')}
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};