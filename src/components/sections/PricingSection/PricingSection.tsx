/**
 * 💎 PricingSection - Main Pricing Component
 *
 * Displays pricing packages with 3D flip cards.
 * Config-driven, responsive, dark mode compatible.
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { typography } from '@/design-system/tokens/typography';
import { animations } from '@/config/animations.config';
import { cn } from '@/lib/utils/cn';

import { PricingCard } from './PricingCard';
import { pricingConfig } from './PricingSection.config';
import { pricingTokens as tokens } from './PricingSection.tokens';
import type { PricingSectionProps } from './PricingSection.types';

/**
 * PricingSection Component
 *
 * Features:
 * - Config-driven content
 * - Traditional vertical pricing cards with LuxuryCard
 * - Responsive grid layout (1/2/4 columns)
 * - Framer Motion animations
 * - Design tokens integration
 */
export function PricingSection({
  config = pricingConfig,
  customConfig,
  className,
  hideTitle = false,
  maxPackages,
}: PricingSectionProps): React.JSX.Element {
  // Merge custom config with defaults
  const finalConfig = customConfig ? { ...config, ...customConfig } : config;

  // Limit packages if maxPackages is specified
  const displayPackages = maxPackages
    ? finalConfig.packages.slice(0, maxPackages)
    : finalConfig.packages;

  return (
    <section className={cn(tokens.container.base, className)}>
      <div className={tokens.container.maxWidth}>
        {/* Title & Subtitle - ORCHESTRATED */}
        {!hideTitle && (
          <motion.div
            className='text-center mb-16'
            variants={animations.staggerContainer}
            initial='hidden'
            whileInView='visible'
            viewport={animations.viewport}
          >
            <motion.div
              className={tokens.typography.title.container}
              variants={animations.fadeInUp}
            >
              <h2 className={tokens.typography.title.primary}>
                {finalConfig.title.primary}{' '}
                <span
                  className={tokens.typography.title.accent}
                  style={{
                    textShadow: typography.effects.goldGlow.textShadow,
                    filter: typography.effects.goldGlow.filter,
                  }}
                >
                  {finalConfig.title.accent}
                </span>
              </h2>
            </motion.div>

            <motion.div
              className={tokens.typography.subtitle.container}
              variants={animations.fadeIn}
            >
              <p className={tokens.typography.subtitle.base}>{finalConfig.subtitle}</p>
            </motion.div>
          </motion.div>
        )}

        {/* Pricing Cards Grid - ORCHESTRATED (stânga → dreapta) */}
        <motion.div
          className={tokens.grid.container}
          variants={animations.staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={animations.viewport}
        >
          {displayPackages.map(pkg => (
            <PricingCard key={pkg.id} plan={pkg} />
          ))}
        </motion.div>

        {/* Commitment Facts - Jos sub grid */}
        <motion.div
          className='flex flex-wrap items-center justify-center gap-3 mt-16 mb-16 text-sm md:text-base text-neutral-500 dark:text-neutral-600'
          initial='hidden'
          whileInView='visible'
          viewport={animations.viewport}
          variants={animations.fadeIn}
        >
          {finalConfig.commitment.map((item, index) => (
            <React.Fragment key={index}>
              <span className='flex items-center gap-2'>
                <item.icon
                  className='w-4 h-4 stroke-[2] text-[var(--brand-primary)]'
                  aria-hidden='true'
                />
                {item.text}
              </span>
              {index < finalConfig.commitment.length - 1 && (
                <span className='text-[var(--brand-primary)]/30'>|</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Bottom CTA - ORCHESTRATED */}
        {finalConfig.cta && (
          <motion.div
            className={tokens.bottomCta.container}
            variants={animations.fadeIn}
            initial='hidden'
            whileInView='visible'
            viewport={animations.viewport}
          >
            {finalConfig.cta.description && (
              <p className={tokens.bottomCta.description}>{finalConfig.cta.description}</p>
            )}
            <Link href={finalConfig.cta.href} className={tokens.bottomCta.button}>
              {finalConfig.cta.text}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
