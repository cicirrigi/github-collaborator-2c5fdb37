'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface TimeWheelProps {
  initialHour: string;
  initialMinute: string;
  onConfirm: (h: string, m: string) => void;
}

export function TimeWheel({ initialHour, initialMinute, onConfirm }: TimeWheelProps) {
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')), []);
  const mins = useMemo(() => ['00', '15', '30', '45'], []);

  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  useEffect(() => {
    const hIndex = hours.indexOf(initialHour);
    const mIndex = mins.indexOf(initialMinute);

    hourRef.current?.scrollTo({ top: hIndex * 48 });
    minRef.current?.scrollTo({ top: mIndex * 48 });
  }, [initialHour, initialMinute, hours, mins]);

  let scrollTimeout: NodeJS.Timeout | null = null;

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    set: (v: string) => void,
    values: string[]
  ) => {
    if (!ref.current) return;

    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;

      if (!ref.current) return;
      const index = Math.round(ref.current.scrollTop / 48);
      if (values[index] === undefined) return;

      const newValue = values[index];
      set(newValue);

      const h = ref === hourRef ? newValue : hour;
      const m = ref === minRef ? newValue : minute;

      onConfirm(h, m);
    }, 60);
  };

  return (
    <div className='flex justify-center gap-10 mt-4'>
      {/* HOURS */}
      <div
        ref={hourRef}
        onScroll={() => handleScroll(hourRef, setHour, hours)}
        className='h-48 overflow-y-scroll snap-y snap-mandatory scrollbar-none w-20 text-center'
      >
        {hours.map(h => (
          <div
            key={h}
            className={`snap-center h-12 flex items-center justify-center text-xl font-light
              ${h === hour ? 'text-white' : 'text-white/40'}
            `}
          >
            {h}
          </div>
        ))}
      </div>

      {/* MINUTES */}
      <div
        ref={minRef}
        onScroll={() => handleScroll(minRef, setMinute, mins)}
        className='h-48 overflow-y-scroll snap-y snap-mandatory scrollbar-none w-20 text-center'
      >
        {mins.map(m => (
          <div
            key={m}
            className={`snap-center h-12 flex items-center justify-center text-xl font-light
              ${m === minute ? 'text-white' : 'text-white/40'}
            `}
          >
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}
