'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

import { useAuth } from '@/features/auth/context/AuthProvider';
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
  const { user, isLoading, signOut } = useAuth();

  // Debug auth state in development
  if (process.env.NODE_ENV === 'development') {
    console.log('UserMenu Debug:', { user: !!user, isLoading, userEmail: user?.email });
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(); // SignOut from AuthProvider handles everything
    } catch {
      // Silent fail - logout redirect will happen anyway
    }
  };

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className='h-6 w-16 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded' />
      </div>
    );
  }

  // Authenticated user UI
  if (user) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        {/* User Account Button removed - handled by My Account dropdown in main menu */}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-2 text-sm font-medium transition-colors duration-300',
            'text-[var(--text-secondary)] hover:text-red-500',
            'rounded-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500/50'
          )}
        >
          <LogOut className='w-4 h-4' />
          <span className='hidden sm:inline'>Logout</span>
        </button>
      </div>
    );
  }

  // Unauthenticated user UI (original)
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Login Button */}
      <Link
        href='/auth/signin'
        className={cn(
          'text-sm font-medium transition-colors duration-300',
          'text-[var(--text-primary)] hover:text-[var(--brand-primary)]',
          'rounded-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50'
        )}
      >
        Sign In
      </Link>

      {/* Register Button - Orchestrated Hover + Shimmer */}
      <Link
        href='/auth/signup'
        className={cn(
          'text-sm font-medium transition-all duration-300',
          'bg-[var(--brand-primary)] text-black hover:bg-[var(--brand-primary)]/90',
          'rounded-lg px-4 py-2',
          'focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50',
          'hover:scale-105 active:scale-95',
          'hover:shadow-lg hover:shadow-[var(--brand-primary)]/30',
          'hover:brightness-110',
          'relative overflow-hidden',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000 before:ease-out'
        )}
        style={{
          backgroundColor: 'var(--brand-primary)',
          color: 'black',
        }}
      >
        Sign Up
      </Link>
    </div>
  );
}

export default UserMenu;
