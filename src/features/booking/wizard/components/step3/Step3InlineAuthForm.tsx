'use client';

import { useState } from 'react';
import { AuthForm } from '@/features/auth/components/AuthForm';
import { AuthTabs } from '@/features/auth/components/AuthTabs';
import type { AuthMode } from '@/features/auth/types/auth.types';

/**
 * 🔐 STEP 3 INLINE AUTH FORM
 *
 * Step3-specific auth form designed for embedded use in booking flow.
 * Reuses existing auth logic without full-page styling conflicts.
 *
 * Features:
 * - Reuses AuthForm and AuthTabs (no code duplication)
 * - No BackgroundOrchestrator (prevents background conflicts)
 * - No full-page styling (proper column alignment)
 * - Clean vl-card compatible design
 * - Preserves all existing auth functionality
 */
interface Step3InlineAuthFormProps {
  defaultMode?: AuthMode;
  redirectTo?: string;
}

export function Step3InlineAuthForm({
  defaultMode = 'signin',
  redirectTo = '/booking',
}: Step3InlineAuthFormProps) {
  const [activeMode, setActiveMode] = useState<AuthMode>(defaultMode);

  /**
   * Component mapping - reuses existing auth components
   */
  const getFormComponent = () => {
    switch (activeMode) {
      case 'signin':
      case 'signup':
        return <AuthForm key={activeMode} mode={activeMode} redirectTo={redirectTo} />;
      // Note: forgot-password and reset-password not needed in booking flow
      default:
        return <AuthForm key={activeMode} mode='signin' redirectTo={redirectTo} />;
    }
  };

  /**
   * Show tabs only for signin/signup (same logic as AuthContainer)
   */
  const showTabs = activeMode === 'signin' || activeMode === 'signup';

  return (
    <div className='space-y-6'>
      {/* Auth Tabs - Same as AuthContainer but without full-page wrapper */}
      {showTabs && <AuthTabs activeMode={activeMode} onChange={setActiveMode} />}

      {/* Auth Form - Direct embedding without extra containers */}
      <div className={showTabs ? 'mt-6' : 'mt-0'}>{getFormComponent()}</div>
    </div>
  );
}
