/**
 * 🛡️ AssuranceItem Component
 * Single trust indicator with icon, label, and subtext
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';

import { cn } from '@/lib/utils/cn';

import type { AssuranceItem as AssuranceItemType } from '../VantageAssuranceSection.types';
import { assuranceTokens } from '../VantageAssuranceSection.tokens';

const tokens = assuranceTokens;

interface AssuranceItemProps extends AssuranceItemType {
  /** Animation delay for stagger effect */
  delay?: number;
}

export function AssuranceItem({
  icon: Icon,
  label,
  subtext,
  delay = 0,
}: AssuranceItemProps): React.JSX.Element {
  return (
    <motion.div
      className={cn('group', tokens.grid.item, tokens.spacing.item)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: tokens.animations.duration,
        delay,
        ease: tokens.animations.ease,
      }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Icon */}
      <div
        className={cn(tokens.colors.icon, tokens.effects.iconGlow, 'transition-all duration-300')}
      >
        <Icon className={cn(tokens.icon.size, tokens.icon.stroke)} />
      </div>

      {/* Label */}
      <h3 className={tokens.typography.item.label}>{label}</h3>

      {/* Subtext */}
      <p className={tokens.typography.item.subtext}>{subtext}</p>
    </motion.div>
  );
}
