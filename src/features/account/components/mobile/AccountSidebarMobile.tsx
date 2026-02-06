/**
 * 📱 Account Sidebar Mobile - Mobile Navigation
 *
 * Mobile-specific sidebar cu drawer/sheet pattern
 * Separat de desktop, optimizat pentru touch
 */

'use client';

import { ACCOUNT_NAVIGATION } from '../../constants/account.constants';
import type { AccountSection } from '../../types/account.types';
import { AccountSidebarItem } from '../shared/AccountSidebarItem';

interface AccountSidebarMobileProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function AccountSidebarMobile({ isOpen, onClose }: AccountSidebarMobileProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Sidebar Sheet */}
      <aside className='fixed inset-y-0 left-0 w-80 max-w-[90vw] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-50 lg:hidden'>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800'>
            <div>
              <h2 className='text-lg font-semibold text-neutral-900 dark:text-white'>My Account</h2>
              <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-1'>
                Manage your profile
              </p>
            </div>

            <button
              onClick={onClose}
              className='p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
              aria-label='Close menu'
            >
              <div className='w-5 h-5 text-neutral-500 dark:text-neutral-400'>✕</div>
            </button>
          </div>

          {/* Navigation */}
          <nav className='flex-1 p-6 space-y-6 overflow-y-auto' aria-label='Account navigation'>
            {ACCOUNT_NAVIGATION.map((section: AccountSection) => (
              <MobileSidebarSection key={section.title} section={section} onItemClick={onClose} />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

interface MobileSidebarSectionProps {
  readonly section: AccountSection;
  readonly onItemClick: () => void;
}

function MobileSidebarSection({ section, onItemClick }: MobileSidebarSectionProps) {
  return (
    <div>
      <h3 className='text-xs font-medium uppercase text-neutral-500 dark:text-neutral-400 tracking-wider mb-3'>
        {section.title}
      </h3>

      <div className='space-y-2'>
        {section.items.map(item => (
          <AccountSidebarItem key={item.id} item={item} variant='mobile' onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
}
