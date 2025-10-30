/**
 * 📦 Navbar Module - Complete Navigation System
 *
 * Modular navbar with orchestrator pattern:
 * - Navbar: Main orchestrator (80 lines)
 * - NavbarDesktop/Mobile: Responsive components
 * - NavbarActions: Theme + User + Mobile toggle
 * - Design tokens integration
 * - Accessibility compliant
 */

// Main orchestrator (recommended import)
export { default as Navbar } from './Navbar';
export type { NavbarProps } from './Navbar';

// Individual components (for custom compositions)
export { Logo } from './Logo';
export type { LogoProps } from './Logo';

export { NavLinks } from './NavLinks';
export type { NavLinksProps } from './NavLinks';

export { UserMenu } from './UserMenu';
export type { UserMenuProps } from './UserMenu';

export { NavbarDesktop } from './NavbarDesktop';
export type { NavbarDesktopProps } from './NavbarDesktop';

export { NavbarMobile } from './NavbarMobile';
export type { NavbarMobileProps } from './NavbarMobile';

export { NavbarActions } from './NavbarActions';
export type { NavbarActionsProps } from './NavbarActions';

// State management hooks
export { useNavbarState } from './hooks';
export type { NavbarState } from './hooks';
