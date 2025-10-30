'use client';

import type React from 'react';

import { cn } from '@/lib/utils/cn';

import ServicesMenu from '../ServicesMenu';
import { NavLinks } from './NavLinks';

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly external?: boolean;
}

export interface NavbarDesktopProps {
  /** Navigation items */
  readonly items: readonly NavItem[];
  /** Hide services menu */
  readonly hideServices?: boolean;
  /** Custom menu items */
  readonly customMenus?: React.ReactNode;
  /** Custom styling */
  readonly className?: string;
}

/**
 * 🖥️ NavbarDesktop - Desktop navigation section
 * - Hidden on mobile (md:flex)
 * - NavLinks integration
 * - Services dropdown
 * - Extensible with custom menus
 * - Theme-aware styling
 */
export function NavbarDesktop({
  items,
  hideServices = false,
  customMenus,
  className,
}: NavbarDesktopProps): React.JSX.Element {
  return (
    <div className={cn('hidden items-center gap-6 md:flex', className)}>
      {/* Main Navigation Links */}
      <NavLinks items={items} className='flex items-center gap-6' />

      {/* Services Dropdown */}
      {!hideServices && <ServicesMenu />}

      {/* Custom Menu Items */}
      {customMenus}
    </div>
  );
}
