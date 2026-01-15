'use client';

import { Car, Clock, Users } from 'lucide-react';

/**
 * 🎯 DRIVER STATUS CARD
 * Show driver assignment status for normal and fleet bookings
 * Clean, informative, no complex logic
 */

interface DriverInfo {
  name?: string;
  phone?: string;
  vehicleInfo?: string;
  status: 'pending' | 'assigned' | 'en_route' | 'arrived';
}

interface FleetDriverInfo {
  vehicleType: string;
  vehicleName: string;
  driver: DriverInfo;
}

interface DriverStatusCardProps {
  bookingType: 'normal' | 'fleet';
  driver?: DriverInfo;
  fleetDrivers?: FleetDriverInfo[];
}

export function DriverStatusCard({
  bookingType,
  driver,
  fleetDrivers = [],
}: DriverStatusCardProps) {
  const StatusBadge = ({ status }: { status: DriverInfo['status'] }) => {
    const configs = {
      pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Assignment Pending' },
      assigned: { color: 'text-green-400', bg: 'bg-green-400/10', label: 'Driver Assigned' },
      en_route: { color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'En Route' },
      arrived: { color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'Arrived' },
    };

    const config = configs[status];

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.color} ${config.bg}`}>
        {config.label}
      </span>
    );
  };

  if (bookingType === 'fleet') {
    return (
      <div className='vl-card'>
        {/* Fleet Header */}
        <div className='flex items-center gap-2 text-amber-400 font-medium mb-4'>
          <Users className='w-5 h-5' />
          Fleet Driver Assignments
        </div>

        {/* Fleet Vehicles */}
        <div className='space-y-3'>
          {fleetDrivers.map((item, index) => (
            <div key={index} className='p-3 bg-white/5 rounded-lg'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <Car className='w-4 h-4 text-amber-400' />
                  <span className='text-white font-medium'>{item.vehicleName}</span>
                  <span className='text-sm text-neutral-400'>({item.vehicleType})</span>
                </div>
                <StatusBadge status={item.driver.status} />
              </div>

              {item.driver.status === 'assigned' && item.driver.name ? (
                <div className='text-sm text-neutral-300'>Driver: {item.driver.name}</div>
              ) : (
                <div className='text-sm text-neutral-400'>
                  Driver will be assigned 2 hours before pickup
                </div>
              )}
            </div>
          ))}

          {fleetDrivers.length === 0 && (
            <div className='text-center py-4 text-neutral-400'>
              Fleet drivers will be assigned 2 hours before pickup
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal Booking
  return (
    <div className='vl-card'>
      {/* Normal Booking Header */}
      <div className='flex items-center gap-2 text-amber-400 font-medium mb-4'>
        <Car className='w-5 h-5' />
        Driver Assignment
      </div>

      <div className='p-3 bg-white/5 rounded-lg'>
        <div className='flex items-center justify-between mb-3'>
          <div className='text-white font-medium'>Your Driver</div>
          <StatusBadge status={driver?.status || 'pending'} />
        </div>

        {driver?.status === 'assigned' && driver.name ? (
          <div className='space-y-2 text-sm'>
            <div className='text-neutral-300'>
              <strong>Driver:</strong> {driver.name}
            </div>
            {driver.phone && (
              <div className='text-neutral-300'>
                <strong>Phone:</strong> {driver.phone}
              </div>
            )}
            {driver.vehicleInfo && (
              <div className='text-neutral-300'>
                <strong>Vehicle:</strong> {driver.vehicleInfo}
              </div>
            )}
          </div>
        ) : (
          <div className='flex items-center gap-2 text-neutral-400 text-sm'>
            <Clock className='w-4 h-4' />
            Driver will be assigned 2 hours before your pickup time
          </div>
        )}
      </div>

      {/* Info */}
      <div className='mt-3 text-xs text-neutral-400 text-center p-2 bg-blue-500/10 rounded border border-blue-500/20'>
        You'll receive SMS and email notifications with driver details when assigned
      </div>
    </div>
  );
}
