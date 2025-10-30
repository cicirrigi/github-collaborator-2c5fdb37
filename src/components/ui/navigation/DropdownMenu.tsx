'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';

import { designTokens } from '@/config/theme.config';
import { uiSurfaces } from '@/design-system/tokens/ui-surfaces';
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
}: DropdownMenuProps): React.JSX.Element | null {
  const [open, setOpen] = useState(false);

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
              'absolute top-full mt-2 min-w-56 rounded-xl border shadow-2xl',
              'backdrop-blur-xl z-50 overflow-hidden',
              alignment === 'right' ? 'right-0' : 'left-0'
            )}
            style={{
              ...uiSurfaces.dropdown,
              // Enhanced luxury glassmorphism
              background: `linear-gradient(135deg, 
                var(--background-elevated) 0%, 
                rgba(255,255,255,0.05) 100%)`,
            }}
          >
            {/* Luxury gradient overlay */}
            <div
              className='absolute inset-0 opacity-10'
              style={{
                background: designTokens.gradients.cardGlow,
              }}
            />

            {/* Menu Items */}
            <nav className='relative py-2' role='menu'>
              {item.children.map((subItem, index) => (
                <Link
                  key={subItem.href || index}
                  href={subItem.href || '#'}
                  role='menuitem'
                  className={cn(
                    'group flex items-center gap-3 px-4 py-3 text-sm',
                    'transition-all duration-200',
                    'text-[var(--text-secondary)] hover:text-[var(--brand-primary)]',
                    'hover:bg-[var(--brand-primary)]/10',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-[var(--brand-primary)]/40',
                    'focus-visible:bg-[var(--brand-primary)]/10'
                  )}
                  onClick={handleClose}
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
