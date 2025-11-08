/**
 * 🏷️ HeroSection Types - Type Safety
 */

export interface HeroProps {
  /** Override default config */
  readonly customConfig?: Partial<HeroConfig>;
  /** Custom CSS class */
  readonly className?: string;
  /** Section variant */
  readonly variant?: 'default' | 'minimal' | 'full-screen';
}

export interface HeroConfig {
  // Content
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;

  // CTA
  readonly cta: {
    readonly label: string;
    readonly href: string;
    readonly variant: 'primary' | 'secondary' | 'outline';
    readonly size: 'sm' | 'md' | 'lg';
  };

  // Visual
  readonly background: {
    readonly image?: string | null;
    readonly video?: string | null;
    readonly gradient: string;
    readonly overlay: string;
  };

  // Animation
  readonly animation: {
    readonly enabled: boolean;
    readonly duration: number;
    readonly stagger: number;
  };

  // Layout
  readonly layout: {
    readonly height: string;
    readonly minHeight: string;
    readonly textAlign: 'left' | 'center' | 'right';
    readonly maxWidth: string;
  };
}
