/**
 * 🪝 useServicesAutoHide Hook - Services Section
 *
 * Custom hook for managing smart auto-hide behavior of services swipe indicator
 * Extracted from ServicesSection for better separation of concerns
 */

import { useEffect, useRef, useState } from 'react';

export interface UseServicesAutoHideReturn {
  /** Ref to attach to scrollable carousel element */
  carouselRef: React.RefObject<HTMLDivElement | null>;
  /** Whether indicator is visible */
  isVisible: boolean;
  /** Whether user has scrolled */
  hasScrolled: boolean;
}

export function useServicesAutoHide(): UseServicesAutoHideReturn {
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
  }, [hasScrolled]);

  return {
    carouselRef,
    isVisible,
    hasScrolled,
  };
}
