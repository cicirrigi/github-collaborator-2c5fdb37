/**
 * 📖 NarrativeSection Configuration
 * Brand philosophy and experience narrative content
 */

import type { NarrativeSectionConfig } from './NarrativeSection.types';

export const narrativeConfig: NarrativeSectionConfig = {
  /**
   * Main title - bicolor (like VantageAssurance)
   */
  title: {
    primary: 'The Art of',
    accent: 'Refined Motion',
  },

  /**
   * Subheadline - brand essence
   */
  subheadline:
    "Every journey we craft embodies precision, discretion, and quiet sophistication — inspired by London's golden tradition of chauffeur excellence.",

  /**
   * Content blocks - separated for visual clarity
   */
  blocks: [
    // Block 1: Brand Philosophy
    {
      paragraphs: [
        {
          text: 'At Vantage Lane, we believe in ',
          emphasis: 'effortless refinement',
          rest: ' — the calm assurance that every detail moves in harmony with your expectations.',
        },
      ],
    },
    // Block 2: Experience & Booking
    {
      paragraphs: [
        {
          text: 'Our ',
          emphasis: 'bespoke booking form',
          rest: ' transforms travel into an experience of artful precision.',
        },
        {
          text: 'Choose your vehicle, tailor every element — from ambience and music to flowers, champagne, or additional stops',
          emphasis: '',
          rest: '.',
        },
        {
          text: 'Each journey is planned with care and carried out with ',
          emphasis: 'impeccable discretion',
          rest: '.',
        },
      ],
    },
  ],

  /**
   * Call-to-action
   */
  cta: {
    text: 'Discover the Vantage Lane Experience',
    href: '#services',
    scroll: true,
  },

  /**
   * Visual content
   */
  visual: {
    src: '/images/Vantage Lane Home Chauffeur plane pic.webp',
    alt: 'Vantage Lane chauffeur service at private jet terminal - luxury Mercedes S-Class',
  },
} as const;
