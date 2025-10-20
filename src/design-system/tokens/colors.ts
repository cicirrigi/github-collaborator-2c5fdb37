/**
 * 🎨 Design Tokens – Colors (Vantage Lane)
 * Source of truth for programmatic color usage.
 * All tokens map directly to CSS vars and brandConfig.
 */

export const designTokens = {
  brand: {
    primary: 'var(--brand-primary)',
    secondary: 'var(--brand-secondary)',
    accent: 'var(--brand-accent)',
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    muted: 'var(--text-muted)',
  },
  background: {
    light: 'var(--background-light)',
    dark: 'var(--background-dark)',
    elevated: 'var(--background-elevated)',
  },
  status: {
    success: 'var(--status-success)',
    warning: 'var(--status-warning)',
    error: 'var(--status-error)',
  },
} as const;

export type ColorTokens = typeof designTokens;

// Legacy support - keeping existing exports for compatibility
export const brandColors = {
  primary: {
    500: 'var(--brand-primary)', // Main brand color
    600: 'var(--brand-primary)', // Hover state
  },
  secondary: {
    DEFAULT: 'var(--brand-accent)',
  },
} as const;

// User tier colors (using design system approach)
export const tierColors = {
  bronze: 'hsl(30, 50%, 40%)', // Bronze tier
  silver: 'hsl(0, 0%, 75%)', // Silver tier
  gold: 'hsl(51, 100%, 50%)', // Gold tier
  platinum: 'hsl(0, 0%, 90%)', // Platinum tier
  elite: 'hsl(45, 35%, 60%)', // Elite tier (same as primary)
} as const;

// Semantic colors
export const semanticColors = {
  success: {
    50: 'hsl(142, 76%, 96%)',
    500: 'hsl(142, 71%, 45%)',
    700: 'hsl(142, 71%, 35%)',
  },
  warning: {
    50: 'hsl(48, 100%, 96%)',
    500: 'hsl(38, 92%, 50%)',
    700: 'hsl(32, 95%, 44%)',
  },
  error: {
    50: 'hsl(0, 86%, 97%)',
    500: 'hsl(0, 84%, 60%)',
    700: 'hsl(0, 70%, 50%)',
  },
  info: {
    50: 'hsl(214, 100%, 97%)',
    500: 'hsl(217, 91%, 60%)',
    700: 'hsl(221, 83%, 53%)',
  },
} as const;

// Neutral colors (for dark theme)
export const neutralColors = {
  50: 'hsl(0, 0%, 98%)', // Pure white backgrounds
  100: 'hsl(0, 0%, 96%)', // Light gray backgrounds
  200: 'hsl(0, 0%, 90%)', // Border colors
  300: 'hsl(0, 0%, 83%)', // Dividers
  400: 'hsl(0, 0%, 64%)', // Placeholder text
  500: 'hsl(0, 0%, 45%)', // Secondary text
  600: 'hsl(0, 0%, 32%)', // Primary text on light
  700: 'hsl(0, 0%, 25%)', // Headings on light
  800: 'hsl(0, 0%, 16%)', // Card backgrounds (dark theme)
  900: 'hsl(0, 0%, 10%)', // Main background (dark theme)
  950: 'hsl(0, 0%, 4%)', // Deep black
} as const;

// Export all colors
export const colors = {
  brand: brandColors,
  tier: tierColors,
  semantic: semanticColors,
  neutral: neutralColors,
} as const;

export default colors;
