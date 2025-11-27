'use client';

import { useEffect, useRef, useState } from 'react';

export type CalendarSizeTier = 'xs' | 'sm' | 'md' | 'lg';

export function useCalendarMeasure() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [sizeTier, setSizeTier] = useState<CalendarSizeTier>('md');

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;

      const w = entry.contentRect.width;
      setWidth(w);

      // 📏 Intelligent tier detection
      if (w < 220) setSizeTier('xs');
      else if (w < 260) setSizeTier('sm');
      else if (w < 320) setSizeTier('md');
      else setSizeTier('lg');
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, width, sizeTier };
}
