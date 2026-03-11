/**
 * 🎯 Sidebar Types - Vantage Lane 2.0
 *
 * Type definitions pentru sidebar navigation
 * Modular, reusable, type-safe
 */

import type { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  readonly id: string;
  readonly label: string;
  readonly path: string;
  readonly icon: LucideIcon;
  readonly description?: string;
  readonly badge?: number | string;
}

export interface SidebarSection {
  readonly title: string;
  readonly items: readonly SidebarItem[];
}

export interface SidebarState {
  readonly isCollapsed: boolean;
  readonly isMobileOpen: boolean;
}

export interface SidebarConfig {
  readonly widthExpanded: number;
  readonly widthCollapsed: number;
  readonly breakpointMobile: number;
}
