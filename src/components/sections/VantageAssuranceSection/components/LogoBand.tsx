/**
 * 🏭 LogoBand Component - Luxury Edition
 * Rolls-Royce inspired prestige indicator
 * Features:
 * - Optical centering
 * - Short lateral lines
 * - Central brand highlighting
 * - Variable spacing
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
  /** Optional: index of central brand to highlight (default: middle) */
  centralBrandIndex?: number;
}

export function LogoBand({ text, logos, centralBrandIndex }: LogoBandProps): React.JSX.Element {
  // Identifică brandul central (default: mijloc)
  const centerIndex = centralBrandIndex ?? Math.floor(logos.length / 2);

  return (
    <motion.div
      className={tokens.container}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
    >
      {/* Content wrapper */}
      <div className={tokens.content}>
        <div className={tokens.layout.wrapper}>
          {/* 💎 Layout orizontal: Linie | Text | Linie */}
          <motion.div
            className={tokens.layout.horizontalBar}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
          >
            {/* Linie stânga - scurtă */}
            <motion.div
              className={tokens.divider.line}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true }}
            />

            {/* Text central */}
            <motion.p
              className={cn(tokens.text.base, tokens.text.color)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true }}
            >
              {text}
            </motion.p>

            {/* Linie dreapta - scurtă */}
            <motion.div
              className={tokens.divider.line}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true }}
            />
          </motion.div>

          {/* 🏭 Branduri cu optical centering */}
          <div className={tokens.logos.container}>
            {logos.map((logo, index) => {
              const isBeforeCenter = index < centerIndex;
              const isAfterCenter = index > centerIndex;

              return (
                <React.Fragment key={logo}>
                  <motion.span
                    className={cn(tokens.logos.item, 'inline-block')}
                    initial={{ opacity: 0 }}
                    whileInView={{
                      opacity: 0.9,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.5 + index * 0.08,
                      ease: 'easeOut',
                    }}
                    viewport={{ once: true }}
                    style={{
                      textShadow: tokens.effects.textShadow,
                    }}
                  >
                    {logo}
                  </motion.span>

                  {/* Separator cu optical spacing */}
                  {index < logos.length - 1 && (
                    <span
                      className={cn(
                        tokens.logos.separator,
                        // Mai mult spațiu în centru
                        (isBeforeCenter && index === centerIndex - 1) ||
                          (isAfterCenter && index === centerIndex)
                          ? 'mx-6 md:mx-8'
                          : 'mx-3 md:mx-4'
                      )}
                    >
                      •
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
