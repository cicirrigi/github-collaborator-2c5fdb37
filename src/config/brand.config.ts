/**
 * 🎨 VANTAGE LANE – Unified Brand Configuration v3.2
 * Combines identity, marketing, and design system in a single structure.
 * Used by: UI components, design tokens, pages, and metadata.
 */

export const brandConfig = {
  /** 🏛️ COMPANY IDENTITY */
  identity: {
    name: 'Vantage Lane',
    fullName: 'Vantage Lane 2.0',
    tagline: 'Premium Luxury Transportation',
    slogan: 'The Art of Refined Motion',
    founded: 2025,
    domain: 'vantagelane.com',
  },

  /** 🎨 LOGO CONFIGURATION */
  logo: {
    text: {
      primary: 'VANTAGE',
      secondary: 'LANE',
      spacing: ' ',
      transform: 'uppercase',
      tracking: 'wide',
      weight: 'light',
    },
    colors: {
      primary: '#CBB26A', // Gold for VANTAGE
      secondary: 'var(--text-primary)', // White/theme for LANE
    },
  },

  /** 🎯 SERVICE DESCRIPTION */
  service: {
    short: 'Premium chauffeur service',
    full: 'Premium chauffeur service in London',
    detailed: 'Experience luxury travel with our professional drivers and exceptional fleet.',
    positioning: "London's only luxury chauffeur platform where choice meets transparency.",
  },

  /** 🏆 KEY FEATURES */
  features: {
    luxury: 'Luxury',
    premium: 'Premium',
    professional: 'Professional',
    reliable: 'Reliable',
    exclusive: 'Exclusive',
    sophisticated: 'Sophisticated',
  },

  /** 🌍 GEOGRAPHIC FOCUS */
  location: {
    primary: 'London',
    coverage: 'United Kingdom',
    expansion: 'Greater London',
  },

  /** 🚗 SERVICE CATEGORIES */
  services: {
    chauffeur: 'Chauffeur Service',
    airport: 'Airport Transfers',
    business: 'Business Travel',
    events: 'Special Events',
    corporate: 'Corporate Transportation',
  },

  /** 💬 MARKETING COPY */
  marketing: {
    hero: 'Experience Luxury Transportation',
    cta: 'Book Your Journey',
    subtitle: 'Professional chauffeurs, premium vehicles, exceptional service.',
    whyChoose: 'Why Choose Our Service',
  },

  /** ⚖️ LEGAL INFO */
  legal: {
    company: 'Vantage Lane Ltd.',
    copyright: '© 2025 Vantage Lane. All rights reserved.',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
  },

  /** 📞 SUPPORT */
  support: {
    available: 'Available 24/7',
    contact: 'Contact Us',
    support: 'Customer Support',
    help: 'Help & Support',
  },

  /** 🧠 META INFORMATION */
  meta: {
    description:
      'Premium luxury chauffeur service in London with professional drivers and exceptional fleet.',
    keywords:
      'luxury chauffeur, premium transportation, London, executive travel, professional drivers',
  },

  /** 🎨 VISUAL IDENTITY (Design System) */
  colors: {
    primary: '#CBB26A', // Gold – prestige & warmth
    secondary: '#1A1A1A', // Deep black – elegance & power
    accent: '#D4AF37', // Champagne gold accent
    text: {
      primary: '#FFFFFF',
      secondary: '#A3A3A3',
      muted: '#737373',
    },
    background: {
      light: '#F9F9F9',
      dark: '#0A0A0A',
      elevated: '#1A1A1A',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },

  /** 🪶 TYPOGRAPHY */
  typography: {
    fontPrimary: `'Inter', sans-serif`,
    fontAccent: `'Playfair Display', serif`,
    baseSize: '16px',
    scaleRatio: 1.25,
  },

  /** 🌀 MOTION & TIMING */
  motion: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      luxury: 'cubic-bezier(0.45, 0, 0.25, 1)',
    },
  },

  /** 📬 CONTACT */
  contact: {
    email: 'support@vantagelane.com',
    phone: '+44 20 8000 0000',
  },
} as const;

export type BrandConfig = typeof brandConfig;
