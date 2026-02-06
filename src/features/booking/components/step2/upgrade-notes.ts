import React, { ReactNode } from 'react';

// 📋 Note informative pentru upgrade-uri
export const UPGRADE_NOTES: Record<string, string> = {
  standard:
    'Standard Luxury Bouquet, hand-tied with seasonal flowers. Requires minimum 24-hour notice; unavailable for last-minute bookings.',
  exclusive:
    'Exclusive Grand Bouquet with luxury roses and exotic flowers. Requires minimum 48-hour notice; availability may vary.',
  moet: 'Moët & Chandon Brut Imperial, elegantly chilled and served on board. Requires a minimum 4-hour notice; unavailable for last-minute bookings.',
  'dom-perignon':
    'Dom Pérignon Vintage Blanc 2015, prepared with care and served on board. Requires a minimum 4-hour notice; availability may vary.',
  escort:
    'Professional SIA-certified close-protection escort for your journey. Requires minimum 72-hour advance notice.',
};

// 🔍 Funcție pentru a evidenția notice-ul cu roșu
export const formatNoticeText = (text: string): ReactNode[] => {
  const parts = text.split(/(Requires.*?notice)/gi);
  return parts.map((part, index) => {
    if (part.match(/Requires.*?notice/gi)) {
      return React.createElement(
        'span',
        {
          key: index,
          className: 'text-red-300 font-medium',
        },
        part
      );
    }
    return React.createElement('span', { key: index }, part);
  });
};
