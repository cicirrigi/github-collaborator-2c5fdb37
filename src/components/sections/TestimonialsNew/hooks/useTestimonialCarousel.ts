/**
 * 🎠 useTestimonialCarousel Hook - Testimonials Section
 *
 * Custom hook for managing testimonial carousel auto-scroll behavior
 * Extracted from TestimonialsGrid for better separation of concerns
 */

import { useRef, useState } from 'react';

export interface UseTestimonialCarouselOptions {
  /** Auto-scroll interval in milliseconds */
  interval?: number;
  /** Card width including gap in pixels */
  cardWidth?: number;
  /** Number of original cards (before cloning) */
  originalCardsCount: number;
  /** Whether carousel is enabled */
  enabled?: boolean;
}

export interface UseTestimonialCarouselReturn {
  /** Ref to attach to carousel container */
  carouselRef: React.RefObject<HTMLDivElement | null>;
  /** Whether auto-scroll is paused */
  isPaused: boolean;
  /** Function to pause auto-scroll */
  pauseScroll: () => void;
  /** Function to resume auto-scroll */
  resumeScroll: () => void;
  /** Current scroll index */
  currentIndex: number;
}

export function useTestimonialCarousel(
  _options: UseTestimonialCarouselOptions
): UseTestimonialCarouselReturn {
  // No longer using auto-scroll parameters - all options unused

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  // No auto-scroll - removed completely

  const pauseScroll = () => {
    setIsPaused(true);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const resumeScroll = () => {
    setIsPaused(false);
    // No auto-scroll to resume
  };

  return {
    carouselRef,
    isPaused,
    pauseScroll,
    resumeScroll,
    currentIndex: currentIndexRef.current,
  };
}
