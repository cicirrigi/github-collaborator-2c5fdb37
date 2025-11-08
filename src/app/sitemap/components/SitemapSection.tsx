/**
 * 🗺️ SitemapSection - Section card component
 * Modular section with links list
 */

'use client';

import {
  Home,
  Car,
  CarFront,
  CalendarCheck,
  Handshake,
  Info,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { sitemapTokens } from '../sitemap.tokens';
import type { SitemapSectionProps } from '../sitemap.types';
import { SitemapLinkItem } from './SitemapLinkItem';

// Icon mapping for type safety
const iconMap = {
  Home,
  Car,
  CarFront,
  CalendarCheck,
  Handshake,
  Info,
  ShieldCheck,
  FileText,
} as const;

export function SitemapSection({ section }: SitemapSectionProps) {
  // Type-safe icon component selection
  const IconComponent = iconMap[section.icon as keyof typeof iconMap] || FileText;

  return (
    <div
      className='border backdrop-blur-md transition-all duration-300'
      style={{
        backgroundColor: sitemapTokens.sectionCard.background,
        borderColor: sitemapTokens.sectionCard.borderColor,
        borderRadius: sitemapTokens.sectionCard.borderRadius,
        padding: sitemapTokens.sectionCard.padding,
        backdropFilter: sitemapTokens.sectionCard.backdropFilter,
        transition: sitemapTokens.sectionCard.transition,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = sitemapTokens.sectionCard.hoverTransform;
        e.currentTarget.style.boxShadow = sitemapTokens.sectionCard.hoverShadow;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <h2
        className='flex items-center gap-2'
        style={{
          color: sitemapTokens.sectionTitle.color,
          fontSize: sitemapTokens.sectionTitle.fontSize,
          fontWeight: sitemapTokens.sectionTitle.fontWeight,
          marginBottom: sitemapTokens.sectionTitle.marginBottom,
          display: sitemapTokens.sectionTitle.display,
          alignItems: sitemapTokens.sectionTitle.alignItems,
          gap: sitemapTokens.sectionTitle.gap,
        }}
      >
        <IconComponent
          style={{
            color: sitemapTokens.sectionIcon.color,
            width: sitemapTokens.sectionIcon.size,
            height: sitemapTokens.sectionIcon.size,
          }}
        />
        {section.title}
      </h2>

      <ul className='space-y-4'>
        {section.links.map((link, index) => (
          <SitemapLinkItem key={index} link={link} />
        ))}
      </ul>
    </div>
  );
}
