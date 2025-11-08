/**
 * 🗺️ SitemapLinkItem - Individual link component
 * Reusable link item with hover states
 */

'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { sitemapTokens } from '../sitemap.tokens';
import type { SitemapLinkItemProps } from '../sitemap.types';

export function SitemapLinkItem({ link }: SitemapLinkItemProps) {
  return (
    <li>
      <Link
        href={link.url}
        className='group block transition-all duration-200'
        style={{
          padding: sitemapTokens.linkItem.padding,
          borderRadius: sitemapTokens.linkItem.borderRadius,
          transition: sitemapTokens.linkItem.transition,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = sitemapTokens.linkItem.hoverBackground;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div className='flex items-start justify-between gap-2'>
          <div className='flex-1'>
            <h3
              className='flex items-center gap-2 transition-colors duration-200'
              style={{
                color: sitemapTokens.linkTitle.color,
                fontSize: sitemapTokens.linkTitle.fontSize,
                fontWeight: sitemapTokens.linkTitle.fontWeight,
                transition: sitemapTokens.linkTitle.transition,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = sitemapTokens.linkTitle.hoverColor;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = sitemapTokens.linkTitle.color;
              }}
            >
              {link.name}
              <ExternalLink
                className='transition-opacity duration-200'
                style={{
                  width: sitemapTokens.externalIcon.size,
                  height: sitemapTokens.externalIcon.size,
                  color: sitemapTokens.externalIcon.color,
                  opacity: sitemapTokens.externalIcon.opacity,
                  transition: sitemapTokens.externalIcon.transition,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = sitemapTokens.externalIcon.hoverOpacity;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = sitemapTokens.externalIcon.opacity;
                }}
              />
            </h3>
            <p
              className='leading-relaxed'
              style={{
                color: sitemapTokens.linkDescription.color,
                fontSize: sitemapTokens.linkDescription.fontSize,
                lineHeight: sitemapTokens.linkDescription.lineHeight,
                marginTop: sitemapTokens.linkDescription.marginTop,
              }}
            >
              {link.description}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}
