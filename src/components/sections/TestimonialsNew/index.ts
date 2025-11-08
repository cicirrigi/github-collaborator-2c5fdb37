/**
 * 📦 TestimonialsNew - Clean Export Layer
 * Centralized exports pentru componente, types, și utilities
 */

// 🎭 Main component export
export { TestimonialsNew } from './TestimonialsNew';

// 🧩 Sub-components exports
export { TestimonialCardNew } from './components/TestimonialCardNew';
export { TestimonialsGrid } from './components/TestimonialsGrid';
export { TestimonialBadge } from './components/TestimonialBadge';

// 🔧 Types exports
export type {
  Testimonial,
  TestimonialsNewProps,
  TrustIndicator,
  TestimonialsNewConfig,
  CardVariant,
  GridVariant,
  ThemeMode,
  BadgeProps,
} from './TestimonialsNew.types';

// 📊 Config export
export { testimonialsNewConfig } from './TestimonialsNew.config';

// 🧱 Tokens exports (pentru advanced usage)
export {
  cardTokens,
  gridTokens,
  motionTokens,
  themeTokens,
  getThemeVariables,
  getGlassmorphismStyles,
} from './tokens';

// 🎨 CSS Module exports (pentru custom styling)
export { default as cardStyles } from './styles/card.module.css';
export { default as gridStyles } from './styles/grid.module.css';
export { default as themeStyles } from './styles/theme.module.css';
