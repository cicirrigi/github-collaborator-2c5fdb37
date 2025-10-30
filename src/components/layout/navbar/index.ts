/**
 * 📦 Navbar Sub-components Barrel Export
 *
 * All navbar-related components for modular usage.
 */

// Main orchestrator
export { default as Navbar } from './Navbar';

// Individual components
export type { LogoProps } from './Logo';
export { Logo } from './Logo';
export { NavLinks } from './NavLinks';
export { NavbarDesktop } from './NavbarDesktop';
export { NavbarMobile } from './NavbarMobile';
export { NavbarActions } from './NavbarActions';
export type { UserMenuProps } from './UserMenu';
export { UserMenu } from './UserMenu';

// Hooks
export { useNavbarState } from './hooks';
