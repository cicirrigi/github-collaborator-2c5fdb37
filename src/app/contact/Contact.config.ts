/**
 * ⚙️ ContactConfig – Vantage Lane Page Config v3.1.1-clean
 * Layout: marketing
 */
export const ContactConfig = {
  title: 'Contact',
  slug: 'contact',
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

export default ContactConfig;
