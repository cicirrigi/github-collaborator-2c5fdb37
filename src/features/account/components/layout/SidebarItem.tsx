/**
 * 🔲 SidebarItem Component
 *
 * Reusable navigation item pentru sidebar
 * Glassmorphism design, responsive, type-safe
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SidebarItem as SidebarItemType } from '../../types/sidebar.types';

interface SidebarItemProps {
  readonly item: SidebarItemType;
  readonly isCollapsed: boolean;
}

export function SidebarItem({ item, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.path;

  const Icon = item.icon;

  return (
    <Link
      href={item.path}
      className={`
        group relative flex items-center gap-3 rounded-lg px-3 py-3
        transition-all duration-200
        ${
          isActive
            ? 'bg-amber-500/20 text-amber-600 dark:bg-amber-500/30 dark:text-amber-400'
            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
      title={isCollapsed ? item.label : undefined}
    >
      {/* Icon */}
      <Icon
        className={`
          flex-shrink-0 transition-colors duration-200
          ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-500 dark:text-neutral-400'}
          ${isCollapsed ? 'w-6 h-6' : 'w-6 h-6'}
        `}
      />

      {/* Label - hidden when collapsed */}
      {!isCollapsed && <span className='flex-1 text-base font-medium truncate'>{item.label}</span>}

      {/* Badge - hidden when collapsed */}
      {!isCollapsed && item.badge && (
        <span
          className={`
            flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full
            ${
              isActive
                ? 'bg-amber-600 text-white dark:bg-amber-500'
                : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
            }
          `}
        >
          {item.badge}
        </span>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-600 dark:bg-amber-400 rounded-r-full' />
      )}
    </Link>
  );
}
