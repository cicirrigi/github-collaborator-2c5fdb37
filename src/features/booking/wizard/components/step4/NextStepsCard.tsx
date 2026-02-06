'use client';

import { AlertCircle, MapPin, Phone, Smartphone } from 'lucide-react';

/**
 * 🎯 NEXT STEPS CARD
 * Inform user about what happens after booking confirmation
 * Clear expectations, no complex logic
 */

interface NextStepsCardProps {
  supportPhone?: string;
  supportEmail?: string;
}

export function NextStepsCard({
  supportPhone = '+44 20 7xxx xxxx',
  supportEmail = 'support@vantagelane.com',
}: NextStepsCardProps) {
  const steps = [
    {
      icon: '📧',
      title: 'Booking Processed',
      description: 'Your booking enters our admin system for processing',
    },
    {
      icon: '👨‍💼',
      title: 'Driver Assignment',
      description: 'Professional chauffeur accepts and reviews your booking',
    },
    {
      icon: '📱',
      title: '2 Hours Before Pickup',
      description: 'You receive SMS and email with driver details and vehicle info',
    },
    {
      icon: '🚗',
      title: 'Day of Service',
      description: 'Track your chauffeur in real-time and enjoy your luxury transfer',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* What Happens Next */}
      <div className='vl-card'>
        <div className='flex items-center gap-2 text-amber-400 font-medium mb-4'>
          <MapPin className='w-5 h-5' />
          What Happens Next
        </div>

        <div className='space-y-4'>
          {steps.map((step, index) => (
            <div key={index} className='flex gap-4 p-3 bg-white/5 rounded-lg'>
              <div className='flex-shrink-0 w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center text-sm'>
                {step.icon}
              </div>
              <div className='flex-1'>
                <div className='text-white font-medium text-sm mb-1'>{step.title}</div>
                <div className='text-neutral-400 text-xs'>{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div className='vl-card'>
        <div className='flex items-center gap-2 text-orange-400 font-medium mb-3'>
          <AlertCircle className='w-5 h-5' />
          Important Notice
        </div>

        <div className='p-4 bg-orange-500/10 rounded-lg border border-orange-500/20 space-y-3'>
          <div className='text-sm text-orange-200'>
            <strong>No Modifications Available:</strong> Post-payment changes are not permitted as
            pricing is based on distance, time, and availability at booking.
          </div>

          <div className='text-xs text-neutral-400'>
            For urgent assistance or exceptional circumstances, contact our support team.
          </div>
        </div>
      </div>

      {/* Support Contact */}
      <div className='vl-card'>
        <div className='flex items-center gap-2 text-blue-400 font-medium mb-4'>
          <Phone className='w-5 h-5' />
          Need Assistance?
        </div>

        <div className='space-y-3'>
          <a
            href={`tel:${supportPhone}`}
            className='flex items-center gap-3 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/40 text-blue-300 hover:text-blue-200 transition-colors'
          >
            <Phone className='w-4 h-4' />
            <div className='flex-1'>
              <div className='font-medium'>Call Support</div>
              <div className='text-sm'>{supportPhone}</div>
            </div>
          </a>

          <a
            href={`mailto:${supportEmail}`}
            className='flex items-center gap-3 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/40 text-blue-300 hover:text-blue-200 transition-colors'
          >
            <Smartphone className='w-4 h-4' />
            <div className='flex-1'>
              <div className='font-medium'>Email Support</div>
              <div className='text-sm'>{supportEmail}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
