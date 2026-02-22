'use client';

import { useBookingState } from '@/hooks/useBookingState';
import { CheckCircle, FileText, MapPin, Send, Users } from 'lucide-react';
import { useState } from 'react';

export function BespokeConfirmation() {
  const { tripConfiguration } = useBookingState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState(`BR-${Date.now().toString().slice(-6)}`);

  const handleSubmitRequest = async () => {
    try {
      // Build bespoke booking payload
      const bookingPayload = {
        tripConfiguration,
        bookingType: 'bespoke' as const,
        // No pricingSnapshot for bespoke - gets custom quote later
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      const raw = await response.text();
      console.log('BESPOKE RESPONSE:', response.status, raw);

      if (!response.ok) {
        throw new Error(raw);
      }

      const result = JSON.parse(raw);

      if (result.success) {
        // Set real reference number from database - check multiple possible locations
        const realReference = result.booking?.reference || result.reference || referenceNumber;
        setReferenceNumber(realReference);
        setIsSubmitted(true);
      } else {
        throw new Error(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error submitting bespoke request:', error);
      // TODO: Show error to user - for now just log
      alert('Failed to submit request. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className='w-full max-w-2xl mx-auto'>
        <div className='bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center space-y-6'>
          <div className='w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center'>
            <CheckCircle className='w-10 h-10 text-green-400' />
          </div>

          <div className='space-y-3'>
            <h3 className='text-2xl font-semibold text-white'>Request Submitted Successfully</h3>
            <p className='text-amber-200/80 text-lg'>
              Your bespoke booking request has been received
            </p>
          </div>

          <div className='bg-amber-400/10 border border-amber-300/20 rounded-xl p-6 space-y-2'>
            <p className='text-amber-200/80 text-sm font-medium'>REFERENCE NUMBER</p>
            <p className='text-amber-50 text-2xl font-bold tracking-wider'>{referenceNumber}</p>
          </div>

          <div className='space-y-4 text-left'>
            <h4 className='text-white font-medium'>What happens next?</h4>
            <ul className='space-y-2 text-amber-200/70 text-sm'>
              <li className='flex items-start gap-2'>
                <span className='text-amber-400 mt-1'>•</span>
                Our team will review your requirements within 2-4 hours
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-amber-400 mt-1'>•</span>
                We&apos;ll prepare a tailored quote based on your specifications
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-amber-400 mt-1'>•</span>
                You&apos;ll receive a detailed proposal via email shortly
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-amber-400 mt-1'>•</span>
                Our concierge team will contact you to finalize arrangements
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-2xl mx-auto space-y-6'>
      {/* Header */}
      <div className='text-center space-y-3'>
        <h2 className='text-2xl font-semibold text-white'>Review Your Bespoke Request</h2>
        <p className='text-amber-200/80'>Please confirm your details before submitting</p>
      </div>

      {/* Request Summary */}
      <div className='bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6'>
        {/* Journey Details */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <MapPin className='w-5 h-5 text-amber-400' />
            <h3 className='text-white font-medium'>Journey Details</h3>
          </div>

          <div className='grid grid-cols-1 gap-4 pl-7'>
            <div className='space-y-1'>
              <p className='text-amber-200/60 text-xs font-medium'>PICKUP LOCATION</p>
              <p className='text-amber-50'>
                {tripConfiguration.pickup?.address || 'Not specified'}
              </p>
            </div>

            {tripConfiguration.dropoff?.address && (
              <div className='space-y-1'>
                <p className='text-amber-200/60 text-xs font-medium'>DROP-OFF LOCATION</p>
                <p className='text-amber-50'>{tripConfiguration.dropoff.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Passengers */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Users className='w-5 h-5 text-amber-400' />
            <h3 className='text-white font-medium'>Passengers</h3>
          </div>
          <div className='pl-7'>
            <p className='text-amber-50'>
              {tripConfiguration.passengers} passenger
              {tripConfiguration.passengers !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Custom Requirements */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <FileText className='w-5 h-5 text-amber-400' />
            <h3 className='text-white font-medium'>Custom Requirements</h3>
          </div>
          <div className='pl-7'>
            <div className='bg-amber-400/5 border border-amber-200/20 rounded-lg p-4'>
              <p className='text-amber-50 text-sm leading-relaxed whitespace-pre-line'>
                {tripConfiguration.customRequirements || 'No specific requirements provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className='pt-4'>
          <button
            onClick={handleSubmitRequest}
            className='w-full bg-amber-400/15 hover:bg-amber-400/25 border border-amber-300/30 text-amber-50 font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 hover:shadow-amber-400/20 hover:shadow-lg'
          >
            <Send className='w-5 h-5' />
            Submit Bespoke Request
          </button>
        </div>
      </div>
    </div>
  );
}
