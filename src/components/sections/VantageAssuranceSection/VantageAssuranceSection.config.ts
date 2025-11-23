/**
 * 🛡️ VantageAssuranceSection Configuration
 * Content data for trust & prestige section
 */

import { Award, BadgeCheck, Clock, CreditCard, Crown, FileCheck, Lock, Shield } from 'lucide-react';

import type { AssuranceItem, HeadlinePart } from './VantageAssuranceSection.types';

export const assuranceConfig = {
  /**
   * Main section title
   */
  title: {
    primary: 'Vantage',
    accent: 'Assurance',
  },

  /**
   * Subtitle (3-part elegant composition)
   */
  headline: {
    parts: [
      { text: 'Refined Journeys.', accent: false },
      { text: 'Professional Chauffeurs.', accent: true },
      { text: 'Unmatched Discretion.', accent: false },
    ] as HeadlinePart[],
  },

  /**
   * Supporting subtext
   */
  subtext: 'Each ride reflects our dedication to safety, comfort, and quiet precision.',

  /**
   * Quick facts bar (with icons, separated by |)
   */
  facts: [
    { icon: Shield, text: 'Licensed & Insured' },
    { icon: BadgeCheck, text: 'Vetted Chauffeurs' },
    { icon: FileCheck, text: 'GDPR Compliant' },
    { icon: Lock, text: 'PCI Secure' },
  ],

  /**
   * 6 Assurance items (2×3 grid)
   */
  items: [
    {
      id: 'licensed',
      icon: Shield,
      label: 'Licensed & Insured',
      subtext: 'Fully compliant with UK chauffeur regulations',
    },
    {
      id: 'secure-payments',
      icon: Lock,
      label: 'Secure Payments',
      subtext: 'PCI-compliant, encrypted transactions',
    },
    {
      id: 'always-on-time',
      icon: Clock,
      label: 'Always On Time',
      subtext: 'Precision tracking & 24/7 reliability',
    },
    {
      id: 'vetted-chauffeurs',
      icon: Award,
      label: 'Vetted Chauffeurs',
      subtext: 'Background-checked, uniformed professionals',
    },
    {
      id: 'fixed-rates',
      icon: CreditCard,
      label: 'Fixed Rates',
      subtext: 'Transparent pricing. No hidden fees.',
    },
    {
      id: 'discreet-service',
      icon: Crown,
      label: 'Discreet Service',
      subtext: 'Privacy and professionalism guaranteed',
    },
  ] as AssuranceItem[],

  /**
   * Logo band configuration (optional feature)
   */
  logos: {
    enabled: true,
    text: "Chosen by guests of the world's most distinguished establishments",
    items: ['Hilton', 'Corinthia', 'Emirates', 'The Ritz London', 'Heathrow VIP'],
  },

  /**
   * Soft footer CTA
   */
  footer: {
    text: 'You can find out the price and book your car online',
    emphasis: 'effortlessly',
    linkText: 'book online',
    linkHref: '/booking',
  },
} as const;

export type AssuranceConfig = typeof assuranceConfig;
