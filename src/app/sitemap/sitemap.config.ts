/**
 * 🗺️ Sitemap Configuration - Enhanced with SEO and Icons
 * Centralized data configuration for premium sitemap
 */

import type { SitemapData } from './sitemap.types';

export const sitemapConfig: SitemapData = {
  sections: [
    // 1️⃣ Main Pages - Highest priority
    {
      title: 'Main Pages',
      icon: 'Home',
      priority: 1.0,
      accent: 'gold',
      links: [
        {
          name: 'Home',
          url: '/',
          description: 'Main landing page with luxury chauffeur services overview',
          priority: 1.0,
          lastModified: '2025-11-05',
          changefreq: 'daily',
          accent: 'gold',
          meta: {
            title: 'Vantage Lane - Premium London Chauffeur Services',
            description:
              'Experience luxury transportation in London with professional chauffeurs and exceptional service.',
            keywords: ['luxury chauffeur', 'London transport', 'premium car service'],
          },
        },
        {
          name: 'About Us',
          url: '/about',
          description: "Learn about Vantage Lane's story, mission and values",
          priority: 0.8,
          lastModified: '2025-11-05',
        },
        {
          name: 'Contact',
          url: '/contact',
          description: 'Get in touch with our premium customer service team',
          priority: 0.9,
          lastModified: '2025-11-05',
        },
      ],
    },

    // 2️⃣ Services - Core business offerings
    {
      title: 'Services',
      icon: 'Car',
      priority: 0.9,
      accent: 'gold',
      links: [
        {
          name: 'Airport Transfers',
          url: '/services/airport-transfers',
          description: 'Premium airport transportation with meet & greet service',
          priority: 0.9,
          lastModified: '2025-11-05',
        },
        {
          name: 'Executive Travel',
          url: '/services/executive',
          description: 'Business and corporate travel solutions',
          priority: 0.8,
          lastModified: '2025-11-05',
        },
        {
          name: 'Wedding Service',
          url: '/services/wedding',
          description: 'Special occasion luxury transportation',
          priority: 0.7,
          lastModified: '2025-11-05',
        },
        {
          name: 'Corporate Events',
          url: '/services/corporate',
          description: 'Event transportation and group travel solutions',
          priority: 0.7,
          lastModified: '2025-11-05',
        },
        {
          name: 'Sightseeing Tours',
          url: '/services/tours',
          description: "Guided luxury tours of London's landmarks",
          priority: 0.6,
          lastModified: '2025-11-05',
        },
        {
          name: 'Hourly Hire',
          url: '/services/hourly',
          description: 'Flexible hourly chauffeur services',
          priority: 0.7,
          lastModified: '2025-11-05',
        },
      ],
    },

    // 3️⃣ Our Fleet - Separate luxury vehicle section
    {
      title: 'Our Fleet',
      icon: 'CarFront',
      priority: 0.8,
      accent: 'gold',
      links: [
        {
          name: 'Luxury Sedans',
          url: '/fleet/sedans',
          description: 'Mercedes S-Class, BMW 7 Series and premium sedans',
          priority: 0.8,
          lastModified: '2025-11-05',
        },
        {
          name: 'Executive SUVs',
          url: '/fleet/suvs',
          description: 'Range Rover, Mercedes GLS and luxury SUVs',
          priority: 0.8,
          lastModified: '2025-11-05',
        },
        {
          name: 'Premium MPVs',
          url: '/fleet/mpvs',
          description: 'Mercedes V-Class and spacious luxury vehicles',
          priority: 0.7,
          lastModified: '2025-11-05',
        },
      ],
    },

    // 4️⃣ Booking & Account
    {
      title: 'Booking & Account',
      icon: 'CalendarCheck',
      priority: 0.8,
      links: [
        {
          name: 'Book Now',
          url: '/booking',
          description: 'Reserve your luxury chauffeur service online',
          priority: 0.9,
          lastModified: '2025-11-05',
        },
        {
          name: 'Manage Booking',
          url: '/booking/manage',
          description: 'View and modify your existing reservations',
          priority: 0.7,
          lastModified: '2025-11-05',
        },
        {
          name: 'Corporate Account',
          url: '/corporate',
          description: 'Business account management and billing',
          priority: 0.6,
          lastModified: '2025-11-05',
        },
      ],
    },

    // 5️⃣ Partnership
    {
      title: 'Partnership',
      icon: 'Handshake',
      priority: 0.6,
      links: [
        {
          name: 'Become a Partner',
          url: '/partner',
          description: 'Join our network of professional chauffeurs',
          priority: 0.6,
          lastModified: '2025-11-05',
        },
        {
          name: 'Partner Portal',
          url: '/partner/portal',
          description: 'Access partner dashboard and resources',
          priority: 0.5,
          lastModified: '2025-11-05',
        },
      ],
    },

    // 6️⃣ Information & Support
    {
      title: 'Information & Support',
      icon: 'Info',
      priority: 0.7,
      accent: 'white',
      links: [
        {
          name: 'Pricing',
          url: '/pricing',
          description: 'Transparent pricing information and service rates',
          priority: 0.8,
          lastModified: '2025-11-05',
        },
        {
          name: 'Coverage Areas',
          url: '/coverage',
          description: 'Service areas in London and surrounding regions',
          priority: 0.7,
          lastModified: '2025-11-05',
        },
        {
          name: 'Testimonials',
          url: '/testimonials',
          description: 'Customer reviews and experiences',
          priority: 0.7,
          lastModified: '2025-11-05',
        },
        {
          name: 'Safety & Licensing',
          url: '/safety',
          description: 'Our commitment to safety and regulatory compliance',
          priority: 0.6,
          lastModified: '2025-11-05',
        },
        {
          name: 'FAQ',
          url: '/faq',
          description: 'Frequently asked questions and helpful information',
          priority: 0.6,
          lastModified: '2025-11-05',
        },
      ],
    },

    // 7️⃣ Legal & Policies - Lowest priority but required
    {
      title: 'Legal & Policies',
      icon: 'ShieldCheck',
      priority: 0.3,
      accent: 'neutral',
      links: [
        {
          name: 'Privacy Policy',
          url: '/privacy',
          description: 'How we protect and handle your personal information',
          priority: 0.5,
          lastModified: '2025-11-05',
        },
        {
          name: 'Terms of Service',
          url: '/terms',
          description: 'Terms and conditions of our chauffeur services',
          priority: 0.5,
          lastModified: '2025-11-05',
        },
        {
          name: 'Cookie Policy',
          url: '/cookies',
          description: 'Information about our use of cookies and tracking',
          priority: 0.4,
          lastModified: '2025-11-05',
        },
        {
          name: 'Cancellation Policy',
          url: '/cancellation',
          description: 'Booking cancellation and refund policies',
          priority: 0.4,
          lastModified: '2025-11-05',
        },
      ],
    },
  ],
} as const;
