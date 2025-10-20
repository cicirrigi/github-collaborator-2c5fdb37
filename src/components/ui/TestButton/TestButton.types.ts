/**
 * 🧩 TestButton – Vantage Lane UI v3.0.0
 * Generated on 2025-10-20T00:24:01.157Z
 * Type: base
 */

export type TestButtonVariant = 'default' | 'primary' | 'secondary';
export type TestButtonSize = 'sm' | 'md' | 'lg';

export interface TestButtonStyleConfig {
  readonly base: string;
  readonly variants: Record<TestButtonVariant, string>;
  readonly sizes: Record<TestButtonSize, string>;
}
