/**
 * 💎 Pricing Section Configuration - Vantage Lane 2.0
 *
 * Centralized configuration for pricing packages and section content.
 * Config-driven approach eliminates hardcoding and enables easy updates.
 */

import { Plane, Clock, Briefcase, Sparkles } from 'lucide-react';

import type { PricingSectionConfig } from './PricingSection.types';

export const pricingConfig: PricingSectionConfig = {
  title: {
    primary: 'Transparent Rates.',
    accent: 'Tailored for Every Journey.',
  },
  subtitle:
    'Every trip with Vantage Lane is priced with precision — based on distance, duration, and vehicle category.',

  commitment: ['No hidden fees', 'No surge pricing', 'What you see is what you pay'],

  packages: [
    {
      id: 'airport-transfers',
      name: 'Airport Transfers',
      category: 'Airport',
      icon: Plane,
      tagline: 'Seamless arrivals & departures',
      priceFrom: 'From £95',
      description: 'Perfect for business and leisure travelers',
      features: [
        { text: 'Mercedes S-Class / E-Class / V-Class', included: true },
        { text: 'Flight monitoring & meet & greet', included: true },
        { text: '60 min waiting time included', included: true },
        { text: 'Assistance with luggage', included: true },
        { text: 'Complimentary water & Wi-Fi', included: true },
      ],
      cta: {
        text: 'Book Airport Transfer',
        href: '/booking?service=airport',
      },
    },
    {
      id: 'hourly-hire',
      name: 'Hourly Hire',
      category: 'Hourly',
      icon: Clock,
      tagline: 'Complete flexibility, your chauffeur on standby',
      priceFrom: 'From £70/hour',
      priceNote: 'Minimum 3 hours',
      description: 'Perfect for meetings, events, or flexible itineraries',
      features: [
        { text: 'Mercedes S-Class / E-Class / V-Class', included: true },
        { text: 'Professional chauffeur', included: true },
        { text: 'Flexible routing and stops', included: true },
        { text: 'Complimentary water & Wi-Fi', included: true },
        { text: 'Customizable ambience (music, temperature, etc.)', included: true },
      ],
      popular: true,
      cta: {
        text: 'Book Hourly Service',
        href: '/booking?service=hourly',
      },
    },
    {
      id: 'corporate-travel',
      name: 'Corporate Travel',
      category: 'Corporate',
      icon: Briefcase,
      tagline: 'Discreet, professional, and efficient',
      priceFrom: 'Custom plans',
      description: 'Tailored solutions for executives & companies',
      features: [
        { text: 'Contract options for companies', included: true },
        { text: 'Priority booking & dedicated account', included: true },
        { text: 'Discreet professional chauffeurs', included: true },
        { text: 'Flight / schedule monitoring', included: true },
        { text: 'Monthly invoicing & support', included: true },
      ],
      cta: {
        text: 'Request Corporate Quote',
        href: '/contact?inquiry=corporate',
      },
    },
    {
      id: 'bespoke-journeys',
      name: 'Bespoke Journeys',
      category: 'Bespoke',
      icon: Sparkles,
      tagline: 'Private itineraries crafted your way',
      priceFrom: 'Custom quote',
      description: 'Fully customizable luxury experiences',
      features: [
        { text: 'Mercedes of your choice', included: true },
        { text: 'Dedicated professional chauffeur', included: true },
        { text: 'Multi-stop / multi-day flexibility', included: true },
        { text: 'Optional amenities: champagne, flowers, escort', included: true },
        { text: 'Concierge-level coordination', included: true },
      ],
      cta: {
        text: 'Design Your Journey',
        href: '/booking?service=bespoke',
      },
    },
  ] as const,

  cta: {
    text: 'Book Instantly',
    href: '/booking',
    description: 'Get an instant quote or book directly online',
  },
} as const;

// Export pricing categories for filtering
export const pricingCategories = ['Airport', 'Hourly', 'Corporate', 'Bespoke'] as const;

// Export packages by category helper
export const getPackagesByCategory = (category: string) =>
  pricingConfig.packages.filter(pkg => pkg.category === category);

// Export popular packages helper
export const getPopularPackages = () => pricingConfig.packages.filter(pkg => pkg.popular);
