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
  MapPin,
  Clock,
  Shield,
  Star,
  Calendar,
  CreditCard,
  FileText,
  HelpCircle,
  Navigation,
  Users,
  Building2,
  Handshake,
  BookOpen,
  Heart,
  Camera,
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
        href: '/services/airport-transfers',
        icon: MapPin,
      },
      {
        label: 'City-to-City Rides',
        href: '/services/city-to-city',
        icon: Navigation,
      },
      {
        label: 'Hourly Hire',
        href: '/services/hourly-hire',
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
      {
        label: 'Corporate Events',
        href: '/services/corporate-events',
        icon: Building2,
      },
      {
        label: 'Wedding Services',
        href: '/services/wedding',
        icon: Heart,
      },
      {
        label: 'Group Travel',
        href: '/services/group-travel',
        icon: Users,
      },
      {
        label: 'Sightseeing Tours',
        href: '/services/sightseeing-tours',
        icon: Camera,
      },
    ],
  },
  {
    label: 'Members',
    href: '/members',
    icon: Users,
  },
  {
    label: 'Corporate',
    href: '/corporate',
    icon: Building2,
  },
  {
    label: 'Partners',
    href: '/partners',
    icon: Handshake,
  },
  {
    label: 'Blog',
    href: '/blog',
    icon: BookOpen,
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
