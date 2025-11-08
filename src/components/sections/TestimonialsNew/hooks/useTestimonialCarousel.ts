/**
 * 🎠 useTestimonialCarousel Hook - Testimonials Section
 *
 * Custom hook for managing testimonial carousel auto-scroll behavior
 * Extracted from TestimonialsGrid for better separation of concerns
 */

import { useCallback, useEffect, useRef, useState } from 'react';

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
  options: UseTestimonialCarouselOptions
): UseTestimonialCarouselReturn {
  const {
    interval = 4000,
    cardWidth = 320 + 32, // card width + gap
    originalCardsCount,
    enabled = true,
  } = options;

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  // Define autoScroll with useCallback to prevent useEffect re-runs
  const autoScroll = useCallback(() => {
    if (isPaused || !carouselRef.current) return;

    currentIndexRef.current++;

    // Scroll la următorul card (inclusiv clonele)
    carouselRef.current.scrollTo({
      left: cardWidth * currentIndexRef.current,
      behavior: 'smooth',
    });

    // Când ajungem la prima clonă, continuăm smooth
    // Reset se face doar după ce am trecut prin prima clonă
    if (currentIndexRef.current > originalCardsCount) {
      setTimeout(() => {
        if (carouselRef.current && !isPaused) {
          carouselRef.current.scrollTo({
            left: 0,
            behavior: 'auto', // Reset instant după clonă
          });
          currentIndexRef.current = 0;
        }
      }, 800); // Delay după smooth scroll prin clonă
    }
  }, [isPaused, cardWidth, originalCardsCount]);

  // Auto-scroll logic
  useEffect(() => {
    if (!enabled || originalCardsCount <= 1) return;

    // Observer pentru manual scroll - detect când user ajunge la clonele
    const handleManualScroll = () => {
      if (!carouselRef.current || isPaused) return;

      const scrollLeft = carouselRef.current.scrollLeft;
      const maxScroll = cardWidth * originalCardsCount;

      // Dacă user-ul a scroll-at manual până la clonele, reset automat
      if (scrollLeft >= maxScroll - 50) {
        // 50px tolerance
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.scrollTo({
              left: 0,
              behavior: 'auto',
            });
            currentIndexRef.current = 0;
          }
        }, 300); // Delay mai scurt pentru manual scroll
      }
    };

    // Pornește auto-scroll
    const startInterval = () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      autoScrollRef.current = setInterval(autoScroll, interval);
    };

    // Add scroll listener pentru manual scroll
    const container = carouselRef.current;
    if (container) {
      container.addEventListener('scroll', handleManualScroll, { passive: true });
    }

    // Start după o mică întârziere
    const initialTimeout = setTimeout(startInterval, 1000);

    return () => {
      clearTimeout(initialTimeout);
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      if (container) {
        container.removeEventListener('scroll', handleManualScroll);
      }
    };
  }, [enabled, originalCardsCount, isPaused, interval, cardWidth, autoScroll]);

  const pauseScroll = () => {
    setIsPaused(true);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const resumeScroll = () => {
    setIsPaused(false);
    // Restart interval after unpause
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(autoScroll, interval);
  };

  return {
    carouselRef,
    isPaused,
    pauseScroll,
    resumeScroll,
    currentIndex: currentIndexRef.current,
  };
}
