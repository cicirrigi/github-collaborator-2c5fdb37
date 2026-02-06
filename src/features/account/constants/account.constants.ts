/**
 * 🔧 Account Constants - Vantage Lane 2.0
 *
 * Configurații și constante pentru sistemul de conturi
 * Centralizate, reutilizabile, type-safe
 */

import type { AccountSection } from '../types/account.types';

export const ACCOUNT_ROUTES = {
  ROOT: '/account',
  PROFILE: '/account/profile',
  SETTINGS: '/account/settings',
  BOOKINGS: '/account/bookings',
  ADDRESSES: '/account/addresses',
  EMERGENCY_CONTACTS: '/account/emergency-contacts',
  BILLING: '/account/billing',
  SUPPORT: '/account/support',
} as const;

export const ACCOUNT_NAVIGATION: readonly AccountSection[] = [
  {
    title: 'My Account',
    items: [
      {
        id: 'profile',
        label: 'Profile',
        path: ACCOUNT_ROUTES.PROFILE,
        icon: 'User',
        description: 'Personal information and avatar',
      },
      {
        id: 'settings',
        label: 'Settings',
        path: ACCOUNT_ROUTES.SETTINGS,
        icon: 'Settings',
        description: 'Preferences and notifications',
      },
    ],
  },
  {
    title: 'Bookings & Travel',
    items: [
      {
        id: 'bookings',
        label: 'Booking History',
        path: ACCOUNT_ROUTES.BOOKINGS,
        icon: 'Calendar',
        description: 'View past and upcoming trips',
      },
      {
        id: 'addresses',
        label: 'Saved Addresses',
        path: ACCOUNT_ROUTES.ADDRESSES,
        icon: 'MapPin',
        description: 'Manage favorite locations',
      },
    ],
  },
  {
    title: 'Safety & Support',
    items: [
      {
        id: 'emergency-contacts',
        label: 'Emergency Contacts',
        path: ACCOUNT_ROUTES.EMERGENCY_CONTACTS,
        icon: 'Phone',
        description: 'Emergency contact information',
      },
      {
        id: 'billing',
        label: 'Billing & Payments',
        path: ACCOUNT_ROUTES.BILLING,
        icon: 'CreditCard',
        description: 'Payment methods and invoices',
      },
      {
        id: 'support',
        label: 'Help & Support',
        path: ACCOUNT_ROUTES.SUPPORT,
        icon: 'HelpCircle',
        description: 'Contact support and FAQs',
      },
    ],
  },
] as const;

export const LOYALTY_TIERS = {
  bronze: {
    name: 'Bronze',
    color: '#CD7F32',
    benefits: ['Basic booking', 'Email support'],
    minSpent: 0,
  },
  silver: {
    name: 'Silver',
    color: '#C0C0C0',
    benefits: ['Priority booking', 'Phone support', '5% discount'],
    minSpent: 1000,
  },
  gold: {
    name: 'Gold',
    color: '#FFD700',
    benefits: ['Premium vehicles', '24/7 support', '10% discount'],
    minSpent: 5000,
  },
  platinum: {
    name: 'Platinum',
    color: '#E5E4E2',
    benefits: ['VIP service', 'Concierge', '15% discount', 'Free cancellation'],
    minSpent: 15000,
  },
} as const;

export const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  MARKETING: 'marketing',
  BOOKING_UPDATES: 'bookingUpdates',
  PROMOTIONS: 'promotions',
} as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
] as const;

export const FILE_UPLOAD_LIMITS = {
  AVATAR: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxDimensions: { width: 1024, height: 1024 },
  },
} as const;

export const VALIDATION_RULES = {
  PROFILE: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    PHONE_PATTERN: /^\+?[1-9]\d{1,14}$/,
  },
  EMERGENCY_CONTACT: {
    RELATIONSHIP_MAX_LENGTH: 30,
    MAX_CONTACTS: 5,
  },
  ADDRESS: {
    LABEL_MAX_LENGTH: 30,
    MAX_ADDRESSES: 10,
  },
} as const;
