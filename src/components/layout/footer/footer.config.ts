/**
 * 🦶 Footer Configuration - Centralized Content
 *
 * All footer data in one place:
 * - Brand identity from brandConfig
 * - Links grouped by category
 * - Social media links
 * - Copyright & legal
 *
 * Zero hardcoded content in components!
 */

import { brandConfig } from '@/config/brand.config';

export const footerConfig = {
  brand: {
    logo: '/LOGO/logo transparent.png',
    name: brandConfig.identity.name,
    tagline: 'The art of redefined motion',
    description: brandConfig.service.detailed,
  },

  links: [
    {
      title: 'Quick Links',
      items: [
        { label: 'Airport Transfers', href: '/services/airport-transfers', icon: 'plane' as const },
        { label: 'City-to-City Rides', href: '/services/city-to-city', icon: 'map-pin' as const },
        { label: 'Hourly Hire', href: '/services/hourly-hire', icon: 'clock' as const },
        { label: 'Limousine Service', href: '/services/limousine', icon: 'crown' as const },
      ],
    },
    {
      title: 'Company',
      items: [
        { label: 'About Us', href: '/about', icon: 'info' as const },
        { label: 'Members', href: '/members', icon: 'users' as const },
        { label: 'Corporate', href: '/corporate', icon: 'building-2' as const },
        { label: 'Partners', href: '/partners', icon: 'handshake' as const },
      ],
    },
    {
      title: 'Events & Support',
      items: [
        { label: 'Events', href: '/events', icon: 'calendar-heart' as const },
        { label: 'Contact Us', href: '/contact', icon: 'mail' as const },
        { label: 'Book Online', href: '/#booking', icon: 'calendar-check' as const },
        { label: 'Help Center', href: '/help', icon: 'help-circle' as const },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Privacy Policy', href: '/privacy', icon: 'shield-check' as const },
        { label: 'Terms of Service', href: '/terms', icon: 'file-text' as const },
        { label: 'Cookie Policy', href: '/cookies', icon: 'cookie' as const },
        { label: 'GDPR', href: '/gdpr', icon: 'lock' as const },
      ],
    },
  ],

  socials: [
    {
      name: 'Facebook',
      href: 'https://facebook.com/vantagelane',
      icon: 'facebook' as const,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/vantagelane',
      icon: 'instagram' as const,
    },
    {
      name: 'TikTok',
      href: 'https://tiktok.com/@vantagelane',
      icon: 'tiktok' as const,
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@vantagelane',
      icon: 'youtube' as const,
    },
    {
      name: 'X',
      href: 'https://x.com/vantagelane',
      icon: 'x' as const,
    },
  ],

  legal: {
    copyright: `© ${new Date().getFullYear()} ${brandConfig.identity.name}. All rights reserved.`,
    location: brandConfig.location.primary,
    company: `${brandConfig.identity.name} Limited`,
    registration: 'Company registered in England & Wales',
  },

  contact: {
    phone: '+44 20 7946 0958',
    email: 'hello@vantagelane.com',
    address: 'London, United Kingdom',
  },

  newsletter: {
    title: 'Stay Elevated',
    subtitle: 'Exclusive luxury travel insights & VIP offers',
    placeholder: 'your@email.com',
    cta: 'Join VIP List',
    benefits: [
      { icon: '🎯', text: 'Early access to new routes' },
      { icon: '✨', text: 'VIP rates & exclusive offers' },
      { icon: '🚗', text: 'Private event invitations' },
    ],
    privacy: 'We respect your privacy. Unsubscribe anytime.',
  },
} as const;

export type FooterConfig = typeof footerConfig;
