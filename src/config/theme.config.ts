/**
 * 🎨 Theme Configuration - Vantage Lane 2.0
 * Scalable orchestrator that imports from design-system/tokens
 */

// Consolidated design tokens (inline for stability)
export const designTokens = {
  colors: {
    brand: {
      primary: '#CBB26A', // Gold primary
      secondary: '#F59E0B', // Amber secondary
      accent: '#FACC15', // Bright accent
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  // Typography tokens (inline for now, can be moved to tokens/typography.ts)
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Playfair Display', 'serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  // Spacing tokens (inline for now, can be moved to tokens/spacing.ts)
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem',
  },
  // Border radius tokens (inline for now, can be moved to tokens/radius.ts)
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  // Shadow tokens (inline for now, can be moved to tokens/shadows.ts)
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
  // Gradient tokens (luxury backgrounds)
  gradients: {
    footerLuxury:
      'linear-gradient(135deg, var(--brand-primary) 0%, transparent 50%, var(--brand-primary) 100%)',
    heroGradient:
      'linear-gradient(180deg, var(--background-dark) 0%, var(--background-elevated) 100%)',
    cardGlow: 'radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)',
  },
  // Animation tokens (inline for now, can be moved to tokens/animations.ts)
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
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
 * 🧩 Component Variants (will be moved to variants/ folder)
 */
export const componentVariants = {
  button: {
    variants: {
      primary: 'bg-brand-primary hover:bg-brand-primary/90 text-black',
      secondary:
        'bg-neutral-200 hover:bg-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100',
      outline:
        'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-black',
      ghost: 'text-brand-primary hover:bg-brand-primary/10',
      destructive: 'bg-red-500 hover:bg-red-600 text-white',
    },
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    },
    base: `inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/50`,
  },
  card: {
    variants: {
      default: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800',
      elevated:
        'bg-white dark:bg-neutral-900 shadow-lg border border-neutral-200 dark:border-neutral-800',
      glass: 'bg-white/10 backdrop-blur-md border border-white/10',
    },
    base: `rounded-lg transition-colors duration-300 ease-in-out`,
  },
  text: {
    variants: {
      h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100',
      h2: 'text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100',
      h3: 'text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100',
      h4: 'text-xl md:text-2xl font-semibold text-neutral-900 dark:text-neutral-100',
      h5: 'text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100',
      h6: 'text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-100',
      body: 'text-base leading-relaxed text-neutral-700 dark:text-neutral-300',
      lead: 'text-lg md:text-xl leading-relaxed text-neutral-700 dark:text-neutral-300',
      small: 'text-sm text-neutral-600 dark:text-neutral-400',
      muted: 'text-neutral-500 dark:text-neutral-500',
    },
  },
  badge: {
    variants: {
      default: 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
      primary: 'bg-brand-primary text-black',
      secondary: 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    },
    sizes: {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1.5 text-sm',
      lg: 'px-3 py-2 text-base',
    },
    base: 'inline-flex items-center font-medium rounded-full',
  },
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
