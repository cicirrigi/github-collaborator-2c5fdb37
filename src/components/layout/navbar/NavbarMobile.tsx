'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type React from 'react';

import { DropdownMenu, MenuItemComponent, mainMenu } from '@/components/ui/navigation';
import { cn } from '@/lib/utils/cn';

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
  /** Navigation items (deprecated - using mainMenu) */
  readonly items?: readonly NavItem[];
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
  items: _items, // Deprecated parameter, marked as unused
  containerRef,
}: NavbarMobileProps): React.JSX.Element {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay blur background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden'
            onClick={onClose}
            aria-hidden='true'
          />

          {/* Menu panel */}
          <motion.div
            ref={containerRef}
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
              {/* Orchestrated Navigation */}
              {mainMenu.map(item =>
                item.children ? (
                  <DropdownMenu key={item.label} item={item} clickToOpen={true} />
                ) : (
                  <MenuItemComponent key={item.label} item={item} onClick={onClose} />
                )
              )}

              {/* All navigation now handled by mainMenu above */}

              {/* User Actions */}
              <div className='mt-2 border-t border-[var(--border-subtle)] pt-3'>
                <UserMenu />
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
