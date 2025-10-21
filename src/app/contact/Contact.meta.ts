import type { Metadata } from 'next';
import { ContactConfig } from './Contact.config';

export const ContactMeta: Metadata = {
  title: `${ContactConfig.title} | Vantage Lane`,
  description: `Explore ${ContactConfig.title} page — powered by Vantage Lane luxury experience.`,
  keywords: ['contact', 'vantage lane', 'luxury', 'premium service'],

  openGraph: {
    title: `${ContactConfig.title} | Vantage Lane`,
    description: 'Premium chauffeur service redefined.',
    type: 'website',
    siteName: 'Vantage Lane',
  },

  twitter: {
    card: 'summary_large_image',
    title: `${ContactConfig.title} | Vantage Lane`,
    description: 'Premium chauffeur service redefined.',
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default ContactMeta;
