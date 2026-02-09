'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';

import { designTokens } from '@/config/theme.config';
import { uiSurfaces } from '@/design-system/tokens/ui-surfaces';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { cn } from '@/lib/utils/cn';

import type { MenuItem } from './menu.config';
import { MenuItemComponent } from './MenuItem';

export interface DropdownMenuProps {
  /** Menu item with children */
  readonly item: MenuItem;
  /** Custom styling */
  readonly className?: string;
  /** Trigger on click instead of hover */
  readonly clickToOpen?: boolean;
  /** Dropdown alignment */
  readonly alignment?: 'left' | 'right';
  /** Mobile menu close handler */
  readonly onMobileClose?: () => void;
}

/**
 * 🧩 DropdownMenu - Reusable dropdown component
 * - Hover or click triggers
 * - Framer Motion animations
 * - Luxury glassmorphism background
 * - Design tokens integration
 * - Keyboard navigation support
 * - Auto-closes on outside click
 */
export function DropdownMenu({
  item,
  className,
  clickToOpen = false,
  alignment = 'left',
  onMobileClose,
}: DropdownMenuProps): React.JSX.Element | null {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  // Hide dropdown if authentication required but user not authenticated
  if (item.requiresAuth && !isAuthenticated && !isLoading) {
    return null;
  }

  // No dropdown if no children
  if (!item.children?.length) {
    return <MenuItemComponent item={item} {...(className && { className })} />;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleToggle = () => setOpen(!open);

  // Hover handlers (desktop)
  const hoverProps = !clickToOpen
    ? {
        onMouseEnter: handleOpen,
        onMouseLeave: handleClose,
      }
    : {};

  return (
    <div className={cn('relative', className)} {...hoverProps}>
      {/* Trigger */}
      <MenuItemComponent
        item={item}
        hideDropdownIcon={false}
        {...(clickToOpen && { onClick: handleToggle })}
        isOpen={open}
      />

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: designTokens.animations.easing.framer.ease,
            }}
            className={cn(
              // Desktop: absolute dropdown with right alignment for navbar items
              'md:absolute md:top-full md:mt-2 md:rounded-xl md:border md:shadow-2xl',
              'md:backdrop-blur-2xl md:saturate-150 md:z-50 md:overflow-hidden',
              // Force right alignment for My Account to prevent off-screen
              item.label === 'My Account'
                ? 'md:right-0'
                : alignment === 'right'
                  ? 'md:right-0'
                  : 'md:left-0',
              // Mobile: accordion-style block
              'block mt-2 rounded-lg border-0 shadow-none',
              'bg-[var(--background-elevated)] overflow-hidden',
              // Consistent width for all dropdowns (desktop only)
              'md:min-w-64 md:max-w-80'
            )}
            style={{
              ...uiSurfaces.dropdown,
              // Opacitate ajustată la 90% pentru mai multă soliditate
              backgroundColor: 'color-mix(in srgb, var(--background-elevated) 90%, transparent)',
              // Elimină gradient-ul care creează glow
              backgroundImage: 'none',
            }}
          >
            {/* Clean background - no golden glow */}

            {/* Menu Items */}
            <nav
              className={cn(
                'relative py-2',
                // Grid layout for many items (2 columns when > 6 items) - desktop only
                item.children.length > 6 ? 'block md:grid md:grid-cols-2 md:gap-0' : 'block'
              )}
              role='menu'
            >
              {/* Elegant vertical divider for 2-column layout - desktop only */}
              {item.children.length > 6 && (
                <div
                  className='hidden md:absolute md:left-1/2 md:top-4 md:bottom-4 md:-translate-x-px md:block'
                  style={{
                    background:
                      'linear-gradient(to bottom, transparent 0%, var(--brand-primary) 20%, var(--brand-primary) 80%, transparent 100%)',
                    opacity: 0.3,
                    width: '1px',
                  }}
                  aria-hidden='true'
                />
              )}
              {item.children.map((subItem, index) => (
                <Link
                  key={subItem.href || index}
                  href={subItem.href || '#'}
                  role='menuitem'
                  className={cn(
                    'group flex items-center gap-3 px-4 py-3 text-base md:text-sm',
                    'transition-all duration-200',
                    'text-[var(--text-primary)] hover:text-[var(--brand-primary)]',
                    'hover:bg-[var(--brand-primary)]/10',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-[var(--brand-primary)]/40',
                    'focus-visible:bg-[var(--brand-primary)]/10'
                  )}
                  onClick={() => {
                    handleClose();
                    // Close mobile menu if we're on mobile
                    if (onMobileClose) onMobileClose();
                  }}
                  {...(subItem.external && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                >
                  {/* Sub-item icon */}
                  {subItem.icon && (
                    <subItem.icon className='h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
                  )}

                  {/* Sub-item label */}
                  <span className='flex-1 transition-transform duration-200 group-hover:translate-x-1'>
                    {subItem.label}
                  </span>

                  {/* Badge */}
                  {subItem.badge && (
                    <span
                      className='ml-2 rounded-full px-2 py-0.5 text-xs font-medium'
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--background-dark)',
                      }}
                    >
                      {subItem.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
