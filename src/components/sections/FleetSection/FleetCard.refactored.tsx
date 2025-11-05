/**
 * 🚗 Fleet Card Refactored - Vantage Lane 2.0
 *
 * Clean, modular vehicle card under 100 lines.
 * Uses motion, design tokens, and subcomponents.
 */

'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { memo } from 'react';

import { designTokens } from '@/config/theme.config';
import { cn } from '@/lib/utils/cn';

import { FleetCardContent } from './FleetCardContent';
import { FleetCardHeader } from './FleetCardHeader';
import { FleetCardImage } from './FleetCardImage';
import type { FleetCardProps } from './FleetSection.types';

/**
 * 🎨 Refactored Fleet Card - Motion + Tokens + Modular
 * Under 100 lines with clean architecture
 */
const FleetCardRefactored = memo(function FleetCardRefactored({
  vehicle,
  onSelect,
  className,
  showPrice = true,
}: FleetCardProps): React.JSX.Element {
  return (
    <div
      className={cn('group relative', className)}
      role='article'
      aria-label={`${vehicle.name} vehicle details`}
    >
      {/* Motion Card Container */}
      <motion.div
        initial={false}
        whileHover={{ scale: designTokens.fleet.effects.hoverScale }}
        transition={{
          duration: designTokens.fleet.effects.transition.duration,
          ease: designTokens.fleet.effects.transition.ease,
        }}
        className={cn(
          'relative overflow-hidden border transition-all duration-300',
          'cursor-pointer focus-within:ring-2 focus-within:ring-offset-2',
          'focus-within:ring-[var(--brand-primary)] focus-within:ring-offset-[var(--background-elevated)]',
          'flex flex-col fleet-card-vertical'
        )}
        style={{
          backgroundColor: 'var(--background-elevated)',
          borderColor: 'var(--border-subtle)',
          borderRadius: designTokens.fleet.effects.borderRadius,
          minHeight: designTokens.fleet.dimensions.cardMinHeight,
        }}
      >
        {/* Header with Badges */}
        <FleetCardHeader vehicle={vehicle} />

        {/* Vehicle Image */}
        <FleetCardImage vehicle={vehicle} />

        {/* Content */}
        <FleetCardContent vehicle={vehicle} {...(onSelect && { onSelect })} showPrice={showPrice} />

        {/* Hover Glow Effect */}
        <motion.div
          className='absolute inset-0 pointer-events-none'
          initial={{ opacity: 0 }}
          whileHover={{ opacity: designTokens.fleet.effects.glowOpacity }}
          transition={{
            duration: designTokens.fleet.effects.transition.duration,
          }}
          style={{
            background: `linear-gradient(to top, var(--brand-primary-05) 0%, transparent 50%)`,
            borderRadius: designTokens.fleet.effects.borderRadius,
          }}
        />
      </motion.div>
    </div>
  );
});

export { FleetCardRefactored };
