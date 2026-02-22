'use client';

import {
  Calendar,
  CreditCard,
  HelpCircle,
  Home,
  MapPin,
  Menu,
  Settings,
  Shield,
  User,
  X,
} from 'lucide-react';
import type React from 'react';

import { DropdownMenu } from '@/components/ui/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/features/auth/context/AuthProvider';
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
  const { isAuthenticated } = useAuth();

  // My Account dropdown menu configuration
  const myAccountMenu = {
    label: 'My Account',
    icon: User,
    requiresAuth: true,
    children: [
      {
        label: 'Dashboard',
        href: '/account',
        icon: Home,
      },
      {
        label: 'Profile',
        href: '/account/profile',
        icon: User,
      },
      {
        label: 'Addresses',
        href: '/account/addresses',
        icon: MapPin,
      },
      {
        label: 'Booking History',
        href: '/account/bookings',
        icon: Calendar,
      },
      {
        label: 'Emergency Contacts',
        href: '/account/emergency-contacts',
        icon: Shield,
      },
      {
        label: 'Billing & Payments',
        href: '/account/billing',
        icon: CreditCard,
      },
      {
        label: 'Settings',
        href: '/account/settings',
        icon: Settings,
      },
      {
        label: 'Help & Support',
        href: '/account/support',
        icon: HelpCircle,
      },
    ],
  };

  return (
    <div className='flex items-center gap-3'>
      {/* Desktop Actions */}
      <div className='hidden items-center gap-3 md:flex'>
        {!hideThemeToggle && <ThemeToggle variant='minimal' size='sm' />}

        {/* Separator */}
        {isAuthenticated && !hideThemeToggle && (
          <div className='w-px h-6 bg-neutral-300 dark:bg-neutral-600' />
        )}

        {/* My Account Dropdown - only when authenticated */}
        {isAuthenticated && <DropdownMenu item={myAccountMenu} alignment='right' />}

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
          <Menu className='h-6 w-6' aria-hidden='true' />
        )}
      </button>
    </div>
  );
}
