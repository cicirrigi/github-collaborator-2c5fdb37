/**
 * 🛫 Airport Transfers Page - SEO Optimized
 *
 * Example implementation of centralized SEO system
 * Uses getPageMetadata() for automatic meta generation
 */

import { getPageMetadata } from '@/lib/seo';

// 🎯 Automatic metadata generation from centralized config
export const metadata = getPageMetadata('/services/airport-transfers');

export default function AirportTransfersPage() {
  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Hero Section */}
      <section className='py-20 px-4'>
        <div className='container mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6'>Premium Airport Transfers</h1>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto mb-8'>
            Professional meet & greet service with luxury vehicles for seamless airport
            transportation.
          </p>
        </div>
      </section>

      {/* Services Content */}
      <section className='py-16 px-4'>
        <div className='container mx-auto'>
          <div className='grid md:grid-cols-2 gap-12'>
            {/* Service Features */}
            <div>
              <h2 className='text-3xl font-bold mb-6'>Why Choose Our Airport Service?</h2>
              <div className='space-y-4'>
                <div className='flex items-start gap-4'>
                  <div className='w-2 h-2 bg-yellow-400 rounded-full mt-2'></div>
                  <div>
                    <h3 className='font-semibold mb-2'>Professional Meet & Greet</h3>
                    <p className='text-gray-300'>Chauffeur waits with name sign in arrivals hall</p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='w-2 h-2 bg-yellow-400 rounded-full mt-2'></div>
                  <div>
                    <h3 className='font-semibold mb-2'>Flight Monitoring</h3>
                    <p className='text-gray-300'>Real-time flight tracking for delayed arrivals</p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='w-2 h-2 bg-yellow-400 rounded-full mt-2'></div>
                  <div>
                    <h3 className='font-semibold mb-2'>Premium Vehicles</h3>
                    <p className='text-gray-300'>Mercedes S-Class, BMW 7 Series, Range Rover</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className='bg-gray-900 p-8 rounded-lg'>
              <h3 className='text-2xl font-bold mb-4'>Book Your Transfer</h3>
              <p className='text-gray-300 mb-6'>
                Reserve your airport transfer with our premium chauffeur service.
              </p>

              <div className='space-y-3 mb-6'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Heathrow - Central London</span>
                  <span className='text-yellow-400 font-semibold'>From £65</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Gatwick - Central London</span>
                  <span className='text-yellow-400 font-semibold'>From £75</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Stansted - Central London</span>
                  <span className='text-yellow-400 font-semibold'>From £80</span>
                </div>
              </div>

              <button className='w-full bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition-colors'>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
