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

import { typography } from '@/design-system/tokens/typography';
import { animations } from '@/config/animations.config';
import { cn } from '@/lib/utils/cn';

import { AssuranceGrid, LogoBand } from './components';
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
        {/* Header Content - ORCHESTRATED */}
        <motion.div
          variants={animations.staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={animations.viewport}
        >
          {/* Main Title - Bicolor */}
          <motion.h2
            className={cn(tokens.typography.title.base, tokens.spacing.titleBottom)}
            variants={animations.fadeInUp}
          >
            <span className={tokens.typography.title.primary}>{config.title.primary}</span>{' '}
            <span
              className={tokens.typography.title.accent}
              style={{
                textShadow: typography.effects.goldGlow.textShadow,
                filter: typography.effects.goldGlow.filter,
              }}
            >
              {config.title.accent}
            </span>
          </motion.h2>

          {/* Gold separator line */}
          <motion.div
            variants={animations.lineExpand}
            className={cn(
              'h-1 bg-gradient-to-r from-[var(--brand-primary)] to-[#E5D485] mx-auto',
              tokens.spacing.separatorBottom
            )}
            style={{ width: '6rem' }}
          />

          {/* Headline/Subtitle - 3-part with bicolor effect (no glow) */}
          <motion.h3
            className={cn(tokens.typography.headline.base, tokens.spacing.headlineBottom)}
            variants={animations.fadeIn}
          >
            {config.headline.parts.map((part, index) => (
              <span
                key={index}
                className={
                  part.accent
                    ? tokens.typography.headline.accent
                    : tokens.typography.headline.primary
                }
              >
                {part.text}
                {index < config.headline.parts.length - 1 && ' '}
              </span>
            ))}
          </motion.h3>

          {/* Subtext */}
          <motion.p
            className={cn(
              tokens.typography.subtext.base,
              tokens.typography.subtext.color,
              tokens.spacing.subtextBottom
            )}
            variants={animations.fadeIn}
          >
            {config.subtext}
          </motion.p>
        </motion.div>

        {/* Assurance Items Grid */}
        <AssuranceGrid items={config.items} />

        {/* Facts Bar - Sub icoane */}
        <motion.div
          className={cn(tokens.typography.facts.base, tokens.typography.facts.color, 'mt-16 mb-16')}
          initial='hidden'
          whileInView='visible'
          viewport={animations.viewport}
          variants={animations.fadeIn}
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

        {/* Logo Band - Prestige Indicator (luxury edition) */}
        {config.logos.enabled && (
          <LogoBand
            text={config.logos.text}
            logos={config.logos.items}
            centralBrandIndex={2} // Emirates - optical centering (mijloc)
          />
        )}

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
