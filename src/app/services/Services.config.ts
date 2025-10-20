/**
 * ⚙️ ServicesConfig – Vantage Lane Page Config v3.1.0
 * Layout: marketing
 */
export const ServicesConfig = {
  title: 'Services',
  slug: 'services',
  layout: 'marketing',
  hero: true,
  requiresAuth: false,
  seo: {
    priority: 0.8,
    changefreq: 'monthly' as const,
  },
  features: {
    breadcrumbs: false,
    sidebar: false,
    footer: true,
  },
} as const;

export default ServicesConfig;
