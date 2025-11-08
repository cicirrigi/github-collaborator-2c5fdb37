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

    // Smart timer system
    let autoHideTimer: NodeJS.Timeout;
    let reappearTimer: NodeJS.Timeout;

    // Auto-hide după 6 secunde
    const startAutoHide = () => {
      autoHideTimer = setTimeout(() => {
        setIsVisible(false);

        // Dacă nu a făcut scroll, reapare după încă 6 secunde
        if (!hasScrolled) {
          reappearTimer = setTimeout(() => {
            setIsVisible(true);
            // Și se ascunde din nou după 6 secunde
            startAutoHide();
          }, 6000);
        }
      }, 6000);
    };

    startAutoHide();

    // Simple scroll listener - marchează că user-ul a făcut scroll
    const handleScroll = () => {
      // Marchează că user-ul a făcut scroll
      setHasScrolled(true);

      // Clear toate timer-ele - nu mai reapare
      clearTimeout(autoHideTimer);
      clearTimeout(reappearTimer);

      // Ascunde indicatorul permanent
      setIsVisible(false);
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true, once: true });

    return () => {
      clearTimeout(autoHideTimer);
      clearTimeout(reappearTimer);
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);

  return {
    carouselRef,
    isVisible,
    hasScrolled,
  };
}
