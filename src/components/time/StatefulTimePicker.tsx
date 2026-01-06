'use client';

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_LEAD_TIME_MINUTES } from './core/time-constants';
import type { TimeValue } from './core/time-types';
import { generateTimeSlots, isTimeDisabled } from './core/time-utils';
import { DesktopTimePickerModal } from './desktop/DesktopTimePickerModal';
import { MobileTimePickerModal } from './mobile/MobileTimePickerModal';

export function StatefulTimePicker({
  date,
  value,
  onChange,
  interval = 15,
  minTime,
  maxTime,
  leadMinutes = DEFAULT_LEAD_TIME_MINUTES,
}: {
  date: Date;
  value: TimeValue | null;
  onChange: (t: TimeValue | null) => void;
  interval?: number;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  leadMinutes?: number;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const defaultSet = useRef(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    // Only auto-select if no initial value is provided and no default has been set
    if (!defaultSet.current && !value) {
      // Use the same logic as useTimeEngine to find first valid slot
      const slots = generateTimeSlots(interval);
      const firstValidSlot = slots.find(
        slot =>
          !isTimeDisabled({
            slot,
            date,
            lead: leadMinutes,
            minTime,
            maxTime,
          })
      );

      if (firstValidSlot) {
        onChange(firstValidSlot);
      }
      defaultSet.current = true;
    } else if (value && !defaultSet.current) {
      // If initial value is provided, mark default as set to prevent override
      defaultSet.current = true;
    }
  }, [value, leadMinutes, interval, onChange, date, minTime, maxTime]);

  const formatted =
    value && value.hours !== undefined
      ? `${String(value.hours).padStart(2, '0')}:${String(value.minutes).padStart(2, '0')}`
      : 'Select time';
  return (
    <div className='relative'>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='
          w-full p-3 text-left rounded-lg
          bg-white/5 text-amber-200 border border-white/10
          hover:bg-white/10 transition
        '
      >
        {formatted}
      </button>

      {mounted && (
        <>
          {!isMobile && (
            <DesktopTimePickerModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onConfirm={onChange}
              value={value}
              date={date}
              interval={interval}
              minTime={minTime}
              maxTime={maxTime}
              leadMinutes={leadMinutes}
            />
          )}

          {isMobile && (
            <MobileTimePickerModal
              open={open}
              onClose={() => setOpen(false)}
              onConfirm={onChange}
              value={value}
              onChange={onChange}
              date={date}
              interval={interval}
              minTime={minTime}
              maxTime={maxTime}
              leadMinutes={leadMinutes}
            />
          )}
        </>
      )}
    </div>
  );
}
