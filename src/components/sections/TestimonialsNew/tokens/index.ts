/**
 * 🧱 TestimonialsNew - Design Tokens Index
 * Aggregator centralizat pentru toate token-urile
 * Permite import clean: import { cardTokens, gridTokens } from '../tokens'
 */

// 🎴 Card tokens - layout, dimensions, typography, effects
export * from './card.tokens';

// 🏗️ Grid tokens - responsive layout, spacing, breakpoints
export * from './grid.tokens';

// 🎬 Motion tokens - animații, transitions, framer motion (modular system)
export * from './motion';

// 🎨 Theme tokens - light/dark mode, glassmorphism, CSS variables
export * from './theme.tokens';

// 📦 Re-export pentru convenience
export { cardTokens } from './card.tokens';
export { gridTokens } from './grid.tokens';
export { motionTokens } from './motion';
export { themeTokens, getThemeVariables, getGlassmorphismStyles } from './theme.tokens';

// 📦 Alias general pentru acces rapid la toate tokens
import { cardTokens } from './card.tokens';
import { gridTokens } from './grid.tokens';
import { motionTokens } from './motion';
import { themeTokens } from './theme.tokens';

export const testimonialTokens = {
  card: cardTokens,
  grid: gridTokens,
  motion: motionTokens,
  theme: themeTokens,
};

// 🔧 Token types pentru TypeScript safety
export type CardVariant = 'default' | 'compact' | 'featured';
export type GridVariant = 'default' | 'compact' | 'carousel' | 'featured';
export type ThemeMode = 'light' | 'dark';
export type GlassmorphismVariant = 'card' | 'interactive' | 'overlay';
