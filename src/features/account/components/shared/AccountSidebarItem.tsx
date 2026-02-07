/**
 * 🔗 Account Sidebar Item - Shared Component
 *
 * Individual navigation item pentru sidebar
 * Shared între desktop și mobile, styling diferit
 */

'use client';

import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AccountMenuItem } from '../../types/account.types';

interface AccountSidebarItemProps {
  readonly item: AccountMenuItem;
  readonly variant?: 'desktop' | 'mobile';
  readonly onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function AccountSidebarItem({
  item,
  variant = 'desktop',
  onClick,
}: AccountSidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.path;

  const baseClasses = [
    'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
    'text-sm font-medium select-none',
  ].join(' ');

  const variantClasses = {
    desktop: [
      'hover:bg-neutral-100 dark:hover:bg-neutral-800',
      isActive
        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
        : 'text-neutral-700 dark:text-neutral-300',
    ].join(' '),
    mobile: [
      'hover:bg-neutral-100 dark:hover:bg-neutral-800',
      isActive
        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
        : 'text-neutral-700 dark:text-neutral-300',
    ].join(' '),
  };

  const iconClasses = [
    'w-5 h-5 flex-shrink-0',
    isActive ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-500 dark:text-neutral-400',
  ].join(' ');

  const linkProps = {
    href: item.path,
    className: cn(baseClasses, variantClasses[variant]),
    'aria-current': isActive ? ('page' as const) : undefined,
    ...(onClick && { onClick }),
  };

  return (
    <Link {...linkProps}>
      {/* Lucide React Icon */}
      <item.icon className={iconClasses} aria-hidden='true' />

      <div className='flex-1 min-w-0'>
        <div className='font-medium truncate'>{item.label}</div>
        {variant === 'desktop' && (
          <div className='text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5'>
            {item.description}
          </div>
        )}
      </div>

      {isActive && (
        <div className='w-2 h-2 bg-amber-500 rounded-full flex-shrink-0' aria-hidden='true' />
      )}
    </Link>
  );
}
