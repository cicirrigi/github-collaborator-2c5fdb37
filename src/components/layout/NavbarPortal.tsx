'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * 🌐 NavbarPortal - Izolează navbar-ul din layout context
 *
 * Renderează navbar-ul direct în document.body pentru
 * position: fixed corect față de viewport, nu față de container.
 *
 * Folosit de: Stripe, Vercel, Linear, etc.
 */
export function NavbarPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
