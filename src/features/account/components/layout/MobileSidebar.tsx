/**
 * 📱 MobileSidebar Component
 *
 * Mobile drawer sidebar with glassmorphism
 * Slide-in from left on mobile devices
 */

'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { ACCOUNT_NAVIGATION } from '../../constants/account.constants';
import { SidebarItem } from './SidebarItem';

interface MobileSidebarProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden'
        onClick={onClose}
        aria-label='Close menu'
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-80
          bg-white/95 dark:bg-neutral-900/95
          backdrop-blur-lg
          border-r border-neutral-200 dark:border-neutral-800
          z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex items-center justify-between px-4 py-6 border-b border-neutral-200 dark:border-neutral-800'>
            <h2 className='text-lg font-bold text-neutral-900 dark:text-white'>Account</h2>
            <button
              onClick={onClose}
              className='p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
              aria-label='Close menu'
            >
              <X className='w-5 h-5 text-neutral-600 dark:text-neutral-400' />
            </button>
          </div>

          {/* Navigation */}
          <nav className='flex-1 overflow-y-auto py-4 px-3 space-y-6'>
            {ACCOUNT_NAVIGATION.map(section => (
              <div key={section.title}>
                <h3 className='px-3 mb-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider'>
                  {section.title}
                </h3>
                <div className='space-y-1'>
                  {section.items.map(item => (
                    <div key={item.id} onClick={onClose}>
                      <SidebarItem item={item} isCollapsed={false} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className='border-t border-neutral-200 dark:border-neutral-800 p-4'>
            <p className='text-xs text-neutral-500 dark:text-neutral-400 text-center'>
              Vantage Lane v2.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
