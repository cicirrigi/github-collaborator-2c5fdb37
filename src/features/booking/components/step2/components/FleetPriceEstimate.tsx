import type { FleetSelection } from '@/hooks/useBookingState/fleet.types';

// 💰 Fleet Price Estimate Component
export interface FleetPriceEstimateProps {
  totalPrice: number;
  fleetSelection: FleetSelection;
}

export function FleetPriceEstimate({ totalPrice, fleetSelection }: FleetPriceEstimateProps) {
  const getPricingText = () => {
    switch (fleetSelection.fleetMode) {
      case 'standard':
        return 'per transfer';
      case 'hourly':
        return `for ${fleetSelection.fleetHours || 2}h`;
      case 'daily': {
        const days = fleetSelection.fleetDays ?? 1;
        return `for ${days} day${days > 1 ? 's' : ''}`;
      }
      default:
        return 'per transfer';
    }
  };

  return (
    <div className='pt-4 border-t border-white/10'>
      <div className='flex items-center justify-between'>
        <span className='text-white/70 text-sm'>Estimated Total</span>
        <div className='text-right'>
          <div className='text-white font-medium'>£{Math.round(totalPrice)}</div>
          <div className='text-white/50 text-xs'>{getPricingText()}</div>
        </div>
      </div>
    </div>
  );
}
