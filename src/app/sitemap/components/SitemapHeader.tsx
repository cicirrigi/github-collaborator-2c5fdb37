/**
 * 🗺️ SitemapHeader - Modular header component
 * Clean header with logo and back navigation
 */

'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { sitemapTokens } from '../sitemap.tokens';
import type { SitemapHeaderProps } from '../sitemap.types';

export function SitemapHeader({ title: _title, subtitle, backUrl = '/' }: SitemapHeaderProps) {
  return (
    <>
      {/* Navigation Header */}
      <div
        className='border-b backdrop-blur-md'
        style={{
          backgroundColor: sitemapTokens.header.background,
          borderColor: sitemapTokens.header.borderColor,
          backdropFilter: sitemapTokens.header.backdropFilter,
        }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          <div
            className='flex items-center justify-between'
            style={{ padding: sitemapTokens.header.padding }}
          >
            <Link href={backUrl} className='flex items-center gap-0 group'>
              {/* Logo placeholder - can be replaced with actual logo component */}
              <div
                className='text-xl font-light tracking-wide uppercase transition-colors duration-300'
                style={{
                  color: sitemapTokens.logo.color,
                  fontSize: sitemapTokens.logo.fontSize,
                  fontWeight: sitemapTokens.logo.fontWeight,
                }}
              >
                <span
                  className='group-hover:text-[var(--brand-primary)] transition-colors duration-300'
                  style={{ color: 'var(--brand-primary)' }}
                >
                  VANTAGE
                </span>{' '}
                <span>LANE</span>
              </div>
            </Link>

            <Link
              href={backUrl}
              className='flex items-center gap-2 transition-colors duration-200'
              style={{
                color: sitemapTokens.backButton.color,
                padding: sitemapTokens.backButton.padding,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = sitemapTokens.backButton.hoverColor;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = sitemapTokens.backButton.color;
              }}
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Page Title Section */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-16'>
        <div className='text-center'>
          <h1
            className='mb-4 tracking-wide text-4xl md:text-5xl font-light text-center'
            style={{
              color: 'var(--text-primary)',
              marginBottom: sitemapTokens.title.marginBottom,
            }}
          >
            <span
              style={{
                color: 'var(--brand-primary)',
                textShadow: sitemapTokens.effects.goldShadow,
                filter: sitemapTokens.effects.goldBrightness,
              }}
            >
              Site
            </span>
            <span> </span>
            <span
              style={{
                color: 'var(--text-primary)',
                textShadow: sitemapTokens.effects.whiteShadow,
                filter: sitemapTokens.effects.whiteBrightness,
              }}
            >
              Map
            </span>
          </h1>

          <div
            className='mx-auto mb-8'
            style={{
              width: sitemapTokens.separator.width,
              height: sitemapTokens.separator.height,
              background: sitemapTokens.separator.background,
              margin: `${sitemapTokens.separator.marginY} auto`,
            }}
          />

          <p
            className='mx-auto'
            style={{
              fontSize: sitemapTokens.subtitle.fontSize,
              color: sitemapTokens.subtitle.color,
              maxWidth: sitemapTokens.subtitle.maxWidth,
              lineHeight: sitemapTokens.subtitle.lineHeight,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </>
  );
}
