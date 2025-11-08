'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type React from 'react';

import { Container } from '@/components/layout/Container';
import { ExploreBadge, LuxuryCard } from '@/components/ui';
import { designTokens } from '@/config/theme.config';
import { layoutTokens } from '@/design-system/tokens/layout';
import { cn } from '@/lib/utils/cn';

import { servicesConfig } from './ServicesSection.config';

export interface ServicesSectionProps {
  /** Custom styling */
  readonly className?: string;
  /** Override default config */
  readonly customConfig?: Partial<typeof servicesConfig>;
}

/**
 * 🚗 ServicesSection - Benefits & Features showcase
 *
 * Features:
 * - Config-driven services grid
 * - LuxuryCard components with shimmer effects
 * - Responsive grid layout
 * - Staggered animations
 * - Design tokens integration
 */
export function ServicesSection({
  className,
  customConfig,
}: ServicesSectionProps): React.JSX.Element {
  const config = customConfig ? { ...servicesConfig, ...customConfig } : servicesConfig;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: config.animation.stagger,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
      className={cn('py-[var(--section-spacing-lg)]', className)}
      style={
        {
          '--section-spacing-lg': layoutTokens.sectionSpacing.lg,
        } as React.CSSProperties
      }
    >
      <Container size='xl'>
        {/* Section Header */}
        <motion.div
          className='mb-12 text-center'
          initial={config.animation.enabled ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2
            className='mb-4 tracking-wide text-4xl md:text-5xl font-light text-center'
            style={{ color: 'var(--text-primary)' }}
          >
            <span style={{ color: 'var(--text-primary)' }}>{config.title.primary}</span>{' '}
            <span
              style={{
                color: 'var(--brand-primary)',
                textShadow: '0 0 25px rgba(203, 178, 106, 0.7), 0 0 35px rgba(203, 178, 106, 0.4)',
                filter: 'brightness(1.2)',
              }}
            >
              {config.title.accent}
            </span>
          </h2>
          <p
            className='mx-auto max-w-3xl text-lg leading-relaxed'
            style={{ color: 'var(--text-secondary)' }}
          >
            {config.subtitle}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className={cn(
            // Mobile: horizontal scroll carousel
            'flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide',
            // Desktop: normal grid
            'md:grid md:overflow-visible md:pb-0 md:snap-none md:grid-cols-2 lg:grid-cols-5 mx-auto',
            {
              'md:max-w-5xl': config.layout.maxWidth === '5xl',
              'md:max-w-6xl': config.layout.maxWidth === '6xl',
              'md:max-w-7xl': config.layout.maxWidth === '7xl',
            }
          )}
          style={{
            // Mobile carousel styling
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
          variants={containerVariants}
          initial={config.animation.enabled ? 'hidden' : 'visible'}
          whileInView='visible'
          viewport={{ once: true }}
        >
          {config.services.map(service => {
            const IconComponent = service.icon;

            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className='flex-shrink-0 w-[280px] snap-center md:w-auto'
              >
                <LuxuryCard
                  as={Link}
                  variant='shimmer'
                  size='md'
                  hover='shimmer'
                  iconSize='vantage'
                  href={service.href}
                  icon={
                    <IconComponent
                      className='h-full w-full transition-colors duration-200'
                      strokeWidth={1.2}
                      style={{ color: 'var(--brand-primary)' }}
                    />
                  }
                  title={service.title}
                  description={service.description}
                  bottomBadge={
                    <ExploreBadge size='sm' variant='translucent' hover='gold' showArrow={true}>
                      Explore
                    </ExploreBadge>
                  }
                  className='h-full transition-transform duration-300 hover:scale-[1.02]'
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile Swipe Indicator - doar pe mobil */}
        <motion.div
          className='flex items-center justify-center gap-2 mt-4 text-sm md:hidden'
          style={{ color: 'var(--brand-primary)' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <span>Slide To Explore</span>
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M5 12h14M12 5l7 7-7 7' />
            </svg>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
