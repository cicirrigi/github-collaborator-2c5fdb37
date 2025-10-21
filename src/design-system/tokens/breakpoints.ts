/**
 * Responsive breakpoints for Vantage Lane 2.0
 * Mobile-first approach with consistent breakpoints across design and code
 */

export const breakpoints = {
  // Base mobile (default)
  base: '0px',

  // Small mobile devices
  xs: '475px',

  // Large mobile / small tablet
  sm: '640px',

  // Tablet
  md: '768px',

  // Small laptop
  lg: '1024px',

  // Desktop
  xl: '1280px',

  // Large desktop
  '2xl': '1536px',
} as const;

export const breakpointValues = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Media query helpers for use in components
 */
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,

  // Max-width queries (mobile-first helpers)
  'max-xs': `(max-width: ${breakpointValues.xs - 1}px)`,
  'max-sm': `(max-width: ${breakpointValues.sm - 1}px)`,
  'max-md': `(max-width: ${breakpointValues.md - 1}px)`,
  'max-lg': `(max-width: ${breakpointValues.lg - 1}px)`,
  'max-xl': `(max-width: ${breakpointValues.xl - 1}px)`,
  'max-2xl': `(max-width: ${breakpointValues['2xl'] - 1}px)`,
} as const;

/**
 * Container max-widths for consistent layouts
 */
export const containers = {
  xs: '475px',
  sm: '100%', // Full width on small screens
  md: '100%', // Full width on medium screens
  lg: '1024px', // Constrained on large screens
  xl: '1280px', // Max content width
  '2xl': '1400px', // Maximum container width
} as const;

/**
 * Common responsive patterns used in Vantage Lane
 */
export const responsivePatterns = {
  // Navigation
  nav: {
    mobile: 'max-md', // Mobile nav below md
    desktop: 'md', // Desktop nav from md up
  },

  // Content layouts
  singleColumn: 'max-lg', // Single column below lg
  twoColumn: 'lg', // Two columns from lg up
  threeColumn: 'xl', // Three columns from xl up

  // Hero sections
  heroCompact: 'max-md', // Compact hero on mobile
  heroFull: 'md', // Full hero from md up

  // Grids
  gridSingle: 'max-sm', // 1 column below sm
  gridDouble: 'sm', // 2 columns from sm
  gridTriple: 'lg', // 3 columns from lg
  gridQuad: 'xl', // 4 columns from xl
} as const;

/**
 * Typography responsive scales
 */
export const responsiveTypography = {
  // Hero titles
  heroTitle: {
    base: 'text-3xl', // Mobile
    md: 'text-4xl', // Tablet
    lg: 'text-5xl', // Desktop
    xl: 'text-6xl', // Large desktop
  },

  // Page headings
  pageHeading: {
    base: 'text-2xl', // Mobile
    md: 'text-3xl', // Tablet+
  },

  // Section headings
  sectionHeading: {
    base: 'text-xl', // Mobile
    md: 'text-2xl', // Tablet+
  },

  // Body text
  bodyText: {
    base: 'text-sm', // Mobile
    md: 'text-base', // Tablet+
  },
} as const;

/**
 * Spacing responsive scales
 */
export const responsiveSpacing = {
  // Section spacing
  sectionY: {
    base: 'py-12', // Mobile: 48px
    md: 'py-16', // Tablet: 64px
    lg: 'py-20', // Desktop: 80px
    xl: 'py-24', // Large: 96px
  },

  // Container padding
  containerX: {
    base: 'px-4', // Mobile: 16px
    sm: 'px-6', // Small: 24px
    lg: 'px-8', // Large: 32px
  },

  // Grid gaps
  gridGap: {
    base: 'gap-4', // Mobile: 16px
    md: 'gap-6', // Tablet: 24px
    lg: 'gap-8', // Desktop: 32px
  },
} as const;

/**
 * Component-specific responsive behaviors
 */
export const componentResponsive = {
  // Buttons
  button: {
    mobile: 'w-full', // Full width on mobile
    desktop: 'w-auto', // Auto width on desktop
  },

  // Cards
  card: {
    mobile: 'rounded-lg', // Less rounded on mobile
    desktop: 'rounded-2xl', // More rounded on desktop
  },

  // Modals
  modal: {
    mobile: 'm-4', // Small margin on mobile
    desktop: 'm-8', // Larger margin on desktop
  },

  // Images
  image: {
    mobile: 'aspect-[16/10]', // Wider aspect on mobile
    desktop: 'aspect-[4/3]', // Standard aspect on desktop
  },
} as const;

/**
 * Utility function to check if current screen matches breakpoint
 */
export function useMediaQuery(query: keyof typeof mediaQueries) {
  if (typeof window === 'undefined') return false;

  return window.matchMedia(mediaQueries[query]).matches;
}

/**
 * Get responsive class based on breakpoint
 */
export function getResponsiveClass(
  baseClass: string,
  responsiveClasses: Partial<Record<keyof typeof breakpoints, string>>
): string {
  const classes = [baseClass];

  Object.entries(responsiveClasses).forEach(([breakpoint, className]) => {
    if (className) {
      classes.push(`${breakpoint}:${className}`);
    }
  });

  return classes.join(' ');
}

export default breakpoints;
