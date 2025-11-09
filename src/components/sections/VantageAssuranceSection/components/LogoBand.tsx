/**
 * 🏨 LogoBand Component
 * Cinematic prestige indicator with hotel/partner names
 */

'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils/cn';

import { assuranceTokens } from '../VantageAssuranceSection.tokens';

const tokens = assuranceTokens.logoBand;

interface LogoBandProps {
  /** Text above logos */
  text: string;
  /** Array of logo names */
  logos: readonly string[];
}

export function LogoBand({ text, logos }: LogoBandProps): React.JSX.Element {
  return (
    <motion.div
      className={tokens.container}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {/* Content wrapper */}
      <div className={tokens.content}>
        {/* Top divider line */}
        <motion.div
          className={tokens.divider.container}
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className={tokens.divider.line} />
        </motion.div>

        {/* Prestige text */}
        <motion.p
          className={cn(tokens.text.base, tokens.text.color)}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {text}
        </motion.p>

        {/* Hotel names with separators */}
        <div className={tokens.logos.container}>
          {logos.map((logo, index) => (
            <React.Fragment key={logo}>
              <motion.span
                className={tokens.logos.item}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
              >
                {logo}
              </motion.span>
              {index < logos.length - 1 && (
                <span className='text-[var(--brand-primary)]/30 text-sm md:text-base'>•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom divider line */}
        <motion.div
          className={cn(tokens.divider.container, 'mt-6')}
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          viewport={{ once: true }}
        >
          <div className={tokens.divider.line} />
        </motion.div>
      </div>
    </motion.div>
  );
}
