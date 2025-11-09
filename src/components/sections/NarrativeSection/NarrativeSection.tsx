/**
 * 📖 NarrativeSection Component
 * Brand philosophy and experience narrative
 * Premium storytelling section between Services and Fleet
 */

'use client';

import type React from 'react';

import { cn } from '@/lib/utils/cn';

import { NarrativeContent, NarrativeImage } from './components';
import { narrativeConfig } from './NarrativeSection.config';
import { narrativeTokens } from './NarrativeSection.tokens';
import type { NarrativeSectionProps } from './NarrativeSection.types';

const config = narrativeConfig;
const tokens = narrativeTokens;

export function NarrativeSection({
  className,
  hide = false,
}: NarrativeSectionProps): React.JSX.Element | null {
  if (hide) return null;

  return (
    <section className={cn(tokens.container.base, className)}>
      <div className={tokens.container.maxWidth}>
        {/* Grid layout: text + image */}
        <div className={tokens.layout.grid}>
          {/* Text side (left on desktop) */}
          <NarrativeContent
            title={config.title}
            subheadline={config.subheadline}
            blocks={config.blocks}
            cta={config.cta}
          />

          {/* Image side (right on desktop) */}
          <NarrativeImage visual={config.visual} />
        </div>
      </div>
    </section>
  );
}
