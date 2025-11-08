/**
 * 🔧 TestimonialsNew - TypeScript Definitions
 * Tipuri clare și scalabile pentru testimoniale
 */

import type React from 'react';

/**
 * 🎯 Testimonial Base Type
 */
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  service: string;
  rating: number;
  avatarUrl?: string;
  verified?: boolean;
}

/**
 * 🎨 Variant Types
 */
export type CardVariant = 'default' | 'compact' | 'featured';
export type GridVariant = 'default' | 'compact' | 'carousel' | 'featured';
export type ThemeMode = 'light' | 'dark';

/**
 * 🎯 Main Section Props
 */
export interface TestimonialsNewProps {
  /** Array cu testimoniale (optional - folosește config dacă nu e furnizat) */
  testimonials?: Testimonial[];
  /** Titlul secțiunii */
  title?:
    | {
        main: string;
        accent: string;
      }
    | string;
  /** Subtitlul secțiunii */
  subtitle?: string;
  /** Varianta grid-ului */
  variant?: GridVariant;
  /** Numărul maxim de testimoniale afișate */
  maxItems?: number;
  /** Afișează sau nu trust indicators */
  showTrustIndicators?: boolean;
  /** CSS class pentru secțiune */
  className?: string;
  /** Callback pentru click pe testimonial */
  onTestimonialClick?: (testimonial: Testimonial) => void;
}

/**
 * 📊 Trust Indicators
 */
export interface TrustIndicator {
  /** Valoarea indicatorului (ex: "4.9/5", "500+") */
  value: string;
  /** Eticheta indicatorului (ex: "Average Rating") */
  label: string;
  /** Icon optional */
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * 📋 Section Configuration
 */
export interface TestimonialsNewConfig {
  /** Configurația titlului */
  title: {
    main: string;
    accent: string;
  };
  /** Subtitlul secțiunii */
  subtitle: string;
  /** Array cu testimoniale */
  testimonials: Testimonial[];
  /** Indicatorii de încredere */
  trustIndicators: TrustIndicator[];
}

/**
 * 🎪 Badge Props (re-export pentru convenience)
 */
export interface BadgeProps {
  service: string;
  variant?: 'solid' | 'outline' | 'ghost';
  tone?: 'gold' | 'neutral' | 'accent';
  className?: string;
}

/**
 * 🎬 Animation State Types
 */
export type AnimationState = 'initial' | 'animate' | 'hover' | 'tap' | 'exit';

/**
 * 📱 Responsive Breakpoint Types
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

/**
 * 🎨 Theme Types (extended)
 */
export interface ThemeConfig {
  mode: ThemeMode;
  enableTransitions: boolean;
  enableAnimations: boolean;
  reducedMotion: boolean;
}

/**
 * 🔧 Utility Types
 */

/** Type pentru extracting keys din tokens */
export type TokenKey<T> = keyof T;

/** Type pentru variant props */
export type VariantProps<T extends Record<string, unknown>> = {
  variant?: keyof T;
};

/** Type pentru responsive props */
export type ResponsiveProps<T> = T | { [K in Breakpoint]?: T };

/**
 * 📦 Component Export Types
 */
export interface TestimonialsNewComponents {
  TestimonialCardNew: typeof import('./components/TestimonialCardNew').TestimonialCardNew;
  TestimonialsGrid: typeof import('./components/TestimonialsGrid').TestimonialsGrid;
  TestimonialBadge: typeof import('./components/TestimonialBadge').TestimonialBadge;
}

/**
 * 🎯 Event Types
 */
export interface TestimonialEvents {
  onView?: (testimonial: Testimonial) => void;
  onClick?: (testimonial: Testimonial) => void;
  onShare?: (testimonial: Testimonial) => void;
}

/**
 * 📈 Analytics Types (pentru future extensii)
 */
export interface TestimonialAnalytics {
  impressions: number;
  clicks: number;
  shares: number;
  rating: number;
}

/**
 * 🔒 Validation Types
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 🎪 Advanced Configuration Types
 */
export interface AdvancedTestimonialsConfig extends TestimonialsNewConfig {
  /** Animații personalizate */
  customAnimations?: Record<string, object>;
  /** Teme personalizate */
  customThemes?: Record<string, object>;
  /** Breakpoint-uri personalizate */
  customBreakpoints?: Record<string, string>;
  /** Analytics configuration */
  analytics?: {
    trackViews: boolean;
    trackClicks: boolean;
    provider: string;
  };
}
