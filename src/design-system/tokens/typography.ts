export const typography = {
  fontPrimary: 'var(--font-primary, Inter, sans-serif)',
  fontAccent: 'var(--font-accent, Playfair Display, serif)',
  baseSize: '16px',
  lineHeights: {
    tight: '1.1',
    normal: '1.5',
    relaxed: '1.75',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;
