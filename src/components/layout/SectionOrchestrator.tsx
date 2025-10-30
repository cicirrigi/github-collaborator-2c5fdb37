'use client';

import type React from 'react';

import { Background } from '@/components/ui/Background';
import type { BackgroundPreset } from '@/config/backgrounds.config';
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
  /** Section variant (auto-adjusts spacing) */
  readonly variant?: 'default' | 'compact' | 'spacious';
  /** Background preset */
  readonly background?: BackgroundPreset;
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
  variant = 'default',
  background,
  containerSize = 'xl',
  noContainer = false,
  relative = true,
}: SectionOrchestratorProps): React.JSX.Element {
  // Calculate spacing based on variant or explicit spacing
  const spacingValue =
    variant === 'compact'
      ? layoutTokens.sectionSpacing.sm
      : variant === 'spacious'
        ? layoutTokens.sectionSpacing.xl
        : layoutTokens.sectionSpacing[spacing];

  // Section styles (clean, testable, extensible)
  const sectionStyle = {
    '--section-spacing': spacingValue,
    paddingBlock: 'var(--section-spacing)',
  } as React.CSSProperties;

  return (
    <section
      id={id}
      className={cn('overflow-hidden', relative && 'relative', className)}
      style={sectionStyle}
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
