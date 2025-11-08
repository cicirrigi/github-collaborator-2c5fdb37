/**
 * 🗺️ SitemapHelp - Help section component
 * Support section with CTA buttons
 */

'use client';

import Link from 'next/link';
import { sitemapTokens } from '../sitemap.tokens';
import type { SitemapHelpProps } from '../sitemap.types';

export function SitemapHelp({ title, description, contactUrl, bookingUrl }: SitemapHelpProps) {
  return (
    <div
      className='border'
      style={{
        background: sitemapTokens.helpSection.background,
        borderColor: sitemapTokens.helpSection.borderColor,
        borderRadius: sitemapTokens.helpSection.borderRadius,
        padding: sitemapTokens.helpSection.padding,
        marginTop: sitemapTokens.helpSection.marginTop,
      }}
    >
      <div className='text-center'>
        <h2
          style={{
            color: sitemapTokens.helpTitle.color,
            fontSize: sitemapTokens.helpTitle.fontSize,
            fontWeight: sitemapTokens.helpTitle.fontWeight,
            marginBottom: sitemapTokens.helpTitle.marginBottom,
          }}
        >
          {title}
        </h2>

        <p
          className='mx-auto'
          style={{
            color: sitemapTokens.helpDescription.color,
            maxWidth: sitemapTokens.helpDescription.maxWidth,
            lineHeight: sitemapTokens.helpDescription.lineHeight,
            marginBottom: sitemapTokens.helpDescription.marginBottom,
          }}
        >
          {description}
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            href={contactUrl}
            className='transition-all duration-300'
            style={{
              background: sitemapTokens.ctaButton.primary.background,
              color: sitemapTokens.ctaButton.primary.color,
              padding: sitemapTokens.ctaButton.primary.padding,
              borderRadius: sitemapTokens.ctaButton.primary.borderRadius,
              fontWeight: sitemapTokens.ctaButton.primary.fontWeight,
              transition: sitemapTokens.ctaButton.primary.transition,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = sitemapTokens.ctaButton.primary.hoverTransform;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Contact Support
          </Link>

          <Link
            href={bookingUrl}
            className='border transition-all duration-300'
            style={{
              borderColor: sitemapTokens.ctaButton.secondary.borderColor,
              color: sitemapTokens.ctaButton.secondary.color,
              padding: sitemapTokens.ctaButton.secondary.padding,
              borderRadius: sitemapTokens.ctaButton.secondary.borderRadius,
              fontWeight: sitemapTokens.ctaButton.secondary.fontWeight,
              transition: sitemapTokens.ctaButton.secondary.transition,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor =
                sitemapTokens.ctaButton.secondary.hoverBackground;
              e.currentTarget.style.color = sitemapTokens.ctaButton.secondary.hoverColor;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = sitemapTokens.ctaButton.secondary.color;
            }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
