/**
 * 🗺️ Sitemap Page - Modular and orchestrated
 * Complete sitemap with design tokens and reusable components
 */

import { getPageMetadata } from '@/lib/seo';
import { sitemapTokens } from './sitemap.tokens';
import { sitemapConfig } from './sitemap.config';
import { SitemapHeader } from './components/SitemapHeader';
import { SitemapSection } from './components/SitemapSection';
import { SitemapHelp } from './components/SitemapHelp';

// 🎯 SEO Metadata pentru Sitemap Page
export const metadata = getPageMetadata('/sitemap');

export default function SitemapPage() {
  return (
    <div
      className='min-h-screen'
      style={{
        background: sitemapTokens.page.background,
        minHeight: sitemapTokens.page.minHeight,
      }}
    >
      <SitemapHeader
        title='Site Map'
        subtitle="Navigate through all pages and sections of Vantage Lane's website. Find everything you need for luxury chauffeur services in London."
      />

      <div className='max-w-6xl mx-auto px-4 sm:px-6 pb-16'>
        {/* Sitemap Sections Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {sitemapConfig.sections.map((section, index) => (
            <SitemapSection key={index} section={section} />
          ))}
        </div>

        {/* Help Section */}
        <SitemapHelp
          title='Need Help Finding Something?'
          description="Can't find what you're looking for? Our customer service team is available 24/7 to assist you with any questions or booking requirements."
          contactUrl='/contact'
          bookingUrl='/booking'
        />

        {/* Last Updated */}
        <div
          className='mt-12'
          style={{
            color: sitemapTokens.lastUpdated.color,
            fontSize: sitemapTokens.lastUpdated.fontSize,
            textAlign: sitemapTokens.lastUpdated.textAlign,
            marginTop: sitemapTokens.lastUpdated.marginTop,
          }}
        >
          <p>
            Last updated:{' '}
            {new Date().toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
