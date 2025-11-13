'use client';

import type { BookingDockItem, FloatingDockProps } from './dock.types';
import { FloatingDockInline } from './FloatingDockInline';
import { FloatingDockMobile } from './FloatingDockMobile';

/**
 * 🎛️ Booking Floating Dock - Modular & Clean
 * Simple orchestrator that delegates to inline/mobile variants
 */
export const BookingFloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: FloatingDockProps) => {
  return (
    <>
      <FloatingDockInline items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};
