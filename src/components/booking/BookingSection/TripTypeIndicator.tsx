import { motion } from 'framer-motion';
import type { BookingTabType } from '@/components/ui/booking-tabs-pro/types';

interface TripTypeIndicatorProps {
  activeTab: BookingTabType;
}

/**
 * 🎯 Trip Type Indicator - Afișează tipul de călătorie selectat
 *
 * Indicator animat cu emoji și text pentru tipul de călătorie activ
 */
export function TripTypeIndicator({ activeTab }: TripTypeIndicatorProps) {
  const labelMap: Record<BookingTabType, { icon: string; text: string }> = {
    oneway: { icon: '🎯', text: 'Single Journey' },
    return: { icon: '↔️', text: 'Round Trip' },
    hourly: { icon: '⏱️', text: 'By the Hour' },
    fleet: { icon: '🚗', text: 'Fleet Booking' },
  };

  const { icon, text } = labelMap[activeTab];

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        duration: 0.4,
      }}
      className='mb-8 text-center'
    >
      <motion.span
        className='inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 dark:from-amber-900/40 dark:to-amber-800/30 dark:text-amber-200 shadow-lg backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          key={`icon-${activeTab}`}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='mr-2'
        >
          {icon}
        </motion.span>
        <motion.span
          key={`text-${activeTab}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {text}
        </motion.span>
      </motion.span>
    </motion.div>
  );
}
