/**
 * 💎 Pricing Section Types - Vantage Lane 2.0
 *
 * TypeScript interfaces for Pricing section components.
 * Ensures type safety and consistent data structure.
 */

import type { LucideIcon } from 'lucide-react';

export type PricingCategory = 'Airport' | 'Hourly' | 'Corporate' | 'Bespoke';

export interface PricingFeature {
  readonly text: string;
  readonly included: boolean;
}

export interface PricingPackage {
  readonly id: string;
  readonly name: string;
  readonly category: PricingCategory;
  readonly icon: LucideIcon;
  readonly tagline: string;
  readonly priceFrom: string;
  readonly priceNote?: string;
  readonly description: string;
  readonly features: readonly PricingFeature[];
  readonly popular?: boolean;
  readonly cta: {
    readonly text: string;
    readonly href: string;
  };
}

export interface CommitmentItem {
  readonly icon: LucideIcon;
  readonly text: string;
}

export interface PricingSectionConfig {
  readonly title: {
    readonly primary: string;
    readonly accent: string;
  };
  readonly subtitle: string;
  readonly commitment: readonly CommitmentItem[];
  readonly packages: readonly PricingPackage[];
  readonly cta?: {
    readonly text: string;
    readonly href: string;
    readonly description?: string;
  };
}

export interface PricingSectionProps {
  readonly config?: PricingSectionConfig;
  readonly customConfig?: Partial<PricingSectionConfig>;
  readonly className?: string;
  readonly hideTitle?: boolean;
  readonly maxPackages?: number;
}

export interface PricingCardProps {
  readonly plan: PricingPackage;
  readonly className?: string;
}
