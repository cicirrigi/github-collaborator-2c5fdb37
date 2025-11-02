'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils/cn';
import { designTokens } from '@/config/theme.config';
import { FooterIcon } from '@/components/ui/FooterIcon';

import type { FooterConfig } from './footer.config';

export interface FooterLinksProps {
  /** Links data from config */
  readonly links: FooterConfig['links'];
  /** Custom styling */
  readonly className?: string;
}

/**
 * 🔗 FooterLinks - Navigation links section
 * - Grouped by category
 * - Luxury hover effects with arrow
 * - Responsive grid layout
 * - Design tokens integration
 * - Zero hardcoded content
 */
export function FooterLinks({ links, className }: FooterLinksProps): React.JSX.Element {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (title: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  return (
    <div
      className={cn('grid items-start grid-cols-1 md:grid-cols-4', className)}
      style={{
        gap: designTokens.footer.spacing.gridGap,
      }}
    >
      {links.map(category => {
        const isOpen = openSections.has(category.title);

        return (
          <div key={category.title}>
            {/* Category Title - Mobile Accordion Button */}
            <button
              onClick={() => toggleSection(category.title)}
              className={cn(
                'flex w-full items-center justify-between mb-4',
                'font-semibold text-sm transition-colors duration-200',
                'md:cursor-default md:pointer-events-none',
                'focus-visible:outline-none focus-visible:ring-2 md:focus-visible:ring-0',
                'focus-visible:ring-[var(--brand-primary)]/40 rounded-sm'
              )}
              style={{ color: 'var(--text-primary)' }}
              aria-expanded={isOpen}
              aria-controls={`footer-section-${category.title}`}
            >
              <span>{category.title}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200 md:hidden',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Category Links - Collapsible on mobile */}
            <ul
              id={`footer-section-${category.title}`}
              className={cn(
                'flex flex-col overflow-hidden transition-all duration-300',
                // Mobile accordion behavior
                'md:flex',
                isOpen ? 'flex max-h-96' : 'hidden max-h-0 md:max-h-none'
              )}
              style={{
                gap: designTokens.footer.spacing.linkGap,
              }}
            >
              {category.items.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 text-sm transition-all duration-200',
                      'hover:text-[var(--brand-primary)]',
                      'focus-visible:outline-none focus-visible:ring-2',
                      'focus-visible:ring-[var(--brand-primary)]/40 focus-visible:ring-offset-2',
                      'focus-visible:ring-offset-[var(--background-dark)] rounded-sm'
                    )}
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {/* Semantic Icon */}
                    <FooterIcon
                      name={item.icon}
                      size={18}
                      className='flex-shrink-0 transition-colors duration-200'
                      style={{ color: 'var(--brand-primary)' }}
                    />

                    <span className='transition-transform duration-200 group-hover:translate-x-1'>
                      {item.label}
                    </span>

                    <ArrowRight
                      className={cn(
                        'h-3 w-3 opacity-0 transition-all duration-200',
                        'translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0'
                      )}
                      style={{ color: 'var(--brand-primary)' }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
