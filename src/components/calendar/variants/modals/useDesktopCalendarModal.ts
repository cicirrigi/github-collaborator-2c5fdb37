'use client';

import { useState } from 'react';

export function useDesktopCalendarModal(initial: Date | null = null) {
  const [isOpen, setIsOpen] = useState(false);

  const [tempDate, setTempDate] = useState<Date | null>(initial);
  const [committedDate, setCommittedDate] = useState<Date | null>(initial);

  return {
    isOpen,
    tempDate,
    committedDate,

    open: (value?: Date | null) => {
      if (value) {
        setTempDate(value);
      }
      setIsOpen(true);
    },

    close: () => setIsOpen(false),

    select: (date: Date) => {
      setTempDate(date);
    },

    confirm: () => {
      setCommittedDate(tempDate);
      setIsOpen(false);
      return tempDate;
    },

    cancel: () => {
      setTempDate(committedDate);
      setIsOpen(false);
    },
  };
}
