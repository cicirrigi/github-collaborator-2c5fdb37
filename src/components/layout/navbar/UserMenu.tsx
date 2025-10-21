'use client';

import type React from 'react';

import { cn } from '@/lib/utils/cn';

/**
 * 👤 User Menu for Vantage Lane 2.0
 *
 * Features:
 * - Login/Register buttons
 * - Theme toggle integration
 * - Responsive design
 * - Accessible navigation
 */

export interface UserMenuProps {
  /** Custom styling */
  readonly className?: string;
}

/**
 * 🔐 User authentication menu
 */
export function UserMenu({ className }: UserMenuProps): React.JSX.Element {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Login Button */}
      <button
        className={cn(
          'text-sm font-medium transition-colors duration-300',
          'text-neutral-300 hover:text-brand-primary',
          'rounded-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-primary/50'
        )}
      >
        Sign In
      </button>

      {/* Register Button */}
      <button
        className={cn(
          'text-sm font-medium transition-all duration-300',
          'bg-brand-primary text-black hover:bg-brand-primary/90',
          'rounded-lg px-4 py-2',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary/50',
          'shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40'
        )}
      >
        Get Started
      </button>
    </div>
  );
}

export default UserMenu;
