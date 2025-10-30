'use client';

import type React from 'react';

import { Background } from '@/components/ui/Background';
import { layoutTokens } from '@/design-system/tokens/layout';
import { cn } from '@/lib/utils/cn';

import { Container } from './Container';

export interface SectionOrchestratorProps {
  /** Section ID for navigation */
  readonly id?: string;
  /** Content */
  readonly children: React.ReactNode;
  /** Custom styling */
  readonly className?: string;
  /** Vertical spacing size */
  readonly spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Background preset */
  readonly background?: keyof typeof import('@/config/backgrounds.config').backgroundPresets;
  /** Container size */
  readonly containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Disable container wrapper */
  readonly noContainer?: boolean;
  /** Enable relative positioning */
  readonly relative?: boolean;
}

/**
 * 🎭 SectionOrchestrator - Global section wrapper with consistent styling
 *
 * Features:
 * - Consistent vertical spacing from layout tokens
 * - Background presets integration
 * - Container size control
 * - Type-safe spacing & background options
 * - Zero style repetition across sections
 * - Design tokens driven
 */
export function SectionOrchestrator({
  id,
  children,
  className,
  spacing = 'lg',
  background,
  containerSize = 'xl',
  noContainer = false,
  relative = true,
}: SectionOrchestratorProps): React.JSX.Element {
  return (
    <section
      id={id}
      className={cn('overflow-hidden', relative && 'relative', className)}
      style={
        {
          '--section-spacing': layoutTokens.sectionSpacing[spacing],
          paddingTop: 'var(--section-spacing)',
          paddingBottom: 'var(--section-spacing)',
        } as React.CSSProperties
      }
    >
      {/* Background */}
      {background && <Background preset={background} />}

      {/* Content */}
      {noContainer ? (
        <div className='relative z-10'>{children}</div>
      ) : (
        <Container size={containerSize} className='relative z-10'>
          {children}
        </Container>
      )}
    </section>
  );
}
