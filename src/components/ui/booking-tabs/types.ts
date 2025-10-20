// Types și interfaces pentru BookingTabs
export type BookingTabType = 'oneway' | 'return' | 'hourly' | 'fleet';

export interface BookingTab {
  id: BookingTabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface BookingTabsProps {
  activeTab?: BookingTabType;
  onTabChange?: (tab: BookingTabType) => void;
  variant?: 'default' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
