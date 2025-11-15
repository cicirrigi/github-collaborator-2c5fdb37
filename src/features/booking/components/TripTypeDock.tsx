'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { useBookingStore, type TripType } from '../store/booking.store';
import { tripTypeDockTokens as t } from '../tokens/tripTypeDock.tokens';

const tripTypes: { id: TripType; label: string }[] = [
  { id: 'oneway', label: 'One Way' },
  { id: 'return', label: 'Return' },
  { id: 'hourly', label: 'Hourly' },
  { id: 'daily', label: 'Daily' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'bespoke', label: 'Bespoke' },
];

export function TripTypeDock() {
  const { tripType, setTripType } = useBookingStore();

  const onSelect = (type: TripType) => {
    if (type !== tripType) {
      setTripType(type);
      navigator.vibrate?.(8);
    }
  };

  return (
    <div className={t.container}>
      <motion.div layout className={t.dock}>
        {/* INNER GLASS LAYER (same as pill inputs) */}
        <div className={t.innerGlass} />

        {tripTypes.map(tt => {
          const selected = tripType === tt.id;

          return (
            <button
              key={tt.id}
              onClick={() => onSelect(tt.id)}
              className={cn(t.item.base, t.item.hover)}
            >
              {selected && (
                <motion.div
                  layoutId='vantageLiquidMetal'
                  className={t.active}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 22,
                  }}
                >
                  {/* Curved glossy highlight */}
                  <div
                    className='absolute inset-0 rounded-full bg-gradient-to-b
                                  from-white/60 to-transparent opacity-[0.25]'
                  />

                  {/* Particule aurii microscopice */}
                  <motion.div
                    className={t.particles}
                    animate={{
                      backgroundPosition: ['0px 0px', '10px 15px', '-15px 5px', '0px 0px'],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              )}

              <span className='relative z-20'>{tt.label}</span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
