/**
 * 📝 NarrativeContent Component
 * Text side: title (bicolor like VantageAssurance), subheadline, blocks, CTA
 */

'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { typography } from '@/design-system/tokens/typography';
import { animations } from '@/config/animations.config';
import { cn } from '@/lib/utils/cn';

import type { NarrativeBlock, NarrativeCTA } from '../NarrativeSection.types';
import { narrativeTokens } from '../NarrativeSection.tokens';

const tokens = narrativeTokens;

interface NarrativeContentProps {
  /** Title (bicolor) */
  title: {
    primary: string;
    accent: string;
  };
  /** Subheadline text */
  subheadline: string;
  /** Content blocks */
  blocks: NarrativeBlock[];
  /** CTA configuration */
  cta: NarrativeCTA;
}

export function NarrativeContent({
  title,
  subheadline,
  blocks,
  cta,
}: NarrativeContentProps): React.JSX.Element {
  return (
    <div className={tokens.layout.textColumn}>
      {/* Header - ORCHESTRATED */}
      <motion.div
        variants={animations.staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={animations.viewport}
      >
        {/* Title - bicolor with glow */}
        <motion.h2
          className={cn(tokens.typography.title.base, tokens.spacing.titleBottom)}
          variants={animations.fadeInUp}
        >
          <span className={tokens.typography.title.primary}>{title.primary} </span>
          <span
            className={tokens.typography.title.accent}
            style={{
              textShadow: typography.effects.goldGlow.textShadow,
              filter: typography.effects.goldGlow.filter,
            }}
          >
            {title.accent}
          </span>
        </motion.h2>

        {/* Gold separator line */}
        <motion.div
          variants={animations.lineExpand}
          className={cn(tokens.separator.main, tokens.spacing.separatorBottom)}
          style={{ width: '6rem' }}
        />

        {/* Subheadline */}
        <motion.p
          className={cn(tokens.typography.subheadline.base, tokens.typography.subheadline.color)}
          variants={animations.fadeIn}
        >
          {subheadline}
        </motion.p>
      </motion.div>

      {/* Content blocks - ORCHESTRATED */}
      <motion.div
        className={tokens.spacing.blockGap}
        variants={animations.staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={animations.viewport}
      >
        {blocks.map((block, blockIndex) => (
          <React.Fragment key={blockIndex}>
            {/* Block paragraphs */}
            <motion.div className={tokens.spacing.innerGap} variants={animations.fadeInUp}>
              {block.paragraphs.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className={cn(
                    tokens.typography.paragraph.base,
                    tokens.typography.paragraph.color
                  )}
                >
                  {paragraph.text}
                  <span className={tokens.typography.emphasis.color}>{paragraph.emphasis}</span>
                  {paragraph.rest}
                </p>
              ))}
            </motion.div>

            {/* Divider between blocks */}
            {blockIndex < blocks.length - 1 && (
              <motion.div variants={animations.fadeIn}>
                <div className={tokens.separator.divider} />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        variants={animations.fadeInUp}
        initial='hidden'
        whileInView='visible'
        viewport={animations.viewport}
        className='mt-12'
      >
        <Link
          href={cta.href}
          {...(cta.scroll !== undefined && { scroll: cta.scroll })}
          className={cn(
            tokens.typography.cta.base,
            tokens.typography.cta.fontSize,
            tokens.typography.cta.weight
          )}
        >
          {cta.text}
          <ArrowRight className='w-4 h-4' />
        </Link>
      </motion.div>
    </div>
  );
}
