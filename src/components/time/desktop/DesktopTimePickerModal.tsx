'use client';

import { useEffect, useState } from 'react';
import { TimePicker } from '../TimePicker';
import type { TimeValue } from '../core/time-types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (t: TimeValue | null) => void;
  value: TimeValue | null;
  date: Date;
  interval?: number | undefined;
  minTime?: TimeValue | undefined;
  maxTime?: TimeValue | undefined;
  leadMinutes?: number | undefined;
}

export function DesktopTimePickerModal({
  isOpen,
  onClose,
  onConfirm,
  value,
  date,
  interval,
  minTime,
  maxTime,
  leadMinutes,
}: Props) {
  const [temp, setTemp] = useState<TimeValue | null>(value);

  useEffect(() => setTemp(value), [value]);

  if (!isOpen) return null;

  const cancel = () => {
    setTemp(value);
    onClose();
  };

  const confirm = () => {
    onConfirm(temp);
    onClose();
  };

  return (
    <>
      <div onClick={cancel} className='fixed inset-0 z-40 bg-black/60 backdrop-blur-sm' />

      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div
          className='
            bg-[#0B0B0B] rounded-2xl w-full max-w-md p-6
            shadow-[0_0_40px_rgba(0,0,0,0.55)]
            border border-white/10 flex flex-col gap-4
          '
        >
          <div className='flex items-center justify-between'>
            <h2 className='text-white text-lg font-medium tracking-wide'>Select Time</h2>
            <button onClick={cancel} className='text-amber-300 hover:text-white transition-colors'>
              ✕
            </button>
          </div>

          <TimePicker
            date={date}
            value={temp}
            onChange={setTemp}
            interval={interval}
            minTime={minTime}
            maxTime={maxTime}
            leadMinutes={leadMinutes}
            className='max-h-[55vh]'
          />

          <p className='text-xs text-white/40 text-center'>
            Bookings must be made at least
            <span className='text-amber-300'> 2 hours </span> in advance (London time).
          </p>

          <div className='flex items-center justify-end gap-3 mt-2'>
            <button
              onClick={cancel}
              className='px-4 py-2 text-sm rounded-md text-white/80 hover:text-white transition'
            >
              Cancel
            </button>
            <button
              onClick={confirm}
              style={{ pointerEvents: 'auto' }}
              className='px-4 py-2 text-sm rounded-md bg-amber-500 text-black font-medium hover:bg-amber-400 transition touch-manipulation'
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
