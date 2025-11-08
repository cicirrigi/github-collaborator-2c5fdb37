'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * 🌐 NavbarPortal - Izolează navbar-ul din layout context
 *
 * Renderează navbar-ul direct în document.body pentru
 * position: fixed corect față de viewport, nu față de container.
 *
 * Fixed hydration issue - shows immediately on mount
 */
export function NavbarPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Show immediately during hydration
  if (typeof window === 'undefined') {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>{children}</div>
    );
  }

  if (!mounted) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>{children}</div>
    );
  }

  return createPortal(children, document.body);
}
