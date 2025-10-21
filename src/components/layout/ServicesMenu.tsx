'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { navigation } from '@/config/site.config';
import { cn } from '@/lib/utils/cn';

/**
 * 🔽 Services Menu Dropdown for Vantage Lane 2.0
 *
 * Features:
 * - Smooth dropdown animation
 * - Click outside to close
 * - Keyboard navigation support
 * - Active service highlighting
 * - Theme-aware styling
 */

export interface ServicesMenuProps {
  /** Custom styling */
  readonly className?: string;
}

// Use config instead of hardcoded values
const services = navigation.services;

/**
 * 🚗 Services dropdown menu
 */
export function ServicesMenu({ className }: ServicesMenuProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isServicesActive = pathname.startsWith('/services');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    return undefined;
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          'text-sm font-medium transition-colors duration-300',
          'hover:text-brand-primary focus:text-brand-primary',
          'rounded-sm px-1 py-1 focus:outline-none focus:ring-2 focus:ring-brand-primary/50',
          'flex items-center gap-1',
          isServicesActive ? 'text-brand-primary' : 'text-neutral-300 hover:text-brand-primary'
        )}
        aria-expanded={isOpen}
        aria-haspopup='true'
        aria-label='Services menu'
      >
        Services
        <svg
          className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={cn(
            'absolute left-0 top-full z-50 mt-2 w-64',
            'border border-border/50 bg-background/95 backdrop-blur-md',
            'rounded-lg shadow-lg shadow-black/20',
            'duration-200 animate-in fade-in-0 zoom-in-95',
            'origin-top-left'
          )}
          role='menu'
          aria-orientation='vertical'
        >
          <div className='p-2'>
            {services.map(service => {
              const isActive = pathname === service.href;

              return (
                <Link
                  key={service.href}
                  href={service.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block rounded-md px-3 py-2 transition-colors duration-200',
                    'hover:bg-brand-primary/10 hover:text-brand-primary',
                    'focus:bg-brand-primary/10 focus:text-brand-primary focus:outline-none',
                    isActive && 'bg-brand-primary/10 text-brand-primary'
                  )}
                  role='menuitem'
                >
                  <div className='text-sm font-medium'>{service.label}</div>
                  {service.description && (
                    <div className='mt-0.5 text-xs text-muted-foreground'>
                      {service.description}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesMenu;
