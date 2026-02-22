/**
 * ⚙️ Settings Content - Main Settings Page Layout
 *
 * Container pentru toate componentele de settings cu tab navigation
 * Clean, fără logic hardcodat, responsive
 */

'use client';

import { cn } from '@/lib/utils/cn';
import { Bell, Globe, Shield, Sliders } from 'lucide-react';
import { useState } from 'react';
import { AccountSecurityTab } from './AccountSecurityTab';
import { NotificationsTab } from './NotificationsTab';
import { PreferencesTab } from './PreferencesTab';
import { PrivacyTab } from './PrivacyTab';

type SettingsTab = 'security' | 'notifications' | 'preferences' | 'privacy';

interface TabConfig {
  id: SettingsTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const TABS: TabConfig[] = [
  {
    id: 'security',
    label: 'Account Security',
    icon: Shield,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: Sliders,
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: Globe,
  },
];

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('security');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'security':
        return <AccountSecurityTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'preferences':
        return <PreferencesTab />;
      case 'privacy':
        return <PrivacyTab />;
      default:
        return <AccountSecurityTab />;
    }
  };

  return (
    <div className='space-y-8'>
      {/* Page Header */}
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>Settings</h1>
      </div>

      {/* Tabs Navigation */}
      <div className='bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800'>
        <div className='border-b border-neutral-200 dark:border-neutral-800'>
          <nav className='flex space-x-8 px-6 overflow-x-auto scrollbar-hide'>
            {/* Mobile scroll container */}
            <div className='flex space-x-8 min-w-max md:min-w-0'>
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors',
                      isActive
                        ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                    )}
                  >
                    <Icon className='w-4 h-4' />
                    {tab.label}
                    {tab.badge && (
                      <span className='ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full'>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Tab Content */}
        <div className='p-6'>{renderTabContent()}</div>
      </div>
    </div>
  );
}

// Placeholder components for other tabs
