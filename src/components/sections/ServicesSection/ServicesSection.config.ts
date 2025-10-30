/**
 * 🚗 ServicesSection Configuration - Benefits & Features
 */

import { CarFront, Clock, CreditCard, Search, UserCheck } from 'lucide-react';

export const servicesConfig = {
  // Section content
  title: 'Why Choose Our Service',
  subtitle: "We're London's premium chauffeur platform where choice meets transparency.",

  // Services/Benefits grid
  services: [
    {
      id: 'book-instantly',
      title: 'Book Instantly',
      description:
        'Competitive rates with full transparency, premium vehicles, and instant confirmation - all in seconds.',
      icon: Search,
      href: '/book-instantly',
      color: 'blue',
    },
    {
      id: 'professional-chauffeurs',
      title: 'Professional Chauffeurs',
      description:
        'Licensed, vetted, and experienced drivers providing exceptional service and local knowledge.',
      icon: UserCheck,
      href: '/chauffeurs',
      color: 'green',
    },
    {
      id: 'finest-fleet',
      title: 'The Finest Fleet',
      description: 'Prestige vehicles, curated with care from fully licensed operators.',
      icon: CarFront,
      href: '/fleet-details',
      color: 'purple',
    },
    {
      id: 'secure-payments',
      title: 'Secure Payments',
      description:
        'Safe and convenient payment options with transparent pricing and instant confirmation.',
      icon: CreditCard,
      href: '/payments',
      color: 'yellow',
    },
    {
      id: '24-7-available',
      title: 'Available 24/7',
      description:
        'Round-the-clock service for airport transfers, business meetings, and special occasions.',
      icon: Clock,
      href: '/support',
      color: 'red',
    },
  ],

  // Layout settings
  layout: {
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      wide: 5, // Pentru 5 servicii
    },
    gap: '1rem',
    maxWidth: '7xl',
  },

  // Animation settings
  animation: {
    enabled: true,
    stagger: 0.1,
    duration: 0.6,
  },
} as const;

export type ServicesConfig = typeof servicesConfig;
