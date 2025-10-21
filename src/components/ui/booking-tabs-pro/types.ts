import type { LucideIcon } from 'lucide-react';

export type BookingTabType = 'oneway' | 'return' | 'hourly' | 'fleet';

export interface BookingTab {
  id: BookingTabType;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface BookingTabsProProps {
  activeTab?: BookingTabType;
  onTabChange?: (tab: BookingTabType) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
