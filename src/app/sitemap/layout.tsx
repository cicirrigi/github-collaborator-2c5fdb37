/**
 * 🗺️ Sitemap Layout - Hide Newsletter Section
 * Custom layout for sitemap page without newsletter
 */

import Layout from '@/components/layout/Layout';

export default function SitemapLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
