'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface DockTabProps {
  title: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

/**
 * 🔘 Modern Pill Tab — 2026 sliding indicator style
 * Icon + label inline, no magnification, clean & minimal
 */
export function DockTab({ title, icon: Icon, isActive, onClick }: DockTabProps) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      type="button"
      className={cn(
        'relative z-10 flex items-center gap-2 px-4 py-2 rounded-full',
        'text-sm font-medium whitespace-nowrap',
        'transition-colors duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/50',
        isActive
          ? 'text-[var(--background-dark)]'
          : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
      )}
    >
      {/* Sliding gold pill indicator */}
      {isActive && (
        <motion.div
          layoutId="dock-active-pill"
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #CBB26A 0%, #D4C078 50%, #B89F5A 100%)',
            boxShadow: '0 0 20px rgba(203,178,106,0.35), 0 2px 8px rgba(203,178,106,0.25)',
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
        />
      )}

      <Icon
        className={cn(
          'relative z-10 h-4 w-4 flex-shrink-0 transition-all duration-200',
          isActive && 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
        )}
      />
      <span className="relative z-10 tracking-wide">{title}</span>
    </button>
  );
}
