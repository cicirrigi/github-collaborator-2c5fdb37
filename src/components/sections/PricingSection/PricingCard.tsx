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
import { animations } from '@/config/animations.config';
import { cn } from '@/lib/utils/cn';

import { pricingTokens as tokens } from './PricingSection.tokens';
import type { PricingCardProps } from './PricingSection.types';

export function PricingCard({ plan, className }: PricingCardProps): React.JSX.Element {
  const IconComponent = plan.icon;

  return (
    <motion.div className={cn('relative h-full', className)} variants={animations.slideInUp}>
      <LuxuryCard variant='shimmer' hover='shimmer' className='h-full p-6 relative'>
        {/* Popular Badge - Consistent cu Fleet */}
        {plan.popular && (
          <div className='absolute top-1 right-0 z-20'>
            <span
              className='px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm'
              style={{
                background:
                  'linear-gradient(135deg, rgba(203, 178, 106, 0.9), rgba(203, 178, 106, 0.7))',
                color: 'var(--background-dark)',
                border: '1px solid rgba(203, 178, 106, 0.3)',
                boxShadow:
                  '0 2px 8px rgba(203, 178, 106, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              ★ Popular
            </span>
          </div>
        )}

        <div className='h-full flex flex-col'>
          {/* Icon */}
          <div className={tokens.card.icon}>
            <IconComponent className='w-6 h-6' />
          </div>

          {/* Name */}
          <h3 className={tokens.card.name}>{plan.name}</h3>

          {/* Tagline */}
          <p className={tokens.card.tagline}>{plan.tagline}</p>

          {/* Price */}
          <div className={tokens.card.price.container}>
            <div className={tokens.card.price.amount}>{plan.priceFrom}</div>
            <div className={tokens.card.price.note}>{plan.priceNote || '\u00A0'}</div>
          </div>

          {/* Divider */}
          <div className={tokens.card.divider} />

          {/* Features List */}
          <div className={tokens.card.features.container}>
            {plan.features.map((feature, index) => (
              <div key={index} className={tokens.card.features.item}>
                <div className='flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5'>
                  <Check className={tokens.card.features.icon} />
                </div>
                <span className={tokens.card.features.text}>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className='mt-auto pt-4'>
            <Link
              href={plan.cta.href}
              className={tokens.card.button}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--brand-primary)';
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '';
                e.currentTarget.style.color = '';
                e.currentTarget.style.borderColor = '';
              }}
            >
              {plan.cta.text}
            </Link>
          </div>
        </div>
      </LuxuryCard>
    </motion.div>
  );
}
