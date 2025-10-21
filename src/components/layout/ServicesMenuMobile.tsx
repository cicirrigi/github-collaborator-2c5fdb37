'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

import { navigation } from '@/config/site.config';
import { cn } from '@/lib/utils/cn';

/**
 * 📱 Premium Mobile Services Menu for Vantage Lane 2.0
 *
 * Features:
 * - Accordion-style menu
 * - Framer Motion animations
 * - Active item highlighting with gold bar
 * - Theme-aware styling (dark/light)
 * - Accessible (ARIA)
 */

// Use config instead of hardcoded values
const services = navigation.services;

export interface ServicesMenuMobileProps {
  readonly className?: string;
  readonly onItemClick?: () => void;
}

export default function ServicesMenuMobile({
  className,
  onItemClick,
}: ServicesMenuMobileProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isServicesActive = pathname.startsWith('/services');

  const handleItemClick = () => {
    setOpen(false);
    onItemClick?.();
  };

  return (
    <div
      className={cn('md:hidden', className)}
      role='navigation'
      aria-label='Mobile services navigation'
    >
      {/* Accordion Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center justify-between px-4 py-3 text-left',
          'text-sm font-medium transition-colors duration-200',
          'hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50',
          isServicesActive ? 'text-brand-primary' : 'text-neutral-700 dark:text-neutral-300'
        )}
        aria-expanded={open}
        aria-controls='services-mobile-menu'
      >
        <span>Services</span>
        <svg
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            open && 'rotate-180',
            isServicesActive && 'text-brand-primary'
          )}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            id='services-mobile-menu'
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className='space-y-1 px-3 pb-3'
          >
            {services.map(service => {
              const isActive = pathname === service.href;
              return (
                <motion.div
                  key={service.href}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className='relative'
                >
                  {isActive && (
                    <span className='absolute bottom-0 left-0 top-0 w-[2px] rounded-r-md bg-brand-primary' />
                  )}
                  <Link
                    href={service.href}
                    onClick={handleItemClick}
                    className={cn(
                      'relative flex flex-col gap-1 rounded-md px-4 py-3 transition-all duration-200 md:px-3 md:py-2',
                      'hover:bg-brand-primary/10 focus:bg-brand-primary/10',
                      'focus:outline-none focus:ring-2 focus:ring-brand-primary/50',
                      isActive
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'text-neutral-700 hover:text-brand-primary dark:text-neutral-300'
                    )}
                  >
                    <div className='text-sm font-medium'>{service.label}</div>
                    {service.description && (
                      <div className='text-xs text-neutral-500 dark:text-neutral-400'>
                        {service.description}
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
