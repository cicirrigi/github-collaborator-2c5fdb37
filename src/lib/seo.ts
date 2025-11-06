/**
 * 🎯 SEO System - Centralized Metadata Management
 *
 * Implements the exact system described by user:
 * - Central source of truth for all page metadata
 * - Dynamic generation from sitemapConfig
 * - Type-safe and consistent across all pages
 */

import type { Metadata } from 'next';
import { sitemapConfig } from '@/app/sitemap/sitemap.config';
import type { SitemapLink } from '@/app/sitemap/sitemap.types';
import { siteMetadata } from '@/config/site.config';

/**
 * 🎯 Get Page Metadata from Centralized Config
 * Exactly as specified in user requirements
 */
export function getPageMeta(pathname: string) {
  // Search through all sections and links to find matching pathname
  for (const section of sitemapConfig.sections) {
    const link = section.links.find((link: SitemapLink) => link.url === pathname);
    if (link?.meta) {
      return {
        title: link.meta.title || `${link.name} | Vantage Lane`,
        description: link.meta.description || link.description,
        keywords: link.meta.keywords || [],
        priority: link.priority || 0.5,
        lastModified: link.lastModified,
        changefreq: link.changefreq || 'monthly',
      };
    }
  }

  // Fallback to default site metadata
  return {
    title: siteMetadata.title,
    description: siteMetadata.description,
    keywords: ['luxury chauffeur', 'london transport', 'premium car service'],
    priority: 0.5,
    lastModified: new Date().toISOString().split('T')[0],
    changefreq: 'monthly' as const,
  };
}

/**
 * 🎯 Generate Complete Metadata Object
 * Ready for Next.js generateMetadata() export
 */
export function generatePageMetadata(pathname: string): Metadata {
  const meta = getPageMeta(pathname);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,

    // Open Graph
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      siteName: 'Vantage Lane',
      locale: 'en_GB',
      url: `${siteMetadata.url}${pathname}`,
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },

    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      site: '@VantageLane',
      creator: '@VantageLane',
      title: meta.title,
      description: meta.description,
      images: ['/images/twitter-image.png'],
    },

    // SEO Technical
    robots: {
      index: true,
      follow: true,
    },

    // Canonical URL
    alternates: {
      canonical: `${siteMetadata.url}${pathname}`,
    },

    // Additional metadata
    other: {
      'theme-color': '#CBB26A',
      'color-scheme': 'dark light',
    },
  };
}

/**
 * 🎯 Easy Hook for Pages
 * Usage: export const metadata = getPageMetadata('/services/airport-transfers');
 */
export const getPageMetadata = (pathname: string) => generatePageMetadata(pathname);

/**
 * 🎯 Dynamic generateMetadata Function Factory
 * For pages that need async metadata generation
 */
export function createGenerateMetadata(pathname: string) {
  return async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata(pathname);
  };
}

/**
 * 🎯 JSON-LD Schema Generator
 * For structured data markup (to be implemented later as user suggested)
 */
export function generateJsonLd(
  pathname: string,
  type: 'LocalBusiness' | 'Service' | 'WebPage' = 'WebPage'
) {
  const meta = getPageMeta(pathname);

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: meta.title,
    description: meta.description,
    url: `${siteMetadata.url}${pathname}`,
  };

  // Extend based on type - to be implemented when needed
  switch (type) {
    case 'LocalBusiness':
      return {
        ...baseSchema,
        '@type': 'LocalBusiness',
        address: siteMetadata.company.address,
        telephone: siteMetadata.company.phone,
        email: siteMetadata.company.email,
      };
    case 'Service':
      return {
        ...baseSchema,
        '@type': 'Service',
        provider: {
          '@type': 'Organization',
          name: siteMetadata.company.name,
        },
      };
    default:
      return baseSchema;
  }
}
