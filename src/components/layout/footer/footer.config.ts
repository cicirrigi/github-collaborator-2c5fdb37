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
    logo: '/images/vantage-lane-logo.png',
    name: brandConfig.identity.name,
    tagline: brandConfig.identity.slogan,
    description: brandConfig.service.detailed,
  },

  links: [
    {
      title: 'Company',
      items: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Story', href: '/about#story' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
      ],
    },
    {
      title: 'Services',
      items: [
        { label: 'Chauffeur Service', href: '/services/chauffeur' },
        { label: 'Airport Transfers', href: '/services/airport' },
        { label: 'Business Travel', href: '/services/business' },
        { label: 'Special Events', href: '/services/events' },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Help Center', href: '/help' },
        { label: 'Book Online', href: '/booking' },
        { label: 'Track Journey', href: '/tracking' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'GDPR', href: '/gdpr' },
      ],
    },
  ],

  socials: [
    {
      name: 'Instagram',
      href: 'https://instagram.com/vantagelane',
      icon: 'instagram' as const,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/vantagelane',
      icon: 'linkedin' as const,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/vantagelane',
      icon: 'twitter' as const,
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/vantagelane',
      icon: 'facebook' as const,
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
} as const;

export type FooterConfig = typeof footerConfig;
