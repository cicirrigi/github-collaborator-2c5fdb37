/**
 * 🛡️ VantageAssuranceSection - Trust & Prestige
 *
 * Elegant trust section between Fleet and Testimonials
 * Features:
 * - 3-part headline with bicolor effect
 * - Quick facts bar
 * - 6 assurance items in 2×3 grid
 * - Soft footer CTA
 * - Theme-aware styling
 * - Responsive design
 * - Staggered animations
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils/cn';

import { AssuranceGrid } from './components';
import { assuranceConfig } from './VantageAssuranceSection.config';
import { assuranceTokens } from './VantageAssuranceSection.tokens';
import type { VantageAssuranceSectionProps } from './VantageAssuranceSection.types';

const config = assuranceConfig;
const tokens = assuranceTokens;

export function VantageAssuranceSection({
  className,
  hide = false,
}: VantageAssuranceSectionProps): React.JSX.Element | null {
  if (hide) return null;

  return (
    <section className={cn(tokens.spacing.section, className)}>
      <div className={tokens.spacing.container}>
        {/* Headline - 3-part with bicolor effect */}
        <motion.h2
          className={cn(tokens.typography.headline.base, tokens.spacing.headlineBottom)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {config.headline.parts.map((part, index) => (
            <span
              key={index}
              className={
                part.accent ? tokens.typography.headline.accent : tokens.typography.headline.primary
              }
              style={
                part.accent
                  ? {
                      textShadow:
                        '0 0 25px rgba(203, 178, 106, 0.7), 0 0 35px rgba(203, 178, 106, 0.4)',
                      filter: 'brightness(1.2)',
                    }
                  : undefined
              }
            >
              {part.text}
              {index < config.headline.parts.length - 1 && ' '}
            </span>
          ))}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className={cn(
            tokens.typography.subtext.base,
            tokens.typography.subtext.color,
            tokens.spacing.subtextBottom
          )}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {config.subtext}
        </motion.p>

        {/* Facts Bar */}
        <motion.div
          className={cn(
            tokens.typography.facts.base,
            tokens.typography.facts.color,
            tokens.spacing.factsBottom
          )}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {config.facts.map((fact, index) => (
            <React.Fragment key={index}>
              <span className='flex items-center gap-1.5'>
                <fact.icon
                  className={cn(tokens.icon.factSize, tokens.icon.factStroke, tokens.colors.icon)}
                />
                {fact.text}
              </span>
              {index < config.facts.length - 1 && (
                <span className={tokens.colors.separator}>|</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Assurance Items Grid */}
        <AssuranceGrid items={config.items} />

        {/* Footer CTA */}
        <motion.p
          className={cn(
            tokens.typography.footer.base,
            tokens.typography.footer.color,
            tokens.spacing.footerTop
          )}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          {config.footer.text}{' '}
          <Link href={config.footer.linkHref} className={tokens.typography.footer.link}>
            {config.footer.linkText}
          </Link>{' '}
          — <em>{config.footer.emphasis}</em>.
        </motion.p>
      </div>
    </section>
  );
}
