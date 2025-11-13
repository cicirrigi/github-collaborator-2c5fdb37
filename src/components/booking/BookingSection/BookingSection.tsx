/**
 * 📋 Booking Section - Premium Booking Form (Refactored)
 *
 * Formularul principal de booking pentru home page - versiune curată și modulară
 * - BookingFloatingDock cu smooth hover effects și active states
 * - TravelPlannerPro pentru detalii avansate
 * - Integrare cu Zustand booking store prin useBookingTabSync hook
 * - Arhitectură modulară: 5 componente + 1 hook
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BookingTabType } from '@/components/ui/booking-tabs-pro/types';

// Design System Integration
import { designTokens } from '@/config/theme.config';
import { SectionOrchestrator } from '@/components/layout/SectionOrchestrator';

// Components
import { BookingHeader } from './BookingHeader';
import { BookingTypeDock } from './BookingTypeDock';
import { BookingCTA } from './BookingCTA';
import { TravelPlannerPro } from '@/components/ui/travel-planner-pro';

// Hooks
import { useBookingTabSync } from './useBookingTabSync';

interface BookingSectionProps {
  className?: string;
}

export function BookingSection({ className }: BookingSectionProps) {
  const [activeTab, setActiveTab] = useState<BookingTabType>('oneway');

  // Sincronizează tab-ul activ cu Zustand store
  useBookingTabSync(activeTab);

  // 🌊 Motion variants cu tokens orchestrați
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6, // Fixed: parseFloat('500ms') was 500 seconds!
        ease: designTokens.motion?.easing?.ease || [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // Fixed: parseFloat('300ms') was 300 seconds!
        ease: designTokens.motion?.easing?.ease || [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <SectionOrchestrator
      id='booking'
      variant='default'
      spacing='xl'
      background='neutral'
      containerSize='xl'
      {...(className && { className })}
    >
      {/* Orchestrated Background Pattern - din gradients tokens */}
      <div className='absolute inset-0 bg-[var(--booking-glow)]' />

      <motion.div
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
        className='max-w-4xl mx-auto'
      >
        {/* Header */}
        <BookingHeader />

        {/* VisionOS Chrome Booking Card Container */}
        <motion.div
          variants={itemVariants}
          className='relative'
          style={{
            background: designTokens.colors.background.elevated,
            borderRadius: designTokens.borderRadius?.['2xl'] || '1rem',
            border: `1px solid ${designTokens.colors.border.subtle}`,
            padding: designTokens.spacing?.xl || '2rem',
            backdropFilter: 'blur(24px)',
            boxShadow: [
              'inset 0 0 1px rgba(255,255,255,0.25)',
              '0 8px 32px rgba(0,0,0,0.22)',
              '0 0 40px rgba(203,178,106,0.11)',
            ].join(', '),
          }}
        >
          {/* Active Tab Status - inside container */}
          <div className='text-center mb-6'>
            <p className='text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-2'>
              Booking Type
            </p>
            <h3 className='text-lg font-semibold text-neutral-800 dark:text-neutral-100'>
              {activeTab === 'oneway' && 'One Way Trip'}
              {activeTab === 'return' && 'Return Trip'}
              {activeTab === 'hourly' && 'Hourly Service'}
              {activeTab === 'fleet' && 'Fleet Booking'}
            </h3>
          </div>

          {/* Booking Type Dock */}
          <div className='mb-8'>
            <BookingTypeDock activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Travel Planner - cu motion orchestrat */}
          <motion.div
            key={`planner-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4, // Fixed: parseFloat('300ms') was 300 seconds!
              ease: designTokens.motion?.easing?.ease || [0.4, 0, 0.2, 1],
            }}
          >
            <TravelPlannerPro
              onPlanChange={plan => {
                // TODO: Handle travel plan changes
                void plan;
              }}
            />
          </motion.div>

          {/* Call to Action */}
          <BookingCTA />
        </motion.div>
      </motion.div>
    </SectionOrchestrator>
  );
}
