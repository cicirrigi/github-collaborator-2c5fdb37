/**
 * 📦 Navbar Module - Complete Navigation System
 *
 * Modular navbar with orchestrator pattern:
 * - Navbar: Main orchestrator (stable version)
 * - NavbarLuxury: Enhanced version with luxury effects
 * - NavbarDesktop/Mobile: Responsive components
 * - NavbarActions: Theme/User/Mobile controls
 * - Logo: Brand component
 * - Hooks: State management & logic
 *
 * 🧪 A/B Testing Ready:
 * Switch between versions by changing import:
 * import { Navbar } from './navbar' // Stable
 * import { NavbarLuxury as Navbar } from './navbar' // Enhanced
 */

// 🛡️ Stable version (original)
export { default as Navbar } from './Navbar';

// ✨ Enhanced version (luxury effects)
export { NavbarLuxury } from './NavbarLuxury';

// Shared components
export { NavbarActions } from './NavbarActions';
export { NavbarDesktop } from './NavbarDesktop';
export { NavbarMobile } from './NavbarMobile';
export { Logo } from './Logo';
export { UserMenu } from './UserMenu';
export { NavLinks } from './NavLinks';

// Hooks
export { useNavbarState } from './hooks';

// Types
export type { NavbarProps } from './Navbar';
export type { NavbarLuxuryProps } from './NavbarLuxury';
export type { NavbarActionsProps } from './NavbarActions';
export type { NavbarDesktopProps } from './NavbarDesktop';
export type { NavbarMobileProps } from './NavbarMobile';
export type { UserMenuProps } from './UserMenu';
export type { NavLinksProps } from './NavLinks';
export type { NavbarState } from './hooks';
