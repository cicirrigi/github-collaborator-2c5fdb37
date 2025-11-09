/**
 * 🛡️ AssuranceGrid Component
 * Grid layout for assurance items (2×3)
 */

'use client';

import type React from 'react';

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
    <div className={cn(tokens.grid.container, tokens.spacing.grid)}>
      {items.map((item, index) => (
        <AssuranceItem key={item.id} {...item} delay={index * tokens.animations.stagger} />
      ))}
    </div>
  );
}
