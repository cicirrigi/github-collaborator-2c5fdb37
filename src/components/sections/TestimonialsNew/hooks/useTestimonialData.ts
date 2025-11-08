/**
 * 📊 useTestimonialData Hook - Testimonials Section
 *
 * Custom hook for processing testimonial data including cloning for seamless carousel
 * Extracted from TestimonialsGrid for better data management
 */

import { useMemo } from 'react';
import type { Testimonial } from '../components/TestimonialCardNew';
import type { GridVariant } from '../tokens';

export interface UseTestimonialDataOptions {
  /** Original testimonials array */
  testimonials: Testimonial[];
  /** Grid variant */
  variant: GridVariant;
  /** Maximum items to display */
  maxItems?: number | undefined;
}

export interface UseTestimonialDataReturn {
  /** Base testimonials (before cloning) */
  baseTestimonials: Testimonial[];
  /** Display testimonials (including clones for carousel) */
  displayTestimonials: Testimonial[];
  /** Whether this is a carousel variant */
  isCarousel: boolean;
}

export function useTestimonialData({
  testimonials,
  variant,
  maxItems,
}: UseTestimonialDataOptions): UseTestimonialDataReturn {
  const isCarousel = variant === 'carousel';

  const baseTestimonials = useMemo(() => {
    if (!testimonials) return [];
    return maxItems ? testimonials.slice(0, maxItems) : testimonials;
  }, [testimonials, maxItems]);

  const displayTestimonials = useMemo(() => {
    // Pentru carousel, clonează primele carduri la sfârșit pentru seamless loop
    if (isCarousel && baseTestimonials.length > 1) {
      return [
        ...baseTestimonials,
        ...baseTestimonials.slice(0, 2).map((item, idx) => ({
          ...item,
          id: `${item.id}-clone-${idx}`, // Key unic pentru clonele
        })),
      ];
    }
    return baseTestimonials;
  }, [isCarousel, baseTestimonials]);

  return {
    baseTestimonials,
    displayTestimonials,
    isCarousel,
  };
}
