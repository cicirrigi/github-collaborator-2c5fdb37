'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { cn } from '@/lib/utils/cn';

// Theme styles imported via CSS custom properties
import { motionTokens } from '../tokens';

/**
 * 🏷️ TestimonialBadge - Service Badge Component
 *
 * Reusable badge pentru servicii de testimoniale
 * Suportă multiple variante: solid, outline, ghost
 * Theme-aware și cu animații smooth
 */

interface TestimonialBadgeProps {
  /** Text afișat în badge */
  service: string;
  /** Varianta vizuală a badge-ului */
  variant?: 'solid' | 'outline' | 'ghost';
  /** Tonalitatea culorilor */
  tone?: 'gold' | 'neutral' | 'accent';
  /** CSS class suplimentară */
  className?: string;
}

const badgeStyles = {
  // Base styles pentru toate variantele
  base: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '600' as const,
    letterSpacing: '0.025em',
    textTransform: 'uppercase' as const,
    borderRadius: '9999px', // Perfect pill shape
    padding: '0.5rem 1rem',
    lineHeight: '1',
    userSelect: 'none' as const,
    cursor: 'default' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Variant styles
  variants: {
    solid: {
      background: 'var(--testimonial-accent)',
      color: '#000',
      border: 'none',
      boxShadow: '0 2px 8px var(--testimonial-accent-glow)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--testimonial-accent)',
      border: '1px solid var(--testimonial-accent)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    },
    ghost: {
      background: 'var(--testimonial-accent-glow)',
      color: 'var(--testimonial-accent)',
      border: '1px solid transparent',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
    },
  },

  // Tone variations
  tones: {
    gold: {
      // Uses default CSS vars (gold theme)
    },
    neutral: {
      '--testimonial-accent': 'var(--color-gray-400)',
      '--testimonial-accent-glow': 'rgba(156, 163, 175, 0.2)',
    },
    accent: {
      '--testimonial-accent': 'var(--color-blue-500)',
      '--testimonial-accent-glow': 'rgba(59, 130, 246, 0.2)',
    },
  },

  // Hover states
  hover: {
    solid: {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 12px var(--testimonial-accent-glow)',
    },
    outline: {
      background: 'var(--testimonial-accent-glow)',
      transform: 'translateX(2px)',
    },
    ghost: {
      background: 'var(--testimonial-accent)',
      color: '#000',
      transform: 'scale(1.02)',
    },
  },
} as const;

export function TestimonialBadge({
  service,
  variant = 'solid',
  tone = 'gold',
  className,
}: TestimonialBadgeProps): React.JSX.Element {
  return (
    <motion.span
      className={cn(
        'inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
        className
      )}
      style={{
        ...badgeStyles.base,
        ...badgeStyles.variants[variant],
        ...badgeStyles.tones[tone],
        zIndex: 10, // Ensure badge stays above other elements
      }}
      variants={motionTokens.badge}
      initial='initial'
      animate='animate'
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 },
      }}
    >
      {service}
    </motion.span>
  );
}
