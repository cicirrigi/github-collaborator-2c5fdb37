/**
 * 📦 Navigation Module - Modular Menu System
 *
 * Orchestrated navigation components:
 * - Config-driven menus (zero hardcoded content)
 * - Reusable dropdown & menu items
 * - Design tokens integration
 * - Luxury hover effects
 * - Accessibility compliant
 */

// Configuration
export { mainMenu, userMenu, adminMenu, allMenus } from './menu.config';
export type { MenuItem } from './menu.config';

// Components
export { MenuItemComponent } from './MenuItem';
export type { MenuItemProps } from './MenuItem';

export { DropdownMenu } from './DropdownMenu';
export type { DropdownMenuProps } from './DropdownMenu';
