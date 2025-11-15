'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { useBookingStore, type TripType } from '../store/booking.store';
import { tripTypeTokens as tokens } from '../tokens/tripType.tokens';

const tripTypes: { id: TripType; label: string }[] = [
  { id: 'oneway', label: 'One Way' },
  { id: 'return', label: 'Return Trip' },
  { id: 'hourly', label: 'Hourly' },
  { id: 'daily', label: 'Daily' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'bespoke', label: 'Bespoke' },
];

export function TripTypeSelector() {
  const { tripType, setTripType } = useBookingStore();

  const handleSelect = (type: TripType) => {
    if (type === tripType) return;

    setTripType(type);
    navigator.vibrate?.(8);
  };

  return (
    <motion.div layout className={tokens.container} role='radiogroup' aria-label='Select trip type'>
      {tripTypes.map(t => {
        const isSelected = tripType === t.id;

        return (
          <motion.button
            key={t.id}
            type='button'
            role='radio'
            aria-checked={isSelected}
            onClick={() => handleSelect(t.id)}
            className={cn(
              tokens.button.base,
              tokens.button.hover,
              isSelected && tokens.button.selected
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 22,
            }}
          >
            {/* underline lichid */}
            {isSelected && (
              <motion.div
                layoutId='tripTypeUnderlineLiquid'
                className='absolute bottom-1 left-3 right-3 h-[3px]
                           bg-gradient-to-r from-[#CBB26A] via-white/70 to-[#CBB26A]
                           rounded-full shadow-[0_0_12px_rgba(203,178,106,0.8)]'
                transition={{ type: 'spring', stiffness: 230, damping: 18 }}
              />
            )}

            {/* shimmer la hover */}
            <span
              className='absolute inset-0 opacity-0 group-hover:opacity-10
                         bg-gradient-to-br from-white/40 to-transparent
                         transition-all duration-500'
            />

            <span className={tokens.label}>{t.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
