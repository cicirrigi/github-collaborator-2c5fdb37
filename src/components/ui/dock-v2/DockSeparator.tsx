'use client';
import { useDockCtx } from './context';
import { useDockTheme } from './hooks/useDockTheme';

export function DockSeparator() {
  const { orientation } = useDockCtx();
  const { tokens } = useDockTheme();

  return (
    <div
      aria-hidden
      className={`rounded-full ${
        orientation === 'vertical' ? 'my-2 h-[1px] w-4/5' : 'mx-3 h-8 w-[1px]'
      }`}
      style={{
        backgroundColor: tokens.background.separator,
        boxShadow: tokens.shadow.low,
      }}
    />
  );
}
