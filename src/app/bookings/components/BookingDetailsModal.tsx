'use client';

import { format } from 'date-fns';
import { Calendar, Car, CreditCard, MapPin, Package, Plane, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BookingDetailsModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface BookingDetails {
  id: string;
  reference: string;
  status: string;
  booking_type: string;
  currency: string;
  created_at: string;
  updated_at: string;
  payment: {
    status: string;
    amount_pence: number;
    stripe_payment_intent_id: string;
  };
  trip: {
    pickup_address: string;
    dropoff_address: string;
    scheduled_at: string;
    distance_miles: number | null;
    duration_min: number | null;
  };
  vehicle: {
    category_id: string;
    model_id: string;
  };
  trip_configuration: {
    selectedVehicle?: {
      model?: { name: string; brand: string };
      category?: { name: string };
    };
    servicePackages?: {
      paidUpgrades?: {
        flowers?: 'standard' | 'exclusive' | null;
        champagne?: 'moet' | 'dom-perignon' | null;
        securityEscort?: boolean;
      };
      premiumFeatures?: Record<string, boolean>;
    };
    flightNumberPickup?: string;
    flightNumberReturn?: string;
    passengers?: number;
    baggage?: number;
    type?: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
  PENDING_PAYMENT: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
  COMPLETED: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
  CANCELLED: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
  NEW: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
};

const UPGRADE_PRICES = {
  flowers: {
    standard: 120,
    exclusive: 250,
  },
  champagne: {
    moet: 120,
    'dom-perignon': 350,
  },
  securityEscort: 750,
};

const UPGRADE_LABELS = {
  flowers: {
    standard: 'Standard Flowers',
    exclusive: 'Exclusive Flowers',
  },
  champagne: {
    moet: 'Moët & Chandon',
    'dom-perignon': 'Dom Pérignon',
  },
  securityEscort: 'Security Escort',
};

export default function BookingDetailsModal({
  bookingId,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !bookingId) return;

    async function fetchBookingDetails() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/bookings_v1/${bookingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        const data = await response.json();
        setBooking(data.booking);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchBookingDetails();
  }, [bookingId, isOpen]);

  const formatCurrency = (amountPence: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(amountPence / 100);
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm');
    } catch {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='fixed inset-0 bg-black/50 transition-opacity' onClick={onClose} />

        <div className='relative w-full max-w-2xl rounded-lg bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-800'>
          <div className='flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4'>
            <h2 className='text-xl font-bold text-neutral-900 dark:text-white'>Booking Details</h2>
            <button
              onClick={onClose}
              className='rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
            >
              <X className='h-5 w-5 text-neutral-500 dark:text-neutral-400' />
            </button>
          </div>

          <div className='max-h-[calc(100vh-200px)] overflow-y-auto p-6'>
            {loading && (
              <div className='flex items-center justify-center py-12'>
                <div className='text-neutral-500 dark:text-neutral-400'>Loading...</div>
              </div>
            )}

            {error && (
              <div className='rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800'>
                <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
              </div>
            )}

            {booking && !loading && (
              <div className='space-y-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='text-2xl font-bold text-neutral-900 dark:text-white'>
                      {booking.reference}
                    </h3>
                    <p className='text-sm text-neutral-500 dark:text-neutral-400 mt-1'>
                      {booking.booking_type.charAt(0).toUpperCase() + booking.booking_type.slice(1)}{' '}
                      booking
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_COLORS[booking.status] ||
                      'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>

                <div className='rounded-lg bg-neutral-50 dark:bg-neutral-800/50 p-4 border border-neutral-200 dark:border-neutral-700'>
                  <div className='flex items-start gap-3'>
                    <MapPin className='h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5' />
                    <div className='flex-1 space-y-2'>
                      <div>
                        <p className='text-xs text-neutral-500 dark:text-neutral-400'>Pickup</p>
                        <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                          {booking.trip.pickup_address}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-neutral-500 dark:text-neutral-400'>Dropoff</p>
                        <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                          {booking.trip.dropoff_address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='rounded-lg bg-neutral-50 dark:bg-neutral-800/50 p-4 border border-neutral-200 dark:border-neutral-700'>
                    <div className='flex items-start gap-3'>
                      <Calendar className='h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5' />
                      <div>
                        <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                          Date & Time
                        </p>
                        <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                          {formatDateTime(booking.trip.scheduled_at)}
                        </p>
                        {booking.trip.distance_miles && (
                          <p className='text-xs text-neutral-500 dark:text-neutral-400 mt-1'>
                            {booking.trip.distance_miles.toFixed(1)} miles •{' '}
                            {booking.trip.duration_min} min
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='rounded-lg bg-neutral-50 dark:bg-neutral-800/50 p-4 border border-neutral-200 dark:border-neutral-700'>
                    <div className='flex items-start gap-3'>
                      <Car className='h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5' />
                      <div>
                        <p className='text-xs text-neutral-500 dark:text-neutral-400'>Vehicle</p>
                        <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                          {booking.trip_configuration?.selectedVehicle?.category?.name ||
                            booking.vehicle.category_id.charAt(0).toUpperCase() +
                              booking.vehicle.category_id.slice(1)}
                        </p>
                        {booking.trip_configuration?.selectedVehicle?.model?.name && (
                          <p className='text-xs text-neutral-500 dark:text-neutral-400 mt-1'>
                            {booking.trip_configuration.selectedVehicle.model.brand}{' '}
                            {booking.trip_configuration.selectedVehicle.model.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='rounded-lg bg-neutral-50 dark:bg-neutral-800/50 p-4 border border-neutral-200 dark:border-neutral-700'>
                  <div className='flex items-start gap-3'>
                    <CreditCard className='h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5' />
                    <div className='flex-1'>
                      <p className='text-xs text-neutral-500 dark:text-neutral-400'>Payment</p>
                      <div className='mt-2 flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                            {booking.payment.status === 'succeeded' ? 'Paid' : 'Pending'}
                          </p>
                          {booking.payment.stripe_payment_intent_id && (
                            <p className='text-xs text-neutral-500 dark:text-neutral-400 mt-1'>
                              {booking.payment.stripe_payment_intent_id.slice(0, 20)}...
                            </p>
                          )}
                        </div>
                        <p className='text-xl font-bold text-neutral-900 dark:text-white'>
                          {formatCurrency(booking.payment.amount_pence, booking.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flight Information */}
                {(booking.trip_configuration?.flightNumberPickup ||
                  booking.trip_configuration?.flightNumberReturn) && (
                  <div className='rounded-lg bg-neutral-50 dark:bg-neutral-800/50 p-4 border border-neutral-200 dark:border-neutral-700'>
                    <div className='flex items-start gap-3'>
                      <Plane className='h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5' />
                      <div className='flex-1'>
                        <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-2'>
                          Flight Information
                        </p>
                        <div className='space-y-2'>
                          {booking.trip_configuration.flightNumberPickup && (
                            <div>
                              <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                                Pickup Flight
                              </p>
                              <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                                {booking.trip_configuration.flightNumberPickup}
                              </p>
                            </div>
                          )}
                          {booking.trip_configuration.flightNumberReturn && (
                            <div>
                              <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                                Return Flight
                              </p>
                              <p className='text-sm font-medium text-neutral-900 dark:text-white'>
                                {booking.trip_configuration.flightNumberReturn}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Service Packages & Upgrades */}
                {booking.trip_configuration?.servicePackages?.paidUpgrades &&
                  (booking.trip_configuration.servicePackages.paidUpgrades.flowers ||
                    booking.trip_configuration.servicePackages.paidUpgrades.champagne ||
                    booking.trip_configuration.servicePackages.paidUpgrades.securityEscort) && (
                    <div className='rounded-lg bg-neutral-50 dark:bg-neutral-800/50 p-4 border border-neutral-200 dark:border-neutral-700'>
                      <div className='flex items-start gap-3'>
                        <Package className='h-5 w-5 text-neutral-500 dark:text-neutral-400 mt-0.5' />
                        <div className='flex-1'>
                          <p className='text-xs text-neutral-500 dark:text-neutral-400 mb-3'>
                            Additional Services
                          </p>
                          <div className='space-y-2'>
                            {booking.trip_configuration.servicePackages.paidUpgrades.flowers && (
                              <div className='flex items-center justify-between'>
                                <span className='text-sm text-neutral-900 dark:text-white'>
                                  {
                                    UPGRADE_LABELS.flowers[
                                      booking.trip_configuration.servicePackages.paidUpgrades
                                        .flowers
                                    ]
                                  }
                                </span>
                                <span className='text-sm font-medium text-neutral-900 dark:text-white'>
                                  {formatCurrency(
                                    UPGRADE_PRICES.flowers[
                                      booking.trip_configuration.servicePackages.paidUpgrades
                                        .flowers
                                    ] * 100,
                                    booking.currency
                                  )}
                                </span>
                              </div>
                            )}
                            {booking.trip_configuration.servicePackages.paidUpgrades.champagne && (
                              <div className='flex items-center justify-between'>
                                <span className='text-sm text-neutral-900 dark:text-white'>
                                  {
                                    UPGRADE_LABELS.champagne[
                                      booking.trip_configuration.servicePackages.paidUpgrades
                                        .champagne
                                    ]
                                  }
                                </span>
                                <span className='text-sm font-medium text-neutral-900 dark:text-white'>
                                  {formatCurrency(
                                    UPGRADE_PRICES.champagne[
                                      booking.trip_configuration.servicePackages.paidUpgrades
                                        .champagne
                                    ] * 100,
                                    booking.currency
                                  )}
                                </span>
                              </div>
                            )}
                            {booking.trip_configuration.servicePackages.paidUpgrades
                              .securityEscort && (
                              <div className='flex items-center justify-between'>
                                <span className='text-sm text-neutral-900 dark:text-white'>
                                  {UPGRADE_LABELS.securityEscort}
                                </span>
                                <span className='text-sm font-medium text-neutral-900 dark:text-white'>
                                  {formatCurrency(
                                    UPGRADE_PRICES.securityEscort * 100,
                                    booking.currency
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Trip Details */}
                {(booking.trip_configuration?.passengers ||
                  booking.trip_configuration?.baggage) && (
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    {booking.trip_configuration.passengers && (
                      <div>
                        <p className='text-neutral-500 dark:text-neutral-400'>Passengers</p>
                        <p className='text-neutral-900 dark:text-white font-medium'>
                          {booking.trip_configuration.passengers}
                        </p>
                      </div>
                    )}
                    {booking.trip_configuration.baggage && (
                      <div>
                        <p className='text-neutral-500 dark:text-neutral-400'>Luggage</p>
                        <p className='text-neutral-900 dark:text-white font-medium'>
                          {booking.trip_configuration.baggage} pieces
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className='grid grid-cols-2 gap-4 text-sm border-t border-neutral-200 dark:border-neutral-700 pt-4'>
                  <div>
                    <p className='text-neutral-500 dark:text-neutral-400'>Created</p>
                    <p className='text-neutral-900 dark:text-white font-medium'>
                      {formatDateTime(booking.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className='text-neutral-500 dark:text-neutral-400'>Last Updated</p>
                    <p className='text-neutral-900 dark:text-white font-medium'>
                      {formatDateTime(booking.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
