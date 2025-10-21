'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';

import { cn } from '@/lib/utils/cn';

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly external?: boolean;
}

export interface NavLinksProps {
  readonly items: readonly NavItem[];
  readonly className?: string;
  readonly disableActive?: boolean;
}

export function NavLinks({
  items,
  className,
  disableActive = false,
}: NavLinksProps): React.JSX.Element {
  const pathname = usePathname();
  const normalize = (url: string) => url.replace(/\/+$/, '');

  return (
    <nav
      className={cn('flex items-center gap-6', className)}
      role='navigation'
      aria-label='Main navigation'
    >
      {items.map(item => {
        const isActive = !disableActive && normalize(pathname) === normalize(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            className={cn(
              'text-sm font-medium transition-colors duration-300',
              'hover:text-brand-primary focus:text-brand-primary',
              'rounded-sm px-1 py-1 focus:outline-none focus:ring-2 focus:ring-brand-primary/50',
              isActive
                ? 'text-brand-primary'
                : 'text-neutral-700 hover:text-brand-primary dark:text-neutral-300 dark:hover:text-brand-primary'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
            {item.external && (
              <span className='ml-1 text-xs' aria-label='Opens in new tab'>
                ↗
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default NavLinks;
