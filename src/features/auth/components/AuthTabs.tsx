/**
 * 🎛️ AuthTabs Component - Vantage Lane 2.0
 *
 * Tab switcher între Sign in / Sign up
 * Reusable și orchestrat prin tokens
 */

'use client';

import { cn } from '@/lib/utils/cn';

import type { AuthTabsProps } from '../types/auth.types';
import { authTokens as tokens } from '../tokens/authTokens';

export function AuthTabs({ activeMode, onChange }: AuthTabsProps) {
  return (
    <div className={tokens.tabs.container} role='tablist' aria-label='Authentication mode'>
      {/* Smooth sliding indicator */}
      <div
        className={tokens.tabs.tab.indicator}
        style={{
          transform: activeMode === 'signin' ? 'translateX(0%)' : 'translateX(100%)',
        }}
      />

      <button
        type='button'
        role='tab'
        aria-selected={activeMode === 'signin'}
        aria-controls='auth-panel'
        onClick={() => onChange('signin')}
        className={cn(
          tokens.tabs.tab.base,
          activeMode === 'signin' ? tokens.tabs.tab.active : tokens.tabs.tab.inactive
        )}
      >
        Sign In
      </button>

      <button
        type='button'
        role='tab'
        aria-selected={activeMode === 'signup'}
        aria-controls='auth-panel'
        onClick={() => onChange('signup')}
        className={cn(
          tokens.tabs.tab.base,
          activeMode === 'signup' ? tokens.tabs.tab.active : tokens.tabs.tab.inactive
        )}
      >
        Sign Up
      </button>
    </div>
  );
}
