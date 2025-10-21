'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/providers/theme-provider';

// Tipare mai stricte cu as const
const _variants = ['default', 'minimal', 'dropdown'] as const;
const _sizes = ['sm', 'md', 'lg'] as const;

type Variant = (typeof _variants)[number];
type Size = (typeof _sizes)[number];

interface ThemeToggleProps {
  variant?: Variant;
  size?: Size;
  className?: string | undefined;
}

export function ThemeToggle({ variant = 'default', size = 'md', className }: ThemeToggleProps) {
  const { currentTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show placeholder during hydration
  if (!mounted) {
    return (
      <div
        className={cn(
          'rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
          variant === 'minimal'
            ? {
                sm: 'h-8 w-8',
                md: 'h-10 w-10',
                lg: 'h-12 w-12',
              }[size]
            : 'px-3 py-2',
          className
        )}
      />
    );
  }

  if (variant === 'minimal') {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    };

    const iconSizes = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    return (
      <button
        onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
        className={cn(
          'relative rounded-lg border border-neutral-200 bg-white p-2 transition-colors hover:bg-muted/80 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-muted/20',
          sizeClasses[size],
          className
        )}
        aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} currentTheme`}
      >
        <Sun
          className={cn(
            'absolute inset-0 m-auto rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0',
            iconSizes[size]
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 m-auto rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100',
            iconSizes[size]
          )}
        />
      </button>
    );
  }

  if (variant === 'dropdown') {
    // Mapare iconuri pentru evitarea redundanței
    const icons = { light: Sun, dark: Moon, system: Monitor } as const;

    return (
      <div className={cn('flex flex-col space-y-1', className)}>
        <div className='mb-2 text-sm font-medium text-neutral-300'>Theme</div>
        {(['light', 'dark', 'system'] as const).map(currentThemeOption => {
          const Icon = icons[currentThemeOption];
          return (
            <button
              key={currentThemeOption}
              onClick={() => setTheme(currentThemeOption)}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
                'hover:bg-muted/80',
                currentTheme === currentThemeOption && 'bg-brand-primary/20 text-brand-primary'
              )}
            >
              <Icon className='mr-2 h-4 w-4' />
              <span className='capitalize'>{currentThemeOption}</span>
              {currentTheme === currentThemeOption && (
                <div className='ml-auto h-2 w-2 rounded-full bg-brand-primary' />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default variant - three buttons
  return (
    <div
      className={cn('inline-flex items-center rounded-lg bg-neutral-800 p-1', className)}
      role='tablist'
      aria-label='Theme selection'
    >
      {[
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
      ].map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value as 'light' | 'dark' | 'system')}
          className={cn(
            'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary/50',
            {
              'h-8 px-2': size === 'sm',
              'h-9 px-3': size === 'md',
              'h-10 px-4': size === 'lg',
            },
            currentTheme === value
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
          )}
          role='tab'
          aria-selected={currentTheme === value}
          aria-label={`Switch to ${label.toLowerCase()} currentTheme`}
        >
          <Icon className='h-4 w-4' />
          <span className='sr-only'>{label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Compact currentTheme toggle for space-constrained areas
 */
export function CompactThemeToggle({ className }: { className?: string }) {
  return <ThemeToggle variant='minimal' size='sm' className={className} />;
}

/**
 * Theme selector for settings pages
 */
export function ThemeSelector({ className }: { className?: string }) {
  return <ThemeToggle variant='dropdown' className={className} />;
}
