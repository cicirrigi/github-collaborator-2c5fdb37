'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type React from 'react';

import { Container } from '@/components/layout/Container';
import { LuxuryCard, ExploreBadge } from '@/components/ui';
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
            className='mb-4 text-3xl font-bold tracking-tight md:text-4xl'
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {config.title}
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
          className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-5 mx-auto', {
            'max-w-5xl': config.layout.maxWidth === '5xl',
            'max-w-6xl': config.layout.maxWidth === '6xl',
            'max-w-7xl': config.layout.maxWidth === '7xl',
          })}
          variants={containerVariants}
          initial={config.animation.enabled ? 'hidden' : 'visible'}
          whileInView='visible'
          viewport={{ once: true }}
        >
          {config.services.map(service => {
            const IconComponent = service.icon;

            return (
              <motion.div key={service.id} variants={itemVariants}>
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
      </Container>
    </section>
  );
}
