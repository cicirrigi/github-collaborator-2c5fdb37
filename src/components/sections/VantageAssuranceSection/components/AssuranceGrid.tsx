/**
 * 🛡️ AssuranceGrid Component
 * Grid layout for assurance items (2×3)
 * ORCHESTRATED with staggerContainer for sequential animations
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';

import { animations } from '@/config/animations.config';
import { cn } from '@/lib/utils/cn';

import type { AssuranceItem as AssuranceItemType } from '../VantageAssuranceSection.types';
import { assuranceTokens } from '../VantageAssuranceSection.tokens';
import { AssuranceItem } from './AssuranceItem';

const tokens = assuranceTokens;

interface AssuranceGridProps {
  /** Array of assurance items to display */
  items: AssuranceItemType[];
}

export function AssuranceGrid({ items }: AssuranceGridProps): React.JSX.Element {
  return (
    <motion.div
      className={cn(tokens.grid.container, tokens.spacing.grid)}
      variants={animations.staggerContainer}
      initial='hidden'
      whileInView='visible'
      viewport={animations.viewport}
    >
      {items.map(item => (
        <AssuranceItem key={item.id} {...item} />
      ))}
    </motion.div>
  );
}
