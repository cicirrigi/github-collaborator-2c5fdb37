'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface CalendarPillsProps {
  year: number;
  month: number;
  selectedDate: string;
  onSelect: (v: string) => void;
}

export function CalendarPills({ year, month, selectedDate, onSelect }: CalendarPillsProps) {
  const date = new Date(year, month, 1);
  const days = [];

  while (date.getMonth() === month) {
    const d = new Date(date);
    const iso = d.toISOString().slice(0, 10);
    days.push({ label: d.getDate(), value: iso });
    date.setDate(date.getDate() + 1);
  }

  return (
    <div className='grid grid-cols-4 gap-3 mt-4'>
      {days.map(d => {
        const isSelected = selectedDate === d.value;

        return (
          <motion.button
            key={d.value}
            whileTap={{ scale: 0.94 }}
            onClick={() => onSelect(d.value)}
            className={cn(
              'py-3 rounded-full text-sm font-medium transition-all backdrop-blur-xl',
              isSelected
                ? 'bg-[#CBB26A]/30 border border-[#CBB26A]/50 text-white shadow-[0_0_16px_rgba(203,178,106,0.4)]'
                : 'bg-white/5 border border-white/10 text-white/70'
            )}
          >
            {d.label}
          </motion.button>
        );
      })}
    </div>
  );
}
