import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 🔗 Booking CTA - Call to Action Button
 *
 * Butonul principal pentru continuarea către selecția vehiculului
 */
export function BookingCTA() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={itemVariants} className='mt-8 text-center'>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center px-8 py-4 rounded-xl',
          'bg-gradient-to-r from-amber-500 to-amber-600',
          'hover:from-amber-600 hover:to-amber-700',
          'text-white font-semibold text-lg',
          'shadow-lg hover:shadow-xl transition-all duration-200',
          'focus:outline-none focus:ring-4 focus:ring-amber-500/25'
        )}
        onClick={() => {
          // TODO: Navigate to vehicle selection step
        }}
      >
        Continue to Vehicle Selection
        <svg className='ml-2 w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M17 8l4 4m0 0l-4 4m4-4H3'
          />
        </svg>
      </motion.button>
    </motion.div>
  );
}
