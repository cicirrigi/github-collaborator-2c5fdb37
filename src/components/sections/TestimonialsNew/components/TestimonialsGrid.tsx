'use client';

import type React from 'react';

import { useTestimonialCarousel } from '../hooks/useTestimonialCarousel';
import { useTestimonialData } from '../hooks/useTestimonialData';
import type { GridVariant } from '../tokens';
import type { Testimonial } from './TestimonialCardNew';
import { TestimonialGridLayout } from './TestimonialGridLayout';

/**
 * 🏗️ TestimonialsGrid - Grid Container Component
 *
 * Auto-responsive grid cu Framer Motion stagger animations
 * Adaptiv pentru toate device-urile cu CSS Grid auto-fit
 */

interface TestimonialsGridProps {
  /** Array cu testimoniale */
  testimonials: Testimonial[];
  /** Varianta grid-ului */
  variant?: GridVariant;
  /** Numărul maxim de testimoniale afișate */
  maxItems?: number;
  /** CSS class suplimentară */
  className?: string;
  /** onClick handler removed - cards no longer clickable */
}

export function TestimonialsGrid({
  testimonials,
  variant = 'default',
  maxItems,
  className,
}: TestimonialsGridProps): React.JSX.Element | null {
  // Use extracted hooks
  const { baseTestimonials, displayTestimonials, isCarousel } = useTestimonialData({
    testimonials,
    variant,
    maxItems,
  });

  const { carouselRef, pauseScroll, resumeScroll } = useTestimonialCarousel({
    originalCardsCount: baseTestimonials.length,
    enabled: isCarousel,
  });

  // Loading state
  if (!testimonials) {
    return (
      <div className={`flex justify-center items-center min-h-[200px] ${className || ''}`}>
        <div className='animate-pulse text-[var(--text-secondary)]'>Loading testimonials...</div>
      </div>
    );
  }

  // Empty state
  if (testimonials.length === 0) {
    return (
      <div className={`text-center text-[var(--text-secondary)] py-8 ${className || ''}`}>
        <p>No testimonials available yet.</p>
      </div>
    );
  }

  // Fallback pentru displayTestimonials gol
  if (displayTestimonials.length === 0) {
    return null;
  }

  return (
    <TestimonialGridLayout
      ref={carouselRef}
      testimonials={displayTestimonials}
      variant={variant}
      isCarousel={isCarousel}
      onPause={pauseScroll}
      onResume={resumeScroll}
      className={className}
    />
  );
}
