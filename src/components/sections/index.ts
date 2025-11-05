/**
 * 📦 Sections Module - Modular Page Components
 *
 * Reusable page sections with:
 * - Config-driven content
 * - Design tokens integration
 * - Consistent spacing & layout
 * - Framer Motion animations
 * - TypeScript strict typing
 */

// Hero Section
export { HeroSection } from './HeroSection';
export type { HeroProps, HeroConfig } from './HeroSection';

// Services Section
export { ServicesSection } from './ServicesSection';
export type { ServicesSectionProps } from './ServicesSection';

// CTA Section
export { CTASection } from './CTASection';
export type { CTASectionProps } from './CTASection';

// Newsletter Section
export { NewsletterSection } from './NewsletterSection';
export type { NewsletterSectionProps } from './NewsletterSection';

// Config exports for reuse
export { heroConfig, heroConfigServices, heroConfigAbout } from './HeroSection';
export { servicesConfig } from './ServicesSection';
