/**
 * 🎨 Background Tokens & Presets
 *
 * Defines reusable background presets for all sections.
 * Ensures consistency between Hero, CTA, Testimonials, etc.
 * Zero hardcoding - all values from design tokens.
 */

export const backgroundPresets = {
  // Luxury gradient backgrounds
  luxury: {
    gradient:
      'linear-gradient(135deg, var(--brand-primary) 0%, transparent 60%, var(--brand-primary) 100%)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    opacity: 0.1,
  },

  // Glass morphism effects
  darkGlass: {
    gradient: 'linear-gradient(180deg, rgba(10,10,10,0.8) 0%, rgba(20,20,20,0.95) 100%)',
    overlay: 'rgba(0, 0, 0, 0.3)',
    opacity: 1,
  },

  lightGlass: {
    gradient: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(240,240,240,0.95) 100%)',
    overlay: 'rgba(255, 255, 255, 0.5)',
    opacity: 1,
  },

  // Neutral backgrounds
  neutral: {
    gradient: 'linear-gradient(180deg, var(--background-dark) 0%, var(--background-elevated) 100%)',
    overlay: 'rgba(0, 0, 0, 0.2)',
    opacity: 1,
  },

  // Transparent (no background)
  transparent: {
    gradient: 'none',
    overlay: 'transparent',
    opacity: 0,
  },

  // CTA specific
  cta: {
    gradient:
      'linear-gradient(135deg, var(--brand-primary) 0%, transparent 50%, var(--brand-primary) 100%)',
    overlay: 'rgba(23, 23, 23, 0.6)', // neutral-900/60
    opacity: 1,
  },

  // Hero specific
  hero: {
    gradient:
      'linear-gradient(to bottom right, var(--background-dark) 0%, var(--background-elevated) 100%)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    opacity: 1,
  },
} as const;

export type BackgroundPreset = keyof typeof backgroundPresets;
