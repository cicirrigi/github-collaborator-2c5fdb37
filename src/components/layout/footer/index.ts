/**
 * 📦 Footer Module - Complete Footer System
 *
 * Modular footer with orchestrator pattern:
 * - Footer: Main orchestrator (under 100 lines)
 * - FooterBrand: Logo + contact info
 * - FooterLinks: Navigation with luxury hover
 * - FooterSocials: Social media with glow effects
 * - FooterBottom: Copyright & legal
 * - Config-driven content (zero hardcoding)
 */

// Main orchestrator (recommended import)
export { default as Footer } from './Footer';
export type { FooterProps } from './Footer';

// Individual components (for custom compositions)
export { FooterBrand } from './FooterBrand';
export type { FooterBrandProps } from './FooterBrand';

export { FooterLinks } from './FooterLinks';
export type { FooterLinksProps } from './FooterLinks';

export { FooterSocials } from './FooterSocials';
export type { FooterSocialsProps } from './FooterSocials';

export { FooterBottom } from './FooterBottom';
export type { FooterBottomProps } from './FooterBottom';

// Configuration
export { footerConfig } from './footer.config';
export type { FooterConfig } from './footer.config';
