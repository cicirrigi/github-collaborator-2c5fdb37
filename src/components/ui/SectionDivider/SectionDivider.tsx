/**
 * ✨ Section Divider Component
 * Subtle gradient line separator between sections
 * Identical to Footer divider - contained width
 */

'use client';

import type React from 'react';

import { Container } from '@/components/layout/Container';

export interface SectionDividerProps {
  readonly className?: string;
  readonly opacity?: number;
}

/**
 * Section Divider - Gradient line separator
 * Wrapped in Container for consistent width with footer divider
 */
export function SectionDivider({
  className = '',
  opacity = 0.6,
}: SectionDividerProps): React.JSX.Element {
  return (
    <div className={`w-full ${className}`}>
      <Container size='xl'>
        <div
          style={{
            height: '1px',
            background: `linear-gradient(to right, transparent, var(--brand-primary), transparent)`,
            opacity,
          }}
        />
      </Container>
    </div>
  );
}
