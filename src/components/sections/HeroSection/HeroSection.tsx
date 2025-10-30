'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';
import { designTokens } from '@/config/theme.config';

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
    <section
      className={cn(
        'relative flex items-center overflow-hidden',
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
      {/* Background Image */}
      {config.background.image && (
        <Image
          src={config.background.image}
          alt='Vantage Lane Hero Background'
          fill
          className='object-cover brightness-[0.4]'
          priority
          sizes='100vw'
        />
      )}

      {/* Background Gradient Overlay */}
      <div
        className={cn(
          'absolute inset-0',
          `bg-gradient-to-br ${config.background.gradient}`,
          config.background.overlay
        )}
      />

      {/* Content */}
      <Container
        size='xl'
        className={cn(
          'relative z-10',
          config.layout.textAlign === 'center' && 'text-center',
          config.layout.textAlign === 'left' && 'text-left',
          config.layout.textAlign === 'right' && 'text-right'
        )}
      >
        <motion.div
          className={cn('mx-auto space-y-8', `max-w-${config.layout.maxWidth}`)}
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
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/50',
                // Size variants
                config.cta.size === 'sm' && 'px-4 py-2 text-sm',
                config.cta.size === 'md' && 'px-6 py-3 text-base',
                config.cta.size === 'lg' && 'px-8 py-4 text-lg',
                // Variant styles
                config.cta.variant === 'primary' &&
                  'bg-[var(--brand-primary)] text-black hover:opacity-90',
                config.cta.variant === 'secondary' &&
                  'bg-neutral-800 text-white hover:bg-neutral-700',
                config.cta.variant === 'outline' &&
                  'border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-black'
              )}
            >
              {config.cta.label}
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
