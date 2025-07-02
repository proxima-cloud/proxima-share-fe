import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDown, Shield, Zap, Globe } from 'lucide-react';
import { gsap } from 'gsap';
import { UploadZone } from '../upload/UploadZone';

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (titleRef.current && subtitleRef.current) {
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      );
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      icon: Shield,
      title: t('hero.features.security.title'),
      description: t('hero.features.security.description'),
    },
    {
      icon: Zap,
      title: t('hero.features.speed.title'),
      description: t('hero.features.speed.description'),
    },
    {
      icon: Globe,
      title: t('hero.features.global.title'),
      description: t('hero.features.global.description'),
    },
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50 dark:from-neutral-900/50 dark:via-neutral-900 dark:to-neutral-800/50" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10"
            style={{
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <motion.div
          className="text-center mb-12 lg:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-4 lg:mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent leading-tight"
          >
            {t('hero.title')}
          </motion.h1>
          
          <motion.p
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <feature.icon className="w-6 h-6 lg:w-8 lg:h-8 text-primary-600 dark:text-primary-400 mb-3 lg:mb-4 mx-auto" />
                <h3 className="text-base lg:text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-12 lg:mb-16"
        >
          <UploadZone />
        </motion.div>

        <motion.div
          className="text-center"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center space-x-2 text-neutral-500 dark:text-neutral-400"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm">{t('hero.scrollDown')}</span>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};