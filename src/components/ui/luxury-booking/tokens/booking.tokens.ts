import { cn } from '@/lib/utils';

export const BOOKING_TOKENS = {
  window: cn(
    'w-full mx-auto max-w-6xl',
    'p-6 md:p-10',
    'backdrop-blur-2xl',
    'rounded-3xl',
    'border border-white/10',
    'bg-black/20'
  ),

  grid: cn('grid gap-10', 'grid-cols-1', 'lg:grid-cols-2'),

  card: cn(
    'relative flex flex-col gap-6',
    'p-6 md:p-8',
    'rounded-2xl',
    'border border-white/10',
    'bg-white/5 backdrop-blur-xl',
    'shadow-[0_8px_30px_rgb(0,0,0,0.35)]'
  ),

  sectionTitle: cn('text-xl font-semibold', 'text-white/90 tracking-tight'),
};
