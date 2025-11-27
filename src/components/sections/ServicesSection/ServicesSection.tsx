'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type React from 'react';

import { Container } from '@/components/layout/Container';
import { ExploreBadge } from '@/components/ui/ExploreBadge';
import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { designTokens } from '@/config/theme.config';
import { layoutTokens } from '@/design-system/tokens/layout';
import { typography } from '@/design-system/tokens/typography';
import { cn } from '@/lib/utils/cn';

import { ServicesSwipeIndicator } from './components';
import { useServicesAutoHide } from './hooks';
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

  // Use extracted auto-hide hook
  const autoHide = useServicesAutoHide();

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
            className={`${typography.classes.sectionTitle} text-center mb-4`}
            style={{ color: 'var(--text-primary)' }}
          >
            <span style={{ color: 'var(--text-primary)' }}>{config.title.primary}</span>{' '}
            <span
              style={{
                color: 'var(--brand-primary)',
                textShadow: typography.effects.goldGlow.textShadow,
                filter: typography.effects.goldGlow.filter,
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
      </Container>

      {/* Services Grid - OUTSIDE Container for proper centering */}
      <motion.div
        ref={autoHide.carouselRef}
        className={cn(
          // Mobile: horizontal scroll carousel
          'flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide',
          // Desktop: normal grid - simplified with direct grid-template-columns
          'md:grid md:overflow-visible md:pb-0 md:snap-none mx-auto md:max-w-7xl md:px-8',
          'lg:[grid-template-columns:repeat(5,minmax(220px,1fr))] md:[grid-template-columns:repeat(2,minmax(220px,1fr))]'
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
              className='flex-shrink-0 w-[min(270px,80vw)] snap-center md:w-auto'
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

      {/* Mobile Swipe Indicator - doar pe mobil, simple auto-hide cu offset pentru primul card */}
      <ServicesSwipeIndicator autoHide={autoHide} />
    </section>
  );
}
