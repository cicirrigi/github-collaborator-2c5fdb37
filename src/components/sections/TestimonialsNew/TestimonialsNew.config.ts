/**
 * 📊 TestimonialsNew Configuration - Centralized Content
 *
 * Toate datele de testimoniale în one place - no hardcoded JSX
 * Easy to modify fără să atingi codul componentelor
 */

import type { TestimonialsNewConfig } from './TestimonialsNew.types';

export const testimonialsNewConfig: TestimonialsNewConfig = {
  // Section content
  title: {
    main: 'Client',
    accent: 'Testimonials',
  },
  subtitle:
    'Discover why discerning clients choose our premium chauffeur service for their most important journeys.',

  // Testimonials data cu texte îmbunătățite și consistente
  testimonials: [
    {
      id: '1',
      name: 'Oliver Smith',
      role: 'Executive Assistant',
      company: 'Mayfair Holdings',
      avatarUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.3&auto=format&q=80',
      rating: 5,
      quote:
        'Impeccable service and attention to detail. Every journey feels perfectly managed, from the professional chauffeur to the immaculate presentation of the car.',
      service: 'Executive Transfer',
      verified: true,
    },
    {
      id: '2',
      name: 'Emma Thompson',
      role: 'Creative Director',
      company: 'Design Studio London',
      avatarUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      quote:
        'Flawless experience throughout. The chauffeur was graceful, the car pristine, and the atmosphere calm — every detail handled with quiet precision.',
      service: 'Private Hire',
      verified: true,
    },
    {
      id: '3',
      name: 'James Chen',
      role: 'Investment Director',
      company: 'Blackstone Capital',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      quote:
        'Simply refined. Each trip with Vantage Lane shows what true professionalism feels like — discreet, punctual, and effortlessly elegant in every sense.',
      service: 'Regular Client',
      verified: true,
    },
    {
      id: '4',
      name: 'Victoria Wright',
      role: 'Head of Operations',
      company: 'Goldman Sachs',
      avatarUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      quote:
        'Consistently exceptional and completely reliable. Our executives trust Vantage Lane for discretion, precision timing, and presentation that reflects our standards.',
      service: 'Corporate Service',
      verified: true,
    },
    {
      id: '5',
      name: 'Alexander Davis',
      role: 'Managing Partner',
      company: 'Davis & Associates',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.3&auto=format&q=80',
      rating: 5,
      quote:
        'Vantage Lane has transformed our approach to business travel. The reliability, communication, and consistency of service save us time and inspire trust.',
      service: 'Business Account',
      verified: true,
    },
    {
      id: '6',
      name: 'Sophie Martinez',
      role: 'Chief Marketing Officer',
      company: 'Luxury Brands Ltd',
      avatarUrl:
        'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      quote:
        'Perfect for client meetings and events. Always punctual, discreet, and beautifully presented — excellence delivered with effortless composure.',
      service: 'Chauffeur Service',
      verified: true,
    },
    {
      id: '7',
      name: 'Friedrich Köhler',
      role: 'Managing Director',
      company: 'Köhler & Co., Germany',
      avatarUrl:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.3&auto=format&q=80',
      rating: 5,
      quote:
        'Remarkable consistency and punctuality. For our corporate transfers across Berlin, Vantage Lane delivered calm professionalism and flawless execution every time.',
      service: 'Corporate Transfer',
      verified: true,
    },
    {
      id: '8',
      name: 'Michael Reed',
      role: 'Head of Sales',
      company: 'Newport Capital, USA',
      avatarUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      quote:
        'Dependable and discreet. The chauffeurs are courteous, routes are optimised, and the vehicles are immaculate — ideal for demanding client schedules.',
      service: 'Executive Transfer',
      verified: true,
    },
    {
      id: '9',
      name: 'Layla Al Mansouri',
      role: 'Event Producer',
      company: 'Dubai Gala Events',
      avatarUrl:
        'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      quote:
        'Perfect discretion and presentation for VIP arrivals. Vantage Lane handles complex event logistics with poise and flawless attention to detail.',
      service: 'Event Transport',
      verified: true,
    },
    {
      id: '10',
      name: 'Claire Dubois',
      role: 'Gallery Director',
      company: 'Galerie du Centre, France',
      avatarUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
      rating: 5,
      quote:
        'Subtle, refined service that suits our clientele. The chauffeurs are polite, the cars immaculate — exactly the quiet professionalism we expect for gallery visits.',
      service: 'Private Hire',
      verified: true,
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
