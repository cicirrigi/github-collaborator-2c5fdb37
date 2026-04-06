'use client';

import { cn } from '@/lib/utils/cn';
import { motion, LayoutGroup } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { DockTab } from './DockTab';

export interface DockInlineItem {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive: boolean;
}

export const FloatingDockInline = ({
  items,
  className,
}: {
  items: DockInlineItem[];
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        'relative mx-auto hidden md:flex items-center',
        'gap-1 p-1.5 rounded-full w-fit',
        'border border-[var(--border-subtle)]/20',
        'backdrop-blur-xl',
        className
      )}
      style={{
        background: 'color-mix(in srgb, var(--background-elevated) 70%, transparent)',
        boxShadow: [
          'inset 0 1px 0 rgba(255,255,255,0.08)',
          '0 4px 24px rgba(0,0,0,0.12)',
          '0 0 0 1px rgba(255,255,255,0.05)',
        ].join(', '),
      }}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      role="tablist"
      aria-label="Booking type selection"
    >
      <LayoutGroup>
        {items.map(item => (
          <DockTab
            key={item.title}
            title={item.title}
            icon={item.icon}
            isActive={item.isActive}
            onClick={item.onClick}
          />
        ))}
      </LayoutGroup>
    </motion.div>
  );
};
