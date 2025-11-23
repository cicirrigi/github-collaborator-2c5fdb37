import { Car, Clock, Repeat, Users } from 'lucide-react';
import type { BookingTab } from './types';

export const BOOKING_TABS: BookingTab[] = [
  { id: 'oneway', label: 'One Way', description: 'Single destination transfer', icon: Car },
  { id: 'return', label: 'Return', description: 'Round trip booking', icon: Repeat },
  { id: 'hourly', label: 'Hourly', description: 'Flexible hourly service', icon: Clock },
  { id: 'fleet', label: 'Fleet', description: 'Multiple vehicles management', icon: Users },
];

export const TAB_GRADIENTS = {
  oneway: { from: 'var(--brand-primary)', to: 'var(--brand-accent)' },
  return: { from: 'var(--brand-accent)', to: 'var(--brand-secondary)' },
  hourly: { from: 'var(--brand-secondary)', to: 'var(--brand-primary)' },
  fleet: { from: 'var(--brand-accent)', to: 'var(--brand-primary)' },
} as const;

export const SIZE_CLASSES = {
  sm: { tab: 'px-3 py-1.5 text-sm', icon: 'w-4 h-4', container: 'p-1' },
  md: { tab: 'px-4 py-2 text-base', icon: 'w-5 h-5', container: 'p-1.5' },
  lg: { tab: 'px-6 py-3 text-lg', icon: 'w-6 h-6', container: 'p-2' },
} as const;
