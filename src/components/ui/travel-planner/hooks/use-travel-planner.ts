'use client';

import { useState, useCallback, useMemo } from 'react';
import { BookingTabType } from '../../booking-tabs/types';
import { GooglePlace } from '../../location-picker/types';
import { TravelPlan, TimeSlot, Stop } from '../types';
import { TIME_SLOTS, BOOKING_CONFIG } from '../constants';

// Hook de orchestrare globală pentru TravelPlanner
export const useTravelPlanner = (
  initialBookingType: BookingTabType,
  initialPlan?: Partial<TravelPlan>
) => {
  // Estado centralizat
  const [plan, setPlan] = useState<TravelPlan>(() => ({
    pickupDate: new Date(),
    returnDate: undefined,
    pickupTime: null,
    returnTime: undefined,
    pickup: null,
    destination: null,
    additionalStops: [],
    bookingType: initialBookingType,
    totalStops: 0,
    ...initialPlan
  }));

  // Generic field updater
  const updateField = useCallback(<K extends keyof TravelPlan>(
    key: K, 
    value: TravelPlan[K]
  ) => {
    setPlan(prev => ({ ...prev, [key]: value }));
  }, []);

  // Smart handlers pentru orchestrarea logicii
  const handlers = useMemo(() => ({
    // Date orchestration
    setPickup: (date: Date, time?: TimeSlot | null) => {
      setPlan(prev => {
        let updated = { ...prev, pickupDate: date };
        
        if (time !== undefined) {
          updated.pickupTime = time;

          // 🧠 Auto-sincronizare Return la schimbarea Pickup
          // Dacă return e în aceeași zi și mai devreme decât noul pickup
          if (
            prev.returnDate &&
            prev.returnDate.toDateString() === date.toDateString() &&
            prev.returnTime &&
            time &&
            prev.returnTime.value <= time.value
          ) {
            updated.returnTime = null; // Reset return time
          }
        }
        
        return updated;
      });
    },

    setReturn: (date?: Date, time?: TimeSlot | null) => {
      setPlan(prev => {
        // ✨ UX inteligent pentru Return - previne inversiuni logice
        if (date && date < prev.pickupDate) {
          date = prev.pickupDate; // Force same day or next valid
        }
        
        return {
          ...prev,
          returnDate: date,
          ...(time !== undefined && { returnTime: time })
        };
      });
    },

    // Location orchestration  
    setPickupLocation: (location: GooglePlace | null) => {
      updateField('pickup', location);
    },

    setDestinationLocation: (location: GooglePlace | null) => {
      updateField('destination', location);
    },

    // Stops orchestration
    addStop: (stop: Stop) => {
      setPlan(prev => ({
        ...prev,
        additionalStops: [...prev.additionalStops, stop],
        totalStops: prev.additionalStops.length + 1
      }));
    },

    removeStop: (stopId: string) => {
      setPlan(prev => ({
        ...prev,
        additionalStops: prev.additionalStops.filter(s => s.id !== stopId),
        totalStops: Math.max(0, prev.totalStops - 1)
      }));
    },

    updateStop: (stopId: string, updates: Partial<Stop>) => {
      setPlan(prev => ({
        ...prev,
        additionalStops: prev.additionalStops.map(stop => 
          stop.id === stopId ? { ...stop, ...updates } : stop
        )
      }));
    },

    setStopsCount: (count: number) => {
      setPlan(prev => {
        const currentStops = prev.additionalStops.slice(0, count);
        
        // Add new stops if count increased
        while (currentStops.length < count) {
          currentStops.push({
            id: `stop-${Date.now()}-${currentStops.length}`,
            address: '',
            coordinates: undefined
          });
        }

        return {
          ...prev,
          additionalStops: currentStops,
          totalStops: count
        };
      });
    },

    // Booking type orchestration
    changeBookingType: (bookingType: BookingTabType) => {
      setPlan(prev => ({
        ...prev,
        bookingType,
        // Reset return data if switching from return
        ...(bookingType !== 'return' && {
          returnDate: undefined,
          returnTime: undefined
        }),
        // Reset stops for hourly
        ...(bookingType === 'hourly' && {
          additionalStops: [],
          totalStops: 0
        })
      }));
    }
  }), [updateField]);

  // Computed properties (evită re-computations)
  const computed = useMemo(() => {
    const config = BOOKING_CONFIG[plan.bookingType];

    // 🔁 availableReturnTimes – logică reală (după ora de plecare)
    const availableReturnTimes = 
      config.showReturn &&
      plan.pickupTime &&
      plan.pickupDate &&
      plan.returnDate &&
      plan.pickupDate.toDateString() === plan.returnDate.toDateString()
        ? TIME_SLOTS.filter(slot => slot.value > (plan.pickupTime?.value ?? ''))
        : TIME_SLOTS;

    return {
      showReturn: config.showReturn,
      showAdditionalStops: config.showAdditionalStops,
      maxStops: config.maxStops,
      
      // Smart time filtering pentru return
      availableReturnTimes,

      // Validation state
      isValid: !!(plan.pickupDate && plan.pickupTime && plan.pickup && plan.destination),
      
      // 🧱 completionPercentage – clamp la 100%
      completionPercentage: Math.min(
        ([
          plan.pickupDate,
          plan.pickupTime, 
          plan.pickup,
          plan.destination,
          ...(config.showReturn ? [plan.returnDate, plan.returnTime] : [])
        ].filter(Boolean).length / (config.showReturn ? 6 : 4)) * 100,
        100
      )
    };
  }, [plan]);

  return {
    // State
    plan,
    
    // Handlers (orchestration logic)
    ...handlers,
    
    // Computed properties  
    ...computed,
    
    // Full plan update (pentru external sync)
    setPlan,
    updateField
  };
};
