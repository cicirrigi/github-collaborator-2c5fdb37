'use client';

import type React from 'react';

import { navigation } from '@/config/site.config';
import { cn } from '@/lib/utils/cn';

import { Container } from '../Container';
import { useNavbarState } from './hooks';
import { Logo } from './Logo';
import { NavbarActions } from './NavbarActions';
import { NavbarDesktop } from './NavbarDesktop';
import { NavbarMobile } from './NavbarMobile';

export interface NavbarProps {
  /** Custom styling */
  readonly className?: string;
  /** Hide services menu */
  readonly hideServices?: boolean;
  /** Hide theme toggle */
  readonly hideThemeToggle?: boolean;
  /** Hide user menu */
  readonly hideUserMenu?: boolean;
  /** Custom navigation items (override config) */
  readonly customNavItems?: readonly {
    href: string;
    label: string;
    external?: boolean;
  }[];
}

/**
 * 🧭 Navbar - Main navigation orchestrator
 * - Modular architecture with separated concerns
 * - Desktop/Mobile responsive behavior
 * - State management with custom hooks
 * - CSS variables for theming
 * - Accessibility compliant
 * - Under 80 lines (orchestrator only)
 */
export default function Navbar({
  className,
  hideServices = false,
  hideThemeToggle = false,
  hideUserMenu = false,
  customNavItems,
}: NavbarProps): React.JSX.Element {
  // State management
  const { mobileOpen, setMobileOpen, panelRef } = useNavbarState();

  // Navigation items from config or custom
  const navItems = customNavItems || navigation.main;

  return (
    <header
      className={cn('relative z-50 w-full border-b transition-colors duration-300', className)}
      style={{
        backgroundColor: 'var(--background-elevated)',
        borderBottomColor: 'var(--border-subtle)',
      }}
    >
      <Container>
        <div className='flex h-16 items-center justify-between'>
          {/* Brand Logo */}
          <Logo size='md' />

          {/* Desktop Navigation */}
          <NavbarDesktop items={navItems} hideServices={hideServices} />

          {/* Actions (Theme, User, Mobile Toggle) */}
          <NavbarActions
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            hideThemeToggle={hideThemeToggle}
            hideUserMenu={hideUserMenu}
          />
        </div>
      </Container>

      {/* Mobile Panel */}
      <NavbarMobile
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={navItems}
        containerRef={panelRef}
      />
    </header>
  );
}
