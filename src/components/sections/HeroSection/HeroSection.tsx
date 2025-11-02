'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

import { SectionOrchestrator } from '@/components/layout/SectionOrchestrator';
import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import { heroConfig } from './HeroSection.config';
import type { HeroProps } from './HeroSection.types';

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
    <div
      className={cn(
        'flex items-center',
        variant === 'full-screen' && 'min-h-screen',
        variant === 'minimal' && 'py-24',
        variant === 'default' && 'h-[var(--hero-height)] min-h-[var(--hero-min-height)]'
      )}
      style={
        {
          '--hero-height': config.layout.height,
          '--hero-min-height': config.layout.minHeight,
        } as React.CSSProperties
      }
    >
      <SectionOrchestrator spacing='xl' noContainer className={cn('w-full', className)}>
        {/* Background Image */}
        {config.background.image && (
          <Image
            src={config.background.image}
            alt='Vantage Lane Hero Background'
            fill
            className={cn(
              'object-cover',
              // Theme-aware brightness (more readable)
              'brightness-[0.7] dark:brightness-[0.5]'
            )}
            priority
            sizes='100vw'
          />
        )}

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
            initial={config.animation.enabled ? 'hidden' : 'visible'}
            animate='visible'
          >
            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className='text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl'
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
                className='mx-auto max-w-2xl text-lg leading-relaxed text-neutral-200 md:text-xl'
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
      </SectionOrchestrator>
    </div>
  );
}
