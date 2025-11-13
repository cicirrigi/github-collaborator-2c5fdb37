import { motion } from 'framer-motion';

/**
 * 🎯 Booking Header - Titlu și descriere
 *
 * Header-ul pentru secțiunea de booking cu animații elegante
 */
export function BookingHeader() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={itemVariants} className='text-center mb-12'>
      <h2 className='text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4'>
        Book Your Luxury Journey
      </h2>
      <p className='text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto'>
        Experience unparalleled comfort and elegance with our premium chauffeur services
      </p>
    </motion.div>
  );
}
