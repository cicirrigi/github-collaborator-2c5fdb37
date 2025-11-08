/**
 * 🗺️ Sitemap Types
 * TypeScript interfaces for sitemap components
 */

export interface SitemapLink {
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly isExternal?: boolean;
  readonly priority?: number; // 0.1-1.0 for Google SEO compliance
  readonly lastModified?: string; // ISO date format
  readonly changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  readonly accent?: 'gold' | 'white' | 'neutral'; // UI accent colors
  readonly meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface SitemapSection {
  readonly title: string;
  readonly icon: string; // Lucide React compatible icon name
  readonly priority?: number; // 0.1-1.0 for section ordering
  readonly accent?: 'gold' | 'white' | 'neutral'; // Section accent color
  readonly links: readonly SitemapLink[];
}

export interface SitemapData {
  readonly sections: readonly SitemapSection[];
}

export interface SitemapHeaderProps {
  readonly title: string;
  readonly subtitle: string;
  readonly backUrl?: string;
}

export interface SitemapSectionProps {
  readonly section: SitemapSection;
}

export interface SitemapLinkItemProps {
  readonly link: SitemapLink;
}

export interface SitemapHelpProps {
  readonly title: string;
  readonly description: string;
  readonly contactUrl: string;
  readonly bookingUrl: string;
}
