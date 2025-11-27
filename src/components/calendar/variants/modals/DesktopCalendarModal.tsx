'use client';

import { Calendar } from '@/components/calendar/Calendar';
import { DesktopCalendarFooter } from './DesktopCalendarFooter';
import { ModalContainer } from './ModalContainer';
import { ModalOverlay } from './ModalOverlay';

interface DesktopCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  onConfirm: () => void;
  value: Date | null;
  timezone: string;
  label?: string;
}

export function DesktopCalendarModal({
  isOpen,
  onClose,
  onSelect,
  onConfirm,
  value,
  timezone,
  label = 'Choose Your Journey Date',
}: DesktopCalendarModalProps) {
  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose} />

      <ModalContainer isOpen={isOpen} onClose={onClose}>
        <div className='flex flex-col gap-4'>
          {/* HEADER */}
          <div className='flex items-center justify-between'>
            <h2 className='text-white text-lg font-medium tracking-wide'>{label}</h2>

            <button onClick={onClose} className='text-amber-300 hover:text-white transition-colors'>
              ✕
            </button>
          </div>

          {/* CALENDAR - 100% CONTROLLED */}
          <Calendar
            value={value}
            onChange={d => onSelect(d as Date)}
            timezone={timezone}
            mode='single'
            className='mt-2'
          />

          {/* FOOTER - EXTRACTED COMPONENT */}
          <DesktopCalendarFooter onCancel={onClose} onConfirm={onConfirm} />
        </div>
      </ModalContainer>
    </>
  );
}
