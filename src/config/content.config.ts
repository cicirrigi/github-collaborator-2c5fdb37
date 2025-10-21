/**
 * 📝 Content Configuration - Vantage Lane 2.0
 *
 * Centralized content management for all pages.
 * Eliminates hardcoding and enables multi-language support.
 */

export interface Feature {
  readonly title: string;
  readonly description: string;
  readonly icon?: string;
}

export interface Value {
  readonly title: string;
  readonly description: string;
}

export interface Stat {
  readonly value: string;
  readonly label: string;
}

/**
 * 🏠 Homepage Content
 */
export const homeContent = {
  hero: {
    title: 'Experience Luxury',
    subtitle: 'Transportation',
    description:
      'Premium chauffeur services in London. Travel in style with our professional drivers and exceptional fleet.',
    cta: 'Book Your Ride',
  },
  features: {
    title: 'Why Choose Vantage Lane',
    subtitle: 'Unmatched luxury, reliability, and professionalism',
    items: [
      {
        title: 'Professional Chauffeurs',
        description: 'Experienced, licensed, and courteous drivers',
      },
      {
        title: 'Luxury Fleet',
        description: 'Premium vehicles maintained to the highest standards',
      },
      {
        title: '24/7 Service',
        description: 'Available whenever you need us, day or night',
      },
    ] as const satisfies readonly Feature[],
  },
  cta: {
    title: 'Ready to Experience Luxury?',
    subtitle: 'Join thousands of satisfied customers who trust Vantage Lane',
    button: 'Get Started Today',
  },
} as const;

/**
 * ℹ️ About Page Content
 */
export const aboutContent = {
  hero: {
    title: 'About Vantage Lane',
    subtitle: 'Our story of luxury transport excellence and commitment to service',
  },
  story: {
    title: 'Our Story',
    paragraphs: [
      "Founded in 2015, Vantage Lane began with a simple mission: to provide unparalleled luxury transportation services in London. What started as a small fleet of premium vehicles has grown into the city's most trusted chauffeur service.",
      'Today, we serve discerning clients across London, from business executives to celebrities, providing them with the comfort, reliability, and discretion they deserve.',
    ] as const,
    stats: [
      { value: '500+', label: 'Happy Clients' },
      { value: '50+', label: 'Premium Vehicles' },
      { value: '8', label: 'Years Experience' },
    ] as const satisfies readonly Stat[],
  },
  values: {
    title: 'Our Values',
    subtitle: 'The principles that guide everything we do',
    items: [
      {
        title: 'Excellence',
        description:
          'We strive for perfection in every aspect of our service, from our vehicles to our customer care.',
      },
      {
        title: 'Reliability',
        description:
          'Our clients trust us to be punctual, professional, and consistent in delivering exceptional service.',
      },
      {
        title: 'Discretion',
        description:
          'We understand the importance of privacy and confidentiality in serving our distinguished clientele.',
      },
    ] as const satisfies readonly Value[],
  },
  cta: {
    title: 'Experience the Vantage Lane Difference',
    subtitle: "Discover why London's elite choose us for their transportation needs",
    button: 'Book Your Experience',
  },
} as const;

/**
 * 🔐 Auth Pages Content
 */
export const authContent = {
  login: {
    title: 'Welcome Back',
    subtitle: 'Sign in to your Vantage Lane account',
    form: {
      email: 'Email Address',
      password: 'Password',
      remember: 'Remember me',
      forgot: 'Forgot password?',
      submit: 'Sign In',
      signup: "Don't have an account? Sign up here",
    },
  },
} as const;

/**
 * 📄 Common UI Text
 */
export const commonText = {
  loading: 'Loading...',
  error: 'Something went wrong',
  tryAgain: 'Try again',
  close: 'Close',
  back: 'Back',
  next: 'Next',
  previous: 'Previous',
  save: 'Save',
  cancel: 'Cancel',
  edit: 'Edit',
  delete: 'Delete',
  confirm: 'Confirm',
} as const;

/**
 * 🏢 Company Information
 */
export const companyInfo = {
  name: 'Vantage Lane',
  tagline: 'Luxury Transportation Excellence',
  phone: '+44 20 7946 0958',
  email: 'hello@vantagelane.co.uk',
  address: 'London, United Kingdom',
  copyright: '© 2024 Vantage Lane. All rights reserved.',
} as const;

export default {
  home: homeContent,
  about: aboutContent,
  auth: authContent,
  common: commonText,
  company: companyInfo,
} as const;
