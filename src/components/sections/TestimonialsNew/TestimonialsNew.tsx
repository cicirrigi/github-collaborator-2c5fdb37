'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import type React from 'react';
import { useEffect, useState } from 'react';

// Import din design-system global
import { SectionOrchestrator } from '@/components/layout/SectionOrchestrator';

// Import componente locale
import { TestimonialsGrid } from './components/TestimonialsGrid';
import { testimonialsNewConfig } from './TestimonialsNew.config';
import type { TestimonialsNewProps } from './TestimonialsNew.types';

// Import styles și tokens
import gridStyles from './styles/grid.module.css';
import themeStyles from './styles/theme.module.css';
import { motionTokens } from './tokens';

/**
 * 🎭 TestimonialsNew - Main Orchestrator Section
 *
 * Features:
 * ✅ Config-driven content (zero hardcoded text)
 * ✅ CSS Grid cu înălțimi egale (soluția pentru text variabil)
 * ✅ Framer Motion animations cu stagger effect
 * ✅ Design tokens orchestration (fără hardcoding)
 * ✅ Light/Dark theme cu glassmorphism
 * ✅ Responsive design automat
 * ✅ Type-safe props cu overrides
 * ✅ Trust indicators section
 * ✅ Modular architecture
 */

export function TestimonialsNew({
  testimonials,
  title,
  subtitle,
  variant = 'default',
  maxItems,
  className,
  onTestimonialClick,
}: TestimonialsNewProps): React.JSX.Element {
  // Theme detection
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const classTheme = document.documentElement.className.includes('dark');
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Check multiple sources for dark mode
      const isDark = theme === 'dark' || classTheme || mediaQuery;
      setIsDarkMode(isDark);

      // Debug logging
      console.log('Theme detection:', { theme, classTheme, mediaQuery, isDark });
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    // Also listen to media query changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkTheme);
    };
  }, []);

  // Use provided testimonials sau fall back la config
  const testimonialsData = testimonials || testimonialsNewConfig.testimonials;
  const displayTestimonials = maxItems ? testimonialsData.slice(0, maxItems) : testimonialsData;

  // Use provided title/subtitle sau fall back la config
  const sectionTitle = title || testimonialsNewConfig.title;
  const sectionSubtitle = subtitle || testimonialsNewConfig.subtitle;

  // Determine dacă title-ul e string sau object
  const titleIsObject = typeof sectionTitle === 'object' && sectionTitle.main;
  const titleText = titleIsObject ? sectionTitle.main : (sectionTitle as string);
  const accentText = titleIsObject ? sectionTitle.accent : '';

  return (
    <div className={themeStyles.themeProvider} data-theme={isDarkMode ? 'dark' : 'light'}>
      <SectionOrchestrator
        spacing={variant === 'compact' ? 'md' : 'xl'}
        className={cn(themeStyles.themeTransition, className)}
      >
        <motion.div
          className={gridStyles.sectionWrapper}
          variants={motionTokens.scroll.reveal}
          initial='initial'
          whileInView='whileInView'
          viewport={motionTokens.scroll.viewport}
        >
          {/* 🌟 Section Header */}
          <motion.div
            className={gridStyles.header}
            variants={motionTokens.header.title}
            initial='initial'
            whileInView='animate'
            viewport={motionTokens.scroll.viewport}
          >
            <motion.h2
              className='text-4xl md:text-5xl font-light tracking-wide mb-4'
              style={{
                color: 'var(--testimonial-text-primary)',
                textShadow: '0 0 18px rgba(220, 220, 255, 0.3), 0 0 30px rgba(180, 180, 255, 0.2)',
                filter: 'brightness(1.1)',
              }}
            >
              {titleText}{' '}
              {accentText && (
                <span
                  className={themeStyles.accentText}
                  style={{
                    fontWeight: '400',
                    textShadow:
                      '0 0 25px rgba(203, 178, 106, 0.6), 0 0 35px rgba(203, 178, 106, 0.3)',
                    filter: 'brightness(1.15)',
                  }}
                >
                  {accentText}
                </span>
              )}
            </motion.h2>

            {/* 🎨 Decorative Line - ca pe homepage */}
            <motion.div
              className='flex justify-center mb-6'
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={motionTokens.scroll.viewport}
              transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            >
              <div
                className='h-1 w-24 rounded-full bg-gradient-to-r'
                style={{
                  background:
                    'linear-gradient(90deg, var(--testimonial-accent) 0%, var(--testimonial-accent-secondary, var(--testimonial-accent)) 100%)',
                  opacity: 0.8,
                }}
              />
            </motion.div>

            <motion.p
              className='text-lg md:text-xl font-light leading-relaxed'
              style={{
                color: 'var(--testimonial-text-secondary)',
              }}
              variants={motionTokens.header.subtitle}
              initial='initial'
              whileInView='animate'
              viewport={motionTokens.scroll.viewport}
            >
              {sectionSubtitle}
            </motion.p>
          </motion.div>

          {/* 🏗️ Testimonials Grid - componenta principală */}
          <motion.div
            className={gridStyles.gridSection}
            variants={motionTokens.grid.container}
            initial='initial'
            whileInView='animate'
            viewport={motionTokens.scroll.viewport}
          >
            <TestimonialsGrid
              testimonials={displayTestimonials}
              variant={variant}
              {...(onTestimonialClick && { onTestimonialClick })}
            />
          </motion.div>
        </motion.div>
      </SectionOrchestrator>
    </div>
  );
}
