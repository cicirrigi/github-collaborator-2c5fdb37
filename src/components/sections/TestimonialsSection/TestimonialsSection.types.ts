/**
 * 🎭 TestimonialsSection Types - Type Safety
 */

export interface TestimonialData {
  readonly id: number;
  readonly name: string;
  readonly role: string;
  readonly avatar: string;
  readonly rating: number;
  readonly text: string;
  readonly service: string;
  readonly company?: string;
}

export interface TestimonialCardProps {
  readonly testimonial: TestimonialData;
  readonly className?: string;
  readonly variant?: 'default' | 'compact' | 'large' | 'carousel';
}

export interface TestimonialsSectionProps {
  /** Custom testimonials data - if not provided, uses config default */
  readonly testimonials?: readonly TestimonialData[];
  /** Section title override */
  readonly title?: string;
  /** Section subtitle override */
  readonly subtitle?: string;
  /** Show trust indicators */
  readonly showTrustIndicators?: boolean;
  /** Custom CSS class */
  readonly className?: string;
  /** Section variant */
  readonly variant?: 'default' | 'compact' | 'carousel';
  /** Maximum testimonials to show */
  readonly maxItems?: number;
}

export interface TrustIndicator {
  readonly value: string;
  readonly label: string;
}

export interface TestimonialsConfig {
  readonly testimonials: readonly TestimonialData[];
  readonly title: {
    readonly main: string;
    readonly accent: string;
  };
  readonly subtitle: string;
  readonly trustIndicators: readonly TrustIndicator[];
}
