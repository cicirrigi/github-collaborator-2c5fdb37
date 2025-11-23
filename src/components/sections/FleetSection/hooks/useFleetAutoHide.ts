/**
 * 🪝 useFleetAutoHide Hook - Fleet Section
 *
 * Custom hook for managing smart auto-hide behavior of swipe indicators
 * Reusable logic extracted from FleetSection3D component
 */

import { useEffect, useRef, useState } from 'react';

export interface UseFleetAutoHideOptions {
  /** Auto-hide duration in milliseconds */
  hideDelay?: number;
  /** Reappear delay in milliseconds */
  reappearDelay?: number;
}

export interface UseFleetAutoHideReturn {
  /** Ref to attach to scrollable carousel element */
  carouselRef: React.RefObject<HTMLDivElement | null>;
  /** Whether indicator is visible */
  isVisible: boolean;
  /** Whether user has scrolled */
  hasScrolled: boolean;
}

export function useFleetAutoHide(options: UseFleetAutoHideOptions = {}): UseFleetAutoHideReturn {
  const { hideDelay = 6000, reappearDelay = 6000 } = options;

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Detectează poziția scroll - arată când e la început (primul card)
    const handleScroll = () => {
      setHasScrolled(true);

      // Verifică dacă e la începutul carousel-ului (primul card)
      const isAtStart = carousel.scrollLeft <= 10; // Toleranță de 10px

      setIsVisible(isAtStart);
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled, hideDelay, reappearDelay]);

  return {
    carouselRef,
    isVisible,
    hasScrolled,
  };
}
