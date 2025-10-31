'use client';
import { DockProvider, useDockCtx } from './context';
import { dockTokens } from './design-tokens';
import { useDockTheme } from './hooks/useDockTheme';
import type { DockConfig } from './types';

export function Dock({
  children,
  orientation = 'horizontal',
  className,
  'aria-label': ariaLabel,
}: DockConfig & {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <DockProvider orientation={orientation}>
      <DockSurface aria-label={ariaLabel ?? 'Dock'} className={className ?? ''}>
        {children}
      </DockSurface>
    </DockProvider>
  );
}

function DockSurface({
  children,
  className,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}) {
  const ctx = useDockCtx();
  const { tokens } = useDockTheme();

  return (
    <div
      role='toolbar'
      aria-label={ariaLabel ?? 'Dock'}
      aria-orientation={ctx.orientation}
      onMouseMove={e => ctx.setMouse(e.pageX, e.pageY)}
      onMouseLeave={ctx.resetMouse}
      className={`relative mx-auto select-none rounded-3xl border backdrop-blur-xl shadow-lg transition-all overflow-visible ${
        ctx.orientation === 'vertical' ? 'flex flex-col py-4 px-2' : 'flex items-end py-3 px-2'
      } ${className ?? ''}`}
      style={{
        background: `linear-gradient(135deg, ${tokens.glass.from}, ${tokens.glass.to})`,
        borderColor: tokens.border,
        transitionDuration: `${dockTokens.motion.duration.slow}ms`,
        transitionTimingFunction: dockTokens.motion.easing.smooth,
        boxShadow: tokens.shadow.low,
        // Container se extinde dinamic când e hover pentru a da spațiu iconurilor
        minWidth: ctx.orientation === 'horizontal' ? 'auto' : undefined,
        width:
          ctx.orientation === 'vertical' ? `${dockTokens.size.containerWidth}px` : 'max-content',
        paddingLeft:
          ctx.orientation === 'horizontal'
            ? `${ctx.isHovered ? dockTokens.spacing.containerPadding.hover : dockTokens.spacing.containerPadding.idle}px`
            : undefined,
        paddingRight:
          ctx.orientation === 'horizontal'
            ? `${ctx.isHovered ? dockTokens.spacing.containerPadding.hover : dockTokens.spacing.containerPadding.idle}px`
            : undefined,
        gap:
          ctx.orientation === 'horizontal'
            ? `${ctx.isHovered ? dockTokens.spacing.gap.hover : dockTokens.spacing.gap.idle}px`
            : undefined,
        transform: ctx.isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-4 -top-2 h-3 rounded-full'
        style={{
          background: `linear-gradient(180deg, ${dockTokens.theme.gold}22, transparent)`,
          filter: 'blur(6px)',
        }}
      />
      {children}
    </div>
  );
}
