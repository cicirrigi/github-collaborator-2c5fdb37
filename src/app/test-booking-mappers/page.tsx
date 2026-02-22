'use client';

import { useState } from 'react';
import { saveBooking } from '@/services/booking.service';
import type { BookingType, TripConfiguration } from '@/services/booking-mapping/types';

/**
 * 🧪 Test Page for Oneway & Return Booking Mappers
 */
export default function TestBookingMappers() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Mock trip configuration for oneway booking
  const mockOnewayTrip: TripConfiguration = {
    // Locations
    pickup: {
      address: 'London Heathrow Airport (LHR), Hounslow TW6, UK',
      coordinates: [-0.4614, 51.47],
      placeId: 'ChIJr_C2PxdFdkgRPW8FKsmWCPI',
    },
    dropoff: {
      address: 'The Shard, 32 London Bridge St, London SE1 9SG, UK',
      coordinates: [-0.0865, 51.5045],
      placeId: 'ChIJH5tWn0YEAkgR8G3jkWC2rT0',
    },
    additionalStops: [
      {
        address: "Claridge's Hotel, Brook St, London W1K 4HR, UK",
        coordinates: [-0.1483, 51.512],
        placeId: 'ChIJD3uTd9wFdkgR4TcJ-2GrWT0',
      },
    ],

    // Return trip (empty for oneway)
    returnPickup: null,
    returnDropoff: null,
    returnAdditionalStops: [],
    isDifferentReturnLocation: false,

    // Dates & Times
    pickupDate: new Date('2026-02-20'),
    returnDate: null,
    pickupTime: '14:30',
    returnTime: '16:00',
    pickupDateTime: new Date('2026-02-20T14:30:00.000Z'),
    returnDateTime: null,
    dailyRange: [null, null],

    // Passengers & Logistics
    passengers: 2,
    luggage: 1,
    flightNumberPickup: 'BA123',
    flightNumberReturn: '',
    hoursRequested: null,
    daysRequested: null,
    customRequirements: 'Please wait in arrivals with name board. Driver should wear black suit.',

    // Vehicle Selection
    selectedVehicle: {
      category: {
        id: 'luxury',
        name: 'Luxury',
        basePrice: 120,
        description: 'Premium vehicles',
      },
      model: {
        id: 'mercedes-s-class',
        name: 'Mercedes-Benz S-Class',
        priceMultiplier: 1.2,
        image: '/images/vehicles/mercedes-s-class.jpg',
      },
    },

    // Fleet & Services
    fleetSelection: {
      executive: 0,
      luxury: 0,
      suv: 0,
      mpv: 0,
    },
    servicePackages: {
      includedServices: [],
      premiumFeatures: [],
      paidUpgrades: [],
    },
    futureFeatures: {
      carbonNeutral: false,
      realTimeTracking: false,
    },
  };

  // Mock return trip configuration
  const mockReturnTrip: TripConfiguration = {
    ...mockOnewayTrip,
    returnDate: new Date('2026-02-21'),
    returnTime: '10:00',
    returnDateTime: new Date('2026-02-21T10:00:00.000Z'),
    flightNumberReturn: 'BA456',
    returnPickup: {
      address: 'The Shard, 32 London Bridge St, London SE1 9SG, UK',
      coordinates: [-0.0865, 51.5045],
      placeId: 'ChIJH5tWn0YEAkgR8G3jkWC2rT0',
    },
    returnDropoff: {
      address: 'London Heathrow Airport (LHR), Hounslow TW6, UK',
      coordinates: [-0.4614, 51.47],
      placeId: 'ChIJr_C2PxdFdkgRPW8FKsmWCPI',
    },
    isDifferentReturnLocation: false,
  };

  const testBooking = async (bookingType: BookingType) => {
    setLoading(true);
    setResult(null);

    try {
      const tripConfig = bookingType === 'oneway' ? mockOnewayTrip : mockReturnTrip;

      console.log(`🧪 Testing ${bookingType} booking...`);
      console.log('Trip Config:', tripConfig);

      const result = await saveBooking(tripConfig, bookingType, 'test-customer-123');

      console.log('Booking Result:', result);
      setResult(result);
    } catch (error) {
      console.error('Test Error:', error);
      setResult({
        success: false,
        error: 'Test failed',
        details: [error instanceof Error ? error.message : String(error)],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-black text-white p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-amber-400 mb-8'>🧪 Booking Mappers Test</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {/* Oneway Test */}
          <div className='bg-slate-900/50 border border-slate-700 rounded-lg p-6'>
            <h2 className='text-xl font-semibold text-amber-200 mb-4'>🚗 One-way Booking Test</h2>
            <div className='text-sm text-slate-300 mb-4'>
              <p>
                <strong>Pickup:</strong> LHR Airport
              </p>
              <p>
                <strong>Stop:</strong> Claridge's Hotel
              </p>
              <p>
                <strong>Dropoff:</strong> The Shard
              </p>
              <p>
                <strong>Date:</strong> 20 Feb 2026, 14:30
              </p>
              <p>
                <strong>Passengers:</strong> 2, Luggage: 1
              </p>
              <p>
                <strong>Flight:</strong> BA123
              </p>
              <p>
                <strong>Vehicle:</strong> Mercedes S-Class (Luxury)
              </p>
            </div>
            <button
              onClick={() => testBooking('oneway')}
              disabled={loading}
              className='w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 
                         text-white py-2 px-4 rounded transition-colors'
            >
              {loading ? 'Testing...' : 'Test Oneway Booking'}
            </button>
          </div>

          {/* Return Test */}
          <div className='bg-slate-900/50 border border-slate-700 rounded-lg p-6'>
            <h2 className='text-xl font-semibold text-amber-200 mb-4'>🔄 Return Booking Test</h2>
            <div className='text-sm text-slate-300 mb-4'>
              <p>
                <strong>Outbound:</strong> LHR → The Shard
              </p>
              <p>
                <strong>Date:</strong> 20 Feb 2026, 14:30
              </p>
              <p>
                <strong>Flight:</strong> BA123
              </p>
              <p>
                <strong>Return:</strong> The Shard → LHR
              </p>
              <p>
                <strong>Date:</strong> 21 Feb 2026, 10:00
              </p>
              <p>
                <strong>Flight:</strong> BA456
              </p>
              <p>
                <strong>Vehicle:</strong> Mercedes S-Class (Luxury)
              </p>
            </div>
            <button
              onClick={() => testBooking('return')}
              disabled={loading}
              className='w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 
                         text-white py-2 px-4 rounded transition-colors'
            >
              {loading ? 'Testing...' : 'Test Return Booking'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className='bg-slate-900/50 border border-slate-700 rounded-lg p-6'>
            <h2 className='text-xl font-semibold text-amber-200 mb-4'>📊 Test Results</h2>

            <div
              className={`p-4 rounded ${
                result.success
                  ? 'bg-green-900/50 border border-green-600'
                  : 'bg-red-900/50 border border-red-600'
              }`}
            >
              {result.success ? (
                <div>
                  <p className='text-green-400 font-semibold mb-2'>✅ Success!</p>
                  <p className='text-slate-300 mb-2'>{result.message}</p>
                  <div className='bg-slate-800 p-3 rounded text-xs text-slate-200 overflow-auto'>
                    <strong>Booking ID:</strong> {result.booking.id}
                    <br />
                    <strong>Trip Type:</strong> {result.booking.trip_type}
                    <br />
                    <strong>Category:</strong> {result.booking.category}
                    <br />
                    <strong>Start At:</strong> {result.booking.start_at}
                    <br />
                    <strong>Passengers:</strong> {result.booking.passenger_count}
                    <br />
                    <strong>Reference:</strong> {result.booking.reference || 'N/A'}
                  </div>
                </div>
              ) : (
                <div>
                  <p className='text-red-400 font-semibold mb-2'>❌ Error!</p>
                  <p className='text-slate-300 mb-2'>{result.error}</p>
                  {result.details && (
                    <div className='bg-slate-800 p-3 rounded text-xs text-slate-200'>
                      <strong>Details:</strong>
                      <ul className='list-disc list-inside mt-1'>
                        {result.details.map((detail: string, i: number) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className='mt-4'>
              <details className='text-sm'>
                <summary className='text-amber-200 cursor-pointer'>View Full Response</summary>
                <pre className='bg-slate-800 p-3 rounded mt-2 overflow-auto text-xs text-slate-300'>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        <div className='mt-8 text-center text-slate-400 text-sm'>
          Check browser console for detailed mapping logs
        </div>
      </div>
    </div>
  );
}
