/**
 * 🖥️ Account Sidebar Desktop - Desktop Navigation
 *
 * Desktop-specific sidebar pentru account navigation
 * Clean, fără logic hardcodat, mobile separat
 */

'use client';

import { AccountSidebarItem } from '../shared/AccountSidebarItem';
import { ACCOUNT_NAVIGATION } from '../../constants/account.constants';
import type { AccountSection } from '../../types/account.types';

interface AccountSidebarDesktopProps {
  readonly className?: string;
}

export function AccountSidebarDesktop({ className = '' }: AccountSidebarDesktopProps) {
  return (
    <aside className={`w-80 flex-shrink-0 ${className}`}>
      <div className='sticky top-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm'>
        {/* Header */}
        <div className='mb-6'>
          <h2 className='text-lg font-semibold text-neutral-900 dark:text-white'>My Account</h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-1'>
            Manage your profile and preferences
          </p>
        </div>

        {/* Navigation Sections */}
        <nav className='space-y-6' aria-label='Account navigation'>
          {ACCOUNT_NAVIGATION.map((section: AccountSection) => (
            <SidebarSection key={section.title} section={section} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

interface SidebarSectionProps {
  readonly section: AccountSection;
}

function SidebarSection({ section }: SidebarSectionProps) {
  return (
    <div>
      <h3 className='text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400 tracking-wider mb-3'>
        {section.title}
      </h3>

      <div className='space-y-1'>
        {section.items.map(item => (
          <AccountSidebarItem key={item.id} item={item} variant='desktop' />
        ))}
      </div>
    </div>
  );
}
