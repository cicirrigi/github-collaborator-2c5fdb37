'use client';

import { cn } from '@/lib/utils/cn';
import { motion, LayoutGroup } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface DockMobileItem {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive: boolean;
}

export const FloatingDockMobile = ({
  items,
  className,
}: {
  items: DockMobileItem[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'block md:hidden w-full overflow-x-auto scrollbar-hide',
        '-mx-2 px-2',
        className
      )}
    >
      <motion.div
        className={cn(
          'flex items-center gap-1 p-1 rounded-full w-fit mx-auto',
          'border border-[var(--border-subtle)]/20',
          'backdrop-blur-xl',
        )}
        style={{
          background: 'color-mix(in srgb, var(--background-elevated) 70%, transparent)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.12)',
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        role="tablist"
        aria-label="Booking type selection"
      >
        <LayoutGroup>
          {items.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={item.onClick}
                role="tab"
                aria-selected={item.isActive}
                type="button"
                className={cn(
                  'relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                  'text-xs font-medium whitespace-nowrap',
                  'transition-colors duration-200',
                  item.isActive
                    ? 'text-[var(--background-dark)]'
                    : 'text-[var(--text-muted)]'
                )}
              >
                {item.isActive && (
                  <motion.div
                    layoutId="dock-mobile-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #CBB26A 0%, #D4C078 50%, #B89F5A 100%)',
                      boxShadow: '0 0 12px rgba(203,178,106,0.3)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <Icon className="relative z-10 h-3.5 w-3.5 flex-shrink-0" />
                <span className="relative z-10">{item.title}</span>
              </button>
            );
          })}
        </LayoutGroup>
      </motion.div>
    </div>
  );
};
