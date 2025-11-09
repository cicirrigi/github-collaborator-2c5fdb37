/**
 * 📝 NarrativeContent Component
 * Text side: title (bicolor like VantageAssurance), subheadline, blocks, CTA
 */

'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

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
      {/* Title - bicolor with glow (EXACT like VantageAssurance) */}
      <motion.h2
        className={cn(tokens.typography.title.base, tokens.spacing.titleBottom)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span className={tokens.typography.title.primary}>{title.primary} </span>
        <span
          className={tokens.typography.title.accent}
          style={{
            textShadow: '0 0 25px rgba(203, 178, 106, 0.7), 0 0 35px rgba(203, 178, 106, 0.4)',
            filter: 'brightness(1.2)',
          }}
        >
          {title.accent}
        </span>
      </motion.h2>

      {/* Gold separator line (EXACT like VantageAssurance) */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        whileInView={{ opacity: 1, width: '6rem' }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className={cn(tokens.separator.main, tokens.spacing.separatorBottom)}
      />

      {/* Subheadline */}
      <motion.p
        className={cn(tokens.typography.subheadline.base, tokens.typography.subheadline.color)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        {subheadline}
      </motion.p>

      {/* Content blocks with divider */}
      <div className={tokens.spacing.blockGap}>
        {blocks.map((block, blockIndex) => (
          <React.Fragment key={blockIndex}>
            {/* Block paragraphs */}
            <div className={tokens.spacing.innerGap}>
              {block.paragraphs.map((paragraph, pIndex) => (
                <motion.p
                  key={pIndex}
                  className={cn(
                    tokens.typography.paragraph.base,
                    tokens.typography.paragraph.color
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + blockIndex * 0.2 + pIndex * 0.1,
                  }}
                  viewport={{ once: true }}
                >
                  {paragraph.text}
                  <span className={tokens.typography.emphasis.color}>{paragraph.emphasis}</span>
                  {paragraph.rest}
                </motion.p>
              ))}
            </div>

            {/* Divider between blocks - straight line */}
            {blockIndex < blocks.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.7 + blockIndex * 0.2 }}
                viewport={{ once: true }}
              >
                <div className={tokens.separator.divider} />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* CTA - subtle and refined */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        viewport={{ once: true }}
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
