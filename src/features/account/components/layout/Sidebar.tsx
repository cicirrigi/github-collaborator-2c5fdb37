/**
 * 🎯 Sidebar Component
 *
 * Collapsible sidebar navigation with glassmorphism
 * Desktop: expandable/collapsible
 * Mobile: handled by drawer
 */

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ACCOUNT_NAVIGATION, SIDEBAR_CONFIG } from '../../constants/account.constants';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  readonly className?: string;
  readonly isCollapsed: boolean;
  readonly onToggleCollapse: () => void;
}

export function Sidebar({ className = '', isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)]
        bg-white/80 dark:bg-neutral-900/80
        backdrop-blur-lg
        border-r border-neutral-200 dark:border-neutral-800
        transition-all duration-300 ease-in-out
        z-40
        ${className}
      `}
      style={{
        width: isCollapsed
          ? `${SIDEBAR_CONFIG.WIDTH_COLLAPSED}px`
          : `${SIDEBAR_CONFIG.WIDTH_EXPANDED}px`,
      }}
    >
      {/* Sidebar Content */}
      <div className='flex flex-col h-full'>
        {/* Logo/Brand Section */}
        <div
          className={`flex items-center px-4 py-6 border-b border-neutral-200 dark:border-neutral-800 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
        >
          {!isCollapsed && (
            <h2 className='text-lg font-bold text-neutral-900 dark:text-white'>MY ACCOUNT</h2>
          )}
          <button
            onClick={onToggleCollapse}
            className='p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors'
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className='w-5 h-5 text-neutral-600 dark:text-neutral-400' />
            ) : (
              <ChevronLeft className='w-5 h-5 text-neutral-600 dark:text-neutral-400' />
            )}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className='flex-1 overflow-y-auto py-4 px-3 space-y-6'>
          {ACCOUNT_NAVIGATION.map(section => (
            <div key={section.title}>
              {/* Section Title */}
              {!isCollapsed && (
                <h3 className='px-3 mb-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider'>
                  {section.title}
                </h3>
              )}

              {/* Section Items */}
              <div className='space-y-1.5'>
                {section.items.map(item => (
                  <SidebarItem key={item.id} item={item} isCollapsed={isCollapsed} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Section - Optional for future use */}
        <div className='border-t border-neutral-200 dark:border-neutral-800 p-4'>
          {!isCollapsed && (
            <p className='text-xs text-neutral-500 dark:text-neutral-400 text-center'>
              Vantage Lane
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
