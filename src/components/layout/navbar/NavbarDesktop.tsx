'use client';

import type React from 'react';

import { cn } from '@/lib/utils/cn';
import { DropdownMenu, MenuItemComponent, mainMenu } from '@/components/ui/navigation';

export interface NavbarDesktopProps {
  /** Custom menu override */
  readonly customMenu?: typeof mainMenu;
  /** Custom menu items */
  readonly customMenus?: React.ReactNode;
  /** Custom styling */
  readonly className?: string;
}

/**
 * 🖥️ NavbarDesktop - Desktop navigation section (Orchestrated)
 * - Hidden on mobile (md:flex)
 * - Config-driven navigation from menu.config.ts
 * - Auto dropdown detection
 * - Design tokens integration
 * - Zero hardcoded content
 */
export function NavbarDesktop({
  customMenu,
  customMenus,
  className,
}: NavbarDesktopProps): React.JSX.Element {
  // Use custom menu or default from config
  const menuItems = customMenu || mainMenu;

  return (
    <div className={cn('hidden items-center gap-6 md:flex', className)}>
      {/* Orchestrated Navigation - Auto dropdown/link detection */}
      <nav className='flex items-center gap-6' role='navigation'>
        {menuItems.map(item =>
          item.children ? (
            <DropdownMenu key={item.label} item={item} />
          ) : (
            <MenuItemComponent key={item.label} item={item} />
          )
        )}
      </nav>

      {/* Custom Menu Items */}
      {customMenus}
    </div>
  );
}
