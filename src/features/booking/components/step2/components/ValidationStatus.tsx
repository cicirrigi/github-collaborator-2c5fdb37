import { AlertCircle, CheckCircle } from 'lucide-react';

// ✅ Validation Status Component
export interface ValidationStatusProps {
  isValid: boolean;
  totalCapacity: number;
  passengers: number;
}

export function ValidationStatus({ isValid, totalCapacity, passengers }: ValidationStatusProps) {
  if (isValid) {
    return (
      <div className='flex items-center gap-2 text-green-400 text-sm'>
        <CheckCircle className='w-4 h-4' />
        <span>Fleet capacity sufficient for {passengers} passengers</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2 text-amber-400 text-sm'>
      <AlertCircle className='w-4 h-4' />
      <span>
        Need {passengers - totalCapacity} more passenger capacity ({totalCapacity}/{passengers})
      </span>
    </div>
  );
}
