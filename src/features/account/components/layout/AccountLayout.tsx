/**
 * 🏗️ AccountLayout Component
 *
 * Main layout wrapper for account section
 * Includes sidebar + main content area
 */

'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { MobileSidebar } from './MobileSidebar';
import { Sidebar } from './Sidebar';

interface AccountLayoutProps {
  readonly children: React.ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <div className='min-h-screen bg-neutral-50 dark:bg-neutral-900'>
      {/* Desktop Sidebar - hidden on mobile */}
      <div className='hidden md:block'>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Mobile Header with Menu Toggle */}
      <div className='md:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800'>
        <div className='flex items-center justify-between px-4 py-4'>
          <h1 className='text-lg font-bold text-neutral-900 dark:text-white'>Account</h1>
          <button
            onClick={toggleMobileMenu}
            className='p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
            aria-label='Toggle menu'
          >
            {isMobileMenuOpen ? (
              <X className='w-6 h-6 text-neutral-600 dark:text-neutral-400' />
            ) : (
              <Menu className='w-6 h-6 text-neutral-600 dark:text-neutral-400' />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main
        className='transition-all duration-300 ease-in-out pt-16'
        style={{
          marginLeft: isSidebarCollapsed ? '80px' : '280px',
        }}
      >
        {children}
      </main>
    </div>
  );
}
