'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

import { cn } from '@/lib/utils/cn';

import type { MenuItem } from './menu.config';

export interface MenuItemProps {
  /** Menu item data */
  readonly item: MenuItem;
  /** Custom styling */
  readonly className?: string;
  /** Disable dropdown indicator */
  readonly hideDropdownIcon?: boolean;
  /** Click handler for dropdown toggle */
  readonly onClick?: () => void;
  /** Is dropdown open (for styling) */
  readonly isOpen?: boolean;
}

/**
 * 🧩 MenuItem - Single menu item component
 * - Icon + label display
 * - Hover effects with design tokens
 * - Dropdown indicator if has children
 * - External link support
 * - Badge display
 * - Focus states for accessibility
 */
export function MenuItemComponent({
  item,
  className,
  hideDropdownIcon = false,
  onClick,
  isOpen = false,
}: MenuItemProps): React.JSX.Element {
  const Icon = item.icon;
  const isDropdown = !!item.children?.length;
  const isExternal = item.external;

  const baseClasses = cn(
    'flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium',
    'transition-all duration-300 ease-out group relative overflow-hidden',
    'text-[var(--text-primary)] hover:text-[var(--brand-primary)]',
    'hover:bg-[var(--brand-primary)]/10 hover:backdrop-blur-sm',
    'hover:shadow-lg hover:shadow-[var(--brand-primary)]/20',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-[var(--brand-primary)]/40 focus-visible:ring-offset-2',
    'focus-visible:ring-offset-[var(--background-elevated)]',
    'transform-gpu hover:scale-[1.02]',
    className
  );

  // Enhanced luxury underline effect
  const underlineClasses = cn(
    'absolute bottom-0 left-1/2 h-0.5 w-0 transition-all duration-500 ease-out',
    'bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent',
    'group-hover:w-full group-hover:left-0',
    'shadow-[0_0_4px_var(--brand-primary)] opacity-0 group-hover:opacity-60',
    'transform-gpu'
  );

  const content = (
    <>
      {/* Icon */}
      {Icon && (
        <Icon className='h-4 w-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:drop-shadow-sm' />
      )}

      {/* Label */}
      <span className='transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:font-semibold group-hover:drop-shadow-sm'>
        {item.label}
      </span>

      {/* Badge */}
      {item.badge && (
        <span
          className='ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium'
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'var(--background-dark)',
          }}
        >
          {item.badge}
        </span>
      )}

      {/* Dropdown Icon */}
      {isDropdown && !hideDropdownIcon && (
        <ChevronDown
          className={cn('h-3 w-3 ml-1 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      )}

      {/* Luxury underline */}
      <div className={underlineClasses} />
    </>
  );

  // Dropdown trigger (button)
  if (isDropdown && onClick) {
    return (
      <button
        type='button'
        onClick={onClick}
        className={baseClasses}
        aria-expanded={isOpen}
        aria-haspopup='menu'
      >
        {content}
      </button>
    );
  }

  // Regular link
  if (item.href) {
    return (
      <Link
        href={item.href}
        className={baseClasses}
        {...(isExternal && {
          target: '_blank',
          rel: 'noopener noreferrer',
        })}
      >
        {content}
      </Link>
    );
  }

  // Fallback span
  return <span className={baseClasses}>{content}</span>;
}
