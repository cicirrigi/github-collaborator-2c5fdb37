'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type React from 'react';

import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import { heroConfig } from './HeroSection.config';
import type { HeroProps } from './HeroSection.types';

// Import AnimatedBackground only on client to prevent hydration errors
const AnimatedBackground = dynamic(
  () => import('@/components/ui/AnimatedBackground').then(mod => mod.AnimatedBackground),
  { ssr: false }
);

/**
 * 🎯 HeroSection - Homepage hero with luxury animations
 *
 * Features:
 * - Config-driven content (zero hardcoded text)
 * - Framer Motion animations
 * - Responsive images with Next.js optimization
 * - Design tokens integration
 * - Multiple variants support
 * - Reusable across pages
 */
export function HeroSection({
  customConfig,
  className,
  variant = 'default',
}: HeroProps): React.JSX.Element {
  // Merge custom config with defaults
  const config = customConfig ? { ...heroConfig, ...customConfig } : heroConfig;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: config.animation.stagger,
        duration: config.animation.duration,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: config.animation.duration,
        ease: designTokens.animations.easing.framer.ease,
      },
    },
  };

  return (
    <section
      className={cn(
        'relative flex items-center w-full overflow-hidden',
        variant === 'full-screen' && 'min-h-screen',
        variant === 'minimal' && 'py-24',
        variant === 'default' && 'h-[var(--hero-height)] min-h-[var(--hero-min-height)]',
        className
      )}
      style={
        {
          '--hero-height': config.layout.height,
          '--hero-min-height': config.layout.minHeight,
        } as React.CSSProperties
      }
    >
      {/* Theme-aware base background for orb contrast */}
      <div className='absolute inset-0 bg-gradient-to-br from-neutral-100 via-neutral-50 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-black' />

      {/* Animated Background with Floating Orbs */}
      <AnimatedBackground
        variant='luxury'
        speed='normal'
        intensity='medium'
        colorScheme='gold'
        enableParallax={true}
        zIndex={0}
      />

      {/* Theme-aware overlay for better text contrast */}
      <div
        className='absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/30 dark:from-black/30 dark:via-black/20 dark:to-black/40'
        style={{ zIndex: 1 }}
      />

      {/* Content Container */}
      <div
        className={cn(
          'container mx-auto px-4 relative z-10',
          config.layout.textAlign === 'center' && 'text-center',
          config.layout.textAlign === 'left' && 'text-left',
          config.layout.textAlign === 'right' && 'text-right'
        )}
      >
        <motion.div
          className={cn('mx-auto space-y-8', {
            'max-w-xl': config.layout.maxWidth === 'xl',
            'max-w-2xl': config.layout.maxWidth === '2xl',
            'max-w-3xl': config.layout.maxWidth === '3xl',
            'max-w-4xl': config.layout.maxWidth === '4xl',
            'max-w-5xl': config.layout.maxWidth === '5xl',
            'max-w-6xl': config.layout.maxWidth === '6xl',
            'max-w-7xl': config.layout.maxWidth === '7xl',
          })}
          variants={containerVariants}
          initial={false}
          animate='visible'
        >
          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className='text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-6xl lg:text-7xl'
            style={{
              fontFamily: 'var(--font-display)',
              lineHeight: '1.1',
            }}
          >
            {config.title}
            {config.subtitle && (
              <span
                className='block text-[var(--brand-primary)]'
                style={{ color: 'var(--brand-primary)' }}
              >
                {config.subtitle}
              </span>
            )}
          </motion.h1>

          {/* Description */}
          {config.description && (
            <motion.p
              variants={itemVariants}
              className='mx-auto max-w-2xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-200 md:text-xl'
            >
              {config.description}
            </motion.p>
          )}

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <Link
              href={config.cta.href}
              className={cn(
                'inline-flex items-center justify-center rounded-md font-semibold transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
                // Size variants
                config.cta.size === 'sm' && 'px-4 py-2 text-sm',
                config.cta.size === 'md' && 'px-6 py-3 text-base',
                config.cta.size === 'lg' && 'px-8 py-4 text-lg',
                // Variant styles
                config.cta.variant === 'primary' &&
                  'bg-brand-primary text-black hover:bg-brand-primary/90',
                config.cta.variant === 'secondary' &&
                  'bg-neutral-800 text-white hover:bg-neutral-700',
                config.cta.variant === 'outline' &&
                  'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-black'
              )}
            >
              {config.cta.label}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
