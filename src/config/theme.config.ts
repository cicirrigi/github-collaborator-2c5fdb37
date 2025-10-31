/**
 * 🎨 Theme Configuration - Vantage Lane 2.0
 * Modular orchestrator importing from design-system/tokens
 */

import { colors } from '../design-system/tokens/colors';
import { animations, motion } from '../design-system/tokens/animations';
import { typography } from '../design-system/tokens/typography';
import { spacing } from '../design-system/tokens/spacing';
import { gradients } from '../design-system/tokens/gradients';
import { buttonVariants } from '../design-system/variants/button.variants';
import { textVariants } from '../design-system/variants/text.variants';
import { newsletterVariants } from '../design-system/variants/newsletter.variants';

// Consolidated design tokens (imported from modular files)
export const designTokens = {
  colors,
  typography,
  spacing,
  gradients,
  animations,
  motion,
  // Border radius tokens
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  // Shadow tokens
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  // Breakpoints tokens (responsive design)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export const propTokens = {
  variants: {
    primary: 'primary',
    secondary: 'secondary',
    outline: 'outline',
    ghost: 'ghost',
    destructive: 'destructive',
  },
  sizes: {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
  },
} as const;

/**
 * 🧩 Component Variants (imported from design-system/variants)
 */
export const componentVariants = {
  button: buttonVariants,
  text: textVariants,
  newsletter: newsletterVariants,
} as const;

/**
 * 🎨 Unified Theme Configuration
 */
export const themeConfig = {
  tokens: designTokens,
  props: propTokens,
  components: componentVariants,
} as const;

export default themeConfig;
