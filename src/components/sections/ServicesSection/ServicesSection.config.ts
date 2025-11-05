/**
 * 🚗 ServicesSection Configuration - Benefits & Features
 */

import { CalendarCheck, Clock2, ShieldCheck, UserCheck, Star } from 'lucide-react';

export const servicesConfig = {
  // Section content
  title: 'Why Choose Our Service',
  subtitle: "We're London's premium chauffeur platform where choice meets transparency.",

  // Services/Benefits grid
  services: [
    {
      id: 'book-instantly',
      title: 'Book Instantly',
      description: 'Effortless bookings. Instant confirmation. Pure convenience.',
      icon: CalendarCheck,
      href: '/book-instantly',
      color: 'blue',
    },
    {
      id: 'professional-chauffeurs',
      title: 'Elite Chauffeurs',
      description: 'Licensed experts. Impeccable etiquette. Absolute discretion.',
      icon: UserCheck,
      href: '/chauffeurs',
      color: 'green',
    },
    {
      id: 'finest-fleet',
      title: 'The Finest Fleet',
      description: 'Hand-picked vehicles. Crafted for prestige and comfort.',
      icon: Star,
      href: '/fleet-details',
      color: 'purple',
    },
    {
      id: 'secure-payments',
      title: 'Secure Payments',
      description: 'Transparent pricing. Trusted transactions, every time.',
      icon: ShieldCheck,
      href: '/payments',
      color: 'yellow',
    },
    {
      id: '24-7-available',
      title: 'Available 24/7',
      description: 'At your service — any hour, any destination.',
      icon: Clock2,
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
    maxWidth: '7xl' as '5xl' | '6xl' | '7xl',
  },

  // Animation settings
  animation: {
    enabled: true,
    stagger: 0.1,
    duration: 0.6,
  },
} as const;

export type ServicesConfig = typeof servicesConfig;
