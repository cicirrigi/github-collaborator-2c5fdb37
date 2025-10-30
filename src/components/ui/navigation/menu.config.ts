/**
 * 🧠 Navigation Menu Configuration - Centralized
 *
 * All navigation data in one place:
 * - Main menu items with icons
 * - Dropdown children
 * - Icons from lucide-react
 * - Zero hardcoded content in components!
 */

import {
  type LucideIcon,
  Home,
  Car,
  User,
  Settings,
  Phone,
  Info,
  MapPin,
  Clock,
  Shield,
  Star,
  Calendar,
  CreditCard,
  FileText,
  HelpCircle,
} from 'lucide-react';

export interface MenuItem {
  /** Display label */
  label: string;
  /** Direct link (for simple items) */
  href?: string;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Dropdown children */
  children?: MenuItem[];
  /** External link flag */
  external?: boolean;
  /** Badge text (optional) */
  badge?: string;
  /** Requires authentication */
  requiresAuth?: boolean;
}

export const mainMenu: MenuItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Services',
    icon: Car,
    children: [
      {
        label: 'Chauffeur Service',
        href: '/services/chauffeur',
        icon: User,
      },
      {
        label: 'Airport Transfers',
        href: '/services/airport',
        icon: MapPin,
      },
      {
        label: 'Hourly Hire',
        href: '/services/hourly',
        icon: Clock,
      },
      {
        label: 'Business Travel',
        href: '/services/business',
        icon: Shield,
      },
      {
        label: 'Special Events',
        href: '/services/events',
        icon: Star,
      },
    ],
  },
  {
    label: 'About',
    href: '/about',
    icon: Info,
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: Phone,
  },
];

export const userMenu: MenuItem[] = [
  {
    label: 'My Account',
    href: '/account',
    icon: User,
    requiresAuth: true,
  },
  {
    label: 'My Bookings',
    href: '/account/bookings',
    icon: Calendar,
    requiresAuth: true,
  },
  {
    label: 'Payment Methods',
    href: '/account/payments',
    icon: CreditCard,
    requiresAuth: true,
  },
  {
    label: 'Help Center',
    href: '/help',
    icon: HelpCircle,
  },
];

export const adminMenu: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: Settings,
    requiresAuth: true,
  },
  {
    label: 'Reports',
    href: '/admin/reports',
    icon: FileText,
    requiresAuth: true,
  },
];

// Export all menus for reuse
export const allMenus = {
  main: mainMenu,
  user: userMenu,
  admin: adminMenu,
} as const;
