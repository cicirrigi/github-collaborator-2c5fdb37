'use client';

import GlassCard from '@/components/ui/GlassCard';
import type { BookingType } from '@/hooks/useBookingState';
import { useBookingState } from '@/hooks/useBookingState';
import {
  ArrowRight,
  CalendarRange,
  Car,
  Clock,
  Gem,
  RefreshCw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BookingTypeOption {
  id: BookingType;
  label: string;
  description: string;
  icon: LucideIcon;
}

const bookingTypes: BookingTypeOption[] = [
  {
    id: 'oneway',
    label: 'One Way',
    description: 'Single journey transfer',
    icon: ArrowRight,
  },
  {
    id: 'return',
    label: 'Return',
    description: 'Round trip transfer',
    icon: RefreshCw,
  },
  {
    id: 'hourly',
    label: 'By Hour',
    description: 'Chauffeur by the hour',
    icon: Clock,
  },
  {
    id: 'daily',
    label: 'By Day',
    description: 'Full day chauffeur service',
    icon: CalendarRange,
  },
  {
    id: 'fleet',
    label: 'Fleet',
    description: 'Multiple vehicles for groups',
    icon: Car,
  },
  {
    id: 'bespoke',
    label: 'Bespoke',
    description: 'Tailored luxury experience',
    icon: Gem,
  },
];

/**
 * 🎛️ Booking Type Selector — Drive My Way Grid Style
 * GlassCard grid with icon + title + description
 */
export function ZustandBookingTypeDock() {
  const { bookingType, setBookingType } = useBookingState();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Select Your <span className="gold-text">Journey Type</span>
        </h2>
        <p className="mt-2 text-[var(--text-muted)]">
          Choose the service that best suits your needs
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookingTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = bookingType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => setBookingType(type.id)}
              className="text-left w-full"
            >
              <GlassCard
                hover
                className={`p-6 transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-[var(--brand-primary)] shadow-[0_0_20px_rgba(203,178,106,0.2)]'
                    : ''
                }`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-[var(--brand-primary)]/20'
                      : 'bg-[var(--brand-primary)]/10'
                  }`}
                >
                  <Icon className="h-6 w-6 text-[var(--brand-primary)]" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-[var(--text-primary)]">
                  {type.label}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {type.description}
                </p>
              </GlassCard>
            </button>
          );
        })}
      </div>
    </div>
  );
}
