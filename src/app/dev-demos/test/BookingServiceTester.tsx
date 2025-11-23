'use client';

import { useBookingState } from '@/hooks/useBookingState';
import type { BookingResult } from '@/services/booking.service';
import {
  logBookingStructure,
  testOneWayBooking,
  testReturnBooking,
  testSupabaseConnection,
} from '@/services/booking.test-service';
import { useState } from 'react';

export default function BookingServiceTester() {
  const [testResult, setTestResult] = useState<BookingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    error?: string;
  } | null>(null);

  const {
    tripConfiguration,
    bookingType,
    setBookingType,
    setPickupDateTime,
    setReturnDateTime,
    setFlightNumberPickup,
    setFlightNumberReturn,
    setIsDifferentReturnLocation,
    setPickup,
    setDropoff,
    setAdditionalStops,
    setPassengers,
    setLuggage,
    setHoursRequested,
    selectVehicleCategory,
    selectVehicleModel,
  } = useBookingState();

  const handleTestConnection = async () => {
    setIsLoading(true);
    const result = await testSupabaseConnection();
    setConnectionStatus(result);
    setIsLoading(false);
  };

  const handleTestOneWayBooking = async () => {
    setIsLoading(true);
    const result = await testOneWayBooking(tripConfiguration);
    setTestResult(result);
    setIsLoading(false);
  };

  const handleTestReturnBooking = async () => {
    setIsLoading(true);
    const result = await testReturnBooking(tripConfiguration);
    setTestResult(result);
    setIsLoading(false);
  };

  const handleLogStructure = () => {
    logBookingStructure(tripConfiguration, bookingType);
  };

  const handleSetupMockData = async () => {
    // Setup mock data for testing
    const mockDateTime = new Date();
    mockDateTime.setHours(mockDateTime.getHours() + 2); // 2 hours from now

    console.log('🎭 Setting up mock data...');
    console.log('Mock DateTime:', mockDateTime);

    // Set basic booking data
    setPickupDateTime(mockDateTime);
    setPassengers(2);
    setLuggage(1);

    // Set flight number
    setFlightNumberPickup('BA123'); // British Airways flight
    console.log('✈️ Flight Number: BA123');

    // Set pickup location (Heathrow)
    setPickup({
      placeId: 'ChIJr_TqNgiFdkgRBfVt7jMJFgE',
      address: 'London Heathrow Airport, Hounslow, UK',
      coordinates: [51.47, -0.4543], // [lat, lng] array format
      type: 'airport' as const,
      components: { airport_name: 'Heathrow Airport' },
    });
    console.log('🛫 Pickup: Heathrow Airport');

    // Set dropoff location (Mayfair)
    setDropoff({
      placeId: 'ChIJr-RlsVkFdkgRWgx-3F7Phto',
      address: 'Mayfair, London W1K, UK',
      coordinates: [51.5074, -0.1478], // [lat, lng] array format
      type: 'address' as const,
      components: { area: 'Mayfair' },
    });
    console.log('🏙️ Dropoff: Mayfair');

    // Add 2 additional stops
    const additionalStops = [
      {
        placeId: 'ChIJrxKYlK0FdkgRVeb0YfXWX8g',
        address: 'Oxford Street, London W1, UK',
        coordinates: [51.5155, -0.141] as [number, number],
        type: 'address' as const,
        components: { street: 'Oxford Street' },
      },
      {
        placeId: 'ChIJJ_wZiLkFdkgR7JQODnOM6hM',
        address: 'Hyde Park Corner, London W1J, UK',
        coordinates: [51.5028, -0.1527] as [number, number],
        type: 'poi' as const,
        components: { landmark: 'Hyde Park Corner' },
      },
    ];

    setAdditionalStops(additionalStops);
    console.log('🚏 Additional Stops: Oxford Street + Hyde Park Corner (2 stops × £15 = £30)');

    // Set RETURN booking data
    if (bookingType === 'return') {
      // Set return date/time (3 hours later) - use mockDateTime directly!
      console.log('🔍 DEBUG mockDateTime for return calculation:', mockDateTime);
      const returnDateTime = new Date(mockDateTime);
      returnDateTime.setHours(returnDateTime.getHours() + 3);
      console.log('🔍 DEBUG calculated returnDateTime:', returnDateTime);
      setReturnDateTime(returnDateTime);
      console.log('🔄 Return DateTime: ' + returnDateTime.toLocaleString());

      // Set return flight number
      setFlightNumberReturn('BA456'); // Return British Airways flight
      console.log('✈️ Return Flight: BA456');

      // For testing: Leave isDifferentReturnLocation = false (normal return)
      setIsDifferentReturnLocation(false);
      console.log('🔄 Return Mode: Normal (same locations reversed)');
    }

    // Set HOURLY booking data
    if (bookingType === 'hourly') {
      // Set hours requested (3 hours chauffeur service)
      setHoursRequested(3);
      console.log('⏰ Hours Requested: 3h chauffeur service');

      // For HOURLY, can have same pickup/dropoff for "at disposal" service
      console.log('🚗 Hourly Mode: Chauffeur service (3 hours at disposal)');
    }

    // Import and select vehicle category
    try {
      const { vehicleCategories } = await import('@/hooks/useBookingState/vehicle.data');
      console.log(
        'Available categories:',
        vehicleCategories.map(c => c.id)
      );

      if (vehicleCategories.length > 0) {
        const executiveCategory =
          vehicleCategories.find(c => c.id === 'executive') || vehicleCategories[0];
        if (executiveCategory) {
          console.log('Selecting category:', executiveCategory.id);
          selectVehicleCategory(executiveCategory);

          // Also select first model from category
          if (executiveCategory.models && executiveCategory.models.length > 0) {
            const firstModel = executiveCategory.models[0];
            if (firstModel) {
              console.log('Selecting model:', firstModel.name);
              selectVehicleModel(firstModel);
            }
          }
        }
      }

      console.log('✅ Mock data setup complete');
    } catch (error) {
      console.error('❌ Error setting up mock data:', error);
    }
  };

  const handleTestBooking = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Use saveBooking directly with the correct bookingType from store
      const { saveBooking } = await import('@/services/booking.service');
      console.log(`🧪 Testing ${bookingType.toUpperCase()} booking creation...`);
      const result = await saveBooking(tripConfiguration, bookingType);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Unexpected error during test',
        details: [error instanceof Error ? error.message : 'Unknown error'],
      });
    }

    setIsLoading(false);
  };

  return (
    <div className='p-6 bg-white border rounded-lg shadow'>
      <h3 className='text-xl font-bold mb-4'>🧪 Booking Service Tester</h3>

      {/* Booking Type Selector */}
      <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded'>
        <h4 className='font-semibold mb-3'>🎯 Select Booking Type:</h4>
        <div className='flex gap-3'>
          <button
            onClick={() => setBookingType('oneway')}
            className={`px-4 py-2 rounded border ${
              bookingType === 'oneway'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            ➡️ ONE-WAY
          </button>
          <button
            onClick={() => setBookingType('return')}
            className={`px-4 py-2 rounded border ${
              bookingType === 'return'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            🔄 RETURN
          </button>
          <button
            onClick={() => setBookingType('hourly')}
            className={`px-4 py-2 rounded border ${
              bookingType === 'hourly'
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            ⏰ HOURLY
          </button>
        </div>
      </div>

      {/* Current Store State */}
      <div className='mb-6 p-4 bg-gray-50 rounded'>
        <h4 className='font-semibold mb-2'>📋 Current Store State:</h4>
        <div className='text-sm space-y-1'>
          <p>
            <strong>Booking Type:</strong> {bookingType}
          </p>
          <p>
            <strong>Pickup:</strong> {tripConfiguration.pickup?.address || 'Not set'}
          </p>
          <p>
            <strong>Dropoff:</strong> {tripConfiguration.dropoff?.address || 'Not set'}
          </p>
          <p>
            <strong>DateTime:</strong>{' '}
            {tripConfiguration.pickupDateTime?.toISOString() || 'Not set'}
          </p>
          <p>
            <strong>Passengers:</strong> {tripConfiguration.passengers}
          </p>
          <p>
            <strong>Luggage:</strong> {tripConfiguration.luggage}
          </p>
          {bookingType === 'hourly' && (
            <p>
              <strong>Hours Requested:</strong> {tripConfiguration.hoursRequested || 'Not set'}
            </p>
          )}
          <p>
            <strong>Vehicle Category:</strong>{' '}
            {tripConfiguration.selectedVehicle?.category?.id || 'Not selected'}
          </p>
          <p>
            <strong>Vehicle Model:</strong>{' '}
            {tripConfiguration.selectedVehicle?.model?.name || 'Not selected'}
          </p>
        </div>
      </div>

      {/* Test Buttons */}
      <div className='space-y-3 mb-6'>
        <button
          onClick={handleTestConnection}
          disabled={isLoading}
          className='w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'
        >
          {isLoading ? 'Testing...' : '🔌 Test Supabase Connection'}
        </button>

        <button
          onClick={handleSetupMockData}
          className='w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600'
        >
          🎭 Setup Mock Data (Required for Test)
        </button>

        <button
          onClick={handleLogStructure}
          className='w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
        >
          📋 Log Booking Structure (Check Console)
        </button>

        <button
          onClick={handleTestBooking}
          disabled={isLoading}
          className='w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50'
        >
          {isLoading
            ? 'Creating Booking...'
            : `💾 Test ${bookingType.toUpperCase()} Booking Creation`}
        </button>
      </div>

      {/* Connection Status */}
      {connectionStatus && (
        <div
          className={`p-4 rounded mb-4 ${connectionStatus.connected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          <h4 className='font-semibold mb-2'>
            {connectionStatus.connected ? '✅ Supabase Connected' : '❌ Connection Failed'}
          </h4>
          {connectionStatus.error && (
            <p className='text-sm text-red-600'>{connectionStatus.error}</p>
          )}
        </div>
      )}

      {/* Test Results */}
      {testResult && (
        <div
          className={`p-4 rounded ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          <h4 className='font-semibold mb-2'>
            {testResult.success ? '✅ Booking Created Successfully!' : '❌ Booking Creation Failed'}
          </h4>

          {testResult.success ? (
            <div className='text-sm'>
              <p>
                <strong>Booking ID:</strong> {testResult.booking.id}
              </p>
              <p>
                <strong>Message:</strong> {testResult.message}
              </p>
              <p className='mt-2 text-green-600'>
                Check your Supabase dashboard to see the new booking!
              </p>
            </div>
          ) : (
            <div className='text-sm'>
              <p className='text-red-600 mb-2'>
                <strong>Error:</strong> {testResult.error}
              </p>
              {testResult.details && testResult.details.length > 0 && (
                <div>
                  <strong>Details:</strong>
                  <ul className='list-disc list-inside mt-1'>
                    {testResult.details.map((detail, index) => (
                      <li key={index} className='text-red-600'>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {testResult.code && (
                <p className='mt-2'>
                  <strong>Error Code:</strong> {testResult.code}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded'>
        <h4 className='font-semibold mb-2'>📝 Instructions:</h4>
        <ol className='text-sm list-decimal list-inside space-y-1'>
          <li>
            <strong>Test Supabase Connection</strong> - Verify database connectivity
          </li>
          <li>
            <strong>Setup Mock Data</strong> - This will populate the store with test data (DateTime
            + Vehicle)
          </li>
          <li>
            <strong>Log Structure</strong> - Check console to see what data will be sent to DB
          </li>
          <li>
            <strong>Test Booking Creation</strong> - Creates a real booking in Supabase
          </li>
          <li>
            <strong>Check Supabase Dashboard</strong> - Verify the new booking was created
          </li>
        </ol>

        {!tripConfiguration.pickupDateTime && (
          <div className='mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm'>
            ⚠️ <strong>Store is empty!</strong> Click &quot;Setup Mock Data&quot; first to populate
            test data.
          </div>
        )}
      </div>
    </div>
  );
}
