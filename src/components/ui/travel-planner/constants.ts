import { type TimeSlot } from '@/components/ui/travel-planner/types';

// 🧩 Generate TIME_SLOTS automatically (zero hardcoding)
export const generateTimeSlots = (start = 6, end = 23, interval = 15): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let h = start; h <= end; h++) {
    for (let m = 0; m < 60; m += interval) {
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const label = new Date(0, 0, 0, h, m).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      // Smart categorization
      let category: 'morning' | 'afternoon' | 'evening';
      if (h >= 6 && h < 12) category = 'morning';
      else if (h >= 12 && h < 18) category = 'afternoon';
      else category = 'evening';

      slots.push({ value, label, category });
    }
  }
  return slots;
};

// Dynamic TIME_SLOTS generation (scalable & configurable)
export const TIME_SLOTS = generateTimeSlots(6, 23, 15);

// Smart Section Awareness - accent vizual per booking type
export const SECTION_ACCENTS = {
  oneway: 'border-l-4 border-[#CBB26A]',
  return: 'border-l-4 border-[#D4AF37]',
  hourly: 'border-l-4 border-amber-500/70',
  fleet: 'border-l-4 border-yellow-400/60',
} as const;

// Theme classes pentru toate secțiunile
export const TRAVEL_THEME = {
  sections: {
    dateTime: 'bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md rounded-xl p-6 shadow-lg',
    stops:
      'bg-gradient-to-br from-yellow-50/30 to-amber-50/30 dark:from-yellow-900/10 dark:to-amber-900/10 rounded-xl p-6',
    mapPreview:
      'bg-white/50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200/30 dark:border-neutral-700/30',
  },
  calendar: {
    header: 'flex items-center justify-between mb-4 px-2',
    grid: 'grid grid-cols-7 gap-1 text-center text-sm',
    day: 'w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer',
    dayInactive: 'text-gray-400 dark:text-gray-600',
    dayToday: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    daySelected: 'bg-gradient-to-r from-[#CBB26A] to-[#D4AF37] text-white',
    dayInRange: 'bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
    dayHover: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
  },
  timeSlots: {
    container: 'grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2',
    slot: 'px-3 py-2 rounded-full text-sm transition-all cursor-pointer text-center',
    slotInactive: 'text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
    slotSelected: 'bg-gradient-to-r from-[#CBB26A] to-[#D4AF37] text-white',
    slotDisabled: 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50',
  },
  counters: {
    button: 'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
    buttonInactive:
      'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/20',
    buttonActive: 'bg-gradient-to-r from-[#CBB26A] to-[#D4AF37] text-white',
    display: 'min-w-12 text-center font-medium text-gray-700 dark:text-gray-300',
  },
  skeleton: {
    base: 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
    calendar: 'h-64 w-full',
    timeSlot: 'h-8 w-16',
    counter: 'h-10 w-24',
  },
} as const;

// 🌤️ Weather recommendations adaptive (AI-ready)
export const WEATHER_RECOMMENDATIONS: Record<string, string> = {
  Rain: 'Add 15min buffer for wet conditions',
  Drizzle: 'Roads may be slippery — add buffer',
  Snow: 'Add 30min buffer for snow',
  Thunderstorm: 'Consider rescheduling due to storm risk',
  Clear: 'Perfect travel conditions',
  Clouds: 'Moderate visibility',
  Fog: 'Drive carefully — limited visibility',
  Mist: 'Reduced visibility conditions',
  Haze: 'Light atmospheric conditions',
} as const;

// 🎨 Motion tokens pentru animații consistente (luxury-grade)
export const MOTION = {
  transition: 'transition-all duration-300 ease-in-out',
  transitionFast: 'transition-all duration-150 ease-out',
  hoverLift: 'hover:-translate-y-0.5',
  tap: 'active:scale-95',
  slideIn: 'animate-in slide-in-from-left-2',
  fadeIn: 'animate-in fade-in-0 duration-300',
} as const;

// 🚦 BOOKING_CONFIG cu extensie logică pentru viitor
export const BOOKING_CONFIG = {
  oneway: {
    showReturn: false,
    supportsReturn: false,
    showAdditionalStops: true,
    maxStops: 3,
    title: 'One Way Journey',
    description: 'Single destination transfer',
  },
  return: {
    showReturn: true,
    supportsReturn: true,
    showAdditionalStops: true,
    maxStops: 3,
    title: 'Return Journey',
    description: 'Round trip with return',
  },
  hourly: {
    showReturn: false,
    supportsReturn: false,
    showAdditionalStops: false,
    maxStops: 0,
    title: 'Hourly Booking',
    description: 'Flexible hourly service',
  },
  fleet: {
    showReturn: false,
    supportsReturn: false,
    showAdditionalStops: true,
    maxStops: 10,
    title: 'Fleet Management',
    description: 'Multiple vehicles coordination',
  },
} as const;

// Weather API configuration
export const WEATHER_CONFIG = {
  apiUrl: 'https://api.openweathermap.org/data/2.5/weather',
  staticMapUrl: 'https://maps.googleapis.com/maps/api/staticmap',
  recommendations: {
    rain: 'Add 15min buffer for weather delays',
    snow: 'Add 30min buffer for winter conditions',
    clear: 'Perfect conditions for travel',
  },
} as const;
