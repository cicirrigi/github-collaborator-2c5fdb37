import { useEffect, useRef, useState } from 'react';

export interface NavbarState {
  /** Is mobile menu open */
  mobileOpen: boolean;
  /** Set mobile menu state */
  setMobileOpen: (open: boolean) => void;
  /** Panel ref for outside click detection */
  panelRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 🎛️ useNavbarState - Navbar state management
 * - Mobile menu open/close state
 * - Outside click detection
 * - Escape key handling
 * - Clean event listeners
 */
export function useNavbarState(): NavbarState {
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [mobileOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return {
    mobileOpen,
    setMobileOpen,
    panelRef,
  };
}
