/**
 * 🎯 TestimonialsSection Configuration - Centralized Content
 *
 * All testimonials content in one place - no hardcoded JSX
 * Easy to modify without touching component code
 */

import type { TestimonialsConfig } from './TestimonialsSection.types';

export const testimonialsConfig: TestimonialsConfig = {
  // Section content
  title: {
    main: 'Client',
    accent: 'Testimonials',
  },
  subtitle:
    'Discover why discerning clients choose our premium chauffeur service for their most important journeys.',

  // Testimonials data
  testimonials: [
    {
      id: 1,
      name: 'James Richardson',
      role: 'CEO, Richardson & Associates',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      text: "Exceptional service from start to finish. The chauffeur was punctual, professional, and the BMW 7 Series was immaculate. This is now our company's preferred transportation service.",
      service: 'Executive Transfer',
    },
    {
      id: 2,
      name: 'Lady Catherine Pemberton',
      role: 'Private Client',
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      text: 'Absolutely flawless experience for our wedding day. The Mercedes S-Class was pristine and the chauffeur went above and beyond to ensure everything was perfect. Highly recommended.',
      service: 'Wedding Service',
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Investment Director',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      text: 'Effortless comfort and quiet sophistication. Vantage Lane delivers every time — discreet, precise, and refined. Each journey feels tailored and consistently exceptional.',
      service: 'Regular Client',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      role: 'Head of Operations, Goldman Sachs',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      text: 'Vantage Lane has transformed our executive transport. The dedicated account management and volume discounts have saved us significantly while improving service quality.',
      service: 'Corporate Service',
    },
    {
      id: 5,
      name: 'David Thompson',
      role: 'Managing Partner',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      text: 'The attention to detail is extraordinary. From the immaculate vehicles to the professional chauffeurs, every aspect exceeds expectations. Truly the gold standard.',
      service: 'VIP Service',
    },
    {
      id: 6,
      name: 'Emma Clarke',
      role: 'Event Director',
      avatar:
        'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      text: 'Coordinating transportation for high-profile events requires precision and reliability. Vantage Lane delivers both consistently, making our events seamless.',
      service: 'Event Transport',
    },
  ],

  // Trust indicators
  trustIndicators: [
    {
      value: '4.9/5',
      label: 'Average Rating',
    },
    {
      value: '500+',
      label: '5-Star Reviews',
    },
    {
      value: '98%',
      label: 'Client Retention',
    },
    {
      value: '24/7',
      label: 'Support Available',
    },
  ],
} as const;
