'use client';

import { useEffect, useRef, useState } from 'react';

export type CalendarSizeTier = 'xs' | 'sm' | 'md' | 'lg';

export function calculateFallbackHeight(
  sizeTier: CalendarSizeTier,
  orientation: 'portrait' | 'landscape'
) {
  const weekdayHeight =
    sizeTier === 'xs' ? 14 : sizeTier === 'sm' ? 18 : sizeTier === 'md' ? 20 : 22;

  const cell = sizeTier === 'xs' ? 24 : sizeTier === 'sm' ? 28 : sizeTier === 'md' ? 34 : 40;

  const cellHeight = orientation === 'landscape' ? Math.floor(cell * 0.55) : cell;

  const gap = sizeTier === 'xs' ? 2 : sizeTier === 'sm' ? 4 : sizeTier === 'md' ? 4 : 6;

  return weekdayHeight + cellHeight * 6 + gap * 5;
}

export function useCalendarMeasure() {
  const ref = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState(0);
  const [sizeTier, setSizeTier] = useState<CalendarSizeTier>('md');
  const [isReady, setIsReady] = useState(false);

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;

      let w = entry.contentRect.width;

      // SAFARI: contentRect.width returns 0 → fallback
      if (w === 0) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0) w = rect.width;
        else w = el.clientWidth; // final fallback
      }

      // FILTER NOISE (ignore micro changes < 1px)
      if (Math.abs(w - width) < 1) return;

      // Cancel previous frame
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        setWidth(w);
        setIsReady(true);

        if (w < 220) setSizeTier('xs');
        else if (w < 260) setSizeTier('sm');
        else if (w < 320) setSizeTier('md');
        else setSizeTier('lg');
      });
    });

    observer.observe(el);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [width]);

  return { ref, width, sizeTier, isReady };
}
