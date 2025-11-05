/**
 * 🗺️ XML Sitemap Generator
 * Auto-generates sitemap.xml from config data
 */

import { sitemapConfig } from '../sitemap/sitemap.config';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vantagelane.com';

  const allLinks = sitemapConfig.sections.flatMap(section => section.links);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allLinks
  .map(
    link => `
  <url>
    <loc>${baseUrl}${link.url}</loc>
    <lastmod>${link.lastModified || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${link.changefreq || 'monthly'}</changefreq>
    <priority>${link.priority || 0.5}</priority>
  </url>`
  )
  .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
