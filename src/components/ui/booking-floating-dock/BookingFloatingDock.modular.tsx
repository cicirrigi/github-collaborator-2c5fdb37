'use client';

import type { LucideIcon } from 'lucide-react';
import { FloatingDockInline } from './FloatingDockInline';
import { FloatingDockMobile } from './FloatingDockMobile';

export interface ModularDockItem {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive: boolean;
}

interface ModularDockProps {
  items: ModularDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}

/**
 * 🎛️ Booking Floating Dock - Modern 2026 Pill Style
 * Orchestrator for inline (desktop) and mobile variants
 */
export const BookingFloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: ModularDockProps) => {
  return (
    <>
      <FloatingDockInline items={items} className={desktopClassName || ''} />
      <FloatingDockMobile items={items} className={mobileClassName || ''} />
    </>
  );
};
