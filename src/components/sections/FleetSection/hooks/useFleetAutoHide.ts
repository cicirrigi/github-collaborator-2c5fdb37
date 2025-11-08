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

    // Smart timer system
    let autoHideTimer: NodeJS.Timeout;
    let reappearTimer: NodeJS.Timeout;

    // Auto-hide după hideDelay
    const startAutoHide = () => {
      autoHideTimer = setTimeout(() => {
        setIsVisible(false);

        // Dacă nu a făcut scroll, reapare după reappearDelay
        if (!hasScrolled) {
          reappearTimer = setTimeout(() => {
            setIsVisible(true);
            // Și se ascunde din nou
            startAutoHide();
          }, reappearDelay);
        }
      }, hideDelay);
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
  }, [hasScrolled, hideDelay, reappearDelay]);

  return {
    carouselRef,
    isVisible,
    hasScrolled,
  };
}
