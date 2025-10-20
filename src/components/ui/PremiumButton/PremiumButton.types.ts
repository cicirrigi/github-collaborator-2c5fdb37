/**
 * 🧩 PremiumButton – Vantage Lane UI v3.0.0
 * Generated on 2025-10-20T00:29:37.491Z
 * Type: base
 */

export type PremiumButtonVariant = 'default' | 'primary' | 'secondary';
export type PremiumButtonSize = 'sm' | 'md' | 'lg';

export interface PremiumButtonStyleConfig {
  readonly base: string;
  readonly variants: Record<PremiumButtonVariant, string>;
  readonly sizes: Record<PremiumButtonSize, string>;
}
