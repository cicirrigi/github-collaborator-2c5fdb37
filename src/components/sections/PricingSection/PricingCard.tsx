/**
 * 💎 PricingCard - Traditional Pricing Card Component
 *
 * Clean vertical pricing card with features list and CTA.
 * Uses LuxuryCard for consistent design across the site.
 */

'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

import { LuxuryCard } from '@/components/ui/LuxuryCard';
import { cn } from '@/lib/utils/cn';

import { pricingTokens as tokens } from './PricingSection.tokens';
import type { PricingCardProps } from './PricingSection.types';

export function PricingCard({ plan, className }: PricingCardProps): React.JSX.Element {
  const IconComponent = plan.icon;

  return (
    <motion.div
      className={cn('relative', className)}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className={tokens.badge.container}>
          <span className={tokens.badge.base}>Most Popular</span>
        </div>
      )}

      <LuxuryCard variant='shimmer' hover='shimmer' className='h-full flex flex-col p-6'>
        {/* Icon */}
        <div className={tokens.card.icon}>
          <IconComponent className='w-8 h-8' />
        </div>

        {/* Name */}
        <h3 className={tokens.card.name}>{plan.name}</h3>

        {/* Tagline */}
        <p className={tokens.card.tagline}>{plan.tagline}</p>

        {/* Price */}
        <div className={tokens.card.price.container}>
          <div className={tokens.card.price.amount}>{plan.priceFrom}</div>
          {plan.priceNote && <div className={tokens.card.price.note}>{plan.priceNote}</div>}
        </div>

        {/* Divider */}
        <div className={tokens.card.divider} />

        {/* Features List */}
        <div className={tokens.card.features.container}>
          {plan.features.map((feature, index) => (
            <div key={index} className={tokens.card.features.item}>
              <Check className={tokens.card.features.icon} />
              <span className={tokens.card.features.text}>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className='mt-auto pt-4'>
          <Link href={plan.cta.href} className={tokens.card.button}>
            {plan.cta.text}
          </Link>
        </div>
      </LuxuryCard>
    </motion.div>
  );
}
