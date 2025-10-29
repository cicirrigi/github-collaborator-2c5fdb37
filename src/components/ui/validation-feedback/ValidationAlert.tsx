'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { validationConfig } from './validationConfig';

interface ValidationAlertProps {
  type: 'error' | 'warning' | 'success';
  messages: string[];
  onDismiss: () => void;
  variant?: 'default' | 'compact';
}

export const ValidationAlert = ({ type, messages, onDismiss, variant = 'default' }: ValidationAlertProps) => {
  const { icon: Icon, title, colors, ariaLive, role } = validationConfig[type];

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={cn(
        'p-4 rounded-lg border motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-top-1 transition-all',
        variant === 'compact' && 'p-2',
        colors.bg,
        colors.border
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', colors.text.icon)} />
        
        <div className="flex-1">
          <h4 className={cn('text-sm font-medium mb-2', colors.text.title)}>{title}</h4>
          
          <ul className="space-y-1">
            {messages.map((message, index) => (
              <li key={index} className={cn('text-sm flex items-start gap-2', colors.text.message)}>
                <span className={cn('w-1 h-1 rounded-full flex-shrink-0 mt-2', colors.dot)} />
                <span>{message}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onDismiss}
          className={cn(
            'p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition',
            colors.hover,
            colors.text.button,
            type === 'error' && 'focus:ring-red-300',
            type === 'warning' && 'focus:ring-amber-400',
            type === 'success' && 'focus:ring-emerald-400'
          )}
          aria-label={`Dismiss ${type} messages`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
