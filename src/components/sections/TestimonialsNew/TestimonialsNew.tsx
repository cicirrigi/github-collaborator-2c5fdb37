'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import type React from 'react';
import { useEffect, useState } from 'react';

// Import din design-system global
import { typography } from '@/design-system/tokens/typography';
import { animations } from '@/config/animations.config';
import { SectionOrchestrator } from '@/components/layout/SectionOrchestrator';

// Import componente locale
import { TestimonialsGrid } from './components/TestimonialsGrid';
import { testimonialsNewConfig } from './TestimonialsNew.config';
import type { TestimonialsNewProps } from './TestimonialsNew.types';

// Import styles
import gridStyles from './styles/grid.module.css';
import themeStyles from './styles/theme.module.css';

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

      // Debug logging removed for production
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
          variants={animations.staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={animations.viewport}
        >
          {/* 🌟 Section Header */}
          <motion.div className={gridStyles.header} variants={animations.fadeInUp}>
            <motion.h2
              className={`${typography.classes.sectionTitle} mb-4`}
              style={{
                color: 'var(--testimonial-text-primary)',
              }}
            >
              {titleText}{' '}
              {accentText && (
                <span
                  className={themeStyles.accentText}
                  style={{
                    fontWeight: '400',
                    textShadow: typography.effects.goldGlow.textShadow,
                    filter: typography.effects.goldGlow.filter,
                  }}
                >
                  {accentText}
                </span>
              )}
            </motion.h2>

            {/* 🎨 Decorative Line - ca pe homepage */}
            <motion.div className='flex justify-center mb-6' variants={animations.lineExpand}>
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
              variants={animations.fadeIn}
            >
              {sectionSubtitle}
            </motion.p>
          </motion.div>

          {/* 🏗️ Testimonials Grid - componenta principală */}
          <motion.div className={gridStyles.gridSection} variants={animations.fadeInUp}>
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
