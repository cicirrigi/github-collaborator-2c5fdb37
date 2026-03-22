/**
 * 🚀 QuickActionsWidget - Quick action links + support footer
 *
 * Mobile-responsive widget with action links and footer icons
 */

'use client';

import {
  Award,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Clock,
  Headphones,
  Phone,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { DashboardWidget } from './DashboardWidget';

interface ActionLink {
  readonly icon: React.ElementType;
  readonly label: string;
  readonly href: string;
}

interface FooterAction {
  readonly icon: React.ElementType;
  readonly label: string;
  readonly subtitle: string;
  readonly href: string;
}

const ACTION_LINKS: readonly ActionLink[] = [
  { icon: CalendarCheck, label: 'Book a Ride', href: '/booking' },
  { icon: Clock, label: 'Book by Hour', href: '/booking?type=hourly' },
  { icon: CalendarDays, label: 'Book by Day', href: '/booking?type=daily' },
  { icon: CalendarDays, label: 'Upcoming Bookings', href: '/account/bookings' },
  { icon: Award, label: 'Loyalty', href: '/account/loyalty' },
];

const FOOTER_ACTIONS: readonly FooterAction[] = [
  { icon: Headphones, label: 'Support', subtitle: '24x7 airport', href: '/support' },
  { icon: Settings, label: 'Settings', subtitle: 'Terms & policies', href: '/account/settings' },
  { icon: Phone, label: 'Emergency', subtitle: 'Prefix & preferences', href: '/emergency' },
];

export function QuickActionsWidget() {
  return (
    <DashboardWidget className='h-fit'>
      {/* Header */}
      <h3 className='text-xs font-semibold uppercase tracking-wider text-white/70 mb-4'>
        Quick Actions
      </h3>

      {/* Action Links */}
      <div className='space-y-1'>
        {ACTION_LINKS.map(action => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className='
                flex items-center justify-between
                py-3 px-4 rounded-lg
                hover:bg-white/5 dark:hover:bg-white/10
                transition-colors duration-200
                group
              '
            >
              <div className='flex items-center gap-3'>
                <Icon className='w-5 h-5 text-amber-400' />
                <span className='text-sm md:text-base text-white font-medium'>{action.label}</span>
              </div>
              <ChevronRight className='w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors' />
            </Link>
          );
        })}
      </div>

      {/* Footer - Support Actions */}
      <div className='border-t border-white/10 mt-6 pt-6'>
        <div className='grid grid-cols-3 gap-4'>
          {FOOTER_ACTIONS.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={action.label} className='relative'>
                {/* Separator line - not for first item */}
                {index > 0 && (
                  <div className='absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-white/10' />
                )}

                <Link
                  href={action.href}
                  className='
                    flex flex-col items-center gap-2
                    py-2 px-2 rounded-lg
                    hover:bg-white/5 dark:hover:bg-white/10
                    transition-colors duration-200
                    group
                  '
                >
                  <Icon className='w-5 h-5 md:w-6 md:h-6 text-white/70 group-hover:text-amber-400 transition-colors' />
                  <div className='text-center'>
                    <p className='text-xs font-medium text-white/90'>{action.label}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardWidget>
  );
}
