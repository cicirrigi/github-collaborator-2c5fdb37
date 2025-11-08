/**
 * 🎯 HeroSection Configuration - Centralized Content
 *
 * All hero content in one place - no hardcoded JSX
 * Easy to modify without touching component code
 */

import { homeContent } from '@/config/content.config';

export const heroConfig = {
  // Main content
  title: homeContent.hero.title,
  subtitle: homeContent.hero.subtitle,
  description: homeContent.hero.description,

  // Call to action
  cta: {
    label: homeContent.hero.cta,
    href: '/booking',
    variant: 'primary' as const,
    size: 'lg' as const,
  },

  // Visual elements
  background: {
    image: '/images/hero/vantage-lane-luxury-fleet.webp',
    video: null, // Optional video background
    gradient: 'from-neutral-950 via-neutral-900 to-neutral-950',
    overlay: 'bg-black/40', // Dark overlay for text readability
  },

  // Animation settings
  animation: {
    enabled: true,
    duration: 0.8,
    stagger: 0.2,
  },

  // Layout settings
  layout: {
    height: '90vh',
    minHeight: '600px',
    textAlign: 'center' as const,
    maxWidth: '4xl', // Tailwind max-width class
  },
} as const;

// Alternative hero configs for different pages
export const heroConfigServices = {
  ...heroConfig,
  title: 'Premium Chauffeur Services',
  subtitle: 'Professional Transportation Solutions',
  description: 'From airport transfers to corporate events, experience luxury travel redefined.',
  cta: {
    label: 'View All Services',
    href: '/services',
    variant: 'primary' as const,
    size: 'lg' as const,
  },
} as const;

export const heroConfigAbout = {
  ...heroConfig,
  title: 'The Art of Refined Motion',
  subtitle: 'Our Story & Values',
  description: "Discover the vision behind London's most trusted luxury transportation service.",
  cta: {
    label: 'Learn More',
    href: '/about#story',
    variant: 'primary' as const,
    size: 'lg' as const,
  },
} as const;

export type HeroConfig = typeof heroConfig;
