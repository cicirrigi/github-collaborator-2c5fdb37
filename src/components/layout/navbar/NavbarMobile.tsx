'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import type React from 'react';
import { useRef } from 'react';

import { cn } from '@/lib/utils/cn';

import ServicesMenuMobile from '../ServicesMenuMobile';
import { UserMenu } from './UserMenu';

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly external?: boolean;
}

export interface NavbarMobileProps {
  /** Is mobile menu open */
  readonly open: boolean;
  /** Close handler */
  readonly onClose: () => void;
  /** Navigation items */
  readonly items: readonly NavItem[];
  /** Container ref for outside click detection */
  readonly containerRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * 📱 NavbarMobile - Mobile panel with animations
 * - AnimatePresence with smooth transitions
 * - Outside click detection
 * - Services accordion integration
 * - Theme-aware styling with CSS variables
 */
export function NavbarMobile({
  open,
  onClose,
  items,
  containerRef,
}: NavbarMobileProps): React.JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={containerRef || panelRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className={cn(
            'absolute left-0 top-16 z-40 w-full border-t shadow-xl backdrop-blur-xl md:hidden',
            // Use CSS variables for theming
            'bg-[var(--background-elevated)] border-[var(--border-subtle)]'
          )}
          style={{
            backgroundColor: 'var(--background-elevated)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <nav className='flex flex-col space-y-2 p-4' aria-label='Mobile navigation'>
            {items.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'text-[var(--text-secondary)] hover:bg-[var(--brand-primary)]/10',
                  'hover:text-[var(--brand-primary)] focus:outline-none focus:ring-2',
                  'focus:ring-[var(--brand-primary)]/50'
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Services Section */}
            <div className='my-2 border-t border-[var(--border-subtle)]' />
            <ServicesMenuMobile />

            {/* User Actions */}
            <div className='mt-2 border-t border-[var(--border-subtle)] pt-3'>
              <UserMenu />
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
