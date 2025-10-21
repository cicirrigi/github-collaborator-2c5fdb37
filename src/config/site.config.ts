/**
 * 🌐 Site Configuration - Vantage Lane 2.0
 *
 * Centralized configuration for site-wide settings.
 * Eliminates hardcoding and enables enterprise scalability.
 */

export interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly external?: boolean;
  readonly hasDropdown?: boolean;
}

export interface ServiceItem {
  readonly href: string;
  readonly label: string;
  readonly description: string;
}

export interface SocialLink {
  readonly href: string;
  readonly label: string;
  readonly icon: string;
}

export interface FooterSection {
  readonly title: string;
  readonly links: readonly { href: string; label: string }[];
}

/**
 * 🧭 Navigation Configuration
 */
export const navigation = {
  main: [
    { href: '/', label: 'Home' },
    { href: '/members', label: 'Members' },
    { href: '/corporate', label: 'Corporate' },
    { href: '/events', label: 'Events' },
    { href: '/partners', label: 'Partners' },
  ] as const satisfies readonly NavItem[],

  services: [
    {
      href: '/services/city-to-city',
      label: 'City-to-City',
      description: 'Long-distance luxury transfers',
    },
    {
      href: '/services/airport-transfers',
      label: 'Airport Transfers',
      description: 'Professional airport pickups',
    },
    {
      href: '/services/hourly-hire',
      label: 'Hourly Hire',
      description: 'Flexible hourly bookings',
    },
    {
      href: '/services/limousine',
      label: 'Limousine Service',
      description: 'Premium limousine experience',
    },
  ] as const satisfies readonly ServiceItem[],
} as const;

/**
 * 🏢 Footer Configuration
 */
export const footer = {
  sections: [
    {
      title: 'Services',
      links: navigation.services.map(s => ({ href: s.href, label: s.label })),
    },
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/fleet', label: 'Our Fleet' },
        { href: '/chauffeurs', label: 'Chauffeurs' },
        { href: '/contact', label: 'Contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { href: '/support', label: 'Help Center' },
        { href: '/support/booking', label: 'Booking Help' },
        { href: '/support/payment', label: 'Payment Issues' },
        { href: '/support/account', label: 'Account Support' },
      ],
    },
  ] as const satisfies readonly FooterSection[],

  social: [
    {
      href: 'https://twitter.com/vantagelane',
      label: 'Twitter',
      icon: 'twitter',
    },
    {
      href: 'https://linkedin.com/company/vantage-lane',
      label: 'LinkedIn',
      icon: 'linkedin',
    },
    {
      href: 'https://instagram.com/vantagelane',
      label: 'Instagram',
      icon: 'instagram',
    },
  ] as const satisfies readonly SocialLink[],

  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ] as const,
} as const;

/**
 * 📄 Site Metadata
 */
export const siteMetadata = {
  name: 'Vantage Lane',
  title: 'Vantage Lane - Premium Chauffeur Services',
  description:
    'Experience luxury transportation in London with professional chauffeurs and exceptional service.',
  url: 'https://vantagelane.co.uk',
  ogImage: '/og-image.jpg',
  company: {
    name: 'Vantage Lane Ltd',
    address: 'London, United Kingdom',
    phone: '+44 20 7946 0958',
    email: 'hello@vantagelane.co.uk',
  },
} as const;

export default {
  navigation,
  footer,
  siteMetadata,
} as const;
