/**
 * 📦 Barrel Export – Layout Components
 *
 * Re-exports all layout-related components and types
 * for consistent usage across the project.
 *
 * Usage:
 *   import { Layout, Navbar, Footer } from '@/components/layout'
 *
 * 🧱 Available Components:
 * - Layout: Main app wrapper with navbar/footer
 * - Container: Responsive content containers
 * - Section: Semantic sections with spacing
 * - Navbar: Premium navigation with mobile
 * - Footer: Multi-column luxury footer
 * - ServicesMenu: Desktop/Mobile service menus
 * - Logo, NavLinks, UserMenu: Navbar sub-components
 */

export type { ContainerProps } from './Container';
export { Container } from './Container';
export type { FooterProps } from './footer/Footer';
export { default as Footer } from './footer/Footer';
export type { LayoutProps } from './Layout';
export { default as Layout } from './Layout';
export type { NavbarProps } from './navbar/Navbar';
export { default as Navbar } from './navbar/Navbar';
export type { SectionProps } from './Section';
export { Section } from './Section';

// Services Menu Components (Desktop + Mobile)
export { default as ServicesMenu } from './ServicesMenu';
export { default as ServicesMenuMobile } from './ServicesMenuMobile';

// Navbar sub-components
export type { LogoProps } from './navbar/Logo';
export { Logo } from './navbar/Logo';
export type { NavLinksProps } from './navbar/NavLinks';
export { NavLinks } from './navbar/NavLinks';
export type { UserMenuProps } from './navbar/UserMenu';
export { UserMenu } from './navbar/UserMenu';

// Future layout exports
// export { PageHero } from './PageHero'
