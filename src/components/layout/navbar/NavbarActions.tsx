'use client';

import { X } from 'lucide-react';
import type React from 'react';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils/cn';

import { UserMenu } from './UserMenu';

export interface NavbarActionsProps {
  /** Is mobile menu open */
  readonly mobileOpen: boolean;
  /** Mobile menu toggle handler */
  readonly setMobileOpen: (open: boolean) => void;
  /** Hide theme toggle */
  readonly hideThemeToggle?: boolean;
  /** Hide user menu */
  readonly hideUserMenu?: boolean;
  /** Custom actions */
  readonly customActions?: React.ReactNode;
}

/**
 * ⚡ NavbarActions - Right-side actions (Theme, User, Mobile Toggle)
 * - Theme toggle with minimal variant
 * - User menu integration
 * - Mobile burger menu button
 * - CSS variables for theming
 * - Accessible with ARIA labels
 */
export function NavbarActions({
  mobileOpen,
  setMobileOpen,
  hideThemeToggle = false,
  hideUserMenu = false,
  customActions,
}: NavbarActionsProps): React.JSX.Element {
  return (
    <div className='flex items-center gap-3'>
      {/* Desktop Actions */}
      <div className='hidden items-center gap-3 md:flex'>
        {!hideThemeToggle && <ThemeToggle variant='minimal' size='sm' />}
        {customActions}
        {!hideUserMenu && <UserMenu />}
      </div>

      {/* Mobile Menu Button */}
      <button
        type='button'
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label='Toggle mobile menu'
        aria-expanded={mobileOpen}
        className={cn(
          'rounded-md p-2 transition-colors focus:outline-none',
          'focus:ring-2 focus:ring-[var(--brand-primary)]/50 md:hidden',
          'text-[var(--text-secondary)] hover:text-[var(--brand-primary)]'
        )}
        style={{
          color: mobileOpen ? 'var(--brand-primary)' : 'var(--text-secondary)',
        }}
      >
        {mobileOpen ? (
          <X className='h-6 w-6' aria-hidden='true' />
        ) : (
          <svg
            className='h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        )}
      </button>
    </div>
  );
}
