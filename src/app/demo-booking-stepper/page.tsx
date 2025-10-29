'use client';

import { BookingStepperDemo, CustomStepperDemo } from '@/components/ui/booking-stepper/BookingStepper.demo';

export default function DemoBookingStepperPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-neutral-950 to-black'>
      <div className='container mx-auto max-w-6xl py-8'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='text-4xl font-bold text-white mb-4'>📋 Booking Stepper Demo</h1>
          <p className='text-xl text-neutral-400'>
            Complete booking flow with step navigation, animations, and validation
          </p>
        </div>

        {/* Main BookingStepper Demo */}
        <div className='mb-16 p-8 bg-black/20 rounded-xl'>
          <BookingStepperDemo />
        </div>

        {/* Custom Stepper Demo */}
        <div className='p-8 bg-black/20 rounded-xl'>
          <CustomStepperDemo />
        </div>

        {/* Info */}
        <div className='mt-16 text-center p-8 bg-[#CBB26A]/10 rounded-xl'>
          <h3 className='text-2xl font-bold text-[#CBB26A] mb-4'>🎪 BookingStepper Features</h3>
          <div className='grid md:grid-cols-3 gap-6 text-neutral-300'>
            <div>
              <h4 className='font-semibold text-white mb-2'>📐 Multiple Sizes</h4>
              <p className='text-sm'>Small, Medium, Large with spacing options</p>
            </div>
            <div>
              <h4 className='font-semibold text-white mb-2'>🔄 Orientations</h4>
              <p className='text-sm'>Horizontal & Vertical layouts</p>
            </div>
            <div>
              <h4 className='font-semibold text-white mb-2'>✨ Animations</h4>
              <p className='text-sm'>Pulse effects, transitions, interactive states</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
