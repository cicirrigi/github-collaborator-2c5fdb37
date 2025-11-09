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
export type { HeroConfig, HeroProps } from './HeroSection';

// Services Section
export { ServicesSection } from './ServicesSection';
export type { ServicesSectionProps } from './ServicesSection';

// CTA Section
export { CTASection } from './CTASection';
export type { CTASectionProps } from './CTASection';

// Newsletter Section
export { NewsletterSection } from './NewsletterSection';
export type { NewsletterSectionProps } from './NewsletterSection';

// Testimonials Section - New Component
export { TestimonialsNew } from './TestimonialsNew';
export type { TestimonialsNewProps } from './TestimonialsNew';

// Vantage Assurance Section - Trust & Prestige
export { VantageAssuranceSection } from './VantageAssuranceSection';
export type { VantageAssuranceSectionProps } from './VantageAssuranceSection';

// Narrative Section - Brand Philosophy & Experience
export { NarrativeSection } from './NarrativeSection';
export type { NarrativeSectionProps } from './NarrativeSection';

// Config exports for reuse
export { heroConfig, heroConfigAbout, heroConfigServices } from './HeroSection';
export { servicesConfig } from './ServicesSection';
