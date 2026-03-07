/**
 * 🏠 Billing Address Accordion - Standalone Component
 *
 * Clean accordion for billing address selection
 * - Fetches from favorite_addresses
 * - Allows new address entry
 * - Completely isolated, ready for integration
 */

import { useAddresses } from '@/features/account/hooks/useAddresses';
import type { FavoriteAddress } from '@/features/account/types/profile.types';
import { ChevronDown, ChevronUp, Home, MapPin } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface BillingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

type BillingType = 'individual' | 'corporate';

interface BillingAddressAccordionProps {
  onAddressChange?: (address: BillingAddress | null) => void;
  onBillingTypeChange?: (type: BillingType) => void;
  alwaysExpanded?: boolean; // true = always expanded (My Account), false = accordion (checkout)
}

export function BillingAddressAccordion({
  onAddressChange,
  onBillingTypeChange,
  alwaysExpanded = false,
}: BillingAddressAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(alwaysExpanded);
  const [billingType, setBillingType] = useState<BillingType>('individual');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [customAddress, setCustomAddress] = useState<BillingAddress>({
    street: '',
    city: '',
    postalCode: '',
    country: 'United Kingdom',
  });
  const [corporateData, setCorporateData] = useState({
    companyName: '',
    vatNumber: '',
    registrationNumber: '',
    billingEmail: '',
    phone: '',
  });
  const [isBookingForSomeoneElse, setIsBookingForSomeoneElse] = useState(false);
  const [individualData, setIndividualData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleBillingTypeChange = (type: BillingType) => {
    setBillingType(type);
    onBillingTypeChange?.(type);
  };

  const handleCorporateDataChange = (field: keyof typeof corporateData, value: string) => {
    setCorporateData(prev => ({ ...prev, [field]: value }));
  };

  const handleIndividualDataChange = (field: keyof typeof individualData, value: string) => {
    setIndividualData(prev => ({ ...prev, [field]: value }));
  };

  const { addresses, fetchAddresses, isLoading } = useAddresses();

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddressSelect = useCallback(
    (address: FavoriteAddress) => {
      const billingAddress: BillingAddress = {
        street: `${address.street_number || ''} ${address.street_name || ''}`.trim(),
        city: address.county || '',
        postalCode: '',
        country: address.country || 'United Kingdom',
      };
      onAddressChange?.(billingAddress);
    },
    [onAddressChange]
  );

  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === 'new') {
      const defaultAddr = addresses.find(addr => addr.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        handleAddressSelect(defaultAddr);
      }
    }
  }, [addresses, selectedAddressId, handleAddressSelect]);

  const handleCustomAddressChange = (field: keyof BillingAddress, value: string) => {
    const updated = { ...customAddress, [field]: value };
    setCustomAddress(updated);
    onAddressChange?.(updated);
  };

  const handleSelectionChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === 'new') {
      onAddressChange?.(customAddress);
    } else {
      const selected = addresses.find(addr => addr.id === addressId);
      if (selected) {
        handleAddressSelect(selected);
      }
    }
  };

  return (
    <div className='backdrop-filter backdrop-blur-md bg-neutral-800/40 rounded-lg border border-neutral-700/50 overflow-hidden'>
      {/* Accordion Header - only show if not alwaysExpanded */}
      {!alwaysExpanded && (
        <button
          type='button'
          onClick={() => setIsExpanded(!isExpanded)}
          className='w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-700/20 transition-colors'
        >
          <div className='flex items-center gap-3'>
            <Home className='w-5 h-5 text-amber-400' />
            <div className='text-left'>
              <h3 className='text-white font-medium text-sm'>Billing Address</h3>
              <p className='text-neutral-400 text-xs mt-0.5'>
                {isExpanded
                  ? 'Select or enter billing address'
                  : 'Click to add billing information'}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className='w-5 h-5 text-neutral-400' />
          ) : (
            <ChevronDown className='w-5 h-5 text-neutral-400' />
          )}
        </button>
      )}

      {/* Content - show if expanded OR alwaysExpanded */}
      {(isExpanded || alwaysExpanded) && (
        <div className='px-6 pb-6 space-y-4 border-t border-neutral-700/30'>
          {/* Billing Type Tabs */}
          <div className='flex gap-2 pt-4'>
            <button
              type='button'
              onClick={() => handleBillingTypeChange('individual')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingType === 'individual'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                  : 'bg-neutral-700/30 text-neutral-400 border border-neutral-600/30 hover:bg-neutral-700/50'
              }`}
            >
              Individual
            </button>
            <button
              type='button'
              onClick={() => handleBillingTypeChange('corporate')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingType === 'corporate'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                  : 'bg-neutral-700/30 text-neutral-400 border border-neutral-600/30 hover:bg-neutral-700/50'
              }`}
            >
              Corporate
            </button>
          </div>

          {/* Individual: Personal details (always shown) */}
          {billingType === 'individual' && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-neutral-300 mb-2'>
                    First Name
                  </label>
                  <input
                    type='text'
                    value={individualData.firstName}
                    onChange={e => handleIndividualDataChange('firstName', e.target.value)}
                    placeholder='John'
                    disabled={!isBookingForSomeoneElse}
                    className={`w-full px-4 py-3 bg-neutral-900/50 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 ${
                      !isBookingForSomeoneElse
                        ? 'border-neutral-700/50 cursor-not-allowed opacity-75'
                        : 'border-neutral-600'
                    }`}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-neutral-300 mb-2'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    value={individualData.lastName}
                    onChange={e => handleIndividualDataChange('lastName', e.target.value)}
                    placeholder='Doe'
                    disabled={!isBookingForSomeoneElse}
                    className={`w-full px-4 py-3 bg-neutral-900/50 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 ${
                      !isBookingForSomeoneElse
                        ? 'border-neutral-700/50 cursor-not-allowed opacity-75'
                        : 'border-neutral-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-neutral-300 mb-2'>Email</label>
                <input
                  type='email'
                  value={individualData.email}
                  onChange={e => handleIndividualDataChange('email', e.target.value)}
                  placeholder='john.doe@example.com'
                  disabled={!isBookingForSomeoneElse}
                  className={`w-full px-4 py-3 bg-neutral-900/50 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 ${
                    !isBookingForSomeoneElse
                      ? 'border-neutral-700/50 cursor-not-allowed opacity-75'
                      : 'border-neutral-600'
                  }`}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-neutral-300 mb-2'>Phone</label>
                <input
                  type='tel'
                  value={individualData.phone}
                  onChange={e => handleIndividualDataChange('phone', e.target.value)}
                  placeholder='+44 7700 900000'
                  disabled={!isBookingForSomeoneElse}
                  className={`w-full px-4 py-3 bg-neutral-900/50 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 ${
                    !isBookingForSomeoneElse
                      ? 'border-neutral-700/50 cursor-not-allowed opacity-75'
                      : 'border-neutral-600'
                  }`}
                />
              </div>

              {/* Booking for someone else checkbox - at the bottom */}
              <div className='flex items-center gap-2 pt-2'>
                <input
                  type='checkbox'
                  id='bookingForSomeoneElse'
                  checked={isBookingForSomeoneElse}
                  onChange={e => setIsBookingForSomeoneElse(e.target.checked)}
                  className='w-4 h-4 rounded border-neutral-600 text-amber-500 focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-0 checked:bg-amber-500 checked:border-amber-500'
                />
                <label
                  htmlFor='bookingForSomeoneElse'
                  className='text-sm text-neutral-300 cursor-pointer'
                >
                  Booking for someone else
                </label>
              </div>
            </div>
          )}

          {/* Corporate-specific fields */}
          {billingType === 'corporate' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-neutral-300 mb-2'>
                  Company Name
                </label>
                <input
                  type='text'
                  value={corporateData.companyName}
                  onChange={e => handleCorporateDataChange('companyName', e.target.value)}
                  placeholder='Acme Corporation Ltd'
                  className='w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-neutral-300 mb-2'>
                    VAT Number
                  </label>
                  <input
                    type='text'
                    value={corporateData.vatNumber}
                    onChange={e => handleCorporateDataChange('vatNumber', e.target.value)}
                    placeholder='GB123456789'
                    className='w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-neutral-300 mb-2'>
                    Registration Number
                  </label>
                  <input
                    type='text'
                    value={corporateData.registrationNumber}
                    onChange={e => handleCorporateDataChange('registrationNumber', e.target.value)}
                    placeholder='12345678'
                    className='w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-neutral-300 mb-2'>
                  Billing Email
                </label>
                <input
                  type='email'
                  value={corporateData.billingEmail}
                  onChange={e => handleCorporateDataChange('billingEmail', e.target.value)}
                  placeholder='billing@acme.com'
                  className='w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-neutral-300 mb-2'>Phone</label>
                <input
                  type='tel'
                  value={corporateData.phone}
                  onChange={e => handleCorporateDataChange('phone', e.target.value)}
                  placeholder='+44 20 1234 5678'
                  className='w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
                />
              </div>
            </div>
          )}

          {/* Address Selection Dropdown */}
          <div>
            <label className='block text-sm font-medium text-neutral-300 mb-2'>
              Select Address
            </label>
            <select
              value={selectedAddressId}
              onChange={e => handleSelectionChange(e.target.value)}
              className='w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
              disabled={isLoading}
            >
              <option value='new'>Enter new address</option>
              {addresses.map(addr => (
                <option key={addr.id} value={addr.id}>
                  {addr.label} - {addr.street_number} {addr.street_name}, {addr.county}
                  {addr.is_default ? ' (Default)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Address Form - Only show if "new" is selected */}
          {selectedAddressId === 'new' && (
            <div className='space-y-4 pt-2'>
              <div>
                <label className='block text-sm font-medium text-neutral-300 mb-2'>
                  Street Address
                </label>
                <input
                  type='text'
                  value={customAddress.street}
                  onChange={e => handleCustomAddressChange('street', e.target.value)}
                  placeholder='10 Downing Street'
                  className='w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-neutral-300 mb-2'>City</label>
                  <input
                    type='text'
                    value={customAddress.city}
                    onChange={e => handleCustomAddressChange('city', e.target.value)}
                    placeholder='London'
                    className='w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-neutral-300 mb-2'>
                    Postal Code
                  </label>
                  <input
                    type='text'
                    value={customAddress.postalCode}
                    onChange={e => handleCustomAddressChange('postalCode', e.target.value)}
                    placeholder='SW1A 2AA'
                    className='w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-neutral-300 mb-2'>Country</label>
                <input
                  type='text'
                  value={customAddress.country}
                  onChange={e => handleCustomAddressChange('country', e.target.value)}
                  placeholder='United Kingdom'
                  className='w-full px-4 py-3 bg-neutral-900/50 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
                />
              </div>
            </div>
          )}

          {/* Info hint */}
          {selectedAddressId === 'new' && (
            <div className='flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg'>
              <MapPin className='w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0' />
              <p className='text-xs text-amber-200/80'>
                This address will be saved with your booking. You can add it to your saved addresses
                from My Account.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
