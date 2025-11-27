'use client';

/**
 * 🖥️ VANTAGE LANE — Desktop TimePicker Modal (Enterprise)
 *
 * Features:
 *  - overlay blur
 *  - centered modal
 *  - safe temp selection
 *  - identical styling to Desktop Calendar Modal
 *  - confirm / cancel actions
 */

import { useEffect, useState } from 'react';
import { TimePicker } from '../TimePicker';
import { type TimeValue } from '../core/useTimeEngine';

interface DesktopTimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;

  /** Called when selection is confirmed */
  onConfirm: (t: TimeValue | null) => void;

  /** Controlled value */
  value: TimeValue | null;

  date: Date;
  interval?: number;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  leadMinutes?: number;
  label?: string;
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
  label = 'Select Time',
}: DesktopTimePickerModalProps) {
  /* -------------------------------------------------------
     1. Temp selection (safe editing)
  --------------------------------------------------------- */
  const [tempValue, setTempValue] = useState<TimeValue | null>(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  if (!isOpen) return null;

  /* -------------------------------------------------------
     2. Close handler
  --------------------------------------------------------- */
  const handleCancel = () => {
    setTempValue(value);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(tempValue);
    onClose();
  };

  /* -------------------------------------------------------
     3. Render
  --------------------------------------------------------- */
  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={handleCancel}
        className='
          fixed inset-0 z-40
          bg-black/60 backdrop-blur-sm
        '
      />

      {/* MODAL WRAPPER */}
      <div
        className='
          fixed inset-0 z-50
          flex items-center justify-center
          p-4
        '
      >
        {/* MODAL */}
        <div
          className='
            bg-[#0B0B0B]
            rounded-2xl
            w-full max-w-md
            p-6
            shadow-[0_0_40px_rgba(0,0,0,0.55)]
            border border-white/10
            flex flex-col gap-4
          '
        >
          {/* HEADER */}
          <div className='flex items-center justify-between mb-2'>
            <h2 className='text-white text-lg font-medium tracking-wide'>{label}</h2>

            <button onClick={handleCancel} className='text-amber-300 hover:text-white transition'>
              ✕
            </button>
          </div>

          {/* TIME PICKER */}
          <TimePicker
            date={date}
            value={tempValue}
            onChange={setTempValue}
            interval={interval}
            minTime={minTime}
            maxTime={maxTime}
            leadMinutes={leadMinutes}
            className='max-h-[55vh]'
          />

          {/* WARNING */}
          <p className='text-xs text-white/40 text-center'>
            Bookings must be made at least{' '}
            <span className='text-amber-300'>2 hours in advance</span> (London time).
          </p>

          {/* FOOTER */}
          <div
            className='
              flex items-center justify-end
              gap-4 mt-4
            '
          >
            <button
              onClick={handleCancel}
              className='
                px-4 py-2 rounded-lg
                bg-white/10 text-white
                hover:bg-white/20 transition
              '
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className='
                px-4 py-2 rounded-lg
                bg-amber-400/20 border border-amber-300/40
                text-amber-200 font-medium
                hover:bg-amber-400/30 transition
              '
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
