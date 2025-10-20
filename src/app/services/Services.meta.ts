import type { Metadata } from 'next';
import { ServicesConfig } from './Services.config';

export const ServicesMeta: Metadata = {
  title: `${ServicesConfig.title} | Vantage Lane`,
  description: `Explore ${ServicesConfig.title} page — powered by Vantage Lane luxury experience.`,
  keywords: ['services', 'vantage lane', 'luxury', 'premium service'],
  
  openGraph: {
    title: `${ServicesConfig.title} | Vantage Lane`,
    description: 'Premium chauffeur service redefined.',
    type: 'website',
    siteName: 'Vantage Lane',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: `${ServicesConfig.title} | Vantage Lane`,
    description: 'Premium chauffeur service redefined.',
  },
  
  robots: {
    index: true,
    follow: true,
  },
};

export default ServicesMeta;
