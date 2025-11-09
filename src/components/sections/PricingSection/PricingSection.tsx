/**
 * 💎 PricingSection - Main Pricing Component
 *
 * Displays pricing packages with 3D flip cards.
 * Config-driven, responsive, dark mode compatible.
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type React from 'react';

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
        {/* Title & Subtitle */}
        {!hideTitle && (
          <div className='text-center mb-16'>
            <motion.div
              className={tokens.typography.title.container}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <h2 className={tokens.typography.title.primary}>
                {finalConfig.title.primary}{' '}
                <span className={tokens.typography.title.accent}>{finalConfig.title.accent}</span>
              </h2>
            </motion.div>

            <motion.div
              className={tokens.typography.subtitle.container}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <p className={tokens.typography.subtitle.base}>{finalConfig.subtitle}</p>
            </motion.div>

            <motion.div
              className={tokens.typography.commitment.container}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              {finalConfig.commitment.map((item, index) => (
                <div key={index} className={tokens.typography.commitment.item}>
                  <span className={tokens.typography.commitment.icon}>✓</span>
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className={tokens.grid.container}>
          {displayPackages.map(pkg => (
            <PricingCard key={pkg.id} plan={pkg} />
          ))}
        </div>

        {/* Bottom CTA */}
        {finalConfig.cta && (
          <motion.div
            className={tokens.bottomCta.container}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, margin: '-100px' }}
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
