/**
 * 🛡️ AssuranceItem Component
 * Single trust indicator with icon, label, and subtext
 * ORCHESTRATED by parent container - no individual delays
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';

import { animations } from '@/config/animations.config';
import { cn } from '@/lib/utils/cn';

import type { AssuranceItem as AssuranceItemType } from '../VantageAssuranceSection.types';
import { assuranceTokens } from '../VantageAssuranceSection.tokens';

const tokens = assuranceTokens;

type AssuranceItemProps = AssuranceItemType;

export function AssuranceItem({
  icon: Icon,
  label,
  subtext,
}: AssuranceItemProps): React.JSX.Element {
  return (
    <motion.div
      className={cn('group', tokens.grid.item, tokens.spacing.item)}
      variants={animations.fadeInUp}
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
